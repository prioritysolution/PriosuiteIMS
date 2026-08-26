import CookiesJS from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_COOKIE_SECRET_KEY ||
  "default-cookie-secret-key-prio-bank";

export const COOKIE_PREFIX = "priosuite_Ims_";

export const toStorageCookieKey = (key: string): string =>
  key.startsWith(COOKIE_PREFIX) ? key : `${COOKIE_PREFIX}${key}`;

const isCryptoJSCipher = (value: string): boolean =>
  typeof value === "string" && value.startsWith("U2FsdGVk");

const isSecureContext = () => {
  if (typeof window === "undefined") return true;
  return window.location.protocol === "https:";
};

const encryptVal = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  const stringVal =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return CryptoJS.AES.encrypt(stringVal, SECRET_KEY).toString();
};

/** Single AES decrypt pass. Returns null if not valid UTF-8 plaintext. */
const decryptOnce = (cipherText: string): string | null => {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return decrypted;
  } catch {
    return null;
  }
};

/**
 * Decrypt cookie payload.
 * - Plain values returned as-is
 * - Decrypts up to 3 times if still CryptoJS ciphertext (handles double-encrypt)
 */
const decryptVal = (raw: string): string | null => {
  if (!raw) return null;

  // Not encrypted — return plain
  if (!isCryptoJSCipher(raw)) return raw;

  let current = raw;
  for (let i = 0; i < 3; i++) {
    const next = decryptOnce(current);
    if (next === null) {
      // First decrypt failed on ciphertext → bad key / corrupt
      return i === 0 ? null : current;
    }
    current = next;
    if (!isCryptoJSCipher(current)) return current;
  }
  return current;
};

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "Lax" | "None" | "Strict" | "lax" | "none";
}

const defaultOptions = (options: CookieOptions = {}): CookieOptions => {
  const merged: any = {
    sameSite: "Lax",
    path: "/",
    ...options,
  };

  merged.secure =
    options.secure !== undefined ? options.secure : isSecureContext();

  if (merged.sameSite) {
    const ss = String(merged.sameSite).toLowerCase();
    merged.sameSite = (ss.charAt(0).toUpperCase() + ss.slice(1)) as
      | "Strict"
      | "Lax"
      | "None";
  }

  return merged;
};

const Cookies = {
  /** Encrypt then store (for app-written plain values). */
  set: (key: string, value: unknown, options: CookieOptions = {}) => {
    const storageKey = toStorageCookieKey(key);
    CookiesJS.set(storageKey, encryptVal(value), defaultOptions(options));
  },

  /**
   * Store an already-encrypted portal value as-is (do not encrypt again).
   */
  setEncrypted: (
    key: string,
    encryptedValue: string,
    options: CookieOptions = {},
  ) => {
    const storageKey = toStorageCookieKey(key);
    if (!encryptedValue) return;

    // Normalize URI encoding (+ / =) from query strings
    let value = encryptedValue;
    try {
      if (value.includes("%")) {
        value = decodeURIComponent(value);
      }
    } catch {
      // keep original
    }

    CookiesJS.set(storageKey, value, defaultOptions(options));
  },

  get: (key: string): string | undefined => {
    const storageKey = toStorageCookieKey(key);
    const val = CookiesJS.get(storageKey);
    if (!val) return undefined;

    const decrypted = decryptVal(val);
    if (decrypted === null) {
      CookiesJS.remove(storageKey, { path: "/" });
      return undefined;
    }

    // Still ciphertext after decrypt attempts → treat as unreadable
    if (isCryptoJSCipher(decrypted)) {
      console.warn(
        `[cookies] Value for "${storageKey}" is still encrypted after decrypt. Check NEXT_PUBLIC_COOKIE_SECRET_KEY.`,
      );
      return undefined;
    }

    return decrypted;
  },

  remove: (key: string, options: CookieOptions = {}) => {
    const storageKey = toStorageCookieKey(key);
    CookiesJS.remove(storageKey, { path: "/", ...options });
  },
};

export default Cookies;
