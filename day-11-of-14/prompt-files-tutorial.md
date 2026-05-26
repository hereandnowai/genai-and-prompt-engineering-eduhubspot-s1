# How to Create a Prompt File in VS Code (GitHub Copilot)

A **prompt file** is a reusable Markdown file (`.prompt.md`) that lets you save and run custom AI instructions directly inside VS Code with GitHub Copilot.

---

## Prerequisites

- Visual Studio Code installed
- GitHub Copilot extension enabled

---

## Step 1 — Choose a Storage Location

Decide where your prompt file will live based on who should use it:

| Scope | Location | Best For |
|---|---|---|
| **Workspace** | `.github/prompts/` inside your project root | Sharing with your team |
| **User** | VS Code global user profile | Personal reuse across all projects |

---

## Step 2 — Create the Prompt File

You have two options: let AI build it for you, or write it manually.

### Option A — Automate with AI (Recommended)

1. Open **Copilot Chat** with `Ctrl+Alt+I` (Windows/Linux) or `Cmd+Option+I` (Mac).
2. Type `/create-prompt` followed by a short description:
   ```
   /create-prompt a template for writing Jest unit tests
   ```
3. Answer any clarifying questions from Copilot.
4. Copilot generates the `.prompt.md` file and asks whether to save it at the **Workspace** or **User** level.

---

### Option B — Manual Creation

1. If using workspace scope, create the folder structure at your project root:
   ```
   .github/
   └── prompts/
       └── your-prompt-name.prompt.md
   ```

2. Open the new file and add a YAML frontmatter block at the very top, followed by your instructions:

   ```markdown
   ---
   name: code-review
   description: Custom checklist for reviewing code quality and performance
   argument-hint: Paste the code diff or file to review
   ---

   Please review the following code changes. Check explicitly for:

   1. Memory leaks or performance bottlenecks.
   2. Proper error handling blocks.
   3. Code readability and clean variable names.
   ```

   | Frontmatter Field | Purpose |
   |---|---|
   | `name` | The slash command name (e.g. `/code-review`) |
   | `description` | Short summary shown in the command palette |
   | `argument-hint` | Optional hint text shown to the user |

---

## Step 3 — Alternate: Use the Command Palette

You can skip manual folder creation and let VS Code handle it:

1. Open the **Command Palette** with `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
2. Search for and select **Chat: New Prompt File**.
3. Choose your scope (**User** or **Workspace**) and give your file a name.

---

## Step 4 — Run Your Prompt

Once your file is saved, you have three ways to trigger it:

| Method | How |
|---|---|
| **Slash Command** | Open Copilot Chat and type `/your-prompt-name` |
| **Play Button** | Open the `.prompt.md` file and click the ▶ icon in the top-right |
| **Command Palette** | Run `Chat: Run Prompt` and select your file from the list |

---

## Quick Example

Here is a complete prompt file for generating React component boilerplate:

```markdown
---
name: react-component
description: Generates a typed React functional component with props
argument-hint: Component name and a brief description of what it does
---

Create a React functional component in TypeScript based on the description below.

Requirements:
- Use a named export
- Define a typed Props interface
- Include a JSDoc comment explaining the component
- Add a default export at the bottom
```

Save this as `.github/prompts/react-component.prompt.md`, then trigger it in Copilot Chat with `/react-component`.

---

## Tips

- You can reference other files inside a prompt using `#file:path/to/file.ts` to give Copilot extra context.
- Prompt files support full Markdown, so use headers and lists to make instructions easier for Copilot to follow.
- Keep each prompt focused on a single task for the best results.
