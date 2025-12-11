#!/bin/bash
# Dokploy 배포 스크립트

echo "🚀 Dokploy 배포 스크립트"
echo "========================"

# 설정
DOKPLOY_URL="http://34.64.143.114:3000"
DOKPLOY_TOKEN="rFDhPKemOKaKDDVGTrsNvdviQQfZXIcSBRCZHRNwpLdcGyqVBiTJgPrTmqmhElcd"
PROJECT_NAME="SocialDoctors"

# 색상 설정
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Dokploy 웹 대시보드에서 다음 단계를 수행해주세요:${NC}"
echo ""

echo "1. Dokploy 대시보드 접속:"
echo "   ${DOKPLOY_URL}"
echo ""

echo "2. 애플리케이션이 없다면 생성:"
echo "   - Project: SocialDoctors 클릭"
echo "   - Create Application 클릭"
echo ""

echo "3. Application 설정:"
echo "   ✅ General 탭:"
echo "      - Name: socialdoctors-frontend"
echo "      - Port: 3000"
echo ""
echo "   ✅ Git 탭:"
echo "      - Repository: myaji35/SocialDoctors-Mail-AI"
echo "      - Branch: main"
echo "      - Build Path: frontend"
echo ""
echo "   ✅ Build 탭:"
echo "      - Build Type: Dockerfile"
echo "      - Dockerfile Path: Dockerfile.production"
echo "      - Context Path: ."
echo ""

echo "4. Environment Variables 탭에 다음 추가:"
cat << 'EOF'
NODE_ENV=production
PORT=3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_RzKvIGWTJ8QIkAPNt3WqjdC2sORh3hDQNlo1pLxp0H

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Gemini API
GEMINI_API_KEY=AIzaSyBDjky7Xxv6eZF0iEnh_WFf0obzKWru73A

# Plane Project Management
PLANE_URL=http://34.158.192.195
PLANE_API_TOKEN=your_plane_api_token_here
PLANE_WORKSPACE=testgraph
PLANE_PROJECT_ID=SOCIA

# Production
NEXT_TELEMETRY_DISABLED=1
EOF

echo ""
echo "5. Deploy 버튼 클릭"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}📝 배포 완료 후 Application ID 확인:${NC}"
echo "   - URL에서 확인: .../application/{APP_ID}"
echo "   - Settings 탭에서 복사"
echo ""
echo "   이 ID를 GitHub Secrets에 추가:"
echo "   - Name: DOKPLOY_APP_ID"
echo "   - Value: [복사한 Application ID]"
echo -e "${GREEN}============================================${NC}"