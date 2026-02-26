export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MIN_SETTLEMENT = 50000;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, bankName, accountNumber, accountHolder } = body;

    if (!amount || !bankName || !accountNumber || !accountHolder) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (amount < MIN_SETTLEMENT) {
      return NextResponse.json(
        { success: false, error: '최소 정산 금액은 50,000원입니다.' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: userId },
      include: { wallet: true },
    });

    if (!partner || !partner.wallet) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 });
    }

    if (partner.wallet.currentBalance < amount) {
      return NextResponse.json(
        { success: false, error: '출금 가능 잔액이 부족합니다.' },
        { status: 400 }
      );
    }

    const settlement = await prisma.$transaction(async (tx) => {
      const s = await tx.settlement.create({
        data: {
          walletId: partner.wallet!.id,
          amount,
          bankName,
          accountNumber,
          accountHolder,
        },
      });

      await tx.partnerWallet.update({
        where: { id: partner.wallet!.id },
        data: {
          currentBalance: { decrement: amount },
          pendingAmount: { increment: amount },
        },
      });

      return s;
    });

    return NextResponse.json({ success: true, data: { id: settlement.id, status: settlement.status } }, { status: 201 });
  } catch (error) {
    console.error('[affiliate/settlement]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
