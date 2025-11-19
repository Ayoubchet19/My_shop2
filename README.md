# 🛍️ My Shop (Angular + Material + Tailwind + NgRx)

A modern Angular application featuring **product listing**, **rating display**, **authentication**, **shopping cart**, and **checkout flow** — built with **Angular 20**, **Material UI**, **TailwindCSS**, **NgRx Store**, and **Storybook**.

---

## 🚀 Features

- 🧩 **Standalone Angular Components**
- 🎨 **Angular Material** + **TailwindCSS** styling
- 🔁 **Signals**, `@defer`, and modern Angular template syntax (`@if`, `@for`, `@let`)
- 📦 **Products List** with pagination, sorting, and rating
- 💬 **ProductCard** and **ProductsList** (Storybook-ready presentational components)
- 🔐 **Authentication system** (login/logout with token storage)
- ⚙️ **Reactive services** with RxJS and BehaviorSubjects
- 🔄 **HTTP Interceptors** for token handling and refresh logic (optional)
- 🛒 **Shopping Cart** with add/remove/update quantity, badge icon
- 💾 **Cart Persistence** via localStorage hydration
- 🧾 **Checkout Flow** (summary → address → confirmation)
- 🔍 **Product Details Page** with Add to Cart
- 🧪 **Mock API** using MSW (products, ratings, product details, cart validate, order submit)

---

## 🧰 Tech Stack

- **Angular 18+**
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

## 🧱 Project Structure (key folders)

```
src/
├── app/
│   ├── services/          # Products & Auth services
│   ├── state/cart/        # NgRx cart slice (actions, reducer, selectors, persistence)
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

## 🔑 Auth Flow

- User logs in via `/auth` → gets token saved to `localStorage`
- AuthService exposes reactive `token$` and `isAuthenticated`
- Logout clears tokens and redirects to `/auth`

---

## 🧩 Storybook Components

- `ProductCardComponent` – displays product info (name, price, rating)
- `ProductsListComponent` – table with pagination and ordering
- `CartItemComponent` – editable quantity + remove button
- `CartSummaryComponent` – subtotal + line items
- `ProductDetailsPageComponent` – product info with Add to Cart

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

Selectors: `selectCartItems`, `selectCartTotal`, `selectCartCount`.

Persistence: `CartPersistenceService` hydrates from `localStorage` key `cartItems` and persists on changes.

Checkout: Uses MSW mocks (`/api/cart/validate/`, `/api/order/`). Step3 clears cart after successful order.

## 🧪 Mock API (MSW)

| Endpoint                        | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `POST /api/auth/token/`         | Issue access & refresh tokens                    |
| `POST /api/auth/token/refresh/` | Refresh access token                             |
| `GET /api/products/`            | Paginated product list                           |
| `GET /api/products/:id/rating/` | Product rating summary                           |
| `GET /api/products/:id/`        | Product details with computed avg rating         |
| `POST /api/cart/validate/`      | Returns pricing breakdown (subtotal, tax, total) |
| `POST /api/order/`              | Returns order confirmation number                |

## 🔄 Future Enhancements (Ideas)

- Coupon codes & discount application
- Stock indicator & disable Add to Cart when out-of-stock
- Toast notifications on add/remove
- Wish list feature
- Animations for cart transitions

Run Storybook to preview reusable UI blocks visually.

---

## 🧹 Scripts

| Command             | Description          |
| ------------------- | -------------------- |
| `npm start`         | Run dev server       |
| `npm run build`     | Build for production |
| `npm run storybook` | Launch Storybook     |
| `npm run test`      | Run unit tests       |

---

## 🧡 Author

Made with Angular, Material & Tailwind — for modern frontend development.
