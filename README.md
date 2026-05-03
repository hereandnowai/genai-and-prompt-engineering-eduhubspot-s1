# GenAI and Prompt Engineering — EduHubSpot S1

HERE AND NOW AI — "AI is Good" • https://hereandnowai.com

## Class Resources

- Portfolio for this class: https://docs.google.com/spreadsheets/d/15HcyLU1THQj8Bd8ZtDe85pyvc7QF2eJn-eM_zr2FtJs/edit?gid=1780776769#gid=1780776769
- Notes for this class: https://docs.google.com/document/d/1-BfDr5N89-e6m7XexvB-v8D6CgDrM50c9kDuq3XEWEs/edit?tab=t.0
- OpenRouter API keys: https://openrouter.ai/workspaces/default/keys
- Google API key: https://aistudio.google.com/api-keys

## Additional learning materials

- OpenAI Tokenizer (token counting): https://platform.openai.com/tokenizer
- Learn embeddings (TensorFlow Projector): https://projector.tensorflow.org/
- Google Embedding 2 announcement: https://x.com/GoogleAI/status/2049903687016063456?s=20
- Attention Is All You Need (paper): https://arxiv.org/pdf/1706.03762
- Transformer Explainer: https://poloclub.github.io/transformer-explainer/

## Pushing updates to GitHub

Use the helper script we added (adjust permissions once):

```bash
chmod +x scripts/push-latest.sh
scripts/push-latest.sh
```

Notes
- The script initializes git if needed, adds/commits changes, sets `origin` to:
	`https://github.com/hereandnowai/genai-and-prompt-engineering-eduhubspot-s1`, and pushes to `main` (or your current branch).
- Authenticate with GitHub as prompted, or ensure your credential helper/`gh auth login` is set up beforehand.
- To push to a different remote, run with `REMOTE_URL=... scripts/push-latest.sh`.

To set repository metadata (description, topics, homepage) with GitHub CLI:

```bash
chmod +x scripts/gh-configure-repo.sh
scripts/gh-configure-repo.sh
```
