import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "vietnam_atlas_admin_token";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "vietnamatlas2026";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "vietnam_atlas_super_secret_session_key_2026";
}

// Generate a signed session token
export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const secret = getSessionSecret();
  const pass = getAdminPassword();
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${pass}-${timestamp}`)
    .digest("hex");
  return `${timestamp}.${hash}`;
}

// Verify a session token (valid for 7 days)
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes(".")) return false;
  const [timestamp, hash] = token.split(".");
  const time = parseInt(timestamp, 10);
  if (isNaN(time)) return false;

  // Max age: 7 days
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - time > MAX_AGE) return false;

  const secret = getSessionSecret();
  const pass = getAdminPassword();
  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(`${pass}-${timestamp}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch {
    return false;
  }
}

// Check admin authentication from incoming NextRequest
export function isAdminAuthenticated(req: NextRequest): boolean {
  // 1. Check HTTP-only cookie
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return true;
  }

  // 2. Check Authorization Bearer header (for API / CLI access)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearer = authHeader.substring(7).trim();
    if (bearer === getAdminPassword() || verifySessionToken(bearer)) {
      return true;
    }
  }

  return false;
}

// Verify raw password input
export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const expected = getAdminPassword();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputPassword),
      Buffer.from(expected)
    );
  } catch {
    return inputPassword === expected;
  }
}
