import { UseFormReturn } from "react-hook-form";
import { MappedRate } from "./MapItemRateSlice";

export interface MapItemRateFormValues {
  selectItem: string;
  selectUnit: string;
  rate: number;
}

export interface MapItemRateViewProps {
  mappings: MappedRate[];
  loading: boolean;
  handleCreateMapping: (data: MapItemRateFormValues) => void;
  handleDeleteMapping: (id: string) => void;
  form: UseFormReturn<MapItemRateFormValues>;
}
