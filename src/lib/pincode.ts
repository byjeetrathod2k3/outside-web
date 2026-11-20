/**
 * OUTSIDE Apparel Studio — Indian Pincode Express Delivery Estimator
 * Origin: Ahmedabad, Gujarat (State Code 24, Pincode 380015)
 * Logistics Partners: Bluedart Air Express / Delhivery Express
 */

export interface DeliveryEstimateResult {
  valid: boolean;
  pincode: string;
  city?: string;
  state?: string;
  stateCode?: string;
  estimatedDeliveryDate?: string;
  transitDaysMin?: number;
  transitDaysMax?: number;
  courierPartner: string;
  dispatchNote: string;
  isExpressFree: boolean;
  error?: string;
}

const PINCODE_ZONES: Record<string, { city: string; state: string; stateCode: string; daysMin: number; daysMax: number }> = {
  // Gujarat (Origin)
  '38': { city: 'Ahmedabad / Gandhinagar', state: 'Gujarat', stateCode: '24', daysMin: 1, daysMax: 2 },
  '39': { city: 'Surat / Vadodara', state: 'Gujarat', stateCode: '24', daysMin: 1, daysMax: 2 },
  '36': { city: 'Rajkot / Saurashtra', state: 'Gujarat', stateCode: '24', daysMin: 1, daysMax: 2 },
  '37': { city: 'Kutch / Bhuj', state: 'Gujarat', stateCode: '24', daysMin: 2, daysMax: 3 },

  // Maharashtra
  '40': { city: 'Mumbai Metro', state: 'Maharashtra', stateCode: '27', daysMin: 1, daysMax: 2 },
  '41': { city: 'Pune / Western Maharashtra', state: 'Maharashtra', stateCode: '27', daysMin: 2, daysMax: 3 },
  '42': { city: 'Nashik / Thane', state: 'Maharashtra', stateCode: '27', daysMin: 2, daysMax: 3 },
  '44': { city: 'Nagpur / Vidarbha', state: 'Maharashtra', stateCode: '27', daysMin: 2, daysMax: 3 },

  // Delhi NCR
  '11': { city: 'Delhi NCT', state: 'Delhi', stateCode: '07', daysMin: 2, daysMax: 3 },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', stateCode: '06', daysMin: 2, daysMax: 3 },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', stateCode: '09', daysMin: 2, daysMax: 3 },

  // Karnataka & South
  '56': { city: 'Bengaluru Urban', state: 'Karnataka', stateCode: '29', daysMin: 2, daysMax: 3 },
  '57': { city: 'Mysuru / Mangaluru', state: 'Karnataka', stateCode: '29', daysMin: 3, daysMax: 4 },
  '50': { city: 'Hyderabad Metro', state: 'Telangana', stateCode: '36', daysMin: 2, daysMax: 3 },
  '60': { city: 'Chennai Metro', state: 'Tamil Nadu', stateCode: '33', daysMin: 2, daysMax: 3 },
  '68': { city: 'Kochi / Ernakulam', state: 'Kerala', stateCode: '32', daysMin: 3, daysMax: 4 },

  // West Bengal & East
  '70': { city: 'Kolkata Metro', state: 'West Bengal', stateCode: '19', daysMin: 2, daysMax: 4 },
  '75': { city: 'Bhubaneswar', state: 'Odisha', stateCode: '21', daysMin: 3, daysMax: 4 },

  // Rajasthan
  '30': { city: 'Jaipur Metro', state: 'Rajasthan', stateCode: '08', daysMin: 2, daysMax: 3 },
  '34': { city: 'Jodhpur', state: 'Rajasthan', stateCode: '08', daysMin: 2, daysMax: 3 },

  // Punjab / Chandigarh
  '14': { city: 'Ludhiana / Jalandhar', state: 'Punjab', stateCode: '03', daysMin: 2, daysMax: 3 },
  '16': { city: 'Chandigarh Tricity', state: 'Chandigarh', stateCode: '04', daysMin: 2, daysMax: 3 },
};

/**
 * Format a delivery target date by adding transit business days
 */
function getTargetDateString(daysToAdd: number): string {
  const date = new Date();
  let added = 0;

  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    // Skip Sunday
    if (day !== 0) {
      added++;
    }
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-IN', options);
}

/**
 * Evaluates Indian Postal Pincode for express delivery estimation
 */
export function estimateDelivery(pincode: string): DeliveryEstimateResult {
  const clean = pincode.replace(/\D/g, '').trim();

  if (clean.length !== 6) {
    return {
      valid: false,
      pincode: clean,
      courierPartner: 'Bluedart Air / Delhivery Express',
      dispatchNote: 'Enter valid 6-digit Indian Pincode',
      isExpressFree: true,
      error: 'Please enter a valid 6-digit PIN code.',
    };
  }

  // First 2 digits determine zone
  const prefix = clean.slice(0, 2);
  const zone = PINCODE_ZONES[prefix] || {
    city: 'Rest of India',
    state: 'India',
    stateCode: '24', // Fallback
    daysMin: 3,
    daysMax: 5,
  };

  const deliveryDate = getTargetDateString(zone.daysMax);

  return {
    valid: true,
    pincode: clean,
    city: zone.city,
    state: zone.state,
    stateCode: zone.stateCode,
    estimatedDeliveryDate: deliveryDate,
    transitDaysMin: zone.daysMin,
    transitDaysMax: zone.daysMax,
    courierPartner: 'Bluedart Air Express (Dispatched in 24h)',
    dispatchNote: `Dispatches directly from our Ahmedabad Studio within 24 hours.`,
    isExpressFree: true,
  };
}
