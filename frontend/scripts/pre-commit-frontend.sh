#!/bin/bash

cd "$(dirname "$0")/.."

echo ""
echo "📦 Running pre-commit checks: ESLint + TypeScript"
echo "--------------------------------------------------"

# Step 1: ESLint Check
echo ""
echo "🔍 Step 1: Running ESLint (with autofix)..."
./node_modules/.bin/eslint . --config eslint.config.mjs --fix --max-warnings=0
eslint_exit_code=$?

if [ $eslint_exit_code -ne 0 ]; then
  echo "❌ ESLint failed. Please fix the above issues before committing."
  exit 1
else
  echo "✅ ESLint passed."
fi

# Step 2: TypeScript Type Check
echo ""
echo "🔍 Step 2: Running TypeScript type check..."
./node_modules/.bin/tsc --noEmit
tsc_exit_code=$?

if [ $tsc_exit_code -ne 0 ]; then
  echo "❌ TypeScript type check failed. Please fix the errors before committing."
  exit 1
else
  echo "✅ TypeScript type check passed."
fi

echo ""
echo "🎉 All checks passed. You are good to commit!"
echo "--------------------------------------------------"
exit 0
