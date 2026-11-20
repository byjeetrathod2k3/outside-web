/**
 * OUTSIDE — Authentication, Session & Role-Based Access Control (RBAC)
 */

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'outside_super_secure_secret_key_production_32chars_min'
);

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  expiresAt?: number;
}

const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export function hasRequiredRole(userRole: Role, minimumRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minimumRole] || 0);
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function createSessionToken(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('outside_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export interface PreAuthChallengePayload {
  userId: string;
  email: string;
  role: Role;
  type: '2fa_challenge';
}

export async function create2faChallengeToken(payload: {
  userId: string;
  email: string;
  role: Role;
}): Promise<string> {
  return new SignJWT({ ...payload, type: '2fa_challenge' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m') // 5 minutes challenge window
    .sign(JWT_SECRET);
}

export async function verify2faChallengeToken(token: string): Promise<PreAuthChallengePayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    if (payload.type !== '2fa_challenge') return null;
    return payload as unknown as PreAuthChallengePayload;
  } catch {
    return null;
  }
}
