export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-auth';

// GET /api/admin/partners — 파트너 목록 조회
export async function GET(request: NextRequest) {
  if (!(await verifyAdminToken(request))) {
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

    const where = status ? { status: status as 'PENDING' | 'ACTIVE' | 'SUSPENDED' } : {};

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        include: {
          wallet: true,
          _count: { select: { referredUsers: true, clicks: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: partners, total, page, limit });
  } catch (error) {
    console.error('[admin/partners GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/admin/partners — 파트너 상태 변경
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: 'DB not available' }, { status: 503 });
  }

  try {
    const { partnerId, status } = await request.json();

    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: { status },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error('[admin/partners PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
