import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Social Pulse',
    overview: '소셜 미디어 자동화 마케팅 플랫폼. AI 기반 콘텐츠 생성 및 예약 게시 기능 제공',
    url: 'https://socialpulse.example.com',
    partners: ['마케팅팀', '파트너A'],
    category: '마케팅',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Partner Hub',
    overview: '제휴사 및 인플루언서 관리 플랫폼. 실시간 성과 추적과 자동 정산 시스템',
    url: 'https://partnerhub.example.com',
    partners: ['영업팀', '파트너B'],
    category: '파트너 관리',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
  {
    name: 'Content AI',
    overview: 'GPT 기반 AI 콘텐츠 생성 도구. 블로그, SNS, 광고 카피라이팅 자동화',
    url: 'https://contentai.example.com',
    partners: ['콘텐츠팀'],
    category: 'AI',
    planeIssueId: null,
    planeProjectId: 'SOCIA',
  },
];

async function main() {
  console.log('🌱 데이터베이스 Seed 시작...\n');

  for (const product of initialProducts) {
    const created = await prisma.saasProduct.create({
      data: product,
    });
    console.log(`✅ 생성됨: ${created.name}`);
  }

  console.log(`\n✨ ${initialProducts.length}개의 제품이 추가되었습니다!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
