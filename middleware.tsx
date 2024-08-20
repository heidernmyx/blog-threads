import { getSession } from "next-auth/react";
import { getToken, type JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { request } from "http";
export { default } from "next-auth/middleware"



function handleProtectedRoutes(pathUrl: string, token: JWT | null, req: NextRequest) {
  console.log(true)
  if (pathUrl === '/dashboard' || pathUrl === '/admin_dashboard(.*)') {
    if (!token) {
      console.log(true)
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    else {
      console.log(false)
      return null;
    }
  }
}

function handlePublicRoutes(pathUrl: string, token: JWT | null, req: NextRequest) {
  console.log(true)
  console.log(token)
  console.log(pathUrl)
  console.log(req.url);
  if (pathUrl === '/auth/signin' || pathUrl === '/auth/signup') {
    if (token) {
      console.log(true)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    else {
      return NextResponse.next();
    }
  }
}

export async function middleware(req: NextRequest) {

  const pathUrl = req.nextUrl.pathname;

  
  const isProtectedRoute = ['/dashboard', '/admin_dashboard'].includes(pathUrl);
  const isPublicRoute = ['/auth/signin', '/auth/signup'].includes(pathUrl);

  console.log(isProtectedRoute);
  console.log(isPublicRoute);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (isProtectedRoute) {
    handleProtectedRoutes(pathUrl, token, req);
  }
  else if (isPublicRoute) {
    handlePublicRoutes(pathUrl, token, req);
  }

}


export const config = { matcher: ["/dashboard(.*)", "/auth(.*)"] }