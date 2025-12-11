import { NextRequest, NextResponse } from 'next/server';
import { SaasStore } from '@/lib/saas-store';

// GET: 특정 SaaS 제품 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = SaasStore.getById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SaaS product',
      },
      { status: 500 }
    );
  }
}

// PUT: SaaS 제품 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, overview, url, partners, category, planeIssueId, planeProjectId } = body;

    // 제품 업데이트
    const updatedProduct = SaasStore.update(id, {
      name,
      overview,
      url,
      partners,
      category,
      planeIssueId,
      planeProjectId,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    // TODO: Plane API 연동 - 이슈 업데이트
    // if (planeIssueId) {
    //   await updatePlaneIssue(planeIssueId, updatedProduct);
    // }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'SaaS product updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update SaaS product',
      },
      { status: 500 }
    );
  }
}

// DELETE: SaaS 제품 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedProduct = SaasStore.delete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    // TODO: Plane API 연동 - 이슈 삭제
    // if (deletedProduct.planeIssueId) {
    //   await deletePlaneIssue(deletedProduct.planeIssueId);
    // }

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'SaaS product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete SaaS product',
      },
      { status: 500 }
    );
  }
}
