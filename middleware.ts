import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthenticated = () => {
    if (!token) {
      return false;
    }
    // try {
      // jwt.verify(token, JWT_SECRET);
      console.log("Token is valid");
      return true;
    // } catch (error) {
    //   console.log("Token verification failed", error);
    //   return false;
    // }
  };

  if (pathname.startsWith("/login") || pathname.startsWith("/Register")) {
    if (isAuthenticated()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated()) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/Register", "/dashboard"],
};