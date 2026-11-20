/**
 * OUTSIDE — India Apparel GST Compliance Engine
 * Origin State: Gujarat (Code: 24)
 * HSN: 6109 (61091000 for 100% Cotton Knitted T-Shirts)
 * Value Slabs:
 *   - <= Rs. 2,500 / piece => 5% GST
 *   - > Rs. 2,500 / piece  => 18% GST
 * Intra-State (Gujarat -> Gujarat): CGST (50%) + SGST (50%)
 * Inter-State (Gujarat -> Other):   IGST (100%)
 */

export interface GstSettings {
  isEnabled: boolean;
  sellerLegalName: string;
  gstin: string;
  originStateCode: string; // e.g. "24"
  originStateName: string;
  registeredAddress: string;
  pricingMode: 'TAX_INCLUSIVE' | 'TAX_EXCLUSIVE';
  thresholdInr: number;    // default: 2500
  lowSlabRate: number;     // default: 5.00
  highSlabRate: number;    // default: 18.00
  defaultHsn: string;      // default: "61091000"
  invoicePrefix: string;   // default: "OUT/26-27/"
  invoiceCounter?: number; // default: 1
}

export const DEFAULT_GST_SETTINGS: GstSettings = {
  isEnabled: true,
  sellerLegalName: 'OUTSIDE APPAREL STUDIO PVT LTD',
  gstin: '24AABCO1234F1Z5',
  originStateCode: '24',
  originStateName: 'Gujarat',
  registeredAddress: 'Plot 104, Design District, SG Highway, Ahmedabad, Gujarat 380015',
  pricingMode: 'TAX_INCLUSIVE',
  thresholdInr: 2500,
  lowSlabRate: 5.0,
  highSlabRate: 18.0,
  defaultHsn: '61091000',
  invoicePrefix: 'OUT/26-27/',
  invoiceCounter: 1,
};

export interface IndianState {
  code: string;
  name: string;
}

export const INDIAN_STATES: IndianState[] = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh (New)' },
  { code: '38', name: 'Ladakh' },
];

export interface CartItemInput {
  title: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  unitPricePaise: number; // in paise (e.g. 240000 = Rs. 2400)
  quantity: number;
  hsnCode?: string;
}

export interface TaxCalculatedItem {
  title: string;
  fit: 'WOMEN' | 'MEN' | 'UNISEX';
  size: string;
  quantity: number;
  unitPricePaise: number;
  grossAmountPaise: number;
  taxableAmountPaise: number;
  hsnCode: string;
  gstRate: number; // e.g. 5 or 18
  isInterState: boolean;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmountPaise: number;
  sgstAmountPaise: number;
  igstAmountPaise: number;
  totalTaxPaise: number;
}

export interface OrderTaxBreakdown {
  pricingMode: 'TAX_INCLUSIVE' | 'TAX_EXCLUSIVE';
  buyerStateCode: string;
  buyerStateName: string;
  isInterState: boolean;
  items: TaxCalculatedItem[];
  subtotalGrossPaise: number;
  totalTaxableAmountPaise: number;
  totalCgstPaise: number;
  totalSgstPaise: number;
  totalIgstPaise: number;
  totalTaxPaise: number;
  finalPayablePaise: number;
}

/**
 * Calculates itemized GST for apparel orders according to Indian tax regulations.
 * Evaluates slab strictly PER PIECE (threshold Rs. 2,500).
 */
export function calculateOrderGst(
  items: CartItemInput[],
  buyerStateCode: string,
  settings: GstSettings = DEFAULT_GST_SETTINGS
): OrderTaxBreakdown {
  const isInterState = buyerStateCode !== settings.originStateCode;
  const buyerState = INDIAN_STATES.find((s) => s.code === buyerStateCode) || {
    code: buyerStateCode,
    name: 'Other State',
  };

  const calculatedItems: TaxCalculatedItem[] = items.map((item) => {
    const hsnCode = item.hsnCode || settings.defaultHsn;
    const unitPriceInr = item.unitPricePaise / 100;
    
    // Evaluate per-piece tax rate based on threshold
    const applicableGstRate =
      unitPriceInr <= settings.thresholdInr ? settings.lowSlabRate : settings.highSlabRate;

    const quantity = item.quantity;
    let unitTaxablePaise: number;
    let unitTaxPaise: number;
    let grossItemPaise: number;

    if (settings.pricingMode === 'TAX_INCLUSIVE') {
      // MRP includes GST: Taxable = Gross / (1 + Rate / 100)
      grossItemPaise = item.unitPricePaise * quantity;
      const rateMultiplier = 1 + applicableGstRate / 100;
      unitTaxablePaise = Math.round(item.unitPricePaise / rateMultiplier);
      const totalTaxable = Math.round(grossItemPaise / rateMultiplier);
      const totalTax = grossItemPaise - totalTaxable;

      let cgstRate = 0;
      let sgstRate = 0;
      let igstRate = 0;
      let cgstPaise = 0;
      let sgstPaise = 0;
      let igstPaise = 0;

      if (!settings.isEnabled) {
        return {
          title: item.title,
          fit: item.fit,
          size: item.size,
          quantity,
          unitPricePaise: item.unitPricePaise,
          grossAmountPaise: grossItemPaise,
          taxableAmountPaise: grossItemPaise,
          hsnCode,
          gstRate: 0,
          isInterState,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
          cgstAmountPaise: 0,
          sgstAmountPaise: 0,
          igstAmountPaise: 0,
          totalTaxPaise: 0,
        };
      }

      if (isInterState) {
        igstRate = applicableGstRate;
        igstPaise = totalTax;
      } else {
        cgstRate = applicableGstRate / 2;
        sgstRate = applicableGstRate / 2;
        cgstPaise = Math.floor(totalTax / 2);
        sgstPaise = totalTax - cgstPaise; // avoid rounding truncation
      }

      return {
        title: item.title,
        fit: item.fit,
        size: item.size,
        quantity,
        unitPricePaise: item.unitPricePaise,
        grossAmountPaise: grossItemPaise,
        taxableAmountPaise: totalTaxable,
        hsnCode,
        gstRate: applicableGstRate,
        isInterState,
        cgstRate,
        sgstRate,
        igstRate,
        cgstAmountPaise: cgstPaise,
        sgstAmountPaise: sgstPaise,
        igstAmountPaise: igstPaise,
        totalTaxPaise: totalTax,
      };
    } else {
      // TAX_EXCLUSIVE: Tax is added on top of unitPrice
      const totalTaxable = item.unitPricePaise * quantity;
      const totalTax = Math.round((totalTaxable * applicableGstRate) / 100);
      grossItemPaise = totalTaxable + totalTax;

      let cgstRate = 0;
      let sgstRate = 0;
      let igstRate = 0;
      let cgstPaise = 0;
      let sgstPaise = 0;
      let igstPaise = 0;

      if (!settings.isEnabled) {
        return {
          title: item.title,
          fit: item.fit,
          size: item.size,
          quantity,
          unitPricePaise: item.unitPricePaise,
          grossAmountPaise: totalTaxable,
          taxableAmountPaise: totalTaxable,
          hsnCode,
          gstRate: 0,
          isInterState,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
          cgstAmountPaise: 0,
          sgstAmountPaise: 0,
          igstAmountPaise: 0,
          totalTaxPaise: 0,
        };
      }

      if (isInterState) {
        igstRate = applicableGstRate;
        igstPaise = totalTax;
      } else {
        cgstRate = applicableGstRate / 2;
        sgstRate = applicableGstRate / 2;
        cgstPaise = Math.floor(totalTax / 2);
        sgstPaise = totalTax - cgstPaise;
      }

      return {
        title: item.title,
        fit: item.fit,
        size: item.size,
        quantity,
        unitPricePaise: item.unitPricePaise,
        grossAmountPaise: grossItemPaise,
        taxableAmountPaise: totalTaxable,
        hsnCode,
        gstRate: applicableGstRate,
        isInterState,
        cgstRate,
        sgstRate,
        igstRate,
        cgstAmountPaise: cgstPaise,
        sgstAmountPaise: sgstPaise,
        igstAmountPaise: igstPaise,
        totalTaxPaise: totalTax,
      };
    }
  });

  const subtotalGrossPaise = calculatedItems.reduce((acc, it) => acc + it.grossAmountPaise, 0);
  const totalTaxableAmountPaise = calculatedItems.reduce((acc, it) => acc + it.taxableAmountPaise, 0);
  const totalCgstPaise = calculatedItems.reduce((acc, it) => acc + it.cgstAmountPaise, 0);
  const totalSgstPaise = calculatedItems.reduce((acc, it) => acc + it.sgstAmountPaise, 0);
  const totalIgstPaise = calculatedItems.reduce((acc, it) => acc + it.igstAmountPaise, 0);
  const totalTaxPaise = totalCgstPaise + totalSgstPaise + totalIgstPaise;

  const finalPayablePaise =
    settings.pricingMode === 'TAX_INCLUSIVE'
      ? subtotalGrossPaise
      : totalTaxableAmountPaise + totalTaxPaise;

  return {
    pricingMode: settings.pricingMode,
    buyerStateCode,
    buyerStateName: buyerState.name,
    isInterState,
    items: calculatedItems,
    subtotalGrossPaise,
    totalTaxableAmountPaise,
    totalCgstPaise,
    totalSgstPaise,
    totalIgstPaise,
    totalTaxPaise,
    finalPayablePaise,
  };
}

/**
 * Validates Gujarat GSTIN format
 * Format: 24 followed by 5 letters (PAN), 4 digits, 1 letter, 1 entity code, Z, 1 checksum
 */
export function validateGujaratGstin(gstin: string): boolean {
  const gstinRegex = /^24[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim());
}

/**
 * Formats sequential invoice number: e.g. OUT/26-27/0001
 */
export function generateInvoiceNumber(prefix: string, counter: number): string {
  const padded = String(counter).padStart(4, '0');
  return `${prefix}${padded}`;
}

/**
 * Generates GSTR-1 HSN summary CSV string from a collection of order items
 */
export function generateGstr1Csv(
  items: Array<{
    hsnCode: string;
    description: string;
    quantity: number;
    taxableAmountPaise: number;
    cgstAmountPaise: number;
    sgstAmountPaise: number;
    igstAmountPaise: number;
    totalTaxPaise: number;
    gstRate: number;
  }>
): string {
  // Aggregate by HSN and GST Rate
  const map = new Map<
    string,
    {
      hsnCode: string;
      description: string;
      uqc: string;
      quantity: number;
      totalValuePaise: number;
      taxableAmountPaise: number;
      igstPaise: number;
      cgstPaise: number;
      sgstPaise: number;
      rate: number;
    }
  >();

  items.forEach((item) => {
    const key = `${item.hsnCode}-${item.gstRate}`;
    const existing = map.get(key) || {
      hsnCode: item.hsnCode,
      description: item.description || 'Cotton Knitted T-Shirts',
      uqc: 'PCS',
      quantity: 0,
      totalValuePaise: 0,
      taxableAmountPaise: 0,
      igstPaise: 0,
      cgstPaise: 0,
      sgstPaise: 0,
      rate: item.gstRate,
    };

    existing.quantity += item.quantity;
    existing.taxableAmountPaise += item.taxableAmountPaise;
    existing.igstPaise += item.igstAmountPaise;
    existing.cgstPaise += item.cgstAmountPaise;
    existing.sgstPaise += item.sgstAmountPaise;
    existing.totalValuePaise += item.taxableAmountPaise + item.totalTaxPaise;

    map.set(key, existing);
  });

  const headers = [
    'HSN',
    'Description',
    'UQC',
    'Total Quantity',
    'Total Value (INR)',
    'Taxable Value (INR)',
    'Integrated Tax (INR)',
    'Central Tax (INR)',
    'State/UT Tax (INR)',
    'Rate (%)',
  ];

  const rows = Array.from(map.values()).map((row) => [
    row.hsnCode,
    `"${row.description}"`,
    row.uqc,
    row.quantity,
    (row.totalValuePaise / 100).toFixed(2),
    (row.taxableAmountPaise / 100).toFixed(2),
    (row.igstPaise / 100).toFixed(2),
    (row.cgstPaise / 100).toFixed(2),
    (row.sgstPaise / 100).toFixed(2),
    `${row.rate}%`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
