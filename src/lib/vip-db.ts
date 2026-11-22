import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export type VipTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'BLACK_EDITION';

export interface VipAddress {
  id: string;
  label: string; // e.g. "Primary Residence", "Studio / Office"
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: 'SHIPPING' | 'BILLING';
}

export interface VipPaymentMethod {
  id: string;
  type: 'CARD' | 'UPI';
  brand: string; // 'Visa', 'Mastercard', 'UPI / GPay', etc.
  last4OrVpa: string; // '4242' or 'elena@okhdfcbank'
  expiryMonth?: string;
  expiryYear?: string;
  holderName: string;
  isDefault: boolean;
}

export interface TrackingEvent {
  title: string;
  location: string;
  timestamp: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING';
  note?: string;
}

export interface VipOrderItem {
  dropId: string;
  title: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  quantity: number;
  unitPricePaise: number;
  image: string;
  sku: string;
}

export interface VipOrder {
  id: string;
  orderNumber: string; // e.g., ORD-2026-9021
  invoiceNumber: string; // e.g., OUT/26-27/0042
  createdAt: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  fulfillmentStatus: 'DELIVERED' | 'IN_TRANSIT' | 'PROCESSING' | 'CANCELLED';
  carrier: string; // e.g., "Bluedart Air Express"
  trackingNumber: string; // e.g., "BLUEDART-8492019482"
  estimatedDelivery: string;
  shippingAddress: VipAddress;
  paymentMethod: {
    type: string;
    description: string;
  };
  items: VipOrderItem[];
  subtotalPaise: number;
  taxableAmountPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalTaxPaise: number;
  totalAmountPaise: number;
  trackingTimeline: TrackingEvent[];
  returnRequested?: boolean;
  returnDetails?: {
    requestedAt: string;
    type: 'EXCHANGE' | 'RETURN';
    reason: string;
    exchangeSize?: string;
    status: 'UNDER_REVIEW' | 'APPROVED' | 'COMPLETED';
    rmaCode: string;
  };
}

export interface VipSupportTicketMessage {
  id: string;
  sender: 'CUSTOMER' | 'CONCIERGE';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface VipSupportTicket {
  id: string;
  ticketNumber: string; // e.g. TKT-26-8941
  subject: string;
  category: 'SIZING_INQUIRY' | 'ORDER_TRACKING' | 'EXCHANGE_REQUEST' | 'VIP_CONCIERGE' | 'PRODUCT_DETAIL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'NORMAL' | 'VIP_PRIORITY';
  createdAt: string;
  updatedAt: string;
  messages: VipSupportTicketMessage[];
}

export interface VipPreferences {
  emailOrderUpdates: boolean;
  smsDropAlerts: boolean;
  earlyAccessAlerts: boolean;
  preferredFit: 'WOMEN' | 'MEN' | 'UNISEX';
  preferredSize: string;
  favoriteFabric: string;
  styleAesthetic: 'ARCHITECTURAL' | 'MINIMAL_OBSIDIAN' | 'RAW_ORGANIC';
}

export interface VipUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: 'CUSTOMER';
  isActive: boolean;
  twoFactorEnabled: boolean;
  vipTier: VipTier;
  loyaltyPoints: number;
  tierSpendTotalPaise: number; // Stored in paise (₹100 = 10000 paise)
  memberSince: string;
  perks: string[];
  wishlist: string[]; // Drop IDs
  cart: {
    id: string;
    dropId: string;
    variantId: string;
    title: string;
    fit: 'WOMEN' | 'MEN' | 'UNISEX';
    size: string;
    quantity: number;
    unitPricePaise: number;
    maxStock: number;
    image: string;
  }[];
  addresses: VipAddress[];
  paymentMethods: VipPaymentMethod[];
  orders: VipOrder[];
  tickets: VipSupportTicket[];
  preferences: VipPreferences;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const VIP_STORE_PATH = path.join(DATA_DIR, 'vip-users.json');

// Default pre-seeded users: Elena Vance (Gold Tier) and Aarav Mehta (Silver Tier)
// Passwords hashed with bcrypt: 'Password123!'
const DEFAULT_PASSWORD_HASH = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // Password123!

export const INITIAL_VIP_USERS: VipUser[] = [
  {
    id: 'vip_elena_vance',
    email: 'elena.vance@outside.in',
    name: 'Elena Vance',
    phone: '+91 98201 44521',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'CUSTOMER',
    isActive: true,
    twoFactorEnabled: true,
    vipTier: 'GOLD',
    loyaltyPoints: 3450,
    tierSpendTotalPaise: 1420000, // ₹14,200
    memberSince: '2025-08-14T10:00:00.000Z',
    perks: [
      'Private 15-Minute Drop Early Access (The Archive List)',
      'Zero-Fee Bluedart Air Express Freight (All Metro Pincodes)',
      'Dedicated WhatsApp Studio Concierge Access',
      'Complimentary Bespoke Hemming & Sizing Consultations',
      'Invitational Ahmedabad Studio Showroom Preview',
    ],
    wishlist: ['drop_001', 'drop_002'],
    cart: [
      {
        id: 'drop_001-WOMEN-M',
        dropId: 'drop_001',
        variantId: 'v_w_m',
        title: 'DROP 001 // BETTER DAYS AHEAD',
        fit: 'WOMEN',
        size: 'M',
        quantity: 1,
        unitPricePaise: 240000,
        maxStock: 4,
        image: '/images/drops/drop-001-front.jpg',
      },
    ],
    addresses: [
      {
        id: 'addr_elena_1',
        label: 'Primary Residence (Studio)',
        recipientName: 'Elena Vance',
        phone: '+91 98201 44521',
        streetAddress: 'Penthouse 14B, Altamount Heights, Altamount Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '400026',
        country: 'India',
        isDefault: true,
        type: 'SHIPPING',
      },
      {
        id: 'addr_elena_2',
        label: 'Design Office (Bandra)',
        recipientName: 'Elena Vance — Studio Atelier',
        phone: '+91 98201 44521',
        streetAddress: 'Level 4, The Pavilion, Turner Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '400050',
        country: 'India',
        isDefault: false,
        type: 'SHIPPING',
      },
    ],
    paymentMethods: [
      {
        id: 'pm_elena_card_1',
        type: 'CARD',
        brand: 'Visa Infinite',
        last4OrVpa: '4242',
        expiryMonth: '09',
        expiryYear: '2028',
        holderName: 'Elena Vance',
        isDefault: true,
      },
      {
        id: 'pm_elena_upi_1',
        type: 'UPI',
        brand: 'Google Pay UPI',
        last4OrVpa: 'elena.vance@okhdfcbank',
        holderName: 'Elena Vance',
        isDefault: false,
      },
    ],
    orders: [
      {
        id: 'ord_vip_elena_001',
        orderNumber: 'ORD-2026-9021',
        invoiceNumber: 'OUT/26-27/0042',
        createdAt: '2026-11-18T14:32:00.000Z',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
        carrier: 'Bluedart Air Express',
        trackingNumber: 'BLUEDART-8492019482',
        estimatedDelivery: '2026-11-20T17:00:00.000Z',
        shippingAddress: {
          id: 'addr_elena_1',
          label: 'Primary Residence (Studio)',
          recipientName: 'Elena Vance',
          phone: '+91 98201 44521',
          streetAddress: 'Penthouse 14B, Altamount Heights, Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          stateCode: '27',
          pincode: '400026',
          country: 'India',
          isDefault: true,
          type: 'SHIPPING',
        },
        paymentMethod: {
          type: 'CARD',
          description: 'Visa Infinite ending in •••• 4242',
        },
        items: [
          {
            dropId: 'drop_001',
            title: 'DROP 001 // BETTER DAYS AHEAD',
            fit: 'WOMEN',
            size: 'M',
            quantity: 1,
            unitPricePaise: 240000,
            image: '/images/drops/drop-001-front.jpg',
            sku: 'OUT-001-W-M',
          },
        ],
        subtotalPaise: 240000,
        taxableAmountPaise: 228571,
        cgstPaise: 0,
        sgstPaise: 0,
        igstPaise: 11429,
        totalTaxPaise: 11429,
        totalAmountPaise: 240000,
        trackingTimeline: [
          {
            title: 'Order Confirmed & Serialized Piece Reserved',
            location: 'OUTSIDE Studio, Ahmedabad',
            timestamp: 'Nov 18, 2026 — 14:32 IST',
            status: 'COMPLETED',
            note: 'Edition unit #042/250 marked and packed.',
          },
          {
            title: '280 GSM Textile Inspection Passed',
            location: 'Quality Hub, Ahmedabad',
            timestamp: 'Nov 18, 2026 — 18:00 IST',
            status: 'COMPLETED',
            note: 'Stitch tension, chain-stitch embroidery and French Terry density verified.',
          },
          {
            title: 'Dispatched via Bluedart Air Express',
            location: 'Ahmedabad Airport Logistics Hub',
            timestamp: 'Nov 19, 2026 — 06:15 IST',
            status: 'COMPLETED',
            note: 'AWB BLUEDART-8492019482 assigned.',
          },
          {
            title: 'Arrived at Mumbai Central Gateway',
            location: 'Vile Parle Sorting Facility, Mumbai',
            timestamp: 'Nov 19, 2026 — 21:40 IST',
            status: 'COMPLETED',
          },
          {
            title: 'Out for Doorstep Delivery',
            location: 'South Mumbai Delivery Hub',
            timestamp: 'Nov 20, 2026 — 09:30 IST',
            status: 'COMPLETED',
          },
          {
            title: 'Delivered to Recipient (Signed by Elena Vance)',
            location: 'Altamount Road, Mumbai',
            timestamp: 'Nov 20, 2026 — 14:15 IST',
            status: 'COMPLETED',
            note: 'Parcel verified in pristine archival packaging.',
          },
        ],
      },
      {
        id: 'ord_vip_elena_002',
        orderNumber: 'ORD-2026-8104',
        invoiceNumber: 'OUT/26-27/0019',
        createdAt: '2026-10-14T09:15:00.000Z',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
        carrier: 'Delhivery Surface Express',
        trackingNumber: 'DELHIVERY-9920184471',
        estimatedDelivery: '2026-10-17T18:00:00.000Z',
        shippingAddress: {
          id: 'addr_elena_1',
          label: 'Primary Residence (Studio)',
          recipientName: 'Elena Vance',
          phone: '+91 98201 44521',
          streetAddress: 'Penthouse 14B, Altamount Heights, Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          stateCode: '27',
          pincode: '400026',
          country: 'India',
          isDefault: true,
          type: 'SHIPPING',
        },
        paymentMethod: {
          type: 'UPI',
          description: 'UPI / Google Pay (elena.vance@okhdfcbank)',
        },
        items: [
          {
            dropId: 'drop_003',
            title: 'DROP 003 // MONOLITH OBSIDIAN',
            fit: 'WOMEN',
            size: 'S',
            quantity: 1,
            unitPricePaise: 260000,
            image: '/images/drops/drop-003-front.jpg',
            sku: 'OUT-003-W-S',
          },
        ],
        subtotalPaise: 260000,
        taxableAmountPaise: 220339,
        cgstPaise: 0,
        sgstPaise: 0,
        igstPaise: 39661,
        totalTaxPaise: 39661,
        totalAmountPaise: 260000,
        trackingTimeline: [
          {
            title: 'Order Verified',
            location: 'Ahmedabad Studio',
            timestamp: 'Oct 14, 2026 — 09:15 IST',
            status: 'COMPLETED',
          },
          {
            title: 'Dispatched via Delhivery Express',
            location: 'Ahmedabad Hub',
            timestamp: 'Oct 15, 2026 — 11:00 IST',
            status: 'COMPLETED',
          },
          {
            title: 'Delivered',
            location: 'Mumbai',
            timestamp: 'Oct 17, 2026 — 16:20 IST',
            status: 'COMPLETED',
          },
        ],
      },
    ],
    tickets: [
      {
        id: 'tkt_elena_001',
        ticketNumber: 'TKT-26-8941',
        subject: 'Inquiry regarding DROP 002 Botanical Architecture launch preview',
        category: 'VIP_CONCIERGE',
        status: 'RESOLVED',
        priority: 'VIP_PRIORITY',
        createdAt: '2026-11-20T10:15:00.000Z',
        updatedAt: '2026-11-20T11:45:00.000Z',
        messages: [
          {
            id: 'msg_1',
            sender: 'CUSTOMER',
            senderName: 'Elena Vance',
            text: 'Hello Outside Studio team. As a Gold Tier collector, could you let me know if DROP 002 Sage Terry will feature the same proportioned shoulder width as DROP 001?',
            timestamp: 'Nov 20, 2026 — 10:15 IST',
          },
          {
            id: 'msg_2',
            sender: 'CONCIERGE',
            senderName: 'Kavita Patel (Studio Atelier Concierge)',
            text: 'Dear Elena, thank you for your continued patronship. Yes, DROP 002 uses our identical Women-First Boxy architectural block with the exact same 280 GSM combed organic terry yarn. We have pre-flagged your size Medium so you receive guaranteed 15-minute early reservation.',
            timestamp: 'Nov 20, 2026 — 11:45 IST',
          },
        ],
      },
    ],
    preferences: {
      emailOrderUpdates: true,
      smsDropAlerts: true,
      earlyAccessAlerts: true,
      preferredFit: 'WOMEN',
      preferredSize: 'M',
      favoriteFabric: '280 GSM Organic French Terry',
      styleAesthetic: 'ARCHITECTURAL',
    },
    createdAt: '2025-08-14T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vip_aarav_mehta',
    email: 'aarav.mehta@outside.in',
    name: 'Aarav Mehta',
    phone: '+91 97123 55890',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'CUSTOMER',
    isActive: true,
    twoFactorEnabled: false,
    vipTier: 'SILVER',
    loyaltyPoints: 1200,
    tierSpendTotalPaise: 480000, // ₹4,800
    memberSince: '2026-02-10T11:20:00.000Z',
    perks: [
      'Early Entry Drop Alerts (10 Minutes Early)',
      'Free Express Shipping Across India',
      'Priority Size Exchange Window',
    ],
    wishlist: ['drop_001'],
    cart: [],
    addresses: [
      {
        id: 'addr_aarav_1',
        label: 'Residence (Ahmedabad)',
        recipientName: 'Aarav Mehta',
        phone: '+91 97123 55890',
        streetAddress: 'Apartment 702, Shivalik Harmony, Bodakdev',
        city: 'Ahmedabad',
        state: 'Gujarat',
        stateCode: '24',
        pincode: '380054',
        country: 'India',
        isDefault: true,
        type: 'SHIPPING',
      },
    ],
    paymentMethods: [
      {
        id: 'pm_aarav_upi_1',
        type: 'UPI',
        brand: 'BHIM UPI / PayTM',
        last4OrVpa: 'aaravmehta@paytm',
        holderName: 'Aarav Mehta',
        isDefault: true,
      },
    ],
    orders: [
      {
        id: 'ord_vip_aarav_001',
        orderNumber: 'ORD-2026-7840',
        invoiceNumber: 'OUT/26-27/0038',
        createdAt: '2026-11-12T16:45:00.000Z',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
        carrier: 'Bluedart Local Direct',
        trackingNumber: 'BLUEDART-7728190391',
        estimatedDelivery: '2026-11-13T14:00:00.000Z',
        shippingAddress: {
          id: 'addr_aarav_1',
          label: 'Residence (Ahmedabad)',
          recipientName: 'Aarav Mehta',
          phone: '+91 97123 55890',
          streetAddress: 'Apartment 702, Shivalik Harmony, Bodakdev',
          city: 'Ahmedabad',
          state: 'Gujarat',
          stateCode: '24',
          pincode: '380054',
          country: 'India',
          isDefault: true,
          type: 'SHIPPING',
        },
        paymentMethod: {
          type: 'UPI',
          description: 'UPI (aaravmehta@paytm)',
        },
        items: [
          {
            dropId: 'drop_001',
            title: 'DROP 001 // BETTER DAYS AHEAD',
            fit: 'MEN',
            size: 'L',
            quantity: 1,
            unitPricePaise: 240000,
            image: '/images/drops/drop-001-front.jpg',
            sku: 'OUT-001-M-L',
          },
        ],
        subtotalPaise: 240000,
        taxableAmountPaise: 228571,
        cgstPaise: 5714,
        sgstPaise: 5714,
        igstPaise: 0,
        totalTaxPaise: 11428,
        totalAmountPaise: 240000,
        trackingTimeline: [
          {
            title: 'Order Verified',
            location: 'Ahmedabad Studio',
            timestamp: 'Nov 12, 2026 — 16:45 IST',
            status: 'COMPLETED',
          },
          {
            title: 'Delivered (Hand-Delivered)',
            location: 'Bodakdev, Ahmedabad',
            timestamp: 'Nov 13, 2026 — 13:10 IST',
            status: 'COMPLETED',
          },
        ],
      },
    ],
    tickets: [],
    preferences: {
      emailOrderUpdates: true,
      smsDropAlerts: false,
      earlyAccessAlerts: true,
      preferredFit: 'MEN',
      preferredSize: 'L',
      favoriteFabric: '280 GSM Heavy French Terry',
      styleAesthetic: 'MINIMAL_OBSIDIAN',
    },
    createdAt: '2026-02-10T11:20:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

// In-memory cache with file persistence
let vipStoreCache: VipUser[] | null = null;

export function getAllVipUsers(): VipUser[] {
  if (vipStoreCache) return vipStoreCache;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(VIP_STORE_PATH)) {
      fs.writeFileSync(VIP_STORE_PATH, JSON.stringify(INITIAL_VIP_USERS, null, 2));
      vipStoreCache = INITIAL_VIP_USERS;
      return vipStoreCache;
    }
    const raw = fs.readFileSync(VIP_STORE_PATH, 'utf-8');
    vipStoreCache = JSON.parse(raw);
    return vipStoreCache || INITIAL_VIP_USERS;
  } catch (error) {
    console.warn('[vip-store] Reading vip-users.json failed, falling back to initial data:', error);
    vipStoreCache = INITIAL_VIP_USERS;
    return vipStoreCache;
  }
}

export function saveAllVipUsers(users: VipUser[]) {
  vipStoreCache = users;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VIP_STORE_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.warn('[vip-store] Failed to write vip-users.json:', error);
  }
}

// User Lookups & Auth
export function findVipUserByEmail(email: string): VipUser | null {
  const users = getAllVipUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function findVipUserById(id: string): VipUser | null {
  const users = getAllVipUsers();
  return users.find((u) => u.id === id) || null;
}

export async function createVipUser(params: {
  name: string;
  email: string;
  phone: string;
  passwordPlain: string;
  preferredFit?: 'WOMEN' | 'MEN' | 'UNISEX';
  preferredSize?: string;
}): Promise<VipUser> {
  const users = getAllVipUsers();
  const existing = users.find((u) => u.email.toLowerCase() === params.email.toLowerCase().trim());
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(params.passwordPlain, salt);

  const newUser: VipUser = {
    id: `vip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: params.email.toLowerCase().trim(),
    name: params.name.trim(),
    phone: params.phone.trim(),
    passwordHash,
    role: 'CUSTOMER',
    isActive: true,
    twoFactorEnabled: false,
    vipTier: 'BRONZE',
    loyaltyPoints: 100, // 100 welcome bonus points
    tierSpendTotalPaise: 0,
    memberSince: new Date().toISOString(),
    perks: [
      'Welcome Tier Status (100 Bonus Archive Points)',
      'Single-Drop Release Announcements',
      'Free Domestic Express Shipping',
    ],
    wishlist: [],
    cart: [],
    addresses: [],
    paymentMethods: [],
    orders: [],
    tickets: [],
    preferences: {
      emailOrderUpdates: true,
      smsDropAlerts: true,
      earlyAccessAlerts: true,
      preferredFit: params.preferredFit || 'WOMEN',
      preferredSize: params.preferredSize || 'M',
      favoriteFabric: '280 GSM Combed French Terry',
      styleAesthetic: 'ARCHITECTURAL',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllVipUsers(users);
  return newUser;
}

export function updateVipUser(userId: string, updater: (user: VipUser) => VipUser): VipUser {
  const users = getAllVipUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('VIP User not found');
  }

  const updated = updater({ ...users[index] });
  updated.updatedAt = new Date().toISOString();
  users[index] = updated;
  saveAllVipUsers(users);
  return updated;
}

// User-Sanitized Profile (Safe for Client)
export function sanitizeVipUser(user: VipUser) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
