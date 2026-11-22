import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { findVipUserById, VipUser, sanitizeVipUser } from './vip-db';

const VIP_JWT_SECRET = new TextEncoder().encode(
  process.env.VIP_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'outside_vip_customer_secret_token_at_least_32_characters_super_secure'
);

export const VIP_SESSION_COOKIE = 'outside_vip_session';

export interface VipSessionPayload {
  customerId: string;
  email: string;
  name: string;
  role: 'CUSTOMER';
  vipTier: string;
}

export async function createVipSessionToken(payload: VipSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('14d') // 14-day persistent VIP session
    .sign(VIP_JWT_SECRET);
}

export async function verifyVipSessionToken(token: string): Promise<VipSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, VIP_JWT_SECRET, {
      algorithms: ['HS256'],
    });
    if (payload.role !== 'CUSTOMER') return null;
    return payload as unknown as VipSessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentVipSession(): Promise<VipSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(VIP_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyVipSessionToken(token);
}

export async function getCurrentVipUser(): Promise<VipUser | null> {
  const session = await getCurrentVipSession();
  if (!session) return null;
  return findVipUserById(session.customerId);
}

export async function verifyCustomerPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function hashCustomerPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
