#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."  

echo ""
echo "📦 Running pre-commit checks: Ruff (Python backend)"
echo "--------------------------------------------------"

# Step 1: Ruff Format Check
echo ""
echo "🔍 Step 1: Running Ruff format check (auto-fix)..."
if ! uv run ruff format src --no-cache; then
  echo "❌ Ruff format check failed. Please fix formatting issues before committing."
  exit 1
else
  echo "✅ Ruff format check passed."
fi

# Step 2: Ruff Lint Check
echo ""
echo "🔍 Step 2: Running Ruff lint check with auto-fix..."
if ! uv run ruff check --fix src --no-cache; then
  echo "❌ Ruff lint check failed. Please fix lint issues before committing."
  exit 1
else
  echo "✅ Ruff lint check passed."
fi

echo ""
echo "🎉 All backend checks passed. You are good to commit!"
echo "--------------------------------------------------"

exit 0
