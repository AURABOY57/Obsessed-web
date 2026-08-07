import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "obsessed_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "obsessed_default_fallback_session_key_32_bytes_len"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger todas las rutas bajo /admin excepto /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionToken, SECRET_KEY);
      if (payload.role !== "admin") {
        throw new Error("Invalid role");
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si ya está autenticado e intenta ir a /admin/login, redirigir a /admin
  if (pathname === "/admin/login") {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, SECRET_KEY);
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // Token inválido, continuar a login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
