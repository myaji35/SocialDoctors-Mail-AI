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
  authorKey?: string; // 작성자 식별용 (브라우저 세션 기반)
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

// GET: 피드백 조회 (특정 제품 또는 전체)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    const feedbacks = loadFeedbacks();

    const filteredFeedbacks = productId
      ? feedbacks.filter((f) => f.productId === productId)
      : feedbacks;

    // 최신순 정렬
    const sortedFeedbacks = filteredFeedbacks.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sortedFeedbacks,
      count: sortedFeedbacks.length,
    });
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feedbacks',
      },
      { status: 500 }
    );
  }
}

// POST: 새 피드백 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, author, content, rating, authorKey } = body;

    // 유효성 검사
    if (!productId || !author || !content || rating === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID, author, content, and rating are required',
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rating must be between 1 and 5',
        },
        { status: 400 }
      );
    }

    const feedbacks = loadFeedbacks();

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      productId,
      author,
      content,
      rating,
      authorKey, // 작성자 식별 키 저장
      replies: [],
      createdAt: new Date().toISOString(),
    };

    feedbacks.push(newFeedback);
    saveFeedbacks(feedbacks);

    return NextResponse.json(
      {
        success: true,
        data: newFeedback,
        message: 'Feedback created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create feedback',
      },
      { status: 500 }
    );
  }
}
