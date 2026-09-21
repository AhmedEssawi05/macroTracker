# Macro Tracker

Track daily calories and macronutrients (protein, carbs, fat) with quick food logging.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) + SQLite for local data storage

## Data model

- **Food** — a reusable item (name, serving size, calories, protein, carbs, fat, and optional fiber/sugar/sodium).
- **Entry** — a logged instance of eating a `Food`, scaled by `servings`, tagged with a meal type (breakfast/lunch/dinner/snack) and timestamp.

See [`prisma/schema.prisma`](./prisma/schema.prisma).

## Getting started

```bash
npm install
cp .env.example .env   # already points at a local SQLite file
npm run db:migrate     # create the SQLite database + tables
npm run db:seed        # optional: seed a handful of common foods
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — today's totals against daily goals, plus a list of today's entries.
- `/log` — search existing foods (or add a new one) and log an entry.

## Scripts

| Command             | Description                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`         | Start the dev server                          |
| `npm run build`       | Production build                              |
| `npm run lint`        | Run ESLint                                    |
| `npm run db:migrate`  | Run Prisma migrations                         |
| `npm run db:seed`     | Seed a few common foods                       |
| `npm run db:studio`   | Open Prisma Studio to browse/edit data        |

## API routes

- `GET/POST /api/foods` — list/create foods (`?q=` to search by name)
- `GET/DELETE /api/foods/[id]` — fetch/delete a single food
- `GET/POST /api/entries` — list/create entries for a day (`?date=YYYY-MM-DD`)
- `PATCH/DELETE /api/entries/[id]` — update/delete a single entry
- `GET /api/summary` — daily macro totals (`?date=YYYY-MM-DD`)

## Not yet implemented

- User accounts / auth (currently single-user, local only)
- Configurable daily goals (hardcoded in `app/page.tsx`)
- Editing an entry's meal/servings from the UI (API supports `PATCH`)
- Date navigation on the dashboard (always shows today)
