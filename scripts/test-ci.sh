#!/bin/sh
set -eu

mkdir -p reports
test_status=0
node test/run.js > reports/tests.tap 2>&1 || test_status=$?
cat reports/tests.tap
test -s reports/tests.tap
grep -Eq '^# tests [1-9][0-9]*$' reports/tests.tap
exit "$test_status"