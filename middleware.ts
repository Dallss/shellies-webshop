import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/auth";

// /admin: signed-in Google account on the ADMIN_EMAILS list only.
// /account and /checkout: any signed-in shopper.
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  if (!user) {
    const login = new URL("/login", req.nextUrl);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && !isAdminEmail(user.email)) {
    return NextResponse.rewrite(new URL("/not-allowed", req.nextUrl), { status: 403 });
  }
});

export const config = { matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"] };
