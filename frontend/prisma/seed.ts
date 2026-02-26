import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://gangseungsig@localhost:5432/socialdoctors_dev',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

const initialProducts = [
  {
    name: 'Social Pulse',
    overview: '소셜 미디어 자동화 마케팅 플랫폼. AI 기반 콘텐츠 생성 및 예약 게시로 Facebook, Instagram, X 등 멀티 플랫폼을 하나의 대시보드에서 통합 관리합니다.',
    url: '/saas/apps/social-pulse',
    partners: ['마케팅팀', '파트너A'],
    category: '마케팅',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Partner Hub',
    overview: '제휴사 및 인플루언서 파트너 관리 플랫폼. 고유 레퍼럴 링크 발급, 실시간 클릭·전환 추적, 자동 수수료 계산 및 정산 시스템을 제공합니다.',
    url: '/saas/apps/partner-hub',
    partners: ['영업팀', '파트너B'],
    category: '파트너 관리',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Content AI',
    overview: 'GPT 기반 AI 콘텐츠 생성 도구. 블로그, SNS, 광고 카피라이팅을 자동화하며 브랜드 톤앤매너를 학습해 일관된 메시지를 다국어로 즉시 생성합니다.',
    url: '/saas/apps/content-ai',
    partners: ['콘텐츠팀'],
    category: 'AI',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Insight Board',
    overview: '비즈니스 전 부서 데이터를 통합 시각화하는 실시간 BI 대시보드. AI 예측 분석으로 매출 트렌드를 파악하고 이상 징후를 즉시 감지해 알림을 보냅니다.',
    url: '/saas/apps/insight-board',
    partners: ['데이터팀'],
    category: '분석',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'CRM Pro',
    overview: '고객과의 모든 접점을 관리하는 통합 CRM. 고객 세그먼트, 자동화 커뮤니케이션, 구매 이력 분석, 로열티 프로그램으로 재구매율을 높입니다.',
    url: '/saas/apps/crm-pro',
    partners: ['영업팀', '고객팀'],
    category: 'CRM',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Pay Flow',
    overview: '카드·계좌이체·간편결제를 지원하는 통합 결제 시스템. 정기 구독 관리, 자동 정산, 세금 계산서 발행, 환불 처리를 원스톱으로 제공합니다.',
    url: '/saas/apps/pay-flow',
    partners: ['재무팀'],
    category: '결제',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Mail Rocket',
    overview: '드래그앤드롭 에디터와 자동화 워크플로우를 갖춘 이메일 마케팅 플랫폼. A/B 테스트와 세그먼트 발송으로 오픈율·전환율을 극대화합니다.',
    url: '/saas/apps/mail-rocket',
    partners: ['마케팅팀'],
    category: '이메일',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Shop Builder',
    overview: '코딩 없이 쇼핑몰을 만드는 노코드 커머스 빌더. 결제·재고·배송을 통합 관리하며 모바일 최적화 템플릿으로 5분 안에 오픈할 수 있습니다.',
    url: '/saas/apps/shop-builder',
    partners: ['커머스팀'],
    category: '커머스',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Form Wizard',
    overview: '드래그앤드롭으로 만드는 스마트 설문·폼 빌더. AI 응답 분석, 조건부 로직, 결제 연동, 팀 협업 기능으로 데이터 수집부터 분석까지 원스톱 제공합니다.',
    url: '/saas/apps/form-wizard',
    partners: ['마케팅팀'],
    category: '설문',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Task Flow',
    overview: '칸반 보드, 간트 차트, 시간 추적을 지원하는 팀 협업 프로젝트 관리 도구. Slack·Notion 연동으로 기존 워크플로우에 자연스럽게 통합됩니다.',
    url: '/saas/apps/task-flow',
    partners: ['개발팀', '운영팀'],
    category: '프로젝트 관리',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'CertiGraph',
    overview: 'AI 기반 자격증 시험 준비 플랫폼. PDF 업로드 30초만에 Knowledge Graph로 약점을 시각화하고, CBT 모의고사 + AI 합격 예측으로 최단 경로 합격을 지원합니다. 사회복지사 1급 → 전체 자격증 확장 중. 현재 투자 회원 모집 중!',
    url: 'https://exams.townin.net',
    partners: ['Gagahoho, Inc.', 'SocialDoctors'],
    category: 'AI',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
];

async function main() {
  console.log('🌱 데이터베이스 Seed 시작...\n');

  await prisma.saasProduct.deleteMany({});
  console.log('🗑️  기존 데이터 초기화\n');

  for (const product of initialProducts) {
    const created = await prisma.saasProduct.create({ data: product });
    console.log(`✅ ${created.name} (${created.category})`);
  }

  console.log(`\n✨ ${initialProducts.length}개 SaaS 제품 추가 완료!`);

  // SNS 채널 시드 (타운인 테스트 채널)
  const existingChannel = await prisma.snsChannel.findFirst({
    where: { clientSlug: 'townin' },
  });
  if (!existingChannel) {
    await prisma.snsChannel.create({
      data: {
        clientName: '타운인',
        clientSlug: 'townin',
        platform: 'FACEBOOK',
        channelName: '타운인 공식 페이지 (테스트)',
        pageId: 'TOWNIN_PAGE_ID_HERE',
        accessToken: 'MOCK_TOKEN_PLACEHOLDER',
        status: 'ACTIVE',
        metadata: { note: '테스트 채널 - 실제 토큰 입력 필요' },
      },
    });
    console.log('📣 타운인 테스트 SNS 채널 생성 완료');
  }
}

main()
  .catch((e) => { console.error('❌ Seed 실패:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
