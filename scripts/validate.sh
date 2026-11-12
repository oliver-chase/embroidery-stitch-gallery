#!/usr/bin/env bash
# Runs the parser tests with the Node built-in runner, the repo's one validation command.
# Usage: bash scripts/validate.sh
set -euo pipefail
cd "$(dirname "$0")/.."
node --test tests/*.test.mjs
