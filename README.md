# 🛍️ My Shop (Angular + Material + Tailwind + Signals)

A modern Angular application featuring **product listing**, **rating display**, **authentication**, **shopping cart**, **wishlist**, **reviews**, **promotions**, **stock validation**, **admin dashboard**, and **checkout flow** — built with **Angular 20**, **Material UI**, **TailwindCSS**, **Signals-based state**, **NgRx**, **MSW**, and **Storybook**.

---

## 🚀 Features

1. Exo 1 & 2 (recap)

- 🧩 Standalone Components • 🎨 Material + Tailwind
- 🔁 Signals, `@defer`, `@if/@for/@let`
- 📦 Products list: pagination, sorting, rating; Product details
- 🔐 Auth (tokens) • 🔄 Interceptor (optional)
- 🛒 Cart (Signals store): add/remove/update; header badge; localStorage persistence
- 🧾 Checkout (summary → address → confirmation)
- 🧪 MSW API: products, rating, details, cart validate, order submit

2. Exo 3 (new)

- 👤 Account area (profile, orders, order detail) under guard
- 💗 Wishlist end-to-end (MSW + NgRx + localStorage + UI)
- 📝 Reviews (MSW + NgRx slice/effects/selectors) with form and average rating
- 🏷️ Promotions: promo codes (`/api/cart/apply-promo/`) — WELCOME10, FREESHIP, VIP20, BLACKFRIDAY
- 🧮 Taxes & shipping from API (no hard-coded values)
- 📦 Stock model + status UI; disable add-to-cart when out-of-stock
- ✅ Stock validation before order (`/api/cart/validate-stock/`)
- 📊 Admin Dashboard (`/admin/dashboard`) with totals, top products, recent orders
- ⚡ OnPush change detection + trackBy on lists
- 🧠 Memoized selectors (cart total items, reviews by product, orders by status)
- ♻️ Products cache with “stale‑while‑revalidate” strategy
- 🔔 Global notifications via snackbars across critical flows
- 📚 Storybook (pro): WishlistButton, ReviewList, PromoSummary, AdminStatsCard

---

## 🧰 Tech Stack

- **Angular 20 (standalone + signals)**
- **RxJS**
- **Angular Material**
- **TailwindCSS**
- **Storybook**
- **TypeScript**

---

## 🧑‍💻 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the development server

```bash
npm start
# or
ng serve
```

The app runs by default on [http://localhost:4200](http://localhost:4200).

### 3️⃣ Run Storybook

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) to view the UI components.

---

## 🧱 Architecture & Structure

```
src/
├── app/
│   ├── services/          # Products, Auth (HTTP, caching, etc.)
│   ├── state/cart/        # Signals cart store (actions, reducer, selectors, persistence)
│   ├── state/user/        # NgRx slice (user)
│   ├── state/wishlist/    # NgRx slice (wishlist)
│   ├── state/reviews/     # NgRx slice (reviews)
│   ├── state/admin/       # NgRx slice (admin stats)
│   ├── shop/cart/         # Cart UI components (icon, page, summary, item)
│   ├── shop/product-details/ # Product details page component
│   ├── shop/checkout/     # Checkout step components
│   ├── components/
│   │   ├── products/      # Main products feature
│   │   ├── products-list/
│   │   └── product-card/  # Simple UI card for a product
│   └── types/             # Global interfaces
├── styles.css             # Tailwind setup
└── main.ts                # Entry point
```

---

## 🔑 Auth & Account

- User logs in via `/auth` → gets token saved to `localStorage`
- AuthService exposes reactive `token$` and `isAuthenticated`
- Logout clears tokens and redirects to `/auth`

---

## 🧩 Storybook Components

- Product & cart primitives (cards, list, summary)
- New: WishlistButton, ReviewList, PromoSummary, AdminStatsCard (with controls/actions)

## 🛒 Cart & Checkout Overview

| Route             | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `/cart`           | View and edit cart items, clear or proceed to checkout |
| `/checkout/step1` | Order summary (lines + subtotal)                       |
| `/checkout/step2` | Address form (name, address, city, postal)             |
| `/checkout/step3` | Confirmation & order placement                         |
| `/products/:id`   | Product details with Add to Cart                       |

Cart state shape (`CartState`):

```ts
interface CartState {
  items: { product: IProduct; quantity: number }[];
  totalPrice: number;
  count: number;
}
```

Selectors: `selectCartItems`, `selectCartTotal`, `selectCartCount`, `selectCartTotalItems`.

Persistence: localStorage hydration & persistence via the cart store service.

Checkout: Uses MSW mocks:

- `/api/cart/validate/` (baseline)
- `/api/cart/apply-promo/` (promo codes + taxes + shipping)
- `/api/cart/validate-stock/` (stock checks)
- `/api/order/` (confirmation)
  Step3 validates stock, then confirms and clears cart.

## 🧪 Mock API (MSW)

| Endpoint                              | Description                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `POST /api/auth/token/`               | Issue access & refresh tokens                                                  |
| `POST /api/auth/token/refresh/`       | Refresh access token                                                           |
| `GET /api/products/`                  | Paginated product list                                                         |
| `GET /api/products/:id/rating/`       | Product rating summary                                                         |
| `GET /api/products/:id/`              | Product details with computed avg rating                                       |
| `POST /api/cart/validate/`            | Baseline pricing (subtotal, tax, total)                                        |
| `POST /api/cart/apply-promo/`         | Applies promo codes; returns itemsTotal, discount, shipping, taxes, grandTotal |
| `POST /api/cart/validate-stock/`      | Validates stock and quantities                                                 |
| `POST /api/order/`                    | Returns order confirmation number                                              |
| `GET /api/me/`, `PATCH /api/me/`      | Account profile read/update                                                    |
| `GET /api/me/orders/`                 | Orders list                                                                    |
| `GET /api/orders/:id/`                | Order detail                                                                   |
| `GET/POST /api/products/:id/reviews/` | Reviews per product                                                            |
| `GET/POST /api/me/wishlist/`          | Wishlist ids + toggle/add/remove                                               |
| `GET /api/admin/stats/`               | Admin dashboard summary                                                        |

---

## 🧠 State Management (NgRx & Signals)

- Signals store: Cart (local, persisted to `localStorage`)
- NgRx slices: User, Wishlist, Reviews, Admin
- Effects: User, Wishlist (sync with server + localStorage), Reviews (load/post), Admin (stats)
- Memoized selectors examples:
  - `selectCartTotalItems` (signals selector to count quantities)
  - `selectReviewsByProduct(productId)`
  - `selectRecentOrdersByStatus(status)`

---

## ⚡ Performance & Architecture

- Lazy loading: `/admin/dashboard` via `loadComponent()`
- ChangeDetection: `OnPush` across pages/lists
- Lists: `trackBy` on all repeated items (cart, reviews, etc.)
- Products cache: simple “stale‑while‑revalidate” in `ProductsService`
- MSW-only backend: zero-setup API simulation for dev & tests

---

## 🔔 Notifications & UX

- Global notifications via `MatSnackBar` for:
  - Success: wishlist toggle, review posted, promo applied, order confirmed
  - Errors: API failures, invalid promo, insufficient stock
- Loaders/Skeletons:
  - Product list: `@defer` placeholder + spinner
  - Product details: conditional rendering until data arrives
  - Checkout: feedback on stock validation and order confirmation
- Accessibility:
  - Icon buttons have `aria-label` (e.g., wishlist)
  - Keyboard navigable pages; visible focus via browser/Tailwind defaults
  - Alt text on images (if present)

---

## 📝 Technical Decisions

- Wishlist stored in NgRx (`ids`) with localStorage hydration and server sync (MSW). UI reads from store and products service; toggles sync to server and persist locally.
- Reviews managed via NgRx for deterministic loading/posting and easy aggregation (average).
- Products cache implemented in `ProductsService` (SWR): emit cached data instantly, refetch in background, update only if changed.
- Admin stats kept read-only via NgRx; dashboard lazy-loaded for perf.
- Kept cart as Signals store for simplicity and local persistence.

## 🔄 Future Enhancements (Ideas)

- Coupon codes & discounts
- Stock indicator & disable button when out-of-stock
- Toast notifications on add/remove
- Wish list / favorites
- Animations for cart transitions
- Optional NgRx migration (replace signals store)

Run Storybook to preview reusable UI blocks visually.

---

## 🧹 Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm start`         | Run dev server            |
| `npm run build`     | Build for production      |
| `npm run storybook` | Launch Storybook          |
| `npm run test`      | Run unit tests (Karma)    |
| `npm run lint`      | Lint code (if configured) |

## ✅ CI (optional)

Add a GitHub Actions workflow to automatically run install, build & tests on each push:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test --if-present -- --watch=false
```

---

## 🧡 Author

Made with Angular, Material & Tailwind — for modern frontend development.

---

### 📄 License

MIT License © 2025 Ayoubchet19

---

### 🙌 Contributing

PRs welcome! Please open an issue first for significant changes.
