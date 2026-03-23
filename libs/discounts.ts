import discountsData from "@/discounts.json";

export interface DiscountTheme {
  label: string;
  badgeColor: string;
  badgeText: string;
  bannerMessage: string;
}

export interface Discount {
  code: string;
  percentOff: number;
  theme: DiscountTheme;
  startDate: string;
  endDate: string;
}

const discounts: Discount[] = discountsData as Discount[];

/**
 * Get all currently active discounts (within date range).
 */
export function getActiveDiscounts(now: Date = new Date()): Discount[] {
  return discounts.filter((d) => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
}

/**
 * Validate a discount code and return the discount if active.
 */
export function validateDiscountCode(
  code: string,
  now: Date = new Date()
): Discount | null {
  const normalized = code.trim().toUpperCase();
  const active = getActiveDiscounts(now);
  return active.find((d) => d.code === normalized) || null;
}

/**
 * Apply a discount to a price.
 */
export function applyDiscount(price: number, discount: Discount): number {
  return Math.round(price * (1 - discount.percentOff / 100));
}

/**
 * Get the best (highest percentOff) active discount.
 */
export function getBestActiveDiscount(now: Date = new Date()): Discount | null {
  const active = getActiveDiscounts(now);
  if (active.length === 0) return null;
  return active.reduce((best, d) =>
    d.percentOff > best.percentOff ? d : best
  );
}
