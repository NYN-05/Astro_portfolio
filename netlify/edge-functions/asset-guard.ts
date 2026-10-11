/**
 * Netlify Edge Function — asset guard.
 *
 * Gates proprietary image assets (`/images/*`, `/_astro/*`) behind an
 * HMAC-signed session cookie so they are not anonymously fetchable or
 * hotlinkable, while pages stay public and UX stays seamless.
 *
 * Flow:
 *  - Any non-image request: mint/refresh `img_session` (HttpOnly, Secure,
 *    SameSite=Lax, 7-day expiry, sliding refresh), then pass through.
 *  - Image request: require a valid cookie AND a same-origin Origin/Referer
 *    (or neither header), then stream the static asset with CORP hardening.
 *  - Fail closed: missing `ASSET_SIGNING_KEY` => images 403 (pages still work).
 *  - `ASSET_GUARD_MODE=off` bypasses the guard entirely (escape hatch).
 *
 * Required Netlify env: ASSET_SIGNING_KEY (random 32+ byte secret).
 *
 * Honest limitation: any pixel rendered in a browser can be captured by the
 * person viewing it. This guard stops anonymous URL fetching, scrapers, and
 * hotlinking — not a determined human visitor.
 */

export const config = { path: "/*" };

const COOKIE_NAME = "img_session";
const COOKIE_TTL_SECONDS = 7 * 24 * 60 * 60;
const COOKIE_REFRESH_SECONDS = 3 * 24 * 60 * 60;
const PROTECTED_PREFIXES = ["/images/", "/_astro/"];

interface EdgeContext {
  next(request?: Request): Promise<Response>;
}

interface NetlifyEnvApi {
  env: { get(name: string): string | undefined };
}

declare const Netlify: NetlifyEnvApi;

function getSecret(): string | undefined {
  return Netlify.env.get("ASSET_SIGNING_KEY");
}

function getMode(): string {
  return Netlify.env.get("ASSET_GUARD_MODE") ?? "on";
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function signExpiry(secret: string, exp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`v1:${exp}`),
  );
  return bytesToHex(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

async function verifySession(
  secret: string,
  value: string | null,
): Promise<number> {
  if (!value) return -1;
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return -1;
  const exp = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(exp)) return -1;
  if (exp <= Math.floor(Date.now() / 1000)) return -1;
  const expected = await signExpiry(secret, exp);
  return timingSafeEqual(parts[2], expected) ? exp : -1;
}

async function issueSession(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const sig = await signExpiry(secret, exp);
  return `v1.${exp}.${sig}`;
}

function sessionCookie(value: string): string {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

function isSameOriginRequest(request: Request): boolean {
  const siteOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin !== null) return origin === siteOrigin;
  const referer = request.headers.get("referer");
  if (referer !== null) {
    try {
      return new URL(referer).origin === siteOrigin;
    } catch {
      return false;
    }
  }
  return true;
}

function forbidden(): Response {
  return new Response("Forbidden", {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function withHeaders(
  res: Response,
  mutate: (headers: Headers) => void,
): Response {
  const headers = new Headers(res.headers);
  mutate(headers);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export default async function assetGuard(
  request: Request,
  context: EdgeContext,
): Promise<Response> {
  if (getMode() === "off") return context.next();

  const secret = getSecret();
  const url = new URL(request.url);
  const isProtectedAsset = PROTECTED_PREFIXES.some((prefix) =>
    url.pathname.startsWith(prefix),
  );

  if (!isProtectedAsset) {
    const res = await context.next();
    if (!secret) return res;
    const exp = await verifySession(secret, readCookie(request, COOKIE_NAME));
    const now = Math.floor(Date.now() / 1000);
    if (exp >= 0 && exp - now > COOKIE_REFRESH_SECONDS) return res;
    const value = await issueSession(secret);
    return withHeaders(res, (headers) => {
      headers.append("Set-Cookie", sessionCookie(value));
    });
  }

  if (!secret) {
    return new Response(
      "Asset protection is not configured (ASSET_SIGNING_KEY missing).",
      {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  if (!isSameOriginRequest(request)) return forbidden();
  const exp = await verifySession(secret, readCookie(request, COOKIE_NAME));
  if (exp < 0) return forbidden();

  const res = await context.next();
  return withHeaders(res, (headers) => {
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Content-Disposition", "inline");
  });
}
