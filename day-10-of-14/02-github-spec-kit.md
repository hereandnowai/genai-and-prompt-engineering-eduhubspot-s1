# GitHub Spec Kit — Beginner-Friendly Guide

This tutorial is based only on the repository README at https://github.com/github/spec-kit.

## What Is GitHub Spec Kit?

GitHub Spec Kit is an open-source toolkit for Spec-Driven Development.

The README describes Spec-Driven Development like this:

- Traditional development treats specifications as temporary scaffolding.
- Spec-Driven Development makes specifications the center of the workflow.
- Those specifications guide implementation more directly, so you focus on product scenarios and predictable outcomes instead of improvising everything from scratch.

In practice, Spec Kit gives you a CLI named `specify` plus project templates and agent commands such as `/speckit.specify` and `/speckit.plan`.

## Important Installation Note

The README explicitly says:

- The only official, maintained packages are published from the GitHub repository.
- Packages with the same name on PyPI are not affiliated with the Spec Kit maintainers.
- You should install directly from GitHub.

## Prerequisites

The README lists these prerequisites:

- Linux, macOS, or Windows
- A supported AI coding agent
- `uv` for package management, recommended, or `pipx` for persistent installation
- Python 3.11+
- Git

The README also says Spec Kit works with 30+ AI coding agents and links to a full integrations guide. In the installation examples, it shows `copilot`, `gemini`, and `codex` as integration values.

## How To Install Spec Kit

The README gives three documented installation paths.

### Option 1: Persistent installation with `uv` or `pipx`

This is the recommended path when you want the tool available everywhere on your machine.

If you want a stable version, replace `vX.Y.Z` with the latest release tag from the repository releases page.

```bash
# Recommended: install a specific release
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Or install the latest code from main
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# pipx alternative
pipx install git+https://github.com/github/spec-kit.git@vX.Y.Z
pipx install git+https://github.com/github/spec-kit.git
```

Verify the installation:

```bash
specify version
```

The README also gives a quick upgrade command:

```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

### Option 2: One-time usage with `uvx`

Use this when you do not want a permanent installation.

```bash
uvx --from git+https://github.com/github/spec-kit.git@vX.Y.Z specify init <PROJECT_NAME>
```

The README also shows using `uvx` to initialize the current project directory:

```bash
uvx --from git+https://github.com/github/spec-kit.git@vX.Y.Z specify init . --integration copilot

# or
uvx --from git+https://github.com/github/spec-kit.git@vX.Y.Z specify init --here --integration copilot
```

### Option 3: Enterprise or air-gapped installation

The README points to an enterprise installation guide for environments that cannot access PyPI or GitHub directly. It says this flow uses `pip download` to create portable, OS-specific wheel bundles on a connected machine.

## First Commands To Know

After installation, the main CLI command is `specify`.

### Create a new project

```bash
specify init <project_name>
```

### Initialize the current folder

```bash
specify init .

# or
specify init --here
```

### Force initialization in a non-empty folder

```bash
specify init . --force

# or
specify init --here --force
```

### Choose an AI agent integration

The README says that in an interactive terminal, `specify init` will prompt you to choose the coding agent integration.

In non-interactive sessions, such as CI or piped runs, the README says `specify init` defaults to GitHub Copilot unless you pass `--integration`.

Examples shown in the README:

```bash
specify init <project_name> --integration copilot
specify init <project_name> --integration gemini
specify init <project_name> --integration codex

specify init . --integration copilot
specify init . --integration codex --integration-options="--skills"

specify init --here --integration copilot
specify init --here --integration codex --integration-options="--skills"
```

### Skip local agent-tool checks

The README says the CLI checks whether tools such as Claude Code, Gemini CLI, Cursor CLI, Qwen CLI, opencode, Codex CLI, Qoder CLI, Tabnine CLI, Kiro CLI, Pi, Forge, Goose, or Mistral Vibe are installed.

If you want templates without that check, the README shows this command:

```bash
specify init <project_name> --integration copilot --ignore-agent-tools
```

### Check your installed tools

```bash
specify check
```

## Beginner Workflow

Once your project is initialized, the README describes this basic workflow.

### 1. Create project principles

Use `/speckit.constitution` to define the rules and standards for your project.

```bash
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

### 2. Describe what you want to build

Use `/speckit.specify` to explain the product idea. The README says to focus on the what and why, not the tech stack.

```bash
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

### 3. Create the technical plan

Use `/speckit.plan` to describe the tech stack and architecture choices.

```bash
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

### 4. Break the plan into tasks

```bash
/speckit.tasks
```

### 5. Implement the plan

```bash
/speckit.implement
```

The README also notes that most agents expose Spec Kit as `/speckit.*` slash commands, while Codex CLI in skills mode uses `$speckit-*` instead.

## Short Summary

- GitHub Spec Kit is a Spec-Driven Development toolkit.
- The documented CLI is `specify`.
- The official install methods in the README use GitHub-based installs through `uv`, `pipx`, or `uvx`.
- After setup, the main flow is `init`, then `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement`.

## Reference

- Repository README: https://github.com/github/spec-kit
