export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json().catch(() => ({}));
    // referralCode는 body에서 직접 전달하거나, httpOnly ref 쿠키에서 읽음
    const referralCode = body.referralCode || request.cookies.get('ref')?.value;

    if (!referralCode) {
      return NextResponse.json({ success: false, attributed: false });
    }

    // 이미 귀속된 유저인지 확인
    const existing = await prisma.referredUser.findUnique({ where: { userId: userId } });
    if (existing) {
      return NextResponse.json({ success: true, attributed: false, reason: 'already_attributed' });
    }

    const partner = await prisma.partner.findUnique({ where: { referralCode } });
    if (!partner || partner.status !== 'ACTIVE') {
      return NextResponse.json({ success: true, attributed: false, reason: 'invalid_partner' });
    }

    const email = session.user.email || '';

    await prisma.$transaction(async (tx) => {
      await tx.referredUser.create({
        data: { partnerId: partner.id, userId: userId, email },
      });

      // 가장 최근 클릭을 전환 처리
      const latestClick = await tx.referralClick.findFirst({
        where: { partnerId: partner.id, converted: false },
        orderBy: { createdAt: 'desc' },
      });
      if (latestClick) {
        await tx.referralClick.update({
          where: { id: latestClick.id },
          data: { converted: true, convertedAt: new Date() },
        });
      }
    });

    // 귀속 완료 후 ref 쿠키 삭제 (중복 방지)
    const response = NextResponse.json({ success: true, attributed: true });
    response.cookies.set('ref', '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    console.error('[affiliate/attribute]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
