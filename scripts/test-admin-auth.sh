#!/usr/bin/env bash
# Smoke test: verify every admin route returns 401 without auth.
# Usage: BASE_URL=http://localhost:3000 ./scripts/test-admin-auth.sh
# Exits 1 if any route returns HTTP 200.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
FAILED=0

check() {
  local method="$1"
  local path="$2"

  local status
  if [ "$method" = "GET" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  else
    status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d '{}' \
      "${BASE_URL}${path}")
  fi

  if [ "$status" = "200" ]; then
    echo "FAIL [$method $path] => $status (expected non-200)"
    FAILED=$((FAILED + 1))
  else
    echo "PASS [$method $path] => $status"
  fi
}

echo "Testing against: $BASE_URL"
echo ""

# /api/admin/* routes -- all must return 401 without auth
check GET  /api/admin/export-emails
check GET  /api/admin/moderate
check GET  /api/admin/dashboard
check GET  /api/admin/robots
check POST /api/admin/robots
check PUT  /api/admin/robots
check GET  /api/admin/reviews
check POST /api/admin/reviews
check GET  /api/admin/manufacturers
check POST /api/admin/manufacturers
check GET  /api/admin/revenue
check POST /api/admin/meta
check GET  /api/admin/robot-images
check POST /api/admin/robot-images
check POST /api/admin/manufacturer-logo

# Write endpoints on non-/admin-prefixed routes
check POST /api/robots
check POST /api/reviews
check POST /api/manufacturers/claim
check POST /api/manufacturers/partner

echo ""
if [ "$FAILED" -gt 0 ]; then
  echo "RESULT: $FAILED test(s) FAILED"
  exit 1
else
  echo "RESULT: All tests passed"
fi
