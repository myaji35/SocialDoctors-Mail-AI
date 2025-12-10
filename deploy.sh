#!/bin/bash
set -e

echo "🚀 SocialDoctors 배포 시작..."

# 1. Docker 이미지 빌드
echo "📦 Docker 이미지 빌드 중..."
docker build --platform linux/amd64 -t myaji35/socialdoctors:latest .

# 2. Docker Hub에 푸시
echo "⬆️  Docker Hub에 푸시 중..."
docker push myaji35/socialdoctors:latest

# 3. Coolify 서버에 배포
echo "🌐 서버에 배포 중..."
gcloud compute ssh gangseungsig@plane-server --zone=asia-northeast3-a --command "
set -e
echo '📥 이미지 다운로드 중...'
docker pull myaji35/socialdoctors:latest

echo '🛑 기존 컨테이너 정리 중...'
docker stop socialdoctors-prod 2>/dev/null || true
docker rm socialdoctors-prod 2>/dev/null || true

echo '🚀 새 컨테이너 시작 중...'
docker run -d \
  --name socialdoctors-prod \
  --restart unless-stopped \
  -p 3030:3030 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk' \
  -e CLERK_SECRET_KEY='sk_test_RzKvIGWTJ8QIkAPNt3WqjdC2sORh3hDQNlo1pLxp0H' \
  -e NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in' \
  -e NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up' \
  -e NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL='/' \
  -e NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL='/' \
  -e GEMINI_API_KEY='AIzaSyBDjky7Xxv6eZF0iEnh_WFf0obzKWru73A' \
  myaji35/socialdoctors:latest

echo '✅ 컨테이너 시작 완료'
sleep 5

echo '📊 컨테이너 상태:'
docker ps | grep socialdoctors-prod

echo '📝 로그:'
docker logs --tail 20 socialdoctors-prod
"

echo ""
echo "✅ 배포 완료!"
echo "🌐 접속 URL: http://34.158.192.195:3030"
echo ""
