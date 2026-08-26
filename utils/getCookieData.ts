import Cookies from "./secureCookieHelper";

export type CookiesKey =
  | "priosuite_Ims_prioBankClientToken"
  | "priosuite_Ims_Is_Main_Dash"
  | "priosuite_Ims_orgId"
  | "priosuite_Ims_userName"
  | "priosuite_Ims_userOrgName"
  | "priosuite_Ims_userBranchId"
  | "priosuite_Ims_userBranchName"
  | "priosuite_Ims_userBranchAddress"
  | "priosuite_Ims_userOrgAddress"
  | "priosuite_Ims_userOrgRegistration"
  | "priosuite_Ims_userOrgLogo"
  | "priosuite_Ims_userIsActiveDenomination"
  | "priosuite_Ims_year_id"
  | "priosuite_Ims_is_open"
  | "priosuite_Ims_fin_start_date"
  | "priosuite_Ims_fin_end_date"
  | "priosuite_Ims_is_pass_header"
  | "priosuite_Ims_beg_id"
  | "priosuite_Ims_beg_date";

export const AUTH_COOKIE_KEYS: readonly CookiesKey[] = [
  "priosuite_Ims_prioBankClientToken",
  "priosuite_Ims_Is_Main_Dash",
  "priosuite_Ims_orgId",
  "priosuite_Ims_userName",
  "priosuite_Ims_userOrgName",
  "priosuite_Ims_userBranchId",
  "priosuite_Ims_userBranchName",
  "priosuite_Ims_userBranchAddress",
  "priosuite_Ims_userOrgAddress",
  "priosuite_Ims_userOrgRegistration",
  "priosuite_Ims_userOrgLogo",
  "priosuite_Ims_userIsActiveDenomination",
  "priosuite_Ims_year_id",
  "priosuite_Ims_is_open",
  "priosuite_Ims_fin_start_date",
  "priosuite_Ims_fin_end_date",
  "priosuite_Ims_is_pass_header",
  "priosuite_Ims_beg_id",
  "priosuite_Ims_beg_date",
] as const;

const getCookieData = <T = any>(key: CookiesKey): T | null => {
  const cookieValue = Cookies.get(key);

  if (!cookieValue) return null;

  try {
    return JSON.parse(cookieValue) as T;
  } catch {
    return cookieValue as unknown as T;
  }
};

export default getCookieData;
