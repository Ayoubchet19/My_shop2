/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { avgRating, paginate } from './utils';

const API = '/api';
// In-memory wishlist state for MSW (persists while the app is open)
let wishlistIds: number[] = [];
// In-memory reviews per product id
type Review = { user: string; rating: number; comment: string; createdAt: string };
const reviewsByProduct: Record<number, Review[]> = {};

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

  // Product reviews: GET /api/products/:id/reviews/
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const id = Number(params['id']);
    const list = reviewsByProduct[id] ?? [];
    return HttpResponse.json(list, { status: 200 });
  }),

  // Product reviews: POST /api/products/:id/reviews/
  http.post(`${API}/products/:id/reviews/`, async ({ params, request }) => {
    const id = Number(params['id']);
    const body = (await request.json()) as { rating: number; comment?: string; user?: string };
    const review: Review = {
      user: body.user || 'ayoub',
      rating: Math.max(1, Math.min(5, Number(body.rating) || 1)),
      comment: body.comment || '',
      createdAt: new Date().toISOString(),
    };
    const list = reviewsByProduct[id] ?? [];
    reviewsByProduct[id] = [review, ...list];
    return HttpResponse.json(review, { status: 201 });
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

  // Cart apply promo: POST /api/cart/apply-promo/
  // Body: { items: [{id, quantity}], code: string }
  // Response: { itemsTotal, discount, shipping, taxes, grandTotal, appliedPromos }
  http.post(`${API}/cart/apply-promo/`, async ({ request }) => {
    const body = (await request.json()) as {
      items: { id: number; quantity: number }[];
      code?: string;
    };
    const code = (body.code || '').trim().toUpperCase();
    let itemsTotal = 0;
    for (const it of body.items || []) {
      const p = products.find((x) => x.id === it.id);
      if (p) itemsTotal += p.price * it.quantity;
    }
    // Basic rules: FREESHIP -> shipping 0, WELCOME10/PROMO10 -> 10% off, BLACKFRIDAY -> 20% off
    // VIP20 -> 20% off only if itemsTotal >= 100
    let discountRate = 0;
    let shipping = itemsTotal > 0 ? 4.99 : 0;
    const appliedPromos: string[] = [];
    if (code === 'FREESHIP') {
      shipping = 0;
      appliedPromos.push('FREESHIP');
    } else if (code === 'PROMO10' || code === 'WELCOME10') {
      discountRate = 0.1;
      appliedPromos.push(code);
    } else if (code === 'BLACKFRIDAY') {
      discountRate = 0.2;
      shipping = 0;
      appliedPromos.push('BLACKFRIDAY');
    } else if (code === 'VIP20') {
      if (itemsTotal >= 100) {
        discountRate = 0.2;
        appliedPromos.push('VIP20');
      } else {
        // Not eligible, no promo applied
      }
    }
    const discount = +(itemsTotal * discountRate).toFixed(2);
    const taxableBase = Math.max(0, itemsTotal - discount);
    const taxes = +(taxableBase * 0.2).toFixed(2);
    const grandTotal = +(taxableBase + taxes + shipping).toFixed(2);
    return HttpResponse.json(
      {
        itemsTotal: +itemsTotal.toFixed(2),
        discount,
        shipping: +shipping.toFixed(2),
        taxes,
        grandTotal,
        appliedPromos,
      },
      { status: 200 },
    );
  }),

  // Order confirmation: POST /api/order/
  http.post(`${API}/order/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ orderNumber: `ORD-${Date.now()}`, received: body }, { status: 201 });
  }),

  // Validate stock before placing order
  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    const body = (await request.json()) as { items: { id: number; quantity: number }[] };
    for (const it of body.items || []) {
      const p = products.find((x) => x.id === it.id);
      if (!p) {
        return HttpResponse.json({ detail: `Produit ${it.id} introuvable` }, { status: 404 });
      }
      if (p.stock <= 0) {
        return HttpResponse.json(
          { detail: `Rupture de stock pour le produit ${p.name}` },
          { status: 400 },
        );
      }
      if (it.quantity > p.stock) {
        return HttpResponse.json(
          { detail: `Stock insuffisant pour le produit ${p.name}` },
          { status: 400 },
        );
      }
    }
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),

  // User profile: GET /api/me/
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(
      {
        id: 'u-1',
        username: 'ayoub',
        email: 'ayoub@example.com',
        fullName: 'Ayoub C',
        preferences: { newsletter: true, defaultMinRating: 3 },
        defaultAddress: {
          line1: '1 Rue Exemple',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
      },
      { status: 200 },
    );
  }),

  // Update profile/preferences: PATCH /api/me/
  http.patch(`${API}/me/`, async ({ request }) => {
    const raw = await request.json();
    const patch = raw && typeof raw === 'object' ? (raw as Record<string, any>) : {};
    // In a real backend we'd merge & persist; here we return merged payload for demo
    const base = {
      id: 'u-1',
      username: 'ayoub',
      email: 'ayoub@example.com',
      fullName: 'Ayoub C',
      preferences: { newsletter: true, defaultMinRating: 3 },
    } as any;
    const merged = {
      ...base,
      ...(patch['fullName'] ? { fullName: patch['fullName'] } : {}),
      preferences: { ...base.preferences, ...(typeof patch === 'object' ? patch : {}) },
    };
    return HttpResponse.json(merged, { status: 200 });
  }),

  // Orders list: GET /api/me/orders/
  http.get(`${API}/me/orders/`, async () => {
    const orders = [
      { id: '1001', date: '2025-11-01', status: 'livrée', total: 129.9 },
      { id: '1002', date: '2025-11-10', status: 'expédiée', total: 59.49 },
    ];
    return HttpResponse.json(orders, { status: 200 });
  }),

  // Admin stats: GET /api/admin/stats/
  http.get(`${API}/admin/stats/`, async () => {
    const totalUsers = 128;
    const totalOrders = 342;
    const totalRevenue = 18452.35;
    const topProducts = products.slice(0, 5).map((p, idx) => ({
      productId: String(p.id),
      name: p.name,
      sold: 50 - idx * 7,
      revenue: +(p.price * (50 - idx * 7)).toFixed(2),
    }));
    const recentOrders = [
      {
        id: 'A1003',
        user: 'ayoub',
        total: 59.49,
        createdAt: new Date().toISOString(),
        status: 'expédiée',
      },
      {
        id: 'A1002',
        user: 'maria',
        total: 129.9,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'livrée',
      },
      {
        id: 'A1001',
        user: 'jean',
        total: 24.99,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'en préparation',
      },
    ];
    return HttpResponse.json(
      { totalUsers, totalOrders, totalRevenue, topProducts, recentOrders },
      { status: 200 },
    );
  }),

  // Order detail: GET /api/orders/:id/
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const id = String(params['id']);
    const detail = {
      id,
      date: '2025-11-10',
      status: id === '1001' ? 'livrée' : 'expédiée',
      subtotal: 99.99,
      tax: 20.0,
      shipping: 4.5,
      total: 124.49,
      address: { line1: '1 Rue Exemple', city: 'Paris', postalCode: '75001', country: 'FR' },
      items: [
        { id: 1, name: 'Notebook', quantity: 2, price: 9.99 },
        { id: 2, name: 'Pen pack', quantity: 3, price: 2.5 },
      ],
    };
    return HttpResponse.json(detail, { status: 200 });
  }),

  // Wishlist: GET /api/me/wishlist/
  http.get(`${API}/me/wishlist/`, async () => {
    return HttpResponse.json(wishlistIds, { status: 200 });
  }),

  // Wishlist: POST /api/me/wishlist/ { productId, action?: 'add'|'remove'|'toggle' }
  http.post(`${API}/me/wishlist/`, async ({ request }) => {
    const raw = await request.json();
    const body = raw && typeof raw === 'object' ? (raw as Record<string, any>) : {};
    const productId = Number(body['productId']);
    const action = (body['action'] as 'add' | 'remove' | 'toggle' | undefined) ?? 'toggle';
    let added = false;
    let removed = false;
    const has = wishlistIds.includes(productId);
    if (action === 'add' || (action === 'toggle' && !has)) {
      wishlistIds = has ? wishlistIds : [...wishlistIds, productId];
      added = true;
    } else if (action === 'remove' || (action === 'toggle' && has)) {
      wishlistIds = wishlistIds.filter((id) => id !== productId);
      removed = true;
    }
    return HttpResponse.json({ productId, added, removed, ids: wishlistIds }, { status: 200 });
  }),
];
