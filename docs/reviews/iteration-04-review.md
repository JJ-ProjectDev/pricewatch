
# Iteration 4 Review

## Objectives

Iteration 4 built the product catalogue foundation and established the
React frontend as a properly structured application.

The goal was to ship a working frontend that displays real product data
from the API — a user can open the browser, see a list of seeded products,
and click through to a product detail page.

This iteration also marks the permanent team split: the backend developer
owns the API gateway and future microservices, the frontend developer owns
the React application.

---

## Files Created

### Backend

- `services/api-gateway/prisma/migrations/<timestamp>_add_product/migration.sql`
- `services/api-gateway/prisma/seed.ts`
- `services/api-gateway/src/products/product.entity.ts`
- `services/api-gateway/src/products/products.module.ts`
- `services/api-gateway/src/products/products.service.ts`
- `services/api-gateway/src/products/products.controller.ts`
- `services/api-gateway/src/products/products.controller.spec.ts`

### Frontend

- `services/web/src/lib/api.ts`
- `services/web/src/lib/types.ts`
- `services/web/src/components/layout/Layout.tsx`
- `services/web/src/components/layout/Navbar.tsx`
- `services/web/src/components/ui/button.tsx`
- `services/web/src/components/ui/card.tsx`
- `services/web/src/pages/HomePage.tsx`
- `services/web/src/pages/ProductsPage.tsx`
- `services/web/src/pages/ProductDetailPage.tsx`
- `services/web/src/pages/NotFoundPage.tsx`
- `services/web/src/App.tsx`

---

## Architecture Decisions

- The Product entity uses `cuid()` as the id strategy, consistent with
  the approach used for User in previous iterations.
- `searchTerm` is stored on the Product model as an internal field for
  use by the scraper service in a future iteration. It is never returned
  from the API.
- `name` is unique on the Product table. This prevents duplicate products
  being created by repeated seed runs and enforces catalogue integrity.
- The seed script is idempotent — running it multiple times does not
  create duplicates. Products are upserted by name.
- Both product endpoints are public. No JWT is required to browse the
  catalogue. Authentication will gate watchlists and alerts in future
  iterations, not product browsing.
- The frontend Axios instance reads its base URL from the `VITE_API_URL`
  environment variable with a fallback to `http://localhost:3000`. This
  keeps local development working without a `.env` file.
- React Router v6 is configured in `App.tsx` using nested routes with a
  persistent `Layout` wrapper. All pages render inside the layout via
  React Router's `<Outlet />`.
- shadcn/ui components (`Card`, `Button`) are used for product display.
  These are copied into the repository rather than imported from a package,
  which is the intended shadcn/ui pattern.
- `ProductDetailPage` uses a `Status` union type
  (`loading | notFound | error | loaded`) to manage fetch state. This
  makes all possible UI states explicit and prevents the component from
  rendering partial or inconsistent UI.

---

## Data Flow

```
Browser → GET /products
               ↓
         ProductsController
               ↓
         ProductsService.findAll()
               ↓
         Prisma: SELECT from products (excludes searchTerm)
               ↓
         Returns Product[]

Browser → GET /products/:id
               ↓
         ProductsController
               ↓
         ProductsService.findOne(id)
               ↓
         Prisma: SELECT from products WHERE id = ?
               ↓
         Returns Product or 404 NotFoundException
```

---

## Database Changes

A new `products` table was added via a Prisma migration.

| Column          | Type          | Notes                           |
| --------------- | ------------- | ------------------------------- |
| `id`          | String (cuid) | Primary key                     |
| `name`        | String        | Unique                          |
| `description` | String        |                                 |
| `imageUrl`    | String        |                                 |
| `searchTerm`  | String        | Internal — not exposed via API |
| `createdAt`   | DateTime      | Auto-set on create              |
| `updatedAt`   | DateTime      | Auto-updated                    |

A seed script populates the table with 12+ products across three
categories (phones, laptops, GPUs). The seed is idempotent.

---

## New Environment Variables

| Variable         | Description                            | Default                   |
| ---------------- | -------------------------------------- | ------------------------- |
| `VITE_API_URL` | Base URL for the frontend Axios client | `http://localhost:3000` |

---

## Testing

- `GET /products` returns the seeded product list
- `GET /products/:id` returns the correct product
- `GET /products/:id` returns 404 for an unknown id
- Tests use Jest and Supertest

---

## Known Issues

- Product images rely on external `imageUrl` values from seed data. If
  those URLs go dead the images will break. No image hosting solution
  exists yet.
- The homepage (`/`) is a placeholder. It has no content beyond a basic
  shell.
- No error boundary exists in the React app. An unhandled render error
  will crash the entire UI.

---

## Technical Debt

- Add an image hosting strategy (S3 or similar) rather than relying on
  external URLs.
- Add a `Listing` table in a future iteration to store fetched prices
  linked to products by `product_id`. This is the foundation for price
  history and alerts.
- Add React Error Boundaries to prevent full-page crashes on unexpected
  errors.
- Add loading skeletons in place of plain text loading states.
- The `searchTerm` field on Product is unused until the scraper service
  is built in Iteration 6.
- Consider pagination for `GET /products` before the catalogue grows large.

---

## Next Steps

- Iteration 5: Watchlists — authenticated users can save products they
  want to track. Requires a Watchlist entity linking users to products,
  a watchlist API, and a frontend watchlist UI.
- Iteration 6: Scraper service — a separate microservice that uses
  `searchTerm` to fetch live prices from retailer APIs (starting with
  eBay), publishing results to RabbitMQ for the api-gateway to consume
  and store in a `Listing` table.
