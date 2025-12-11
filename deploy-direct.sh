#!/bin/bash
set -e

echo "🚀 SocialDoctors 직접 배포 시작..."

gcloud compute ssh gangseungsig@plane-server --zone=asia-northeast3-a --command "
set -e

# 기존 설치 확인
echo '📦 필수 패키지 확인 중...'
if ! command -v node &> /dev/null; then
    echo 'Node.js 설치 중...'
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo 'PM2 설치 중...'
    sudo npm install -g pm2
fi

# 코드 배포
echo '📥 코드 다운로드 중...'
cd ~
rm -rf SocialDoctors-Mail-AI
git clone https://github.com/myaji35/SocialDoctors-Mail-AI.git
cd SocialDoctors-Mail-AI/frontend

# 환경 변수 파일 생성
echo '📝 환경 변수 설정 중...'
cat > .env.local << 'EOF'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_RzKvIGWTJ8QIkAPNt3WqjdC2sORh3hDQNlo1pLxp0H
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
GEMINI_API_KEY=AIzaSyBDjky7Xxv6eZF0iEnh_WFf0obzKWru73A
PORT=3030
EOF

# 의존성 설치
echo '📦 의존성 설치 중...'
npm ci

# 빌드
echo '🔨 빌드 중...'
npm run build

# PM2로 실행
echo '🚀 애플리케이션 시작 중...'
pm2 delete socialdoctors 2>/dev/null || true
pm2 start npm --name socialdoctors -- start
pm2 save
pm2 startup | grep sudo | bash || true

echo '✅ 배포 완료!'
pm2 list
pm2 logs socialdoctors --lines 20
"

echo ""
echo "✅ 배포 완료!"
echo "🌐 접속 URL: http://34.158.192.195:3030"
echo ""
