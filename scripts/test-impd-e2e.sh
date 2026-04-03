#!/bin/bash
# ─── IMPD ↔ SocialDoctors 홍보대행 E2E 테스트 ───────────────────
# 사용법: bash scripts/test-impd-e2e.sh [BASE_URL] [API_KEY]

set -e

BASE=${1:-"http://localhost:3017"}
API_KEY=${2:-"60984cea07235c0bdf6580c96fc953216c0c7fa818ce52be902ec5e0bdfc495f"}
CALLER="0008_choi-pd"
SLUG="choi-pd"
PASS=0
FAIL=0

green() { printf "\033[0;32m%s\033[0m\n" "$1"; }
red() { printf "\033[0;31m%s\033[0m\n" "$1"; }
header() { printf "\n\033[1;34m━━ %s ━━\033[0m\n" "$1"; }

check() {
  local name=$1 expected=$2 actual=$3
  if [ "$actual" = "$expected" ]; then
    green "  ✅ $name"
    PASS=$((PASS+1))
  else
    red "  ❌ $name (expected=$expected, got=$actual)"
    FAIL=$((FAIL+1))
  fi
}

HEADERS="-H 'X-Api-Key: $API_KEY' -H 'X-Caller-App: $CALLER' -H 'Content-Type: application/json'"

header "1. 헬스 체크"
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE")
check "서버 응답" "200" "$STATUS"

header "2. 채널 목록 조회"
CH_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE/api/social-pulse/channels?clientSlug=$SLUG" -H "X-Api-Key: $API_KEY")
check "채널 API 200" "200" "$CH_STATUS"

header "3. SNS 발행 (mockMode)"
for PLATFORM in FACEBOOK INSTAGRAM X THREADS TIKTOK YOUTUBE; do
  RESULT=$(curl -sf "$BASE/api/social-pulse/publish" \
    -X POST \
    -H "X-Api-Key: $API_KEY" \
    -H "X-Caller-App: $CALLER" \
    -H "Content-Type: application/json" \
    -d "{\"clientSlug\":\"$SLUG\",\"platform\":\"$PLATFORM\",\"content\":\"E2E 테스트: $PLATFORM\",\"mockMode\":true}" 2>/dev/null)
  SUCCESS=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success',''))" 2>/dev/null)
  check "$PLATFORM 발행" "True" "$SUCCESS"
done

header "4. 발행 상태 조회"
PUB_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE/api/social-pulse/publish/status?callerApp=$CALLER&limit=5" -H "X-Api-Key: $API_KEY")
check "발행 상태 API 200" "200" "$PUB_STATUS"

header "5. AI 카피 생성"
COPY_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE/api/social-pulse/generate-copy" \
  -X POST \
  -H "X-Api-Key: $API_KEY" \
  -H "X-Caller-App: $CALLER" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"테스트 프롬프트","platform":"FACEBOOK"}')
check "AI 카피 API 응답" "200" "$COPY_STATUS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "결과: "
green "✅ $PASS PASS"
if [ $FAIL -gt 0 ]; then
  red "❌ $FAIL FAIL"
fi
echo "총 $((PASS+FAIL))건 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $FAIL
