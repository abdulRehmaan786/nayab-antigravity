import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthSession } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nayab-grammar-school-mirwah-super-secret-key-2025"
);

const COOKIE_NAME = "ngs_auth_token";

export async function createAuthToken(session: AuthSession): Promise<string> {
  return await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as "ADMIN" | "TEACHER",
      assignedClasses: (payload.assignedClasses as string[]) || [],
      assignedSubjects: (payload.assignedSubjects as any[]) || [],
    };
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
