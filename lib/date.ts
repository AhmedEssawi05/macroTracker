// Parses a `YYYY-MM-DD` string as local midnight instead of UTC midnight,
// so day-range queries aren't shifted by a timezone offset.
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Inverse of parseLocalDate: formats a Date as `YYYY-MM-DD` in local time.
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Accepts only well-formed `YYYY-MM-DD` values that round-trip to the same
// calendar day (rejects e.g. 2026-02-31), falling back to today.
export function parseLocalDateOrToday(dateStr: string | undefined): Date {
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = parseLocalDate(dateStr);
    if (formatLocalDate(date) === dateStr) return date;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
