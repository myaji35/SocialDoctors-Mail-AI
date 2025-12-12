# PostgreSQL 데이터베이스 설정 가이드

이 가이드는 Dokploy에서 PostgreSQL을 생성하고 SocialDoctors 애플리케이션과 연결하는 방법을 설명합니다.

## 1. Dokploy에서 PostgreSQL 생성

### 단계 1: Dokploy 대시보드 접속
- URL: http://34.64.143.114:3000
- 로그인

### 단계 2: 프로젝트 페이지로 이동
1. 좌측 사이드바 → **Projects** 클릭
2. **SocialDoctors** 프로젝트 클릭

### 단계 3: PostgreSQL 데이터베이스 생성
1. 프로젝트 페이지에서 **"Add Service"** 또는 **"Create"** 버튼 클릭
2. **"Postgres"** 선택
3. 다음 정보 입력:
   ```
   Name: socialdoctors-db
   Description: SocialDoctors SaaS products database
   Database Name: socialdoctors_db
   Username: socialdoctors_user
   Password: (강력한 비밀번호 - 안전하게 보관!)
   Port: 5432 (기본값)
   ```
4. **Create** 버튼 클릭

### 단계 4: 연결 정보 확인
1. 생성된 `socialdoctors-db` 데이터베이스 클릭
2. **General** 또는 **Settings** 탭에서 연결 정보 확인:
   - **Internal URL** (중요!): `postgresql://socialdoctors_user:PASSWORD@socialdoctors-db:5432/socialdoctors_db`
   - External URL: `postgresql://socialdoctors_user:PASSWORD@34.64.143.114:PORT/socialdoctors_db`

## 2. 애플리케이션에 DATABASE_URL 설정

### Dokploy 환경변수 설정
1. `socialdoctors-frontend` 애플리케이션 클릭
2. **Environment** 탭 클릭
3. 새 환경변수 추가:
   ```
   Key: DATABASE_URL
   Value: postgresql://socialdoctors_user:YOUR_PASSWORD@socialdoctors-db:5432/socialdoctors_db
   ```
   ⚠️ **주의**: Internal URL을 사용하세요 (호스트명이 `socialdoctors-db`)
4. **Save** 클릭

## 3. 데이터베이스 마이그레이션

### 로컬에서 마이그레이션 파일 생성 (이미 완료됨)
```bash
cd frontend
npx prisma migrate dev --name init
```

### Dokploy에서 마이그레이션 실행

#### 방법 1: Dockerfile에 추가 (권장)
`Dockerfile.production`에 다음 라인이 있는지 확인:
```dockerfile
# 프로덕션 마이그레이션 실행
RUN npx prisma generate
CMD npx prisma migrate deploy && node server.js
```

#### 방법 2: 수동 실행
Dokploy Console에서:
```bash
npx prisma migrate deploy
```

### 데이터 시드 (초기 데이터 삽입)
```bash
npx tsx scripts/migrate-data.ts
```

## 4. 배포 및 확인

### 단계 1: 변경사항 커밋 및 푸시
```bash
git add .
git commit -m "Add PostgreSQL database integration"
git push origin main
```

### 단계 2: Dokploy 자동 배포 확인
- GitHub Actions가 자동으로 배포 트리거
- 또는 Dokploy 대시보드에서 수동 배포

### 단계 3: 동작 확인
```bash
curl http://socialdoctors.34.64.143.114.nip.io/api/saas
```

예상 응답:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Social Pulse",
      "overview": "...",
      ...
    }
  ],
  "count": 3
}
```

## 5. 데이터베이스 관리

### 백업
Dokploy 대시보드 → `socialdoctors-db` → **Backups** 탭

### 데이터 확인
```bash
# Dokploy Console에서
docker exec -it socialdoctors-db psql -U socialdoctors_user -d socialdoctors_db

# SQL 쿼리
SELECT * FROM saas_products;
```

### 데이터 초기화 (주의!)
```bash
npx prisma migrate reset
npx tsx scripts/migrate-data.ts
```

## 6. 트러블슈팅

### 연결 오류: "Can't reach database server"
- ✅ DATABASE_URL에 **Internal URL** 사용했는지 확인 (`socialdoctors-db:5432`)
- ✅ PostgreSQL 컨테이너가 실행 중인지 확인
- ✅ 애플리케이션과 데이터베이스가 같은 Dokploy 프로젝트에 있는지 확인

### 마이그레이션 실패
```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 강제 마이그레이션
npx prisma migrate deploy --force
```

### 테이블이 없음
```bash
# 스키마 재생성
npx prisma db push
```

## 7. 환경별 DATABASE_URL

### 로컬 개발 (`.env.local`)
```env
DATABASE_URL="postgresql://socialdoctors_user:PASSWORD@localhost:5432/socialdoctors_db"
```

### Dokploy 프로덕션 (Environment Variables)
```env
DATABASE_URL="postgresql://socialdoctors_user:PASSWORD@socialdoctors-db:5432/socialdoctors_db"
```

## 다음 단계

PostgreSQL 설정이 완료되면:
1. ✅ 로컬과 배포 환경의 데이터가 동기화됩니다
2. ✅ 컨테이너 재시작 시에도 데이터가 보존됩니다
3. ✅ 복잡한 쿼리와 관계형 데이터 모델링이 가능합니다
4. ✅ 자동 백업 및 복원 기능을 사용할 수 있습니다

---

**문제가 발생하면 Dokploy 로그를 확인하세요:**
- Dokploy Dashboard → `socialdoctors-frontend` → **Logs** 탭
- Dokploy Dashboard → `socialdoctors-db` → **Logs** 탭
