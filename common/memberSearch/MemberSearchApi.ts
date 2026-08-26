import api from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import type {
  MemberSearchItem,
  MemberSearchPagination,
  MemberSearchResponse,
} from "./types";

const emptyPage = (page: number): MemberSearchPagination => ({
  current_page: page,
  per_page: 10,
  total: 0,
  last_page: 1,
  data: [],
});

function normalizeMemberList(raw: unknown): MemberSearchItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean) as MemberSearchItem[];
}

function parseMemberSearchPayload(
  response: unknown,
  page: number,
): MemberSearchPagination {
  if (!response || typeof response !== "object") {
    return emptyPage(page);
  }

  const payload = response as Record<string, any>;

  // Shape: { message, data: { current_page, data: [...] } }
  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    const pageData = payload.data as MemberSearchPagination & {
      data?: unknown;
    };
    return {
      current_page: pageData.current_page ?? page,
      per_page: pageData.per_page ?? 10,
      total: pageData.total ?? 0,
      last_page: pageData.last_page ?? 1,
      data: normalizeMemberList(pageData.data),
    };
  }

  // Shape: { current_page, data: [...] }
  if (
    Array.isArray(payload.data) &&
    ("current_page" in payload || "last_page" in payload)
  ) {
    return {
      current_page: payload.current_page ?? page,
      per_page: payload.per_page ?? 10,
      total: payload.total ?? 0,
      last_page: payload.last_page ?? 1,
      data: normalizeMemberList(payload.data),
    };
  }

  // Shape: direct array
  if (Array.isArray(payload)) {
    return {
      ...emptyPage(page),
      total: payload.length,
      data: normalizeMemberList(payload),
    };
  }

  return emptyPage(page);
}

function buildMemberSearchUrl(
  orgId: string,
  page: number,
  name: string,
  type: string,
) {
  if (typeof endPoints?.getMemberDataByName === "function") {
    return endPoints.getMemberDataByName(orgId, page, name, type);
  }

  const base = process.env.NEXT_PUBLIC_BASE_API_URL;
  return `${base}/api/Org/MemberShip/MemberSearch?org_id=${orgId}&page=${page}&keyword=${encodeURIComponent(name)}&type=${type}`;
}

function buildMemberByIdUrl(orgId: string, memberNo: string) {
  if (typeof endPoints?.getMemberDataById === "function") {
    return endPoints.getMemberDataById(orgId, memberNo);
  }

  const base = process.env.NEXT_PUBLIC_BASE_API_URL;
  return `${base}/api/Org/MemberShip/GetMemberData?org_id=${orgId}&mem_no=${encodeURIComponent(memberNo)}`;
}

export async function fetchMembersByName(
  orgId: string,
  page: number,
  name: string,
  type: string,
): Promise<MemberSearchPagination> {
  const response = (await api.get(
    buildMemberSearchUrl(orgId, page, name, type),
  )) as MemberSearchResponse | MemberSearchPagination | null;

  return parseMemberSearchPayload(response, page);
}

export async function fetchMemberById(
  orgId: string,
  memberNo: string,
): Promise<Record<string, any> | null> {
  const response = await api.get(buildMemberByIdUrl(orgId, memberNo));

  if (!response || typeof response !== "object") return null;

  const payload = response as Record<string, any>;

  // Shape: { message, details: [ { Address, Cust_Mob, ... } ] }
  if (Array.isArray(payload.details) && payload.details.length > 0) {
    return payload.details[0] ?? null;
  }

  // Shape: { data: { ... } } or { data: [ { ... } ] }
  if ("data" in payload) {
    if (Array.isArray(payload.data) && payload.data.length > 0) {
      return payload.data[0] ?? null;
    }
    if (payload.data && typeof payload.data === "object") {
      return payload.data as Record<string, any>;
    }
  }

  return payload as Record<string, any>;
}

export type { MemberSearchItem };
