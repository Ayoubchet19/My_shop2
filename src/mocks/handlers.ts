/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { avgRating, paginate } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Product details: GET /api/products/:id/
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    // Add computed avg rating for details view
    return HttpResponse.json({ ...p, _avg: avgRating(p.ratings) }, { status: 200 });
  }),

  // Cart validate: POST /api/cart/validate/ -> returns summary
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json()) as { items: { id: number; quantity: number }[] };
    let subtotal = 0;
    const lines = body.items.map((it) => {
      const p = products.find((x) => x.id === it.id);
      if (!p) return { id: it.id, quantity: it.quantity, price: 0, lineTotal: 0 };
      const lineTotal = p.price * it.quantity;
      subtotal += lineTotal;
      return { id: p.id, name: p.name, quantity: it.quantity, price: p.price, lineTotal };
    });
    const tax = +(subtotal * 0.2).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    return HttpResponse.json({ lines, subtotal, tax, total }, { status: 200 });
  }),

  // Order confirmation: POST /api/order/
  http.post(`${API}/order/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ orderNumber: `ORD-${Date.now()}`, received: body }, { status: 201 });
  }),
];
