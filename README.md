# Shellies webshop

Frontend for **Perle & Co.**, maker of Shellie NFC bracelets. Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS 4.

There is no backend yet. Everything runs on sample data in `lib/data.ts`; admin changes are kept in memory and reset on reload. The cart is saved in the browser.

## Pages

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/shop` | Shop and cart |
| `/news` | Public posts from the team |
| `/s/[tagId]` | What a finder sees after tapping a Shellie (try `/s/AB12CD` or `/s/DN67XY`) |
| `/account` | A shopper's account: tracks their orders from Placed to Delivered (sample shopper until login exists) |
| `/admin/orders` | Receive orders and move them from New to Delivered |
| `/admin/listings` | Manage Shellie listings: price, stock, color, visibility |
| `/admin/posts` | Write, publish and delete posts |

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project layout

- `app/` routes
- `components/` shared UI (`art.tsx` has the crab and bracelet illustrations)
- `lib/data.ts` sample data and types, the place to swap in API calls
- `lib/cart.tsx` cart state
- `lib/admin-store.tsx` admin state

## Deploying

Ready for Vercel with the default Next.js settings. No environment variables are needed yet.

## Still to build

- A backend and database for orders, listings, posts and Shellie profiles
- Real login: shoppers sign in with Facebook or Google; the admin area needs its own login (the admin pages are not protected yet)
- Checkout and payments
