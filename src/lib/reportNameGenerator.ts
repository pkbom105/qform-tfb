// =============================================
// Report Name Generator - Synced with SQLite DB
// =============================================
// All order numbers are derived from the database order ID + OFFSET.
// This ensures the same number appears everywhere regardless of browser.

const REPORT_NAME_OFFSET = 59; // orderId=1 -> 1+59=60 -> 0060

/**
 * Generate a full report name using the database order ID.
 * This is the ONLY function that should be used server-side or when orderId is known.
 * 
 * @param orderId - The auto-increment ID from SQLite orders table
 * @param setNumber - Optional set number (1-5) for multi-set orders
 * @returns e.g. "TFB-OrderForm-2606-0084"
 */
export const getReportName = (orderId: number, setNumber?: number): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;

  // Each set increments the running number by 1
  // Set 1 -> orderId + OFFSET, Set 2 -> orderId + OFFSET + 1, etc.
  const baseId = orderId + REPORT_NAME_OFFSET;
  const runningId = setNumber !== undefined && setNumber > 1
    ? baseId + setNumber - 1
    : baseId;
  const runningNumber = String(runningId).padStart(4, "0");
  return `TFB-OrderForm-${yymm}-${runningNumber}`;
};

/**
 * Compact display format (no prefix) for dashboard tables.
 * e.g. "2606-0084"
 */
export const getDisplayReportName = (orderId: number, setNumber?: number): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;
  const baseId = orderId + REPORT_NAME_OFFSET;
  const runningId = setNumber !== undefined && setNumber > 1
    ? baseId + setNumber - 1
    : baseId;
  return `${yymm}-${String(runningId).padStart(4, "0")}`;
};

/**
 * Get just the prefix without the running number.
 * e.g. "TFB-OrderForm-2606"
 */
export const getReportNameWithoutCounter = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;
  return `TFB-OrderForm-${yymm}`;
};

/**
 * Client-side: Fetch the next report name from the server (DB-based).
 * This replaces the old localStorage-based counter.
 * 
 * @returns The next report name based on the highest order ID in SQLite
 */
export const fetchNextReportName = async (): Promise<string> => {
  try {
    const res = await fetch("/api/report-name/next");
    const json = await res.json();
    if (json.success) {
      return json.reportName;
    }
    // Fallback to base prefix if API fails
    return getReportNameWithoutCounter();
  } catch {
    // Fallback to base prefix if network fails
    return getReportNameWithoutCounter();
  }
};