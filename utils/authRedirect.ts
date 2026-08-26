import Cookies from "./secureCookieHelper";
import getCookieData, { AUTH_COOKIE_KEYS } from "./getCookieData";

export const PORTAL_URL = "https://priosuite.in/";

export const AUTH_TOKEN_KEY = "priosuite_Ims_prioBankClientToken" as const;

export const getAuthToken = (): string | null =>
  getCookieData<string>(AUTH_TOKEN_KEY);

export const clearAuthCookies = () => {
  AUTH_COOKIE_KEYS.forEach((key) => Cookies.remove(key));
};

/**
 * Do not navigate this tab straight to the portal.
 * Close the IMS window first, then open/focus https://priosuite.in/
 */
export const redirectToPortal = () => {
  if (typeof window === "undefined") return;

  // Prefer returning to the opener (portal) that launched IMS
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      try {
        window.opener.location.href = PORTAL_URL;
      } catch {
        // cross-origin opener — focus only
      }
      window.close();
      return;
    }
  } catch {
    // ignore opener access errors
  }

  // No opener: open portal in a new tab, then close this IMS window
  try {
    window.open(PORTAL_URL, "_blank", "noopener,noreferrer");
  } catch {
    // ignore
  }

  window.close();

  // Fallback when browser blocks window.close() (tab not script-opened)
  window.setTimeout(() => {
    try {
      if (!window.closed) {
        window.location.replace(PORTAL_URL);
      }
    } catch {
      window.location.replace(PORTAL_URL);
    }
  }, 150);
};

/** Clear all auth cookies, close IMS window, then open PrioSuite portal. */
export const logoutAndRedirectToPortal = () => {
  clearAuthCookies();
  redirectToPortal();
};
