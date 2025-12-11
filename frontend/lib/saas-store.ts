// 공유 SaaS 제품 데이터 저장소
// 파일 기반 JSON 저장소로 데이터 영구 보존

import fs from 'fs';
import path from 'path';

export interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  partners: string[];
  thumbnail?: string;
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

// 파일 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'saas-products.json');

// 데이터 파일에서 읽기
function loadProducts(): SaasProduct[] {
  try {
    // data 디렉토리 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // 파일이 없으면 초기 데이터로 생성
    if (!fs.existsSync(DATA_FILE)) {
      saveProducts(initialProducts);
      return initialProducts;
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load products:', error);
    return [...initialProducts];
  }
}

// 데이터 파일에 저장
function saveProducts(products: SaasProduct[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save products:', error);
  }
}

// 메모리 캐시
let saasProducts: SaasProduct[] = loadProducts();

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
    saveProducts(saasProducts);
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

    saveProducts(saasProducts);
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
    saveProducts(saasProducts);
    return deletedProduct;
  },

  // 데이터 초기화 (테스트 용도)
  reset(): void {
    saasProducts = [...initialProducts];
    saveProducts(saasProducts);
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
