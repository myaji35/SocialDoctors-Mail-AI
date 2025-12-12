#!/usr/bin/env tsx

/**
 * 데이터 마이그레이션 스크립트
 * 기존 파일 기반 데이터를 PostgreSQL로 이전
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 초기 데이터 (배포판 기준)
const initialProducts = [
  {
    name: 'Social Pulse',
    overview: '소셜 미디어 자동화 마케팅 플랫폼. AI 기반 콘텐츠 생성 및 예약 게시 기능 제공',
    url: 'https://socialpulse.example.com',
    partners: ['마케팅팀', '파트너A'],
    category: '마케팅',
    planeIssueId: null,
    planeProjectId: null,
  },
  {
    name: 'Partner Hub',
    overview: '제휴사 및 인플루언서 관리 플랫폼. 실시간 성과 추적과 자동 정산 시스템',
    url: 'https://partnerhub.example.com',
    partners: ['영업팀', '파트너B'],
    category: '파트너 관리',
    planeIssueId: null,
    planeProjectId: null,
  },
  {
    name: 'Content AI',
    overview: 'GPT 기반 AI 콘텐츠 생성 도구. 블로그, SNS, 광고 카피라이팅 자동화',
    url: 'https://contentai.example.com',
    partners: ['콘텐츠팀'],
    category: 'AI',
    planeIssueId: null,
    planeProjectId: null,
  },
];

async function main() {
  console.log('🚀 데이터 마이그레이션 시작...\n');

  try {
    // 1. 기존 데이터 확인
    const existingCount = await prisma.saasProduct.count();
    console.log(`📊 현재 데이터베이스에 ${existingCount}개의 제품이 있습니다.`);

    if (existingCount > 0) {
      console.log('⚠️  데이터가 이미 존재합니다. 계속하시겠습니까?');
      console.log('   기존 데이터를 삭제하고 초기 데이터로 리셋하려면 다음 명령을 실행하세요:');
      console.log('   npx prisma migrate reset\n');
      return;
    }

    // 2. 초기 데이터 삽입
    console.log(`\n📥 ${initialProducts.length}개의 초기 제품 데이터를 삽입합니다...\n`);

    for (const product of initialProducts) {
      const created = await prisma.saasProduct.create({
        data: product,
      });
      console.log(`✅ 생성됨: ${created.name} (ID: ${created.id})`);
    }

    console.log(`\n✨ 데이터 마이그레이션 완료!`);
    console.log(`총 ${initialProducts.length}개의 제품이 추가되었습니다.\n`);

  } catch (error) {
    console.error('❌ 데이터 마이그레이션 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
