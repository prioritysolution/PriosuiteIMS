"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";

/** Query keys that map to auth cookies (portal sends short and/or prefixed names). */
const COOKIE_QUERY_KEYS = new Set([
  "prioBankClientToken",
  "Is_Main_Dash",
  "orgId",
  "userName",
  "userOrgName",
  "userBranchId",
  "userBranchName",
  "userBranchAddress",
  "userOrgAddress",
  "userOrgRegistration",
  "userOrgLogo",
  "userIsActiveDenomination",
  "year_id",
  "is_open",
  "fin_start_date",
  "fin_end_date",
  "is_pass_header",
  "beg_id",
  "beg_date",
]);

export function applyAuthCookiesFromSearchParams(
  searchParams:
    | URLSearchParams
    | { forEach: (cb: (value: string, key: string) => void) => void },
): boolean {
  const entries: Array<{ shortKey: string; value: string; prefixed: boolean }> =
    [];

  searchParams.forEach((value, key) => {
    if (key.startsWith("__next")) return;

    const prefixed = key.startsWith("priosuite_Ims_");
    const shortKey = prefixed ? key.slice("priosuite_Ims_".length) : key;
    if (!COOKIE_QUERY_KEYS.has(shortKey)) return;

    entries.push({ shortKey, value, prefixed });
  });

  // Apply short keys first, then prefixed (prefixed wins when both exist)
  entries.sort((a, b) => Number(a.prefixed) - Number(b.prefixed));

  if (entries.length === 0) return false;

  for (const { shortKey, value } of entries) {
    // Portal values are already AES-encrypted — never Cookies.set() here
    Cookies.setEncrypted(shortKey, value, {
      path: "/",
      sameSite: "Lax",
      expires: 7,
    });
  }

  return true;
}

function CookieSetterInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasCookies = applyAuthCookiesFromSearchParams(searchParams);

    if (hasCookies) {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams]);

  return null;
}

export function CookieSetter() {
  return (
    <Suspense fallback={null}>
      <CookieSetterInner />
    </Suspense>
  );
}
