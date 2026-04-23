#!/usr/bin/env bash
# Smoke test: verify auth behavior on admin + public API routes.
# Usage: BASE_URL=http://localhost:3000 ./scripts/test-admin-auth.sh
#
# check_admin:  admin routes must return 401 without auth.
# check_public: public intake routes must not return 500 (handler must run).

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
FAILED=0

_curl_status() {
  local method="$1"
  local path="$2"
  if [ "$method" = "GET" ]; then
    curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}"
  else
    curl -s -o /dev/null -w "%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d '{}' \
      "${BASE_URL}${path}"
  fi
}

check_admin() {
  local method="$1"
  local path="$2"
  local status
  status=$(_curl_status "$method" "$path")

  if [ "$status" != "401" ]; then
    echo "FAIL [$method $path] => $status (expected 401)"
    FAILED=$((FAILED + 1))
  else
    echo "PASS [$method $path] => $status"
  fi
}

check_public() {
  local method="$1"
  local path="$2"
  local status
  status=$(_curl_status "$method" "$path")

  if [ "$status" = "500" ]; then
    echo "FAIL [$method $path] => $status (server error, handler broken)"
    FAILED=$((FAILED + 1))
  else
    echo "PASS [$method $path] => $status"
  fi
}

echo "Testing against: $BASE_URL"
echo ""

# /api/admin/* routes -- all must return 401 without auth
check_admin GET  /api/admin/export-emails
check_admin GET  /api/admin/moderate
check_admin GET  /api/admin/dashboard
check_admin GET  /api/admin/robots
check_admin POST /api/admin/robots
check_admin PUT  /api/admin/robots
check_admin GET  /api/admin/reviews
check_admin POST /api/admin/reviews
check_admin GET  /api/admin/manufacturers
check_admin POST /api/admin/manufacturers
check_admin GET  /api/admin/revenue
check_admin POST /api/admin/meta
check_admin GET  /api/admin/robot-images
check_admin POST /api/admin/robot-images
check_admin POST /api/admin/manufacturer-logo

# Public intake routes -- handler must run (anything except 500 is acceptable)
check_public POST /api/reviews
check_public POST /api/manufacturers/claim
check_public POST /api/manufacturers/partner

echo ""
if [ "$FAILED" -gt 0 ]; then
  echo "RESULT: $FAILED test(s) FAILED"
  exit 1
else
  echo "RESULT: All tests passed"
fi
