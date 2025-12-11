# Plane 프로젝트 관리 통합

SocialDoctors 플랫폼과 Plane 프로젝트 관리 시스템의 통합이 완료되었습니다.

## 구현된 기능

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수가 추가되었습니다:

```env
# Plane Project Management
PLANE_URL=http://34.158.192.195
PLANE_API_TOKEN=your_plane_api_token_here
PLANE_WORKSPACE=testgraph
PLANE_PROJECT_ID=SOCIA
```

**중요:** `PLANE_API_TOKEN`을 실제 Plane API 토큰으로 변경해야 합니다.

### 2. API 엔드포인트

다음 API 엔드포인트가 생성되었습니다:

#### `/api/plane/issues` (GET, POST)
- **GET**: 프로젝트의 모든 이슈 조회
- **POST**: 새 이슈 생성

위치: `frontend/app/api/plane/issues/route.ts`

#### `/api/plane/states` (GET)
- **GET**: 프로젝트의 모든 상태(State) 조회

위치: `frontend/app/api/plane/states/route.ts`

### 3. SaaS 갤러리 통합

**파일:** `frontend/components/SaasGallerySection.tsx`

새로운 기능:
- ✈️ Plane 연동 상태 배지 표시
- SaaS 제품이 Plane에 동기화되면 "✈️ Plane 연동" 배지 표시
- 동기화되지 않은 제품은 "⚠️ 미연동" 배지 표시
- "✈️ Plane에서 보기" 버튼으로 Plane 이슈 페이지 직접 이동

### 4. Plane 상태 대시보드

**파일:** `frontend/components/PlaneStatusDashboard.tsx`

새로운 대시보드 컴포넌트:
- 📊 전체 이슈 수
- 🚀 SaaS 제품 수
- ✅ 완료된 작업 수
- 📈 프로젝트 진행률 (%)
- 상태별 이슈 목록 (Backlog, In Progress, Done)
- 우선순위별 표시 (긴급, 높음, 보통, 낮음)
- 실시간 새로고침 기능

### 5. 자동 동기화

**파일:** `frontend/app/api/saas/route.ts` (수정됨)

새 SaaS 제품이 등록되면:
1. SaaS 제품 데이터베이스에 저장
2. 자동으로 Plane에 이슈 생성
3. 제품명은 `[SaaS] {제품명}` 형식
4. 카테고리, 개요, URL, 참여 파트너 정보가 Plane 이슈 설명에 포함
5. 우선순위는 기본값 'medium'

## 사용 방법

### 1. Plane API 토큰 설정

Plane 대시보드에서 API 토큰을 생성하고 `.env.local` 파일을 업데이트:

```bash
PLANE_API_TOKEN=your_actual_token_here
```

### 2. 서버 재시작

환경 변수 변경 후 개발 서버 재시작:

```bash
cd frontend
PORT=3030 npm run dev
```

### 3. SaaS 제품 등록

1. 메인 페이지의 "SaaS" 섹션으로 이동
2. "+ 새 SaaS 등록" 버튼 클릭
3. 제품 정보 입력 (이름, 카테고리, 개요, URL, 파트너)
4. "등록하기" 클릭
5. 자동으로 Plane에 이슈 생성됨
6. 제품 카드에 "✈️ Plane 연동" 배지 표시

### 4. Plane 대시보드 확인

1. 메인 페이지를 아래로 스크롤
2. "✈️ Plane 프로젝트 현황" 섹션 확인
3. 전체/백로그/진행중/완료 필터 사용
4. 이슈 클릭하여 Plane에서 직접 관리

## 기술 세부사항

### Plane API 설정

```typescript
const PLANE_CONFIG = {
  plane_url: process.env.PLANE_URL || 'http://34.158.192.195',
  api_token: process.env.PLANE_API_TOKEN || '',
  workspace: process.env.PLANE_WORKSPACE || 'testgraph',
  project_id: 'SOCIA', // SocialDoctors 프로젝트
};
```

### 이슈 생성 예시

```typescript
const planeResponse = await fetch(`${request.nextUrl.origin}/api/plane/issues`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: `[SaaS] ${name}`,
    description_html: `<p><strong>카테고리:</strong> ${category}</p>...`,
    priority: 'medium',
  }),
});
```

### 데이터 모델

```typescript
interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  partners: string[];
  category: string;
  planeIssueId?: string | null;  // Plane 이슈 ID
  planeProjectId?: string | null; // Plane 프로젝트 ID
}
```

## 문제 해결

### API 엔드포인트 404 오류

만약 `/api/plane/issues` 또는 `/api/plane/states`가 404를 반환하면:

1. Next.js 캐시 삭제:
```bash
cd frontend
rm -rf .next
```

2. 서버 재시작:
```bash
PORT=3030 npm run dev
```

3. 브라우저 캐시 삭제 (Cmd+Shift+R)

### Plane API 연결 오류

Plane API 토큰이 올바르게 설정되었는지 확인:

```bash
echo $PLANE_API_TOKEN
```

또는 `.env.local` 파일 직접 확인

### CORS 오류

Plane 서버에서 CORS 설정이 필요할 수 있습니다. Plane 관리자에게 문의하세요.

## 향후 개선 사항

1. **양방향 동기화**: Plane에서 이슈를 업데이트하면 SaaS 제품 정보도 업데이트
2. **웹훅 통합**: Plane 이슈 변경 시 실시간 알림
3. **고급 필터링**: 담당자, 라벨, 마일스톤별 필터
4. **이슈 상태 자동 업데이트**: SaaS 제품 상태에 따라 Plane 이슈 상태 자동 변경
5. **통계 및 리포트**: 프로젝트 진행률, 완료율, 예상 완료 시간 등

## 참고 자료

- [Plane API 문서](https://docs.plane.so/api)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Plane-Manager GitHub](https://github.com/myaji35/plane-manager)

## 라이선스

이 통합은 SocialDoctors 프로젝트의 일부이며 동일한 라이선스를 따릅니다.
