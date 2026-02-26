export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAdminAuthorized(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/settlements — 정산 요청 목록
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ success: true, data: [], total: 0 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = status ? { status: status as 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' } : {};

    const [settlements, total] = await Promise.all([
      prisma.settlement.findMany({
        where,
        include: {
          wallet: { include: { partner: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.settlement.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: settlements, total, page, limit });
  } catch (error) {
    console.error('[admin/settlements GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/admin/settlements — 정산 상태 처리
export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  }

  try {
    const { settlementId, status, memo } = await request.json();

    const settlement = await prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status,
        memo,
        processedAt: ['COMPLETED', 'REJECTED'].includes(status) ? new Date() : undefined,
      },
    });

    // 정산 완료 시 지갑 잔액 차감
    if (status === 'COMPLETED') {
      await prisma.partnerWallet.update({
        where: { id: settlement.walletId },
        data: {
          currentBalance: { decrement: settlement.amount },
          pendingAmount: { decrement: settlement.amount },
        },
      });
    }

    return NextResponse.json({ success: true, data: settlement });
  } catch (error) {
    console.error('[admin/settlements PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
