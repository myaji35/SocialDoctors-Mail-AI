#!/bin/bash

# Dokploy REST API 자동 배포 스크립트
# 사용법: ./dokploy-api-deploy.sh

set -e

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Dokploy 설정
DOKPLOY_URL="http://34.64.143.114:3000"
API_TOKEN="rFDhPKemOKaKDDVGTrsNvdviQQfZXIcSBRCZHRNwpLdcGyqVBiTJgPrTmqmhElcd"

# 프로젝트 설정
PROJECT_NAME="socialdoctors"
APP_NAME="socialdoctors-frontend"
GITHUB_REPO="https://github.com/myaji35/SocialDoctors-Mail-AI"
BRANCH="main"
BUILD_PATH="frontend"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Dokploy API 자동 배포 시작${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 1. 프로젝트 생성
echo -e "\n${YELLOW}1️⃣  프로젝트 생성 중...${NC}"
PROJECT_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/project.create" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$PROJECT_NAME\",
    \"description\": \"SocialDoctors Marketplace Platform\"
  }")

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}프로젝트가 이미 존재하거나 생성 실패${NC}"
  echo "Response: $PROJECT_RESPONSE"

  # 기존 프로젝트 조회
  PROJECTS=$(curl -s -X GET "$DOKPLOY_URL/api/project.all" \
    -H "Authorization: Bearer $API_TOKEN")

  PROJECT_ID=$(echo $PROJECTS | grep -o "\"projectId\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)

  if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ 프로젝트를 찾을 수 없습니다.${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✓ 프로젝트 ID: $PROJECT_ID${NC}"

# 2. 애플리케이션 생성
echo -e "\n${YELLOW}2️⃣  애플리케이션 생성 중...${NC}"
APP_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/application.create" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"name\": \"$APP_NAME\",
    \"appName\": \"$APP_NAME\",
    \"description\": \"SocialDoctors Frontend Application\"
  }")

APP_ID=$(echo $APP_RESPONSE | grep -o '"applicationId":"[^"]*' | cut -d'"' -f4)

if [ -z "$APP_ID" ]; then
  echo -e "${RED}❌ 애플리케이션 생성 실패${NC}"
  echo "Response: $APP_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ 애플리케이션 ID: $APP_ID${NC}"

# 3. Git 설정
echo -e "\n${YELLOW}3️⃣  Git 저장소 설정 중...${NC}"
GIT_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/application.update" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"applicationId\": \"$APP_ID\",
    \"sourceType\": \"git\",
    \"repository\": \"$GITHUB_REPO\",
    \"branch\": \"$BRANCH\",
    \"buildPath\": \"$BUILD_PATH\",
    \"dockerfile\": \"Dockerfile.production\"
  }")

echo -e "${GREEN}✓ Git 저장소 설정 완료${NC}"

# 4. 환경 변수 설정
echo -e "\n${YELLOW}4️⃣  환경 변수 설정 중...${NC}"

# 환경 변수 배열
declare -a ENV_VARS=(
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk"
  "CLERK_SECRET_KEY=sk_test_RzKvIGWTJ8QIkAPNt3WqjdC2sORh3hDQNlo1pLxp0H"
  "GEMINI_API_KEY=AIzaSyBDjky7Xxv6eZF0iEnh_WFf0obzKWru73A"
  "PLANE_URL=http://34.158.192.195"
  "PLANE_API_TOKEN=your_plane_api_token_here"
  "PLANE_WORKSPACE=testgraph"
  "PLANE_PROJECT_ID=SOCIA"
  "NODE_ENV=production"
  "NEXT_TELEMETRY_DISABLED=1"
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in"
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/"
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/"
)

# 환경 변수를 JSON 형식으로 변환
ENV_JSON=""
for env in "${ENV_VARS[@]}"; do
  KEY="${env%%=*}"
  VALUE="${env#*=}"
  ENV_JSON+="{\"key\":\"$KEY\",\"value\":\"$VALUE\"},"
done
ENV_JSON="[${ENV_JSON%,}]"

ENV_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/application.saveEnvironmentVariables" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"applicationId\": \"$APP_ID\",
    \"env\": $ENV_JSON
  }")

echo -e "${GREEN}✓ 환경 변수 ${#ENV_VARS[@]}개 설정 완료${NC}"

# 5. 빌드 설정
echo -e "\n${YELLOW}5️⃣  빌드 설정 중...${NC}"
BUILD_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/application.update" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"applicationId\": \"$APP_ID\",
    \"buildType\": \"dockerfile\",
    \"dockerfile\": \"Dockerfile.production\",
    \"dockerContextPath\": \".\",
    \"port\": 3000
  }")

echo -e "${GREEN}✓ 빌드 설정 완료${NC}"

# 6. 배포 시작
echo -e "\n${YELLOW}6️⃣  배포 시작...${NC}"
DEPLOY_RESPONSE=$(curl -s -X POST "$DOKPLOY_URL/api/application.deploy" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"applicationId\": \"$APP_ID\"
  }")

echo -e "${GREEN}✓ 배포 요청 전송 완료${NC}"

# 배포 상태 확인
echo -e "\n${YELLOW}배포 진행 중... (실시간 로그는 대시보드에서 확인)${NC}"
echo -e "${GREEN}대시보드: $DOKPLOY_URL${NC}"

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 배포 요청 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n📋 배포 정보:"
echo -e "  - 프로젝트: ${GREEN}$PROJECT_NAME${NC}"
echo -e "  - 애플리케이션: ${GREEN}$APP_NAME${NC}"
echo -e "  - 프로젝트 ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "  - 애플리케이션 ID: ${GREEN}$APP_ID${NC}"

echo -e "\n🔗 다음 단계:"
echo -e "  1. 대시보드에서 배포 로그 확인: ${GREEN}$DOKPLOY_URL/project/$PROJECT_ID${NC}"
echo -e "  2. 배포 완료 후 URL 확인 (자동 생성됨)"
echo -e "  3. GitHub Provider 연결 필요 시: ${GREEN}Settings → Git${NC}"

echo -e "\n${YELLOW}⚠️  GitHub Provider 미연결 시:${NC}"
echo -e "  웹 대시보드에서 Settings → Git → Add GitHub 클릭하여 연결"
