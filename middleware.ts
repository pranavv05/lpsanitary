import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle PDF file requests
  if (request.nextUrl.pathname.includes('/resources/') && request.nextUrl.pathname.endsWith('.pdf')) {
    const response = NextResponse.next();
    
    // Force proper PDF headers to prevent corruption
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Encoding', 'identity');
    response.headers.set('Content-Transfer-Encoding', 'binary');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Accept-Ranges', 'bytes');
    
    // Prevent any compression
    response.headers.set('X-Content-Encoding-Override', 'none');
    response.headers.set('X-Compression-Override', 'false');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Range');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/resources/:path*.pdf',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};