# SocialDoctors Dokploy 배포 가이드

## Dokploy란?

Dokploy는 **오픈소스 자체 호스팅 PaaS**로, Heroku, Vercel, Netlify의 무료 대안입니다.
- Docker 기반 배포
- Next.js 완벽 지원
- 무중단 배포
- 데이터베이스 통합 관리
- 멀티 서버 지원

## 1. Dokploy 서버 설치

### 방법 1: Dokploy Cloud (관리형) - 권장
가장 쉬운 방법입니다. $4.50/월

1. [Dokploy Cloud](https://dokploy.com) 회원가입
2. 새 프로젝트 생성
3. 아래 "애플리케이션 배포" 섹션으로 이동

### 방법 2: VPS 자체 호스팅 (무료)

**필수 사항:**
- Ubuntu 20.04+ 또는 Debian 11+
- 최소 2GB RAM
- Docker 설치됨

**설치 명령:**

```bash
# Dokploy 설치 (단일 명령어)
curl -sSL https://dokploy.com/install.sh | sh
```

설치 후 브라우저에서 `http://YOUR_SERVER_IP:3000`로 접속하여 초기 설정을 완료하세요.

## 2. GitHub 저장소 연결

### 2-1. GitHub에 코드 푸시

```bash
cd /Users/gangseungsig/Documents/02_GitHub/17_SocialDoctors
git add .
git commit -m "Prepare for Dokploy deployment"
git push origin main
```

### 2-2. Dokploy에서 GitHub 연동

1. Dokploy 대시보드 → Settings → Git Providers
2. "Add GitHub" 클릭
3. GitHub 계정 인증
4. SocialDoctors 저장소 선택

## 3. 애플리케이션 배포

### 3-1. 새 애플리케이션 생성

1. Dokploy 대시보드 → "Create Application"
2. **Application Type**: Git
3. **Repository**: `17_SocialDoctors`
4. **Branch**: `main`
5. **Build Path**: `frontend/`

### 3-2. 빌드 설정

**Build Settings:**
```yaml
Build Type: Dockerfile
Dockerfile Path: frontend/Dockerfile.production
Build Context: frontend
Port: 3000
```

**또는 Nixpacks 사용 (더 간단):**
```yaml
Build Type: Nixpacks
Build Path: frontend
Port: 3000
```

### 3-3. 환경 변수 설정

Dokploy 대시보드에서 다음 환경 변수를 추가하세요:

```env
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
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 3-4. 도메인 설정 (선택사항)

1. Dokploy → Application → Domains
2. "Add Domain" 클릭
3. 커스텀 도메인 입력 (예: `socialdoctors.com`)
4. DNS 설정:
   ```
   Type: A
   Name: @
   Value: YOUR_DOKPLOY_SERVER_IP
   ```
5. SSL 자동 발급 (Let's Encrypt)

### 3-5. 배포 시작

1. "Deploy" 버튼 클릭
2. 빌드 로그 실시간 확인
3. 배포 완료 후 URL로 접속 테스트

## 4. 데이터베이스 추가 (향후 필요 시)

SocialDoctors를 실제 데이터베이스로 업그레이드하려면:

### PostgreSQL 추가

1. Dokploy → "Create Database"
2. **Type**: PostgreSQL
3. **Name**: socialdoctors-db
4. **Version**: 16
5. **Username**: socialdoctors
6. **Password**: (강력한 비밀번호 생성)

### 환경 변수 추가

애플리케이션에 데이터베이스 연결 정보 추가:

```env
DATABASE_URL=postgresql://socialdoctors:PASSWORD@postgres:5432/socialdoctors
```

## 5. 자동 배포 설정

### GitHub Webhook 연동

1. Dokploy → Application → Settings → Webhooks
2. "Enable Auto Deploy on Push" 활성화
3. Branch: `main` 선택

이제 `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다!

```bash
git add .
git commit -m "Update feature"
git push origin main
# 자동으로 Dokploy가 감지하고 배포 시작
```

## 6. 모니터링 및 로그

### 실시간 로그 확인

1. Dokploy → Application → Logs
2. 실시간 스트리밍 로그 확인

### 리소스 모니터링

1. Dokploy → Application → Metrics
2. CPU, 메모리, 네트워크 사용량 확인

### 알림 설정

1. Dokploy → Notifications
2. Slack/Discord 웹훅 추가
3. 배포 성공/실패 알림 받기

## 7. 고급 기능

### 무중단 배포 (Zero Downtime)

Dokploy는 기본적으로 무중단 배포를 지원합니다:
- 새 버전 빌드
- 헬스체크 통과 확인
- 트래픽 전환
- 구 버전 종료

### 롤백

배포 실패 시 이전 버전으로 즉시 롤백:

1. Dokploy → Application → Deployments
2. 이전 배포 선택
3. "Rollback" 클릭

### 스케일링

트래픽 증가 시 인스턴스 수 조정:

1. Dokploy → Application → Settings
2. Replicas: 1 → 3 (3개 인스턴스)
3. 자동 로드밸런싱 적용

### 멀티 환경

개발/스테이징/프로덕션 환경 분리:

```yaml
# 개발 환경
Branch: develop
Domain: dev.socialdoctors.com

# 프로덕션 환경
Branch: main
Domain: socialdoctors.com
```

## 8. 비용 최적화

### Dokploy Cloud vs 자체 호스팅 비교

| 항목 | Dokploy Cloud | VPS 자체 호스팅 |
|------|---------------|-----------------|
| 월 비용 | $4.50 | $5-20 (VPS) |
| 관리 난이도 | 쉬움 | 중간 |
| 확장성 | 높음 | 중간 |
| 지원 | 공식 지원 | 커뮤니티 |

### 추천 VPS 제공업체 (자체 호스팅 시)

1. **DigitalOcean** - $6/월 (1GB RAM)
2. **Hetzner** - €4.51/월 (2GB RAM) - 가성비 최고
3. **Vultr** - $6/월 (1GB RAM)
4. **Linode** - $5/월 (1GB RAM)

## 9. 보안 모범 사례

### 환경 변수 보안

- ❌ 절대 `.env` 파일을 Git에 커밋하지 마세요
- ✅ Dokploy 대시보드에서만 관리
- ✅ API 키는 주기적으로 로테이션

### SSL/TLS

- ✅ 항상 HTTPS 사용 (Dokploy 자동 설정)
- ✅ Let's Encrypt 인증서 자동 갱신

### 접근 제어

- ✅ Dokploy 대시보드 2FA 활성화
- ✅ 강력한 비밀번호 사용
- ✅ IP 화이트리스트 설정 (옵션)

## 10. 문제 해결

### 빌드 실패

**증상:** "Build failed" 오류

**해결:**
1. 로그 확인: Dokploy → Logs
2. 일반적인 원인:
   - 환경 변수 누락
   - package.json 의존성 문제
   - Dockerfile 경로 오류

```bash
# 로컬에서 빌드 테스트
cd frontend
docker build -f Dockerfile.production -t socialdoctors:test .
```

### 메모리 부족

**증상:** "Out of memory" 오류

**해결:**
1. VPS 메모리 업그레이드 (2GB → 4GB)
2. 빌드 시 메모리 제한 증가:
   ```dockerfile
   ENV NODE_OPTIONS="--max-old-space-size=2048"
   ```

### 포트 충돌

**증상:** "Port 3000 already in use"

**해결:**
1. Dokploy → Application → Settings
2. Port를 3000 → 8080 변경

### 배포 느림

**해결:**
- Docker 캐시 활용 (이미 설정됨)
- 멀티스테이지 빌드 최적화 (이미 적용됨)
- 의존성 변경 시만 재설치

## 11. 다음 단계

1. ✅ Dokploy에 SocialDoctors 배포
2. ⬜ PostgreSQL 데이터베이스 추가
3. ⬜ 커스텀 도메인 연결
4. ⬜ GitHub Actions CI/CD 추가
5. ⬜ Sentry 에러 트래킹 설정
6. ⬜ Google Analytics 추가

## 참고 자료

- [Dokploy 공식 문서](https://docs.dokploy.com)
- [Dokploy GitHub](https://github.com/Dokploy/dokploy)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**질문이나 문제가 있으면:**
- Dokploy Discord: https://discord.gg/dokploy
- GitHub Issues: https://github.com/Dokploy/dokploy/issues
