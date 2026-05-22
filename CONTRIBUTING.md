# Contributing

## Pull Request Rules

Every pull request must:

- Explain the user-facing change.
- Include screenshots or screen recordings for UI changes.
- Pass `npm run build`.
- Avoid unrelated refactors.
- Avoid committing generated output such as `dist/`.
- Avoid committing personal information, API keys, tokens, passwords, `.env` files, or private datasets.

## Data Rules

- Prefer open datasets with clear licenses.
- Link to third-party sources instead of copying large bodies of content.
- Do not mirror Reddit, GTER, or other community posts without permission.
- Keep attribution visible when a provider requires it.

## Code Style

- Keep UI text clear and user-facing.
- Keep map interactions smooth; avoid blocking map browsing on external data calls.
- Cache or defer slow external requests when possible.
