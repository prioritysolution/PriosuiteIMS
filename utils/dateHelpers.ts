/**
 * Local-date helpers — avoid UTC shifting the calendar day
 * (common in IST and other UTC+ timezones).
 */

/** Build a Date at local noon for Y/M/D (month is 1-based). */
export const localNoon = (
  year: number | string,
  month1Based: number | string,
  day: number | string,
): Date | null => {
  const d = new Date(
    Number(year),
    Number(month1Based) - 1,
    Number(day),
    12,
    0,
    0,
    0,
  );
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Force any Date to local noon using the user's local calendar day. */
export const normalizeLocalNoon = (value: Date): Date | null => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return localNoon(value.getFullYear(), value.getMonth() + 1, value.getDate());
};

/**
 * Parse Date / timestamp / dd-MM-yyyy / yyyy-MM-dd / ISO into local-noon Date.
 */
export const parseLocalDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return normalizeLocalNoon(value);
  if (typeof value === "number" && Number.isFinite(value)) {
    return normalizeLocalNoon(new Date(value));
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // Date-only yyyy-MM-dd — NEVER use new Date("yyyy-MM-dd") (UTC)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-");
    return localNoon(y, m, d);
  }

  // Full ISO datetime — use local calendar day of that instant
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    return normalizeLocalNoon(new Date(raw));
  }

  // dd-MM-yyyy or dd/MM/yyyy
  const dmy = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) return localNoon(dmy[3], dmy[2], dmy[1]);

  return normalizeLocalNoon(new Date(raw));
};

/** API payload: yyyy-MM-dd from LOCAL calendar parts */
export const formatDateForApi = (value: unknown): string => {
  const d = parseLocalDate(value);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** UI display: dd-MM-yyyy */
export const formatDateForDisplay = (value: unknown): string => {
  const d = parseLocalDate(value);
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${day}-${m}-${y}`;
};

/** Today as local-noon Date */
export const todayLocalNoon = (): Date => {
  const now = new Date();
  return localNoon(now.getFullYear(), now.getMonth() + 1, now.getDate())!;
};
