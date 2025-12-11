#!/bin/bash

# SocialDoctors Dokploy 배포 스크립트
# 사용법: ./deploy-to-dokploy.sh

set -e

echo "🚀 SocialDoctors Dokploy 배포 준비..."

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Git 상태 확인
echo -e "\n${YELLOW}1. Git 상태 확인...${NC}"
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}변경사항이 있습니다. 커밋이 필요합니다.${NC}"
  git status --short

  read -p "모든 변경사항을 커밋하시겠습니까? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    read -p "커밋 메시지를 입력하세요: " commit_msg
    git commit -m "$commit_msg"
  else
    echo -e "${RED}배포를 취소합니다.${NC}"
    exit 1
  fi
fi

# 2. 현재 브랜치 확인
current_branch=$(git branch --show-current)
echo -e "${GREEN}현재 브랜치: $current_branch${NC}"

# 3. 원격 저장소로 푸시
echo -e "\n${YELLOW}2. 원격 저장소로 푸시...${NC}"
git push origin $current_branch

# 4. Dockerfile 존재 확인
echo -e "\n${YELLOW}3. Dockerfile 확인...${NC}"
if [ ! -f "frontend/Dockerfile.production" ]; then
  echo -e "${RED}오류: frontend/Dockerfile.production 파일이 없습니다.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Dockerfile 확인 완료${NC}"

# 5. .dockerignore 확인
if [ ! -f "frontend/.dockerignore" ]; then
  echo -e "${YELLOW}경고: .dockerignore 파일이 없습니다.${NC}"
else
  echo -e "${GREEN}✓ .dockerignore 확인 완료${NC}"
fi

# 6. next.config.ts 확인
echo -e "\n${YELLOW}4. Next.js 설정 확인...${NC}"
if grep -q "output: 'standalone'" frontend/next.config.ts; then
  echo -e "${GREEN}✓ Standalone 모드 활성화됨${NC}"
else
  echo -e "${RED}오류: next.config.ts에 standalone 모드가 설정되지 않았습니다.${NC}"
  exit 1
fi

# 7. 환경 변수 체크리스트
echo -e "\n${YELLOW}5. 환경 변수 체크리스트${NC}"
echo -e "${YELLOW}Dokploy 대시보드에서 다음 환경 변수를 설정했는지 확인하세요:${NC}"
echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "  - CLERK_SECRET_KEY"
echo "  - GEMINI_API_KEY"
echo "  - PLANE_URL"
echo "  - PLANE_API_TOKEN (선택사항)"
echo "  - NODE_ENV=production"

read -p "모든 환경 변수가 설정되었습니까? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}환경 변수를 먼저 설정해주세요.${NC}"
  exit 1
fi

# 8. 로컬 Docker 빌드 테스트 (선택사항)
echo -e "\n${YELLOW}6. 로컬에서 Docker 빌드 테스트하시겠습니까? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Docker 빌드 시작...${NC}"
  cd frontend
  docker build -f Dockerfile.production -t socialdoctors:test .
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker 빌드 성공${NC}"
  else
    echo -e "${RED}Docker 빌드 실패. 오류를 수정한 후 다시 시도하세요.${NC}"
    exit 1
  fi
  cd ..
fi

# 9. 배포 정보 출력
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ 모든 준비가 완료되었습니다!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. Dokploy 대시보드 접속: https://dokploy.com 또는 http://YOUR_SERVER_IP:3000"
echo "2. 'Create Application' 클릭"
echo "3. Repository 선택: 17_SocialDoctors"
echo "4. Branch: $current_branch"
echo "5. Build Path: frontend/"
echo "6. Build Type:"
echo "   - Dockerfile: frontend/Dockerfile.production"
echo "   - 또는 Nixpacks (자동 감지)"
echo "7. Port: 3000"
echo "8. 'Deploy' 클릭"
echo ""
echo -e "${GREEN}GitHub 푸시가 완료되었으므로 Dokploy가 자동으로 감지합니다.${NC}"
echo -e "${YELLOW}자동 배포가 활성화되어 있다면 곧 배포가 시작됩니다!${NC}"
echo ""
echo -e "${YELLOW}배포 진행상황은 Dokploy 대시보드에서 확인하세요.${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
