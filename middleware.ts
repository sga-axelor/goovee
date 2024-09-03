import {NextRequest, NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

export const TENANT_HEADER = 'x-tenant-id';
export const WORKSPACE_HEADER = 'x-workspace-id';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export function extractTenant(url: string) {
  const pattern = /^\/([a-zA-Z]+)(?:\/.*)?$/;
  const matches = url.match(pattern);

  return matches ? matches[1] : null;
}

function notFound(req: NextRequest) {
  return NextResponse.rewrite(new URL('/not-found', req.url));
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const tenant = extractTenant(pathname);

  if (!tenant) return notFound(req);

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
  const tenantMismatch = token && token.tenantId && token.tenantId !== tenant;

  if (tenantMismatch) return notFound(req);

  const headers = new Headers(req.headers);
  headers.set(TENANT_HEADER, tenant);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}
