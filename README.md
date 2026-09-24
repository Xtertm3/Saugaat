# Saugaat

Premium gifting & lifestyle storefront built with **React + TypeScript + Vite** and **Supabase**.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL + publishable/anon key
npm run dev
```

### Environment variables (Vite — not Next.js)

```
VITE_SUPABASE_URL=https://xrpaonfnsflizkidjvhc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...   # or legacy anon JWT
```

Do **not** use `NEXT_PUBLIC_*` names or `@supabase/ssr` middleware — this is a client-side Vite SPA.

Optional: run `supabase_setup_and_seed.sql` in the Supabase SQL Editor for tables, RLS, and seed data.

## Admin

1. Open `/login` → switch to **Admin**
2. Email: `admin@saugaat.store` (or `admin@saugaat.com`)
3. Password: `Saugaat#Admin2026!` (or `saugaat123`)

Routes: `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/orders`

Admin product & category CRUD works with Supabase when configured, and falls back to localStorage so the panel stays usable offline.

## Catalog

| Parent | Subcategories |
|--------|----------------|
| Being Well | (direct products) |
| Home Decor | Curtains, Cushions, Wall Decor, Showpieces, Vases & Planters |
| Just Like That | Tableware |
| Gift Packs | Premium Gifts |
| Return Gifts | Wedding Favors |

Curtains are quote-based (`price: 0`). Nav shows parent categories in `sort_order`.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview build


## Vercel deployment (required for multi-device catalog)

Git push only deploys **code**. Product data lives in **Supabase**.

In [Vercel](https://vercel.com) → your project → **Settings → Environment Variables**, add for Production (and Preview):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xrpaonfnsflizkidjvhc.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your `sb_publishable_...` key |

Then **Redeploy** the latest deployment (Deployments → … → Redeploy).

Without these variables, the live site has no database client and admin changes stay in that browser’s localStorage only.
