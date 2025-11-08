# WasteWise - Starter (Safe to publish)

**Important security note:** Your original uploaded file contained a secret API key embedded directly in the client-side HTML.
Embedding secret API keys in client-side code is insecure — anyone can view them in the browser or in a public GitHub repo.
**This package removes the hard-coded key** and adds a small server proxy (`server.js`) that reads the secret from an environment variable `OPENROUTER_API_KEY`.

## What is included
- `index.html` — front-end (modified). It calls `/api/chat` (the local proxy) instead of sending requests directly to OpenRouter.
- `server.js` — Node/Express proxy that forwards requests to OpenRouter using `OPENROUTER_API_KEY` from environment.
- `package.json` — dependencies and start script.
- `.gitignore` — ignores `node_modules` and `.env`.
- `README.md` — (this file).

## How to run locally
1. Clone the repo (or download these files).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your API key in the environment (do **not** commit this to GitHub):
   ```bash
   export OPENROUTER_API_KEY="sk-...your key..."
   node server.js
   ```
   On Windows (PowerShell):
   ```powershell
   $env:OPENROUTER_API_KEY="sk-...your key..."
   node server.js
   ```
4. Open `index.html` in the browser (or serve it from a static server). If you run `server.js` locally, the client will POST to `http://localhost:3000/api/chat` (CORS enabled).

## Deploying to GitHub (safe)
- **Do not** commit your API key to the repository.
- Use GitHub Secrets (`Settings > Secrets`) and set `OPENROUTER_API_KEY`.
- Configure your deployment (e.g., on Vercel, Heroku, or GitHub Actions) to set the environment variable `OPENROUTER_API_KEY` at deploy/runtime.
- Alternatively, use a secret manager and inject the key into the runtime environment.

## Why this is safe
- The secret never appears in client-side code or committed files.
- Anyone cloning the repo cannot use your API key.
- You control access via environment variables / platform secrets.

If you'd like, I can:
- Add a GitHub Actions workflow example that shows how to use repository secrets during a deployment.
- Convert the front-end to be served from the Express app (so you can `node server.js` and visit `http://localhost:3000` to use the site).
