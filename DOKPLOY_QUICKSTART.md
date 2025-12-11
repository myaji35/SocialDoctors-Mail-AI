# Dokploy 배포 빠른 시작 가이드

이 가이드는 웹 대시보드 배포(옵션 A)와 GitHub Actions 자동화(옵션 C)를 다룹니다.

## 📋 사전 준비

- ✅ Dokploy 서버: `http://34.64.143.114:3000`
- ✅ API Token: `rFDhPKemOKaKDDVGTrsNvdviQQfZXIcSBRCZHRNwpLdcGyqVBiTJgPrTmqmhElcd`
- ✅ GitHub 저장소: `myaji35/SocialDoctors-Mail-AI`
- ✅ 배포 파일 준비 완료:
  - `frontend/Dockerfile.production`
  - `frontend/.dockerignore`
  - `frontend/next.config.ts` (standalone mode)

---

## 🎯 옵션 A: 웹 대시보드 수동 배포 (5분)

### 1단계: GitHub Provider 연결

1. Dokploy 대시보드 접속: `http://34.64.143.114:3000`
2. **Settings** → **Git Providers** 메뉴 이동
3. **Add GitHub** 클릭
4. GitHub 계정 인증 및 저장소 권한 부여
5. `myaji35/SocialDoctors-Mail-AI` 저장소 선택

### 2단계: 프로젝트 생성

1. 대시보드 홈에서 **Create Project** 클릭
2. 프로젝트 이름: `socialdoctors`
3. 설명: `SocialDoctors Marketplace Platform`
4. **Create** 클릭

### 3단계: 애플리케이션 생성

1. `socialdoctors` 프로젝트 내에서 **Create Application** 클릭
2. 다음 정보 입력:
   - **Application Type**: Git
   - **Name**: `socialdoctors-frontend`
   - **Repository**: `myaji35/SocialDoctors-Mail-AI`
   - **Branch**: `main`
   - **Build Path**: `frontend`

### 4단계: 빌드 설정

**General Settings:**
```
Port: 3000
```

**Git Settings:**
```
Build Path: frontend
Branch: main
```

**Build Settings (중요!):**
```
Build Type: Dockerfile
Dockerfile Path: Dockerfile.production
Build Context: .
```

### 5단계: 환경 변수 설정

**Environment Variables** 탭에서 다음 변수들을 추가:

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

### 6단계: 배포 시작

1. **Deploy** 버튼 클릭
2. 실시간 빌드 로그 확인
3. 배포 완료 대기 (약 5-10분)
4. 생성된 URL 확인 (예: `http://socialdoctors-frontend.34.64.143.114`)

### 7단계: 도메인 설정 (선택사항)

배포 후 도메인을 추가하려면:

1. **Domains** 탭 클릭
2. **Add Domain** 클릭
3. 도메인 입력 후 저장
4. DNS A 레코드를 `34.64.143.114`로 설정

---

## 🤖 옵션 C: GitHub Actions 자동 배포

### 1단계: GitHub Secrets 설정

1. GitHub 저장소 접속: `https://github.com/myaji35/SocialDoctors-Mail-AI`
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭하여 다음 추가:

**필수 Secrets:**

| Name | Value |
|------|-------|
| `DOKPLOY_URL` | `http://34.64.143.114:3000` |
| `DOKPLOY_TOKEN` | `rFDhPKemOKaKDDVGTrsNvdviQQfZXIcSBRCZHRNwpLdcGyqVBiTJgPrTmqmhElcd` |
| `DOKPLOY_APP_ID` | 웹 대시보드 배포 후 얻은 Application ID |

**Application ID 확인 방법:**
- Dokploy 대시보드 → 애플리케이션 클릭
- URL에서 ID 확인: `http://34.64.143.114:3000/project/xxx/application/{APP_ID}`
- 또는 Settings 탭에서 "Application ID" 복사

### 2단계: Workflow 파일 확인

`.github/workflows/dokploy-deploy.yml` 파일이 이미 생성되어 있습니다.

**트리거 조건:**
- `main` 브랜치에 푸시할 때 자동 실행
- 수동 실행 가능 (workflow_dispatch)

### 3단계: 첫 자동 배포 테스트

```bash
# 로컬에서 변경사항 커밋 및 푸시
git add .
git commit -m "Enable GitHub Actions deployment"
git push origin main
```

### 4단계: 배포 진행 확인

1. GitHub 저장소 → **Actions** 탭
2. 최신 워크플로우 실행 확인
3. 실시간 로그 모니터링
4. 완료 후 Dokploy 대시보드에서 재배포 확인

### 5단계: 수동 배포 트리거 (옵션)

자동 배포 외에 수동으로도 실행 가능:

1. GitHub → **Actions** 탭
2. **Deploy to Dokploy** 워크플로우 선택
3. **Run workflow** 클릭
4. 브랜치 선택 후 **Run workflow** 확인

---

## 🔍 배포 확인 체크리스트

배포 완료 후 다음 항목을 확인하세요:

### ✅ 접속 테스트
```bash
# 헬스체크 (배포 완료 후)
curl http://34.64.143.114:PORT
# PORT는 Dokploy가 자동 할당 (대시보드에서 확인)
```

### ✅ 환경 변수 로드 확인
- Clerk 로그인 페이지 정상 작동
- Gemini API 연동 테스트
- Plane 프로젝트 연동 확인

### ✅ 빌드 최적화 확인
```bash
# Docker 이미지 크기 (예상)
# - 전체 빌드: ~1.2GB
# - 최종 이미지: ~150MB (standalone mode)
```

### ✅ 로그 확인
1. Dokploy 대시보드 → Application → **Logs**
2. 에러 메시지 없는지 확인
3. Next.js 서버 정상 시작 확인

---

## 🐛 문제 해결

### GitHub Provider 연결 실패
**증상:** "Github Provider not found" 오류

**해결:**
1. Dokploy Settings → Git Providers
2. GitHub 다시 연결
3. 저장소 권한 재확인

### 빌드 실패
**증상:** Docker build failed

**해결:**
```bash
# 로컬에서 빌드 테스트
cd frontend
docker build -f Dockerfile.production -t test .

# 로그 확인
dokploy logs --follow
```

### 환경 변수 누락
**증상:** 500 Internal Server Error

**해결:**
1. Dokploy → Application → Environment Variables
2. 모든 필수 변수 재확인
3. **Redeploy** 클릭

### API Token 권한 오류
**증상:** "Unauthorized" 응답

**해결:**
1. Dokploy Settings → API Tokens
2. 토큰 재생성
3. GitHub Secrets의 `DOKPLOY_TOKEN` 업데이트

---

## 📊 자동 배포 흐름도

```
GitHub Push (main)
    ↓
GitHub Actions 트리거
    ↓
Dokploy API 호출
    ↓
Git Clone → Docker Build → Deploy
    ↓
자동 배포 완료
```

---

## 🎉 다음 단계

배포 완료 후:

1. ✅ **모니터링 설정**
   - Dokploy Metrics 확인
   - 리소스 사용량 체크

2. ✅ **도메인 연결**
   - 커스텀 도메인 추가
   - SSL 인증서 자동 발급

3. ✅ **데이터베이스 추가**
   - PostgreSQL 컨테이너 생성
   - 환경 변수 연결

4. ✅ **알림 설정**
   - Slack/Discord 웹훅 연동
   - 배포 성공/실패 알림

---

## 📞 지원

**Dokploy 문제:**
- 공식 문서: https://docs.dokploy.com
- Discord: https://discord.gg/dokploy
- GitHub Issues: https://github.com/Dokploy/dokploy/issues

**프로젝트 문제:**
- GitHub Issues: https://github.com/myaji35/SocialDoctors-Mail-AI/issues
