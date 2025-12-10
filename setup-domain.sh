#!/bin/bash
set -e

echo "🌐 도메인 설정 시작..."

gcloud compute ssh gangseungsig@plane-server --zone=asia-northeast3-a --command "
set -e

# Nginx 설치 확인
if ! command -v nginx &> /dev/null; then
    echo '📦 Nginx 설치 중...'
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Nginx 설정 파일 생성
echo '📝 Nginx 설정 생성 중...'
sudo tee /etc/nginx/sites-available/socialdoctors > /dev/null << 'EOF'
server {
    listen 80;
    server_name socialdoctors.34.158.192.195.nip.io;

    location / {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 심볼릭 링크 생성
sudo ln -sf /etc/nginx/sites-available/socialdoctors /etc/nginx/sites-enabled/

# Nginx 설정 테스트
echo '🔍 Nginx 설정 테스트 중...'
sudo nginx -t

# Nginx 재시작
echo '🔄 Nginx 재시작 중...'
sudo systemctl restart nginx
sudo systemctl enable nginx

echo '✅ Nginx 설정 완료!'
echo '🌐 접속 URL: http://socialdoctors.34.158.192.195.nip.io'
"

echo ""
echo "✅ 도메인 설정 완료!"
echo "🌐 이제 다음 URL로 접속 가능합니다:"
echo "   http://socialdoctors.34.158.192.195.nip.io"
echo ""
