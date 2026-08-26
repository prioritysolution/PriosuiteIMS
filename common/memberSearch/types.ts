export interface MemberSearchItem {
  Id: number;
  Cust_No: number;
  CIF_No: string;
  Full_Name: string;
  Relation_Name: string | null;
  Address: string | null;
}

export interface MemberSearchPagination {
  current_page: string | number;
  per_page: number;
  total: number;
  last_page: number;
  data: MemberSearchItem[];
}

export interface MemberSearchResponse {
  message: string;
  data: MemberSearchPagination;
}

export type MemberTypeValue = "1" | "2" | "3" | "4";

export const MEMBER_TYPE_OPTIONS: { label: string; value: MemberTypeValue }[] =
  [
    { label: "Individual Customer", value: "1" },
    { label: "Group", value: "2" },
    { label: "Institution", value: "3" },
    { label: "Staff", value: "4" },
  ];
