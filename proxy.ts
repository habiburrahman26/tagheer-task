import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
