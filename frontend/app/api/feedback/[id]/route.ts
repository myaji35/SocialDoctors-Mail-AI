export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: 피드백 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, rating, authorKey } = await request.json();

    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    if (feedback.authorKey !== authorKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized: You can only edit your own feedback' }, { status: 403 });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { content, rating },
      include: { replies: true },
    });

    return NextResponse.json({ success: true, data: updated, message: 'Feedback updated successfully' });
  } catch (error) {
    console.error('Failed to update feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to update feedback' }, { status: 500 });
  }
}

// DELETE: 피드백 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { authorKey } = await request.json();

    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    if (feedback.authorKey !== authorKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized: You can only delete your own feedback' }, { status: 403 });
    }

    await prisma.feedback.delete({ where: { id } });

    return NextResponse.json({ success: true, data: feedback, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}

// POST: 댓글 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { author, content, isAdmin } = await request.json();

    if (!author || !content) {
      return NextResponse.json({ success: false, error: 'Author and content are required' }, { status: 400 });
    }

    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    const reply = await prisma.feedbackReply.create({
      data: { feedbackId: id, author, content, isAdmin: isAdmin || false },
    });

    return NextResponse.json({ success: true, data: reply, message: 'Reply added successfully' });
  } catch (error) {
    console.error('Failed to add reply:', error);
    return NextResponse.json({ success: false, error: 'Failed to add reply' }, { status: 500 });
  }
}
