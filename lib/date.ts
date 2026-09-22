// Parses a `YYYY-MM-DD` string as local midnight instead of UTC midnight,
// so day-range queries aren't shifted by a timezone offset.
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
