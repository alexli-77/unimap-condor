# Security Policy

## Sensitive Information

Do not commit or upload:

- Personal information
- API keys
- Access tokens
- Passwords
- Private SSH keys
- `.env` files
- Cookies or browser session exports
- Private user data
- Private third-party datasets

## Before Opening a Pull Request

Run a local secret scan:

```bash
rg -n --hidden -g '!node_modules/**' -g '!.git/**' -g '!package-lock.json' \
  '(api[_-]?key|secret|token|password|authorization|bearer|AIza|sk-[A-Za-z0-9]|ghp_|github_pat_|AKIA|PRIVATE KEY)' .
```

If this command finds a real secret, remove it from the working tree and rotate it immediately.

## Reporting a Vulnerability

Open a private security advisory on GitHub or contact the repository owner privately. Do not disclose active secrets or exploitable issues in a public issue.
