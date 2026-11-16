import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getSessionEmail,
  isAdminAuthenticated,
  verifyCredentials,
} from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";

// 1. GET: Check current authentication status and user email
export async function GET(request: NextRequest) {
  const authenticated = isAdminAuthenticated(request);
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const email = authenticated ? getSessionEmail(token) : null;
  const database = isSupabaseConfigured() ? "supabase" : "local";
  return NextResponse.json({ authenticated, email, database });
}

// 2. POST: Authenticate with email & password and set session cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid admin email address." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect email or password. Please verify your credentials.",
        },
        { status: 401 }
      );
    }

    const token = createSessionToken(email);
    const response = NextResponse.json({
      success: true,
      email: email.trim().toLowerCase(),
      message: "Authentication successful",
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Sign out / clear session cookie
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
