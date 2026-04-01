# LawConnect — LLM-Driven Web App

A Next.js app where users submit free-form prompts to an LLM, get back structured output persisted as editable entities, and can re-run prompts with a clear lifecycle.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **ORM:** Drizzle ORM
- **DB:** SQLite via `better-sqlite3`
- **LLM:** Vercel AI SDK + `@ai-sdk/anthropic`
- **Mutations:** Server Actions

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run database migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```
