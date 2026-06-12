export const getReportName = (orderId?: number, setNumber?: number): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;

  if (orderId !== undefined) {
    // Each set increments the running number by 1
    // Set 1 -> orderId, Set 2 -> orderId+1, Set 3 -> orderId+2, etc.
    const runningId = setNumber !== undefined && setNumber > 1
      ? orderId + setNumber - 1
      : orderId;
    const runningNumber = String(runningId).padStart(4, "0");
    return `TFB-OrderForm-${yymm}-${runningNumber}`;
  }

  // Fallback
  if (typeof window === "undefined") {
    const runningNumber = String(setNumber || 1).padStart(4, "0");
    return `TFB-OrderForm-${yymm}-${runningNumber}`;
  }

  const storageKey = `tfb-counter-${yymm}`;
  let counter = parseInt(localStorage.getItem(storageKey) || "0", 10) + 1;
  localStorage.setItem(storageKey, String(counter));
  const runningNumber = String(counter).padStart(4, "0");
  return `TFB-OrderForm-${yymm}-${runningNumber}`;
};

export const getReportNameWithoutCounter = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;
  return `TFB-OrderForm-${yymm}`;
};

// Display format: yymm-XXXX (e.g. 2606-0017)
// For order 17 with set 2 -> 2606-0018
export const getDisplayReportName = (orderId: number, setNumber?: number): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${year}${month}`;
  const runningId = setNumber !== undefined && setNumber > 1
    ? orderId + setNumber - 1
    : orderId;
  return `${yymm}-${String(runningId).padStart(4, "0")}`;
};
