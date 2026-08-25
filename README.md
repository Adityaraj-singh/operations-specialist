# Enrollment Review Workbench

A React and TypeScript single-page workbench for reviewing enrollment submissions that need operational attention.

## Run locally

Start the mock API in one terminal:

```bash
cd server
npm install
npm start
```

Then start the frontend in a second terminal:

```bash
npm install
npm start
```

The app starts at `http://localhost:3000`; the mock API runs at `http://localhost:4000`. The included `.env.local` connects them. To use an externally supplied API instead, update `.env.local`:

```bash
REACT_APP_API_BASE_URL=http://localhost:YOUR_API_PORT
```

## Commands

```bash
npm test -- --watchAll=false
npm run build
```

## Project structure

- `src/api.ts` — isolated HTTP requests plus response normalization.
- `src/types.ts` — API and domain types.
- `src/components/` — queue, filters, and submission-detail UI.
- `src/hooks/` — UI hooks such as debounced search.
- `src/utils/` — display and formatting utilities.

`server/` contains a small in-memory fallback mock API. If the assignment provider supplies its own mock API, use that service instead.
