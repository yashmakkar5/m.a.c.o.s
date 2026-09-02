# Google Gemini AI Setup Guide for M.A.C.O.S.

This guide explains how to obtain, configure, and verify your Google Gemini API key for M.A.C.O.S.

---

### Step 1: Obtain a Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **Get API key** (or **Create API key**).
4. Select a Google Cloud project (or create a new free project) and generate your key.
5. Copy your generated API key.

---

### Step 2: Configure Environment Variables in `.env.local`

1. Open the [`.env.local`](./.env.local) file in the root of your `m.a.c.o.s` repository.
2. Set the `GEMINI_API_KEY` variable:

```env
GEMINI_API_KEY=AIzaSy...your_gemini_key_here
```

3. *(Optional)* If you want to use a specific model, you can optionally define:
```env
GEMINI_MODEL=gemini-2.5-flash
```
*(If omitted, M.A.C.O.S. defaults to `gemini-2.5-flash` for high performance and low latency).*

---

### Step 3: Verify the AI Health Endpoint

1. Start your local server:
   ```bash
   npm run dev
   ```
2. Open the dedicated AI health test in your browser:
   👉 **[http://localhost:3000/api/health/ai](http://localhost:3000/api/health/ai)**
3. When the key is valid and connected, it executes a live minimal ping and returns:
   ```json
   {
     "configured": true,
     "provider": "Gemini",
     "status": "ok",
     "latencyMs": 318
   }
   ```
   - If the key is missing:
     ```json
     {
       "configured": false,
       "provider": "Gemini",
       "status": "not_configured"
     }
     ```
   - If the key is invalid or Google's API rejects it:
     ```json
     {
       "configured": true,
       "provider": "Gemini",
       "status": "error",
       "message": "..."
     }
     ```
4. You can also view the live status on the combined system health page:
   👉 **[http://localhost:3000/debug](http://localhost:3000/debug)**

---

### Step 4: Security & Privacy Best Practices

- 🔒 **Never commit secrets**: `.env.local` is listed in `.gitignore`. Never check this file into Git or push it to GitHub.
- 🔒 **Server-side only**: `GEMINI_API_KEY` does **not** have a `NEXT_PUBLIC_` prefix. In Next.js, this guarantees it is never bundled into client-side JavaScript or visible in browser network tabs.
- 🔒 **No secret logging**: The centralized Gemini service (`lib/ai/gemini.ts`) strips any potential API key traces from error messages and logs.
