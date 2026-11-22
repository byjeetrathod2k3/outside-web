import { describe, it, expect } from 'vitest';
import {
  createVipUser,
  findVipUserByEmail,
  findVipUserById,
  updateVipUser,
  sanitizeVipUser,
  INITIAL_VIP_USERS,
} from '../src/lib/vip-db';
import {
  createVipSessionToken,
  verifyVipSessionToken,
  verifyCustomerPassword,
  hashCustomerPassword,
} from '../src/lib/vip-auth';
import { createSessionToken, verifySessionToken } from '../src/lib/auth';

describe('VIP Customer Authentication & Per-User Isolated Memory', () => {
  it('pre-seeds Elena Vance with Gold Tier and rich orders', () => {
    const elena = findVipUserByEmail('elena.vance@outside.in');
    expect(elena).not.toBeNull();
    expect(elena?.vipTier).toBe('GOLD');
    expect(elena?.loyaltyPoints).toBeGreaterThanOrEqual(3000);
    expect(elena?.orders.length).toBeGreaterThanOrEqual(2);
    expect(elena?.addresses.length).toBeGreaterThanOrEqual(2);
    expect(elena?.paymentMethods.length).toBeGreaterThanOrEqual(2);
    expect(elena?.role).toBe('CUSTOMER');
  });

  it('pre-seeds Aarav Mehta with Silver Tier', () => {
    const aarav = findVipUserByEmail('aarav.mehta@outside.in');
    expect(aarav).not.toBeNull();
    expect(aarav?.vipTier).toBe('SILVER');
    expect(aarav?.loyaltyPoints).toBe(1200);
    expect(aarav?.role).toBe('CUSTOMER');
  });

  it('hashes customer passwords and verifies them securely', async () => {
    const plain = 'SecretPass2026!';
    const hash = await hashCustomerPassword(plain);
    expect(hash).not.toBe(plain);
    const isValid = await verifyCustomerPassword(plain, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyCustomerPassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });

  it('creates and verifies VIP customer session tokens with CUSTOMER role', async () => {
    const payload = {
      customerId: 'vip_elena_vance',
      email: 'elena.vance@outside.in',
      name: 'Elena Vance',
      role: 'CUSTOMER' as const,
      vipTier: 'GOLD',
    };

    const token = await createVipSessionToken(payload);
    expect(token).toBeDefined();

    const verified = await verifyVipSessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.customerId).toBe(payload.customerId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe('CUSTOMER');
    expect(verified?.vipTier).toBe('GOLD');
  });

  it('prevents cross-authentication: Admin tokens fail customer verification', async () => {
    // Create an admin token
    const adminToken = await createSessionToken({
      userId: 'admin_1',
      email: 'admin@outside.in',
      name: 'Studio Admin',
      role: 'SUPER_ADMIN',
    });

    // Verify it with VIP customer verifier -> should reject because role !== 'CUSTOMER'
    const customerPayload = await verifyVipSessionToken(adminToken);
    expect(customerPayload).toBeNull();
  });

  it('prevents cross-authentication: Customer tokens fail Super Admin role checks', async () => {
    const customerToken = await createVipSessionToken({
      customerId: 'vip_elena_vance',
      email: 'elena.vance@outside.in',
      name: 'Elena Vance',
      role: 'CUSTOMER',
      vipTier: 'GOLD',
    });

    // Verify with admin verifier
    const adminPayload = await verifySessionToken(customerToken);
    // Even if JWT verifies, role is NOT SUPER_ADMIN
    expect(adminPayload?.role).not.toBe('SUPER_ADMIN');
  });

  it('sanitizes customer profile before sending to client (strips passwordHash)', () => {
    const elena = findVipUserByEmail('elena.vance@outside.in')!;
    const sanitized = sanitizeVipUser(elena);
    expect((sanitized as any).passwordHash).toBeUndefined();
    expect(sanitized.email).toBe(elena.email);
    expect(sanitized.vipTier).toBe(elena.vipTier);
  });

  it('maintains isolated user profile state (addresses, payments, preferences, cart)', () => {
    const elena = findVipUserByEmail('elena.vance@outside.in')!;
    const aarav = findVipUserByEmail('aarav.mehta@outside.in')!;

    // Ensure Elena and Aarav have distinct addresses and orders
    expect(elena.id).not.toBe(aarav.id);
    expect(elena.orders).not.toEqual(aarav.orders);
    expect(elena.addresses[0].city).toBe('Mumbai');
    expect(aarav.addresses[0].city).toBe('Ahmedabad');

    // Elena has 2FA enabled, Aarav does not
    expect(elena.twoFactorEnabled).toBe(true);
    expect(aarav.twoFactorEnabled).toBe(false);

    // Verify cart and wishlist are per-user
    expect(elena.cart.length).toBeGreaterThan(0);
    expect(aarav.cart.length).toBe(0);
  });

  it('updates VIP preferences persistently', () => {
    const updated = updateVipUser('vip_elena_vance', (user) => {
      user.preferences.preferredFit = 'WOMEN';
      user.preferences.preferredSize = 'M';
      user.preferences.smsDropAlerts = true;
      return user;
    });

    expect(updated.preferences.preferredFit).toBe('WOMEN');
    expect(updated.preferences.preferredSize).toBe('M');
    expect(updated.preferences.smsDropAlerts).toBe(true);
  });
});
