export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FeedbackReply {
  id: string;
  author: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Feedback {
  id: string;
  productId: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  authorKey?: string;
  replies?: FeedbackReply[];
}

// 파일 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

// 피드백 데이터 로드
function loadFeedbacks(): Feedback[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(FEEDBACK_FILE)) {
      saveFeedbacks([]);
      return [];
    }

    const fileContent = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load feedbacks:', error);
    return [];
  }
}

// 피드백 데이터 저장
function saveFeedbacks(feedbacks: Feedback[]): void {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save feedbacks:', error);
  }
}

// PUT: 피드백 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, rating, authorKey } = body;

    const feedbacks = loadFeedbacks();
    const feedbackIndex = feedbacks.findIndex((f) => f.id === id);

    if (feedbackIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (feedbacks[feedbackIndex].authorKey !== authorKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: You can only edit your own feedback',
        },
        { status: 403 }
      );
    }

    // 업데이트
    feedbacks[feedbackIndex] = {
      ...feedbacks[feedbackIndex],
      content,
      rating,
    };

    saveFeedbacks(feedbacks);

    return NextResponse.json({
      success: true,
      data: feedbacks[feedbackIndex],
      message: 'Feedback updated successfully',
    });
  } catch (error) {
    console.error('Failed to update feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update feedback',
      },
      { status: 500 }
    );
  }
}

// DELETE: 피드백 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorKey } = body;

    const feedbacks = loadFeedbacks();
    const feedbackIndex = feedbacks.findIndex((f) => f.id === id);

    if (feedbackIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (feedbacks[feedbackIndex].authorKey !== authorKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: You can only delete your own feedback',
        },
        { status: 403 }
      );
    }

    // 삭제
    const deletedFeedback = feedbacks[feedbackIndex];
    feedbacks.splice(feedbackIndex, 1);
    saveFeedbacks(feedbacks);

    return NextResponse.json({
      success: true,
      data: deletedFeedback,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete feedback',
      },
      { status: 500 }
    );
  }
}

// POST: 댓글 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, content, isAdmin } = body;

    if (!author || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Author and content are required',
        },
        { status: 400 }
      );
    }

    const feedbacks = loadFeedbacks();
    const feedbackIndex = feedbacks.findIndex((f) => f.id === id);

    if (feedbackIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    const newReply: FeedbackReply = {
      id: Date.now().toString(),
      author,
      content,
      isAdmin: isAdmin || false,
      createdAt: new Date().toISOString(),
    };

    if (!feedbacks[feedbackIndex].replies) {
      feedbacks[feedbackIndex].replies = [];
    }

    feedbacks[feedbackIndex].replies!.push(newReply);
    saveFeedbacks(feedbacks);

    return NextResponse.json({
      success: true,
      data: newReply,
      message: 'Reply added successfully',
    });
  } catch (error) {
    console.error('Failed to add reply:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add reply',
      },
      { status: 500 }
    );
  }
}
