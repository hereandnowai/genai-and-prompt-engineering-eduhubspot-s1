#!/usr/bin/env bash
set -euo pipefail

# Push latest workspace changes to GitHub.
# Default remote repo (override by exporting REMOTE_URL before running):
: "${REMOTE_URL:=https://github.com/hereandnowai/genai-and-prompt-engineering-eduhubspot-s1}"

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$REPO_ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "[ERROR] git is not installed. Install git and re-run." >&2
  exit 1
fi

# Initialize repo if needed
if [ ! -d .git ]; then
  echo "[INFO] Initializing new git repository..."
  git init
fi

# Enforce default branch 'main'
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"
if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "HEAD" ]; then
  git checkout -B main
  BRANCH="main"
else
  if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
  fi
  BRANCH="main"
fi

# Ensure useful ignores (idempotent)
if [ ! -f .gitignore ]; then
  cat > .gitignore <<'EOF'
.venv/
__pycache__/
.DS_Store
.env
*.pyc
.ipynb_checkpoints/
social-media-content/
EOF
  git add .gitignore || true
fi

git add -A

# Compose a helpful commit message if there are staged changes
if ! git diff --cached --quiet; then
  git commit -m "chore: push latest content (docs, tutorial, README, scripts)"
else
  echo "[INFO] No staged changes to commit."
fi

# Configure or update origin
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url origin)"
  if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
    echo "[INFO] Updating origin from $CURRENT_URL to $REMOTE_URL"
    git remote set-url origin "$REMOTE_URL"
  fi
else
  echo "[INFO] Adding origin $REMOTE_URL"
  git remote add origin "$REMOTE_URL"
fi

# If remote branch exists, pull with rebase, otherwise optionally create repo via gh
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  echo "[INFO] Pulling latest from origin/$BRANCH (rebase)"
  git pull --rebase origin "$BRANCH" || true
else
  echo "[INFO] origin/$BRANCH not found. Attempting to ensure remote repo exists..."
  if command -v gh >/dev/null 2>&1; then
    # Try to parse owner/repo from REMOTE_URL
    OWNER_REPO="$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https?://github.com/)##; s/\.git$//')"
    echo "[INFO] Checking repo with gh: $OWNER_REPO"
    if ! gh repo view "$OWNER_REPO" >/dev/null 2>&1; then
      echo "[INFO] Creating repo $OWNER_REPO via gh"
      gh repo create "$OWNER_REPO" --public --license mit --source=. --remote=origin --homepage "https://hereandnowai.com" --description "Hands-on GenAI & Prompt Engineering S1: RAG, Gradio, LangChain, Groq. HERE AND NOW AI — 'AI is Good'." || true
    fi
  else
    echo "[WARN] GitHub CLI (gh) not found. If the remote repo does not exist, create it first or install gh: https://cli.github.com/"
  fi
fi

echo "[INFO] Pushing to origin/$BRANCH"
git push -u origin "$BRANCH"

echo "[SUCCESS] Pushed to $REMOTE_URL on branch $BRANCH"
