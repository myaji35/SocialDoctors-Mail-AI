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
  isActive?: boolean;
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
    overview: '소셜 미디어 자동화 마케팅 플랫폼. AI 기반 콘텐츠 생성 및 예약 게시로 Facebook, Instagram, X 등 멀티 플랫폼을 하나의 대시보드에서 통합 관리합니다.',
    url: 'https://socialpulse.example.com',
    partners: ['마케팅팀', '파트너A'],
    category: '마케팅',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Partner Hub',
    overview: '제휴사 및 인플루언서 파트너 관리 플랫폼. 고유 레퍼럴 링크 발급, 실시간 클릭·전환 추적, 자동 수수료 계산 및 정산 시스템을 제공합니다.',
    url: 'https://partnerhub.example.com',
    partners: ['영업팀', '파트너B'],
    category: '파트너 관리',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Content AI',
    overview: 'GPT 기반 AI 콘텐츠 생성 도구. 블로그, SNS, 광고 카피라이팅을 자동화하며 브랜드 톤앤매너를 학습해 일관된 메시지를 다국어로 즉시 생성합니다.',
    url: 'https://contentai.example.com',
    partners: ['콘텐츠팀'],
    category: 'AI',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Insight Board',
    overview: '비즈니스 전 부서 데이터를 통합 시각화하는 실시간 BI 대시보드. AI 예측 분석으로 매출 트렌드를 파악하고 이상 징후를 즉시 감지해 알림을 보냅니다.',
    url: 'https://insightboard.example.com',
    partners: ['데이터팀'],
    category: '분석',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'CRM Pro',
    overview: '고객과의 모든 접점을 관리하는 통합 CRM. 고객 세그먼트, 자동화 커뮤니케이션, 구매 이력 분석, 로열티 프로그램으로 재구매율을 높입니다.',
    url: 'https://crmpro.example.com',
    partners: ['영업팀', '고객팀'],
    category: 'CRM',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Pay Flow',
    overview: '카드·계좌이체·간편결제를 지원하는 통합 결제 시스템. 정기 구독 관리, 자동 정산, 세금 계산서 발행, 환불 처리를 원스톱으로 제공합니다.',
    url: 'https://payflow.example.com',
    partners: ['재무팀'],
    category: '결제',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Mail Rocket',
    overview: '드래그앤드롭 에디터와 자동화 워크플로우를 갖춘 이메일 마케팅 플랫폼. A/B 테스트와 세그먼트 발송으로 오픈율·전환율을 극대화합니다.',
    url: 'https://mailrocket.example.com',
    partners: ['마케팅팀'],
    category: '이메일',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'SEO Radar',
    overview: '키워드 리서치, 순위 추적, 기술 SEO 감사, 백링크 분석을 제공하는 검색 최적화 도구. AI가 SEO 개선 액션 플랜을 자동으로 제안합니다.',
    url: 'https://seoradar.example.com',
    partners: ['마케팅팀'],
    category: 'SEO',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Task Flow',
    overview: '칸반 보드, 간트 차트, 시간 추적을 지원하는 팀 협업 프로젝트 관리 도구. Slack·Notion 연동으로 기존 워크플로우에 자연스럽게 통합됩니다.',
    url: 'https://taskflow.example.com',
    partners: ['개발팀', '운영팀'],
    category: '프로젝트 관리',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Community Hub',
    overview: '포럼·이벤트·멤버십 등급·포인트 시스템을 갖춘 회원 커뮤니티 플랫폼. 고객 참여를 유도하고 브랜드 로열티를 높여 생애 가치(LTV)를 극대화합니다.',
    url: 'https://communityhub.example.com',
    partners: ['커뮤니티팀'],
    category: '커뮤니티',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
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
