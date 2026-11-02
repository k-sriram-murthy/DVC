/**
 * Indian currency formatting helpers (₹ with Indian grouping).
 * Authoritative money math stays on the server (Decimal); these are display-only.
 */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const INR_FIXED = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/** Format a number as Indian Rupees, e.g. ₹1,24,500 */
export function formatINR(amount: number | string, opts?: { fixed?: boolean }): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "₹—";
  return (opts?.fixed ? INR_FIXED : INR).format(n);
}

/**
 * Compact Indian amount for dashboard KPIs.
 * e.g. 24800000 → ₹2.48 Cr, 6200000 → ₹62.00 L
 */
export function formatINRCompact(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "₹—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  }
  return formatINR(n);
}
