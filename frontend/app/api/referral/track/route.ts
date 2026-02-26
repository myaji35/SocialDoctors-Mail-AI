export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, userAgent, ipAddress } = body;

    if (!referralCode) {
      return NextResponse.json({ success: false, error: 'referralCode is required' }, { status: 400 });
    }

    const partner = await prisma.partner.findUnique({ where: { referralCode } });
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Invalid referral code' }, { status: 404 });
    }

    await prisma.referralClick.create({
      data: {
        partnerId: partner.id,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[referral/track]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
