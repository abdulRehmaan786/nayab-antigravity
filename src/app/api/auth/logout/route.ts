import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.delete(AUTH_COOKIE_NAME);
}

export async function POST(req: NextRequest) {
  const acceptHeader = req.headers.get("accept") || "";
  const contentType = req.headers.get("content-type") || "";
  const isJson =
    acceptHeader.includes("application/json") ||
    contentType.includes("application/json") ||
    req.headers.get("x-requested-with") === "XMLHttpRequest";

  if (isJson) {
    const response = NextResponse.json({ ok: true, message: "Logged out successfully" });
    clearAuthCookie(response);
    return response;
  }

  // Standard HTML form submission: redirect cleanly to /login
  const redirectUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  clearAuthCookie(response);
  return response;
}

export async function GET(req: NextRequest) {
  const redirectUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  clearAuthCookie(response);
  return response;
}
