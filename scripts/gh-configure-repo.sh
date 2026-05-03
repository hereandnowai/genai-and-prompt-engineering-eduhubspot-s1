#!/usr/bin/env bash
set -euo pipefail

# Configure GitHub repo metadata for hereandnowai/genai-and-prompt-engineering-eduhubspot-s1
: "${OWNER:=hereandnowai}"
: "${REPO:=genai-and-prompt-engineering-eduhubspot-s1}"

SEO_DESC="Hands-on GenAI & Prompt Engineering S1: RAG, Gradio, LangChain, Groq. HERE AND NOW AI — 'AI is Good'."

if ! command -v gh >/dev/null 2>&1; then
  echo "[ERROR] GitHub CLI (gh) is not installed. Install from https://cli.github.com/" >&2
  exit 1
fi

# Ensure authenticated
if ! gh auth status >/dev/null 2>&1; then
  echo "[INFO] Running gh auth login..."
  gh auth login
fi

FULL_REPO="$OWNER/$REPO"

echo "[INFO] Updating repo description, homepage, and topics for $FULL_REPO"

gh repo edit "$FULL_REPO" \
  --description "$SEO_DESC" \
  --homepage "https://hereandnowai.com"

# Add topics (idempotent)
for t in ai rag langchain gradio groq education course; do
  gh repo edit "$FULL_REPO" --add-topic "$t" || true
done

echo "[SUCCESS] Updated metadata for $FULL_REPO"
