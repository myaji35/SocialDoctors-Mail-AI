export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 피드백 조회 (특정 제품 또는 전체)
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    const where = productId ? { productId } : {};

    const feedbacks = await prisma.feedback.findMany({
      where,
      include: { replies: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: feedbacks, count: feedbacks.length });
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

// POST: 새 피드백 생성
export async function POST(request: NextRequest) {
  try {
    const { productId, author, content, rating, authorKey } = await request.json();

    if (!productId || !author || !content || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID, author, content, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: { productId, author, content, rating, authorKey },
      include: { replies: true },
    });

    return NextResponse.json({ success: true, data: feedback, message: 'Feedback created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to create feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to create feedback' }, { status: 500 });
  }
}
