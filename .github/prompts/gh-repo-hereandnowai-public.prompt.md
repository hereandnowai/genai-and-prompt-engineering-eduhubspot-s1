# HERE AND NOW AI Git & GitHub Workflow Prompt

## 🏢 Brand Context

- **Organization Name**: HERE AND NOW AI
- **GitHub Organization**: `hereandnowai`
- **Slogan**: "AI is Good"
- **Website**: https://hereandnowai.com

## 🎯 Core Instructions

### 1. Repository Initialization
Whenever a new project is created, you MUST initialize it as a Git repository and set up its remote on GitHub immediately.

- **Git Init**: Run `git init`.
- **Default Branch**: Ensure the default branch is `main` via `git branch -m main`.
- **Gitignore**: Create a comprehensive `.gitignore` file based on the project's tech stack (e.g., Python, Node.js, etc.). **Ensuring the `social-media-content` folder is ALWAYS included.**
- **License**: Always include an **MIT License**.

### 2. GitHub Repository Creation
You MUST create a public repository under the `hereandnowai` organization.

- **SEO & Metadata**:
  - **Description**: Generate a concise, SEO-friendly description (max 140 chars).
  - **Website**: Always set the homepage URL to https://hereandnowai.com.
  - **Topics**: Identify 3–5 relevant topics based on the project tech stack.
- **Command**: 
  ```bash
  gh repo create hereandnowai/<repo-name> \
    --public \
    --license mit \
    --source=. \
    --remote=origin \
    --description "<seo-description>" \
    --homepage "https://hereandnowai.com"
  ```
- **Topics Command**: `gh repo edit --add-topic "ai,mcp,hereandnowai,<other-topics>"`
- **SEO Title**: Ensure the repository name is descriptive and includes relevant keywords for the project.

### 3. Commit Best Practices
Implement "Atomic Commits." You MUST commit every logical change immediately.

- **Frequency**: After every successful file creation, edit, or bug fix.
- **Commit Messages**: Use professional, descriptive messages (e.g., `feat: implement interactive chatbot loop`, `docs: update README with SEO keywords`).
- **Command**: `git add . && git commit -m "<message>"`

### 4. Immediate Synchronization
Every commit MUST be pushed to the remote repository immediately to ensure the project is always live at `github.com/hereandnowai`.

- **Command**: `git push origin main`

## 📝 Modern README Integration
When initializing the repository, ensure the `README.md` follows the guidelines in [branding.prompt.md](./branding.prompt.md), including headers, slogans, and contact information.

## 🚀 Execution Goal
The final result of using this prompt is a fully functional, branded, and version-controlled project hosted at **github.com/hereandnowai**.
