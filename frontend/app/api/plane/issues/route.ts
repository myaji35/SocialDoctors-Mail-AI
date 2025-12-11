import { NextRequest, NextResponse } from 'next/server';

// Plane 설정
const PLANE_CONFIG = {
  plane_url: process.env.PLANE_URL || 'http://34.158.192.195',
  api_token: process.env.PLANE_API_TOKEN || '',
  workspace: process.env.PLANE_WORKSPACE || 'testgraph',
  project_id: 'SOCIA', // SocialDoctors 프로젝트
};

interface PlaneIssue {
  id: string;
  name: string;
  description_html?: string;
  state: string;
  priority?: string;
  created_at: string;
  updated_at: string;
}

// Plane에서 이슈 조회
export async function GET(request: NextRequest) {
  try {
    const url = `${PLANE_CONFIG.plane_url}/api/v1/workspaces/${PLANE_CONFIG.workspace}/projects/${PLANE_CONFIG.project_id}/issues/`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': PLANE_CONFIG.api_token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Plane API 오류: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 응답이 배열인지 객체인지 확인
    const issues = Array.isArray(data) ? data : data.results || [];

    return NextResponse.json({
      success: true,
      data: issues,
      count: issues.length,
    });
  } catch (error) {
    console.error('Plane API 연결 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Plane 서버 연결 실패',
      },
      { status: 500 }
    );
  }
}

// Plane에 이슈 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description_html, priority } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Issue name is required',
        },
        { status: 400 }
      );
    }

    const url = `${PLANE_CONFIG.plane_url}/api/v1/workspaces/${PLANE_CONFIG.workspace}/projects/${PLANE_CONFIG.project_id}/issues/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': PLANE_CONFIG.api_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description_html: description_html || '',
        priority: priority || 'medium',
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Plane API 오류: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Plane 이슈가 생성되었습니다',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Plane 이슈 생성 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Plane 이슈 생성 실패',
      },
      { status: 500 }
    );
  }
}
