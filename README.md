# Saree Sutra

Vite + React + TypeScript e-commerce app with Supabase (auth, database, storage).

## 1) Requirements

- Node.js 18+
- npm
- Supabase CLI

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set values in `.env`:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## 4) Link Supabase project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

## 5) Apply schema migrations

```bash
supabase db push --include-all
```

This applies:

- `products`
- `orders`
- `profiles`
- `addresses`
- `blogs`
- `reviews`
- `site_settings`
- `product-images` storage bucket and public policies

## 6) Run local dev server

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Notes

- `.env` is ignored by git.
- Do not expose service-role keys in frontend env.
- Admin login uses Supabase auth credentials (create admin users in Supabase Auth).
