export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const partner = await prisma.partner.findUnique({
      where: { userId: userId },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
        clicks: true,
        referredUsers: true,
      },
    });

    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 });
    }

    const totalClicks = partner.clicks.length;
    const totalSignups = partner.referredUsers.length;
    const conversionRate = totalClicks > 0 ? (totalSignups / totalClicks) * 100 : 0;

    // 최근 30일 일별 클릭/가입 집계
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicksByDay = partner.clicks
      .filter((c) => c.createdAt >= thirtyDaysAgo)
      .reduce<Record<string, { clicks: number; signups: number }>>((acc, click) => {
        const date = click.createdAt.toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { clicks: 0, signups: 0 };
        acc[date].clicks++;
        if (click.converted) acc[date].signups++;
        return acc;
      }, {});

    const clicksChart = Object.entries(clicksByDay)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referralUrl = baseUrl.replace(/\/$/, '') + '/r/' + partner.referralCode;

    return NextResponse.json({
      success: true,
      data: {
        partner: {
          id: partner.id,
          referralCode: partner.referralCode,
          referralUrl,
          status: partner.status,
          name: partner.name,
        },
        stats: {
          totalClicks,
          totalSignups,
          conversionRate: Math.round(conversionRate * 10) / 10,
          totalEarned: partner.wallet?.totalEarned ?? 0,
          currentBalance: partner.wallet?.currentBalance ?? 0,
          pendingAmount: partner.wallet?.pendingAmount ?? 0,
        },
        recentTransactions: partner.wallet?.transactions ?? [],
        clicksChart,
      },
    });
  } catch (error) {
    console.error('[affiliate/dashboard]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
