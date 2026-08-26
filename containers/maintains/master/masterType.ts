import { UseFormReturn } from "react-hook-form";
import {
  Unit,
  Brand,
  Category,
  SubCategory,
  Item,
  Warehouse,
  Hsn,
} from "./masterSlice";
import {
  UnitFormValues,
  BrandFormValues,
  CategoryFormValues,
  SubCategoryFormValues,
  WarehouseFormValues,
  HsnFormValues,
  MasterTab,
  MasterDropdownOption,
} from "./Hooks";

export interface MasterViewProps {
  units: Unit[];
  brands: Brand[];
  categories: Category[];
  subCategories: SubCategory[];
  items: Item[];
  warehouses: Warehouse[];
  hsnList: Hsn[];
  itemCatwiseSubCategories: MasterDropdownOption[];
  purchaseGlOptions: MasterDropdownOption[];
  saleGlOptions: MasterDropdownOption[];
  itemHsnOptions: MasterDropdownOption[];
  loadingItemSubCategories: boolean;
  loadingItemLedgers: boolean;
  loadingItemHsn: boolean;
  loading: boolean;
  activeTab: MasterTab;
  setActiveTab: React.Dispatch<React.SetStateAction<MasterTab>>;
  unitForm: UseFormReturn<UnitFormValues>;
  brandForm: UseFormReturn<BrandFormValues>;
  categoryForm: UseFormReturn<CategoryFormValues>;
  subCategoryForm: UseFormReturn<SubCategoryFormValues>;
  itemForm: UseFormReturn<Omit<Item, "id" | "status">>;
  warehouseForm: UseFormReturn<WarehouseFormValues>;
  hsnForm: UseFormReturn<HsnFormValues>;
  handleCreateUnit: (data: UnitFormValues) => void;
  handleUpdateUnit: (id: string, data: UnitFormValues) => void;
  handleCreateBrand: (data: BrandFormValues) => void;
  handleUpdateBrand: (id: string, data: BrandFormValues) => void;
  handleCreateCategory: (data: CategoryFormValues) => void;
  handleUpdateCategory: (id: string, data: CategoryFormValues) => void;
  handleCreateSubCategory: (data: SubCategoryFormValues) => void;
  handleUpdateSubCategory: (id: string, data: SubCategoryFormValues) => void;
  handleCreateItem: (data: Omit<Item, "id" | "status">) => void;
  handleUpdateItem: (id: string, data: Omit<Item, "id" | "status">) => void;
  handleCreateWarehouse: (data: WarehouseFormValues) => void;
  handleUpdateWarehouse: (id: string, data: WarehouseFormValues) => void;
  handleCreateHsn: (data: HsnFormValues) => void;
  handleUpdateHsn: (id: string, data: HsnFormValues) => void;
}
