export const getReportName = (): string => {
  // Get current date in YYMM format
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month (01-12)
  const yymm = `${year}${month}`;

  // Get running number from localStorage
  const storageKey = `tfb-counter-${yymm}`;
  let counter = parseInt(localStorage.getItem(storageKey) || "0", 10) + 1;
  localStorage.setItem(storageKey, String(counter));

  // Format running number to 4 digits with leading zeros
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
