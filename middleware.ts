import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthenticated = async () => {
    if (!token) {
      return false;
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      console.log("Token is valid");
      return true;
    } catch (error) {
      console.log("Token verification failed", error);
      return false;
    }
  };

  if (pathname.startsWith("/login") || pathname.startsWith("/Register")) {
    if (await isAuthenticated()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!(await isAuthenticated())) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};