export interface StatCardData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "boxes" | "warehouse" | "alert" | "package" | "cart";
  tone: "blue" | "green" | "amber" | "purple" | "teal";
}

export interface StockLevelSlice {
  label: string;
  value: number;
  count: number;
  color: string;
}

export interface StockMovementPoint {
  date: string;
  inward: number;
  outward: number;
}

export interface LowStockItem {
  name: string;
  sku: string;
  stock: number;
  reorderLevel: number;
}

export type TransactionType = "Purchase" | "Sales" | "Issue";

export interface TransactionItem {
  type: TransactionType;
  item: string;
  qty: number;
  date: string;
}

export interface WarehouseStockRow {
  branch: string;
  items: number;
  value: string;
  isTotal?: boolean;
}

export interface QuickAction {
  label: string;
  description: string;
  icon: "cart" | "truck" | "package" | "report" | "database";
  tone: "blue" | "green" | "purple" | "amber" | "teal";
}
