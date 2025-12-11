// 공유 SaaS 제품 데이터 저장소
// 실제 프로덕션 환경에서는 데이터베이스(PostgreSQL, MongoDB 등)를 사용해야 합니다

export interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  partners: string[];
  category: string;
  planeIssueId?: string | null;
  planeProjectId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// 초기 데이터
const initialProducts: SaasProduct[] = [
  {
    id: '1',
    name: 'Social Pulse',
    overview: '소셜 미디어 자동화 마케팅 플랫폼. AI 기반 콘텐츠 생성 및 예약 게시 기능 제공',
    url: 'https://socialpulse.example.com',
    partners: ['마케팅팀', '파트너A'],
    category: '마케팅',
    planeIssueId: null,
    planeProjectId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Partner Hub',
    overview: '제휴사 및 인플루언서 관리 플랫폼. 실시간 성과 추적과 자동 정산 시스템',
    url: 'https://partnerhub.example.com',
    partners: ['영업팀', '파트너B'],
    category: '파트너 관리',
    planeIssueId: null,
    planeProjectId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Content AI',
    overview: 'GPT 기반 AI 콘텐츠 생성 도구. 블로그, SNS, 광고 카피라이팅 자동화',
    url: 'https://contentai.example.com',
    partners: ['콘텐츠팀'],
    category: 'AI',
    planeIssueId: null,
    planeProjectId: null,
    createdAt: new Date().toISOString(),
  },
];

// 메모리 저장소 (서버 재시작 시 초기화됨)
let saasProducts: SaasProduct[] = [...initialProducts];

// CRUD 작업을 위한 유틸리티 함수들

export const SaasStore = {
  // 모든 제품 조회
  getAll(): SaasProduct[] {
    return [...saasProducts];
  },

  // ID로 제품 조회
  getById(id: string): SaasProduct | undefined {
    return saasProducts.find((p) => p.id === id);
  },

  // 카테고리로 제품 필터링
  getByCategory(category: string): SaasProduct[] {
    return saasProducts.filter((p) => p.category === category);
  },

  // 새 제품 생성
  create(product: Omit<SaasProduct, 'id' | 'createdAt'>): SaasProduct {
    const newProduct: SaasProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saasProducts.push(newProduct);
    return newProduct;
  },

  // 제품 업데이트
  update(id: string, updates: Partial<SaasProduct>): SaasProduct | null {
    const index = saasProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    saasProducts[index] = {
      ...saasProducts[index],
      ...updates,
      id, // ID는 변경 불가
      updatedAt: new Date().toISOString(),
    };

    return saasProducts[index];
  },

  // 제품 삭제
  delete(id: string): SaasProduct | null {
    const index = saasProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }

    const deletedProduct = saasProducts[index];
    saasProducts = saasProducts.filter((p) => p.id !== id);
    return deletedProduct;
  },

  // 데이터 초기화 (테스트 용도)
  reset(): void {
    saasProducts = [...initialProducts];
  },

  // 통계 정보
  getStats(): {
    total: number;
    byCategory: Record<string, number>;
    withPlaneSync: number;
  } {
    const byCategory: Record<string, number> = {};
    let withPlaneSync = 0;

    saasProducts.forEach((product) => {
      // 카테고리별 카운트
      byCategory[product.category] = (byCategory[product.category] || 0) + 1;

      // Plane 연동된 제품 카운트
      if (product.planeIssueId) {
        withPlaneSync++;
      }
    });

    return {
      total: saasProducts.length,
      byCategory,
      withPlaneSync,
    };
  },
};
