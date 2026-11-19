import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response } from 'express';

interface CustomerRecord {
  id: string;
  displayName: string;
  provider: 'phone';
  phone: string;
  createdAt: string;
  lastLoginAt: string;
  reviewCount: number;
  orderCount: number;
}

interface PublicReviewRecord {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: { ar: string; en: string };
  verifiedPurchase: boolean;
}

interface StoreDatabase {
  customers: CustomerRecord[];
  reviews: PublicReviewRecord[];
  ephemeralSecret?: string;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), '.kunooz_data');
const DB_FILE = path.join(DATA_DIR, 'auth-db.json');

const SESSION_COOKIE = 'kunooz_session';
const ADMIN_COOKIE = 'kunooz_admin_session';

function ensureDbDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDb(): StoreDatabase {
  try {
    ensureDbDir();
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw) as Partial<StoreDatabase>;
      return {
        customers: Array.isArray(parsed.customers) ? parsed.customers : [],
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
        ephemeralSecret: parsed.ephemeralSecret,
      };
    }
  } catch {
    // Fallback to clean DB
  }
  return {
    customers: [],
    reviews: [],
    ephemeralSecret: crypto.randomBytes(32).toString('hex'),
  };
}

let db: StoreDatabase = loadDb();
if (!db.ephemeralSecret) {
  db.ephemeralSecret = crypto.randomBytes(32).toString('hex');
}

function saveDb(): void {
  try {
    ensureDbDir();
    const tmp = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmp, DB_FILE);
  } catch {
    // Ignore disk write error in read-only edge envs
  }
}

saveDb();

function getSigningSecret(): string {
  return process.env.SESSION_SECRET || db.ephemeralSecret || 'kunooz-doan-runtime-secret';
}

function signToken(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(body)
    .digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken<T>(token: string | undefined): T | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(body)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T & {
      exp?: number;
    };
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const result: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    try {
      result[key] = decodeURIComponent(val);
    } catch {
      result[key] = val;
    }
  }
  return result;
}

function isSecureRequest(req: Request): boolean {
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.includes('https')) return true;
  if (req.secure) return true;
  if (process.env.APP_URL && process.env.APP_URL.startsWith('https://')) return true;
  return false;
}

function setAuthCookie(res: Response, req: Request, name: string, value: string, maxAgeMs: number): void {
  const secure = isSecureRequest(req);
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: secure ? 'none' : 'lax',
    secure,
    path: '/',
    maxAge: maxAgeMs,
  });
}

function clearAuthCookie(res: Response, req: Request, name: string): void {
  const secure = isSecureRequest(req);
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: secure ? 'none' : 'lax',
    secure,
    path: '/',
  });
}

interface SessionPayload {
  role: 'guest' | 'customer';
  customerId?: string;
  exp: number;
}

interface AdminSessionPayload {
  admin: true;
  exp: number;
}

function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  if (hasPlus) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('967')) return `+${digits}`;
  if (digits.length === 9 && digits.startsWith('7')) return `+967${digits}`;
  return digits;
}

function getSessionFromRequest(req: Request): {
  authStatus: 'guest' | 'customer';
  customer: CustomerRecord | null;
} {
  const cookies = parseCookies(req);
  const payload = verifyToken<SessionPayload>(cookies[SESSION_COOKIE]);
  if (!payload || payload.role === 'guest' || !payload.customerId) {
    return { authStatus: 'guest', customer: null };
  }
  const customer = db.customers.find((c) => c.id === payload.customerId) ?? null;
  if (!customer) {
    return { authStatus: 'guest', customer: null };
  }
  return { authStatus: 'customer', customer };
}

function sanitizeCustomerSelf(c: CustomerRecord) {
  return {
    id: c.id,
    displayName: c.displayName,
    provider: c.provider,
    phone: c.phone,
    createdAt: c.createdAt,
    lastLoginAt: c.lastLoginAt,
  };
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));

  // 1. Auth Availability
  app.get('/api/auth/providers', (_req, res) => {
    res.json({
      guestAvailable: true,
      phoneAvailable: true,
    });
  });

  // 2. Current Session Only (Customer NEVER sees other customers)
  app.get('/api/auth/me', (req, res) => {
    const { authStatus, customer } = getSessionFromRequest(req);
    res.json({
      authStatus,
      customer: customer ? sanitizeCustomerSelf(customer) : null,
    });
  });

  // 3. Continue as Guest Only ("خيار زائر فقط")
  app.post('/api/auth/guest', (req, res) => {
    const token = signToken({
      role: 'guest',
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    } satisfies SessionPayload);
    setAuthCookie(res, req, SESSION_COOKIE, token, 30 * 24 * 60 * 60 * 1000);
    res.json({ authStatus: 'guest', customer: null });
  });

  // 4. Logout -> resets back to Guest
  app.post('/api/auth/logout', (req, res) => {
    clearAuthCookie(res, req, SESSION_COOKIE);
    res.json({ authStatus: 'guest', customer: null });
  });

  // 5. Sign in with Name & Phone Number Only ("بالاسم ورقم التلفون")
  app.post('/api/auth/phone', (req, res) => {
    const rawPhone = typeof req.body?.phone === 'string' ? req.body.phone : '';
    const rawName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

    if (rawName.length < 2) {
      res.status(400).json({
        error: 'INVALID_NAME',
        messageAr: 'يرجى إدخال اسمك الكامل (حرفين على الأقل).',
        messageEn: 'Please enter your name (at least 2 characters).',
      });
      return;
    }

    const normalized = normalizePhone(rawPhone);
    const digitsOnly = normalized.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 16) {
      res.status(400).json({
        error: 'INVALID_PHONE',
        messageAr: 'يرجى إدخال رقم هاتف صحيح (٧ أرقام على الأقل).',
        messageEn: 'Please enter a valid phone number (at least 7 digits).',
      });
      return;
    }

    const now = new Date().toISOString();
    let customer = db.customers.find((c) => c.phone === normalized);

    if (customer) {
      customer.displayName = rawName.slice(0, 60);
      customer.lastLoginAt = now;
    } else {
      customer = {
        id: `cust-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        displayName: rawName.slice(0, 60),
        provider: 'phone',
        phone: normalized,
        createdAt: now,
        lastLoginAt: now,
        reviewCount: 0,
        orderCount: 0,
      };
      db.customers.unshift(customer);
    }

    saveDb();

    const token = signToken({
      role: 'customer',
      customerId: customer.id,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    } satisfies SessionPayload);

    setAuthCookie(res, req, SESSION_COOKIE, token, 30 * 24 * 60 * 60 * 1000);
    res.json({
      authStatus: 'customer',
      customer: sanitizeCustomerSelf(customer),
    });
  });

  // 6. Public Reviews API — Strictly Exposes Author NAME ONLY (Zero PII)
  app.get('/api/reviews', (_req, res) => {
    const publicOnly = db.reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      author: r.author,
      rating: r.rating,
      date: r.date,
      comment: r.comment,
      verifiedPurchase: r.verifiedPurchase,
    }));
    res.json({ reviews: publicOnly });
  });

  app.post('/api/reviews', (req, res) => {
    const { customer } = getSessionFromRequest(req);
    const productId = typeof req.body?.productId === 'string' ? req.body.productId : '';
    const ratingRaw = Number(req.body?.rating);
    const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, Math.round(ratingRaw))) : 5;
    const commentText = typeof req.body?.comment === 'string' ? req.body.comment.trim() : '';
    const requestedAuthor = typeof req.body?.author === 'string' ? req.body.author.trim() : '';

    if (!productId || !commentText) {
      res.status(400).json({ error: 'INVALID_REVIEW' });
      return;
    }

    // ONLY displayName (or guest name) is ever persisted on the public review!
    const publicAuthorName = customer
      ? customer.displayName
      : requestedAuthor || 'زائر';

    const review: PublicReviewRecord = {
      id: `rev-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      productId,
      author: publicAuthorName.slice(0, 60),
      rating,
      date: new Date().toISOString().slice(0, 10),
      comment: { ar: commentText, en: commentText },
      verifiedPurchase: Boolean(customer),
    };

    db.reviews.unshift(review);

    if (customer) {
      customer.reviewCount += 1;
      customer.lastLoginAt = new Date().toISOString();
    }

    saveDb();
    res.status(201).json({ review });
  });

  app.post('/api/customer/order-recorded', (req, res) => {
    const { customer } = getSessionFromRequest(req);
    if (customer) {
      customer.orderCount += 1;
      customer.lastLoginAt = new Date().toISOString();
      saveDb();
    }
    res.json({ ok: true });
  });

  // 7. Admin Session & Admin-Only Customer Directory
  app.post('/api/admin/session', (req, res) => {
    const adminToken = signToken({
      admin: true,
      exp: Date.now() + 12 * 60 * 60 * 1000,
    } satisfies AdminSessionPayload);
    setAuthCookie(res, req, ADMIN_COOKIE, adminToken, 12 * 60 * 60 * 1000);
    res.json({ ok: true });
  });

  function requireAdminSession(req: Request, res: Response): boolean {
    const cookies = parseCookies(req);
    const adminPayload = verifyToken<AdminSessionPayload>(cookies[ADMIN_COOKIE]);
    if (!adminPayload || !adminPayload.admin) {
      res.status(403).json({
        error: 'ADMIN_ONLY',
        messageAr: 'بيانات العملاء متاحة للإدارة فقط.',
        messageEn: 'Customer directory is restricted to administrators only.',
      });
      return false;
    }
    return true;
  }

  app.get('/api/admin/customers', (req, res) => {
    if (!requireAdminSession(req, res)) return;
    res.json({ customers: db.customers });
  });

  app.delete('/api/admin/customers/:id', (req, res) => {
    if (!requireAdminSession(req, res)) return;
    const targetId = req.params.id;
    db.customers = db.customers.filter((c) => c.id !== targetId);
    saveDb();
    res.json({ ok: true });
  });

  // Static / Vite Frontend Serving
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kunooz Doan server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
