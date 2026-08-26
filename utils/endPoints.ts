const getBaseApi = () => {
  const base = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!base) {
    console.error("[endPoints] NEXT_PUBLIC_BASE_API_URL is not set. Check your .env.local file.");
  }
  return `${base}/api`;
};

export const endPoints = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  get login() { return `${getBaseApi()}/user/login`; },

  // ── Fin Year ──────────────────────────────────────────────────────────────
  get getCheckFinYear() { return `${getBaseApi()}/Org/CheckFinYear`; },
  get getLoginFinYear() { return `${getBaseApi()}/Org/GetLoginFinYear`; },

  // ── Day Begin ─────────────────────────────────────────────────────────────
  getCheckDayBeginStatus: (
    date: string,
    orgId: string,
    yearId: string,
    branchId: string
  ) =>
    `${getBaseApi()}/Org/CheckDayBeginStatus?date=${date}&org_id=${orgId}&year_id=${yearId}&branch_id=${branchId}`,

  // ── Dashboard ─────────────────────────────────────────────────────────────
  get getDashboardMetrics() { return `${getBaseApi()}/dashboard/metrics`; },

  // ── Parties ───────────────────────────────────────────────────────────────
  get getParties() { return `${getBaseApi()}/parties`; },
  get addParty() { return `${getBaseApi()}/parties`; },

  // ── Users ─────────────────────────────────────────────────────────────────
  get getUsers() { return `${getBaseApi()}/users`; },

  // ── Vouchers ──────────────────────────────────────────────────────────────
  get getVouchers() { return `${getBaseApi()}/vouchers`; },
  get addVoucher() { return `${getBaseApi()}/vouchers`; },

  // ── Transactions ──────────────────────────────────────────────────────────
  get getTransactions() { return `${getBaseApi()}/transactions`; },
  get addTransaction() { return `${getBaseApi()}/transactions`; },

  // ── Chalans ───────────────────────────────────────────────────────────────
  get getChalans() { return `${getBaseApi()}/chalans`; },

  // ── Stock ─────────────────────────────────────────────────────────────────
  get getStock() { return `${getBaseApi()}/stock`; },

  // ── Purchases ─────────────────────────────────────────────────────────────
  get getPurchases() { return `${getBaseApi()}/purchases`; },

  // ── Sales ─────────────────────────────────────────────────────────────────
  get getSales() { return `${getBaseApi()}/sales`; },

  // ── Item Rates ────────────────────────────────────────────────────────────
  get getItemRates() { return `${getBaseApi()}/item-rates`; },

  // ── Master Setup ──────────────────────────────────────────────────────────
  get masterSetup() { return `${getBaseApi()}/master-setup`; },

  // ── Unit (Trading) ────────────────────────────────────────────────────────
  get addUnit() { return `${getBaseApi()}/Org/Trading/AddItemUnit`; },
  getUnit: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemUnit?org_id=${orgId}`,
  get updateUnit() { return `${getBaseApi()}/Org/Trading/UpdateItemUnit`; },

  // ── Brand (Trading) ───────────────────────────────────────────────────────
  get addBrand() { return `${getBaseApi()}/Org/Trading/AddItemBrand`; },
  getBrand: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemBrand?org_id=${orgId}`,
  get updateBrand() { return `${getBaseApi()}/Org/Trading/UpdateItemBrand`; },

  // ── Category (Trading) ────────────────────────────────────────────────────
  get addCategory() { return `${getBaseApi()}/Org/Trading/AddItemCategory`; },
  getCategory: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemCategory?org_id=${orgId}`,
  get updateCategory() { return `${getBaseApi()}/Org/Trading/UpdateItemCategory`; },

  // ── Sub Category (Trading) ────────────────────────────────────────────────
  get addSubCategory() { return `${getBaseApi()}/Org/Trading/AddItemSubCategory`; },
  getSubCategory: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemSubCategory?org_id=${orgId}`,
  get updateSubCategory() { return `${getBaseApi()}/Org/Trading/UpdateItemSubCategory`; },
  getItemCatwiseSubCat: (orgId: string, catId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemCatwiseSubCat?org_id=${orgId}&cat_id=${catId}`,

  // ── Item Ledgers (Trading) ────────────────────────────────────────────────
  getItemSaleLedger: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemSaleLedger?org_id=${orgId}`,
  getItemPurchaseLedger: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemPurchaseLedger?org_id=${orgId}`,

  // ── Item (Trading) ────────────────────────────────────────────────────────
  get addItem() { return `${getBaseApi()}/Org/Trading/AddItem`; },
  get updateItem() { return `${getBaseApi()}/Org/Trading/UpdateItem`; },
  getItem: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItem?org_id=${orgId}`,
  getItemwiseUnit: (orgId: string, itemId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemwiseUnit?org_id=${orgId}&item_id=${itemId}`,

  // ── Warehouse (Trading) ───────────────────────────────────────────────────
  get addWarehouse() { return `${getBaseApi()}/Org/Trading/AddItemWhareHouse`; },
  getWarehouse: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemWhareHouse?org_id=${orgId}`,
  get updateWarehouse() { return `${getBaseApi()}/Org/Trading/UpdateItemWhareHouse`; },
  get pushItemOpeningStock() { return `${getBaseApi()}/Org/Trading/PushItemOpeningSTock`; },

  // ── HSN / GST (Trading) ───────────────────────────────────────────────────
  get addItemGSTHSN() { return `${getBaseApi()}/Org/Trading/AddItemGSTHSN`; },
  getItemGSTHSN: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetItemGSTHSN?org_id=${orgId}`,
  get updateItemGSTHSN() { return `${getBaseApi()}/Org/Trading/UpdateItemGSTHSN`; },

  // ── Trading Party ─────────────────────────────────────────────────────────
  getPartyType: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetPartyType?org_id=${orgId}`,
  getTradingParty: (orgId: string) =>
    `${getBaseApi()}/Org/Trading/GetTradingParty?org_id=${orgId}`,
  get addTradingParty() {
    return `${getBaseApi()}/Org/Trading/AddTradingParty`;
  },
  get updateTradingParty() {
    return `${getBaseApi()}/Org/Trading/UpdateTradingParty`;
  },
  getTypewiseParty: (orgId: string, partyType: string | number) =>
    `${getBaseApi()}/Org/Trading/GetTypewiseParty?org_id=${orgId}&party_type=${partyType}`,
  get addChalan() { return `${getBaseApi()}/Org/Trading/AddChalan`; },

  // ── Membership / Member Search ────────────────────────────────────────────
  getMemberDataByName(
    orgId: string,
    page: number,
    name: string,
    type: string,
  ) {
    return `${getBaseApi()}/Org/MemberShip/MemberSearch?org_id=${orgId}&page=${page}&keyword=${encodeURIComponent(name)}&type=${type}`;
  },
  getMemberDataById(orgId: string, memberNo: string) {
    return `${getBaseApi()}/Org/MemberShip/GetMemberData?org_id=${orgId}&mem_no=${encodeURIComponent(memberNo)}`;
  },
};

export default endPoints;
