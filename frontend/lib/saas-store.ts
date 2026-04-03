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

// ─── 실제 서비스 데이터 ──────────────────────────────────────────
const initialProducts: SaasProduct[] = [
  // ── SocialDoctors 자체 서비스 ──
  {
    id: '1',
    name: 'Social Pulse',
    overview: '6개 플랫폼 자동 발행 홍보대행 엔진. Facebook, Instagram, Threads, X, TikTok, YouTube에 AI 카피와 카드뉴스를 생성하고 원클릭으로 동시 발행합니다. 외부 프로젝트 연동 SDK로 홍보대행 캠페인을 의뢰부터 리포트까지 자동화.',
    url: 'https://app.socialdoctors.kr',
    partners: ['Gagahoho'],
    category: '마케팅 자동화',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Partner Hub',
    overview: '제휴 파트너 관리 + 커미션 자동 정산 시스템. 고유 레퍼럴 링크 발급, 실시간 클릭·전환 추적, 결제 시 20% 커미션 자동 계산. Toss Payments 연동으로 파트너 정산까지 원스톱 처리.',
    url: 'https://app.socialdoctors.kr/partner',
    partners: ['Gagahoho'],
    category: '파트너 관리',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Content AI',
    overview: 'Google Gemini 기반 AI 콘텐츠 생성 도구. 블로그, SNS 카피, 광고 문구, 이메일 뉴스레터, 제품 설명, 보도자료 6종 템플릿으로 브랜드 톤에 맞는 콘텐츠를 즉시 생성합니다.',
    url: 'https://app.socialdoctors.kr/saas/apps/content-ai',
    partners: ['Gagahoho'],
    category: 'AI 콘텐츠',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  // ── 외부 연동 프로젝트 (실제 서비스) ──
  {
    id: '4',
    name: 'InsureGraph Pro',
    overview: 'GraphRAG 기반 보험 분석 SaaS. 보험 약관 간 관계를 그래프로 시각화하고 AI가 고객 맞춤형 보험 상품을 추천합니다. 고객 생애주기가치(CLV) 분석과 자동 갱신 알림으로 컨설팅 효율을 극대화.',
    url: 'https://insuregraph.socialdoctors.kr',
    partners: ['Gagahoho', '보험 컨설턴트'],
    category: '금융 · 보험',
    isActive: true,
    planeIssueId: null,
    planeProjectId: null,
    createdAt: '2025-12-01T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Townin',
    overview: '의정부시 중심 하이퍼로컬 생활 OS. 디지털 전단지, AR 포인트 시스템, 실시간 CCTV 안전지도, IoT 센서 통합. 가맹점 관리 대시보드와 지역 맞춤형 보험 서비스를 제공하는 지역 상생 플랫폼.',
    url: 'https://townin.kr',
    partners: ['Gagahoho', '의정부시'],
    category: '지역 기반 서비스',
    isActive: true,
    planeIssueId: null,
    planeProjectId: null,
    createdAt: '2025-10-01T00:00:00.000Z',
  },
  {
    id: '6',
    name: 'imPD',
    overview: '5060 베이비부머 대상 스마트폰 창업 교육 플랫폼. 온라인/오프라인/B2B 교육 과정 관리, 수강 결제, 커뮤니티, 뉴스레터 배포를 통합 제공. 최범희 PD의 "스마트폰 연구소" 공식 브랜드 허브.',
    url: 'https://impd.co.kr',
    partners: ['Gagahoho', '최범희 PD'],
    category: '교육 SaaS',
    isActive: true,
    planeIssueId: null,
    planeProjectId: null,
    createdAt: '2025-11-01T00:00:00.000Z',
  },
  {
    id: '7',
    name: 'OmniVibePro',
    overview: 'AI 기반 영상 자동화 SaaS. 구글시트 데이터로 영상 자동 생성, AI 음성 클로닝(ElevenLabs), 자동 자막(Whisper STT), Remotion 렌더링, 멀티채널 자동 배포까지 전 과정 자동화. Zero-Fault Audio 99% 정확도.',
    url: 'https://omnivibe.socialdoctors.kr',
    partners: ['Gagahoho'],
    category: 'AI 영상 마케팅',
    isActive: true,
    planeIssueId: null,
    planeProjectId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '8',
    name: 'CertiGraph',
    overview: 'AI 기반 자격증 시험 준비 플랫폼. PDF 기출문제 자동 파싱, Knowledge Graph 개념 시각화, CBT 모의고사, 오답 분석, AI 해설 생성. 사회복지사 등 국가자격증 수험생을 위한 올인원 학습 도구.',
    url: 'https://exams.townin.net',
    partners: ['Gagahoho'],
    category: '온라인 교육',
    isActive: true,
    planeIssueId: null,
    planeProjectId: null,
    createdAt: '2025-11-15T00:00:00.000Z',
  },
  {
    id: '9',
    name: 'Pay Flow',
    overview: 'Toss Payments 기반 통합 결제 시스템. 카드·계좌이체·간편결제 지원, 구독 관리, 파트너 커미션 자동 계산, 웹훅 기반 실시간 정산. SocialDoctors 전체 마켓플레이스의 결제 인프라.',
    url: 'https://app.socialdoctors.kr/checkout',
    partners: ['Gagahoho'],
    category: '결제 인프라',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: '10',
    name: 'Card News AI',
    overview: 'AI 카드뉴스 자동 생성 + SNS 발행 시스템. Gemini AI가 주제에 맞는 5~9슬라이드 카드뉴스를 생성하고, 렌더링 후 Facebook 등 SNS에 원클릭 자동 발행. 서비스소개·교육·이벤트 4종 템플릿.',
    url: 'https://app.socialdoctors.kr/admin/card-news',
    partners: ['Gagahoho'],
    category: 'AI 콘텐츠',
    isActive: true,
    planeIssueId: null,
    planeProjectId: 'SOCIA',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

// 파일 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'saas-products.json');

// 데이터 파일에서 읽기
function loadProducts(): SaasProduct[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
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

export const SaasStore = {
  getAll(): SaasProduct[] {
    return [...saasProducts];
  },
  getById(id: string): SaasProduct | undefined {
    return saasProducts.find((p) => p.id === id);
  },
  getByCategory(category: string): SaasProduct[] {
    return saasProducts.filter((p) => p.category === category);
  },
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
  update(id: string, updates: Partial<SaasProduct>): SaasProduct | null {
    const index = saasProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    saasProducts[index] = { ...saasProducts[index], ...updates, id, updatedAt: new Date().toISOString() };
    saveProducts(saasProducts);
    return saasProducts[index];
  },
  delete(id: string): SaasProduct | null {
    const index = saasProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const deleted = saasProducts[index];
    saasProducts = saasProducts.filter((p) => p.id !== id);
    saveProducts(saasProducts);
    return deleted;
  },
  reset(): void {
    saasProducts = [...initialProducts];
    saveProducts(saasProducts);
  },
  getStats(): { total: number; byCategory: Record<string, number>; withPlaneSync: number } {
    const byCategory: Record<string, number> = {};
    let withPlaneSync = 0;
    saasProducts.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      if (p.planeIssueId) withPlaneSync++;
    });
    return { total: saasProducts.length, byCategory, withPlaneSync };
  },
};
