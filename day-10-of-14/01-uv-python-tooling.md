# uv — Fast Python packaging and runtime toolkit

This guide explains what `uv` is, why you might choose it over `pip`, and how to install and use it effectively on macOS for local development and CI.

## What Is `uv`?

`uv` is a modern, extremely fast Python packaging and runtime toolkit written in Rust. It focuses on speed, reproducibility, and great developer ergonomics. You can think of it as a drop-in, batteries-included alternative to several Python workflow tools:

- Package installation and resolution (like `pip`/`pip-tools`), but much faster
- Virtual environment management (like `python -m venv`/`virtualenv`)
- Project workflows (e.g., `uv run` to execute with an environment)

Key capabilities include: parallel, cached installs; deterministic resolution with lock files; first-class `pyproject.toml` support; `requirements.txt` workflows; and convenient commands for day-to-day Python work.

## Why Not Just `pip`?

`pip` is the default and works well, but `uv` adds:

- Speed: Rust-based resolver/installer with aggressive caching and parallelism
- Reproducibility: Deterministic resolution and lockfile-based workflows
- Ergonomics: One tool for creating venvs, installing, syncing, running
- CI Focus: Faster cold-starts and better cache reuse for pipelines

You can use `uv` side-by-side with `pip` and adopt it gradually. It understands both `pyproject.toml` and `requirements.txt` flows.

## Install `uv` (macOS)

Pick one method you prefer:

1) Official install script (recommended by the maintainers)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- After install, ensure your shell PATH includes the printed directory (often `~/.local/bin` on macOS). Verify:

```bash
uv --version
```

2) pipx (keeps the tool isolated from your project envs)

```bash
python3 -m pip install --user pipx
pipx ensurepath
pipx install uv
uv --version
```

3) Homebrew (if available on your system)

```bash
brew install uv
uv --version
```

Notes:
- Use the official script for the most up-to-date binaries. Homebrew availability can vary by machine and time.
- No admin rights needed for the script or `pipx` methods.

## Quickstart: Existing `requirements.txt`

If your project uses `requirements.txt` (like this repo), you can keep that workflow and gain speed with `uv`.

```bash
# 1) Create a virtual environment
uv venv .venv

# 2) Activate it (macOS/Linux, zsh)
source .venv/bin/activate

# 3) Install from requirements.txt — fast and cached
uv pip install -r requirements.txt

# 4) Run your app through the env
uv run python your_app.py
```

Common maintenance with `requirements.txt`:

```bash
# Freeze currently installed packages to a file
uv pip freeze > requirements.txt

# Re-sync the environment exactly to the file (great for CI)
uv pip sync requirements.txt
```

## Quickstart: `pyproject.toml` Projects

For projects that use `pyproject.toml` (modern, recommended):

```bash
# Initialize a new project (creates pyproject.toml)
uv init

# Add dependencies (updates pyproject + lock file)
uv add fastapi uvicorn

# Create/refresh a venv and install exactly what’s locked
uv sync

# Run commands within the managed environment
uv run python -c "import fastapi, uvicorn; print('ok')"
```

Other helpful commands:

```bash
# Update dependencies to latest compatible versions
uv lock --upgrade

# Remove build/install caches if you need a clean slate
uv cache clean
```

## Handy Mappings (pip → uv)

- Install from file: `pip install -r reqs.txt` → `uv pip install -r reqs.txt`
- Freeze: `pip freeze > reqs.txt` → `uv pip freeze > reqs.txt`
- Exact sync: (pip doesn’t have an exact equivalent) → `uv pip sync reqs.txt`
- Create venv: `python -m venv .venv` → `uv venv .venv`
- Run with env: activate + `python app.py` → `uv run python app.py`

## Typical Use Cases

- Speeding up local installs and CI pipelines
- Deterministic, lockfile-driven environments for teams/teaching
- Managing multiple projects and virtualenvs consistently
- Smooth transition from `requirements.txt` to `pyproject.toml`

## Troubleshooting

- Command not found: confirm PATH includes the directory printed by the installer. Open a new shell after install.
- Build errors on odd packages: try `uv cache clean` then re-run. If a package truly requires system headers, install them via Homebrew and retry.
- Mixing `pip` and `uv`: Safe in general, but prefer sticking to one workflow per project for reproducibility.

## References

- PyPI page: https://pypi.org/project/uv/
- Project site and docs: https://astral.sh/
