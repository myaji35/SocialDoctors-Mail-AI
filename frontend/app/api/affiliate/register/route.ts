export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReferralCode } from '@/lib/referral';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, phone, bio } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    // 중복 신청 확인
    const existing = await prisma.partner.findUnique({ where: { userId: userId } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: '이미 파트너 신청이 완료되었습니다.' },
        { status: 409 }
      );
    }

    const email = session.user.email || '';
    const referralCode = generateReferralCode();

    const partner = await prisma.partner.create({
      data: {
        userId: userId,
        referralCode,
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        wallet: { create: {} },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referralUrl = baseUrl.replace(/\/$/, '') + '/r/' + referralCode;

    return NextResponse.json(
      {
        success: true,
        data: {
          id: partner.id,
          referralCode: partner.referralCode,
          referralUrl,
          status: partner.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[affiliate/register]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
