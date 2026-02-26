export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SaasStore } from '@/lib/saas-store';

// GET: 특정 SaaS 제품 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prisma 시도, 실패 시 파일 기반 fallback
    let product;
    try {
      product = await prisma.saasProduct.findUnique({
        where: { id },
      });
    } catch (dbError) {
      console.warn('Database not available, using file-based storage');
      product = SaasStore.getById(id);
    }

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
    console.error('Failed to fetch SaaS product:', error);
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
    const {
      name, overview, url, partners, category, planeIssueId, planeProjectId, thumbnail,
      testUrl, launchDate, fundingTarget, fundingRaised, fundingEquity,
    } = body;

    // 제품 업데이트 (Prisma 시도, 실패 시 파일 기반 fallback)
    let updatedProduct;
    try {
      updatedProduct = await prisma.saasProduct.update({
        where: { id },
        data: {
          name,
          overview,
          url,
          partners,
          category,
          thumbnail,
          planeIssueId,
          planeProjectId,
          testUrl: testUrl ?? null,
          launchDate: launchDate ? new Date(launchDate) : null,
          fundingTarget: fundingTarget != null ? Number(fundingTarget) : null,
          fundingRaised: fundingRaised != null ? Number(fundingRaised) : 0,
          fundingEquity: fundingEquity != null ? Number(fundingEquity) : null,
        },
      });
    } catch (dbError: any) {
      console.warn('Database not available, using file-based storage');
      updatedProduct = SaasStore.update(id, {
        name,
        overview,
        url,
        partners,
        category,
        thumbnail,
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
  } catch (error: any) {
    console.error('Failed to update SaaS product:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update SaaS product',
      },
      { status: 500 }
    );
  }
}

// PATCH: SaaS 제품 활성화/비활성화 토글
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'isActive must be a boolean value',
        },
        { status: 400 }
      );
    }

    // 제품 업데이트 (Prisma 시도, 실패 시 파일 기반 fallback)
    let updatedProduct;
    try {
      updatedProduct = await prisma.saasProduct.update({
        where: { id },
        data: { isActive },
      });
    } catch (dbError: any) {
      console.warn('Database not available, using file-based storage');
      updatedProduct = SaasStore.update(id, { isActive });
      if (!updatedProduct) {
        return NextResponse.json(
          {
            success: false,
            error: 'SaaS product not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: `SaaS product ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error: any) {
    console.error('Failed to toggle SaaS product status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle SaaS product status',
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

    // 제품 삭제 (Prisma 시도, 실패 시 파일 기반 fallback)
    let deletedProduct;
    try {
      deletedProduct = await prisma.saasProduct.delete({
        where: { id },
      });
    } catch (dbError: any) {
      console.warn('Database not available, using file-based storage');
      deletedProduct = SaasStore.delete(id);
      if (!deletedProduct) {
        return NextResponse.json(
          {
            success: false,
            error: 'SaaS product not found',
          },
          { status: 404 }
        );
      }
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
  } catch (error: any) {
    console.error('Failed to delete SaaS product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete SaaS product',
      },
      { status: 500 }
    );
  }
}
