// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("token: ", req.nextauth.token);
    switch (req.nextauth.token?.role) {
      case "manager":
        if (
          !req.nextUrl.pathname.startsWith("/dashboard") ||
          !req.nextUrl.pathname.startsWith("/wallets") ||
          !req.nextUrl.pathname.startsWith("/purchases") ||
          !req.nextUrl.pathname.startsWith("/transactions") ||
          !req.nextUrl.pathname.startsWith("/expenses")
        ) {
          console.log("manager");
          return NextResponse.redirect(new URL("/sales", req.url));
        }
        break;
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/customers", "/dashboard", "/transactions", "/transaction-form"],
};
