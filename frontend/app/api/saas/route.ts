import { NextRequest, NextResponse } from 'next/server';
import { SaasStore } from '@/lib/saas-store';

// GET: 모든 SaaS 제품 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    // 카테고리 필터링
    let filteredProducts = category
      ? SaasStore.getByCategory(category)
      : SaasStore.getAll();

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SaaS products',
      },
      { status: 500 }
    );
  }
}

// POST: 새 SaaS 제품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, overview, url, partners, category, planeProjectId, thumbnail } = body;

    // 유효성 검사
    if (!name || !overview || !url || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, overview, url, and category are required',
        },
        { status: 400 }
      );
    }

    // Plane에 이슈 생성
    let planeIssueId = null;
    try {
      const planeResponse = await fetch(`${request.nextUrl.origin}/api/plane/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `[SaaS] ${name}`,
          description_html: `<p><strong>카테고리:</strong> ${category}</p><p><strong>개요:</strong> ${overview}</p><p><strong>URL:</strong> <a href="${url}">${url}</a></p><p><strong>참여 파트너:</strong> ${partners?.join(', ') || '없음'}</p>`,
          priority: 'medium',
        }),
      });

      if (planeResponse.ok) {
        const planeData = await planeResponse.json();
        planeIssueId = planeData.data?.id;
      }
    } catch (planeError) {
      console.error('Plane 이슈 생성 실패:', planeError);
      // Plane 실패해도 SaaS는 생성
    }

    // 새 제품 생성
    const newProduct = SaasStore.create({
      name,
      overview,
      url,
      partners: partners || [],
      category,
      thumbnail,
      planeIssueId,
      planeProjectId: 'SOCIA',
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: planeIssueId
          ? 'SaaS product created and synced to Plane'
          : 'SaaS product created (Plane sync failed)',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create SaaS product',
      },
      { status: 500 }
    );
  }
}
