#!/bin/bash
set -euo pipefail
echo "── Robotomated ──"
echo "Branch: $(git branch --show-current 2>/dev/null || echo 'none')"
echo "Last:   $(git log -1 --oneline 2>/dev/null || echo 'no commits')"

CHANGED=$(git diff --name-only HEAD~1 2>/dev/null || echo "")
if echo "$CHANGED" | grep -q "review\|score\|robo-score"; then
    echo "Context: Reviews/Scoring — context/product.md (RoboScore section)"
elif echo "$CHANGED" | grep -q "advisor\|ai\|chat"; then
    echo "Context: AI Advisor — context/product.md + context/architecture.md"
elif echo "$CHANGED" | grep -q "marketplace\|listing"; then
    echo "Context: Marketplace — context/product.md (Module 3)"
elif echo "$CHANGED" | grep -q "content\|article\|best\|learn"; then
    echo "Context: Content/SEO — context/business.md (GTM section)"
elif echo "$CHANGED" | grep -q "robot\|category\|seed"; then
    echo "Context: Database — context/product.md (Schema section)"
fi
echo "Priority: Content + SEO > everything else"
echo "────────────────"
