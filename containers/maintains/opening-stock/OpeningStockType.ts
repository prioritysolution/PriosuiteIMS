import { UseFormReturn } from "react-hook-form";
import { StockEntryItem } from "./OpeningStockSlice";

export interface OpeningStockFormValues {
  stockDate: string;
  selectWarehouse: string;
  selectedItem: string;
  selectUnit: string;
  Quantity: number | string;
  Rate: number | string;
}

export interface OpeningStockViewProps {
  items: StockEntryItem[];
  loading: boolean;
  itemOptions: Array<{ Id: string; Option_Value: string }>;
  unitOptions: Array<{ Id: string; Option_Value: string }>;
  loadingItems: boolean;
  loadingUnits: boolean;
  warehouseOptions: Array<{ Id: string; Option_Value: string }>;
  loadingWarehouses: boolean;
  onAddItem: () => Promise<void> | void;
  onDeleteItem: (id: string) => void;
  onSaveRecord: () => Promise<void> | void;
  saving: boolean;
  form: UseFormReturn<OpeningStockFormValues>;
  successMessage: string;
  showSuccessMessage: boolean;
  handleCloseSuccessMessage: () => void;
}
