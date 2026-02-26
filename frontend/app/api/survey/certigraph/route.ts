export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cert, method, pain, budget, email } = body;

    if (!cert || !email) {
      return NextResponse.json({ success: false, error: 'cert and email are required' }, { status: 400 });
    }

    // UsageRecord에 설문 데이터 저장 (별도 테이블 없이 재활용)
    await prisma.usageRecord.create({
      data: {
        userId: email, // 비로그인 상태라 email을 식별자로 사용
        appSlug: 'certigraph-survey',
        action: 'survey_submit',
        metadata: { cert, method, pain, budget, email },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[survey/certigraph]', error);
    // DB 실패해도 200 반환 (사용자 경험 우선)
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  try {
    const surveys = await prisma.usageRecord.findMany({
      where: { appSlug: 'certigraph-survey' },
      orderBy: { createdAt: 'desc' },
    });

    const responses = surveys.map((s) => s.metadata);

    // 집계
    const summary = {
      total: surveys.length,
      byCert: {} as Record<string, number>,
      byMethod: {} as Record<string, number>,
      byPain: {} as Record<string, number>,
      byBudget: {} as Record<string, number>,
      emails: surveys.map((s) => (s.metadata as Record<string, string>)?.email).filter(Boolean),
    };

    for (const r of responses as Record<string, string>[]) {
      if (r.cert) summary.byCert[r.cert] = (summary.byCert[r.cert] || 0) + 1;
      if (r.method) summary.byMethod[r.method] = (summary.byMethod[r.method] || 0) + 1;
      if (r.pain) summary.byPain[r.pain] = (summary.byPain[r.pain] || 0) + 1;
      if (r.budget) summary.byBudget[r.budget] = (summary.byBudget[r.budget] || 0) + 1;
    }

    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error('[survey/certigraph GET]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
