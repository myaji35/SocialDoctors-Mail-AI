import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 관리자는 전체 파트너 통계, 일반 사용자는 자신의 파트너 정보만
  const [
    totalPartners,
    activePartners,
    monthlyClicks,
    monthlyConversions,
    totalCommissionPaid,
    recentPartners,
    pendingSettlements,
  ] = await Promise.all([
    prisma.partner.count(),
    prisma.partner.count({ where: { status: 'ACTIVE' } }),
    prisma.referralClick.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.referralClick.count({
      where: { converted: true, createdAt: { gte: startOfMonth } },
    }),
    prisma.commissionTransaction.aggregate({
      _sum: { commissionAmount: true },
      where: { status: 'PAID' },
    }),
    prisma.partner.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: { select: { totalEarned: true, currentBalance: true } },
        _count: { select: { clicks: true, referredUsers: true } },
      },
    }),
    prisma.settlement.findMany({
      where: { status: 'REQUESTED' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: { include: { partner: { select: { name: true } } } },
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalPartners,
      activePartners,
      monthlyClicks,
      monthlyConversions,
      totalCommissionPaid: totalCommissionPaid._sum.commissionAmount ?? 0,
    },
    recentPartners: recentPartners.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.referralCode,
      status: p.status,
      clicks: p._count.clicks,
      referrals: p._count.referredUsers,
      earned: p.wallet?.totalEarned ?? 0,
    })),
    pendingSettlements: pendingSettlements.map((s) => ({
      id: s.id,
      partnerName: s.wallet.partner.name,
      amount: s.amount,
      bankName: s.bankName,
      accountHolder: s.accountHolder,
      createdAt: s.createdAt,
    })),
  });
}
