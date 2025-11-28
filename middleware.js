import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  const host = request.headers.get('host') || ''
  const subdomain = host.split('.')[0]
  url.searchParams.set('city', subdomain)
  return NextResponse.rewrite(url)
}