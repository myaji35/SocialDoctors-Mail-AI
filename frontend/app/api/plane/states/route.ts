import { NextResponse } from 'next/server';

// Plane 설정
const PLANE_CONFIG = {
  plane_url: process.env.PLANE_URL || 'http://34.158.192.195',
  api_token: process.env.PLANE_API_TOKEN || '',
  workspace: process.env.PLANE_WORKSPACE || 'testgraph',
  project_id: 'SOCIA',
};

// Plane 프로젝트 상태 조회
export async function GET() {
  try {
    const url = `${PLANE_CONFIG.plane_url}/api/v1/workspaces/${PLANE_CONFIG.workspace}/projects/${PLANE_CONFIG.project_id}/states/`;

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
    const states = Array.isArray(data) ? data : data.results || [];

    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error('Plane 상태 조회 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Plane 상태 조회 실패',
      },
      { status: 500 }
    );
  }
}
