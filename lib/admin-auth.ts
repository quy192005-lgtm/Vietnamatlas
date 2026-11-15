import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "vietnam_atlas_admin_token";

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "admin@vietnamatlas.com").trim().toLowerCase();
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "vietnamatlas2026";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "vietnam_atlas_super_secret_session_key_2026";
}

// Generate a signed session token containing user email
export function createSessionToken(email?: string): string {
  const timestamp = Date.now().toString();
  const userEmail = email ? email.trim().toLowerCase() : getAdminEmail();
  const secret = getSessionSecret();
  const pass = getAdminPassword();
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${userEmail}-${pass}-${timestamp}`)
    .digest("hex");
  const encodedEmail = Buffer.from(userEmail).toString("base64url");
  return `${timestamp}.${encodedEmail}.${hash}`;
}

// Verify a session token (valid for 7 days)
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes(".")) return false;
  const parts = token.split(".");

  // 1. New 3-part token: timestamp.encodedEmail.hash
  if (parts.length === 3) {
    const [timestamp, encodedEmail, hash] = parts;
    const time = parseInt(timestamp, 10);
    if (isNaN(time)) return false;

    // Max age: 7 days
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - time > MAX_AGE) return false;

    let userEmail = "";
    try {
      userEmail = Buffer.from(encodedEmail, "base64url").toString("utf8");
    } catch {
      return false;
    }

    const secret = getSessionSecret();
    const pass = getAdminPassword();
    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(`${userEmail}-${pass}-${timestamp}`)
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

  // 2. Backward compatibility for 2-part tokens: timestamp.hash
  if (parts.length === 2) {
    const [timestamp, hash] = parts;
    const time = parseInt(timestamp, 10);
    if (isNaN(time)) return false;

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

  return false;
}

// Extract email from session token
export function getSessionEmail(token: string | undefined | null): string {
  if (!token) return getAdminEmail();
  const parts = token.split(".");
  if (parts.length === 3) {
    try {
      return Buffer.from(parts[1], "base64url").toString("utf8");
    } catch {
      return getAdminEmail();
    }
  }
  return getAdminEmail();
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

// Verify full credentials: email + password
export function verifyCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;
  const adminEmail = getAdminEmail();
  const inputEmail = email.trim().toLowerCase();

  if (inputEmail !== adminEmail) {
    return false;
  }

  return verifyPassword(password);
}
