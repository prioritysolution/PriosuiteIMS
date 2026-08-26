import { UseFormReturn } from "react-hook-form";
import { ChalanItemRow } from "./ChalanReceiveSlice";

export interface ChalanReceiveFormValues {
  chalanDate: string;
  refChalanNo: string;
  selectParty: string;
  selectWarehouse: string;
  selectedItem: string;
  Quantity: number | string;
  selectUnit: string;
}

export type { ChalanItemRow };

export interface ChalanReceiveViewProps {
  items: ChalanItemRow[];
  partyOptions: Array<{ Id: string; Option_Value: string }>;
  warehouseOptions: Array<{ Id: string; Option_Value: string }>;
  itemOptions: Array<{ Id: string; Option_Value: string }>;
  unitOptions: Array<{ Id: string; Option_Value: string }>;
  loadingParties: boolean;
  loadingWarehouses: boolean;
  loadingItems: boolean;
  loadingUnits: boolean;
  saving: boolean;
  onAddItem: () => Promise<void> | void;
  onDeleteItem: (id: string) => void;
  onSaveRecord: () => Promise<void> | void;
  form: UseFormReturn<ChalanReceiveFormValues>;
  successMessage: string;
  showSuccessMessage: boolean;
  handleCloseSuccessMessage: () => void;
}
