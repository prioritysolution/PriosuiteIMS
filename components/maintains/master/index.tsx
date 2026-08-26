"use client";

import React, { useState } from "react";
import {
  Unit,
  Brand,
  Category,
  SubCategory,
  Warehouse,
  Hsn,
  Item,
} from "@/containers/maintains/master/masterSlice";
import { MasterViewProps } from "@/containers/maintains/master/masterType";
import { MasterTab } from "@/containers/maintains/master/Hooks";
import { UnitTab } from "./Unit/UnitTab";
import { CreateUnitDialog } from "./Unit/CreateUnitDialog";
import { BrandTab } from "./Brand/BrandTab";
import { CreateBrandDialog } from "./Brand/CreateBrandDialog";
import { CategoryTab } from "./Category/CategoryTab";
import { CreateCategoryDialog } from "./Category/CreateCategoryDialog";
import { SubCategoryTab } from "./SubCategory/SubCategoryTab";
import { CreateSubCategoryDialog } from "./SubCategory/CreateSubCategoryDialog";
import { ItemTab } from "./Item/ItemTab";
import { CreateItemDialog } from "./Item/CreateItemDialog";
import { WarehouseTab } from "./Warehouse/WarehouseTab";
import { CreateWarehouseDialog } from "./Warehouse/CreateWarehouseDialog";
import { HsnTab } from "./Hsn/HsnTab";
import { CreateHsnDialog } from "./Hsn/CreateHsnDialog";

const TABS: MasterTab[] = [
  "Unit",
  "Brand",
  "Category",
  "Sub Category",
  "Item",
  "Warehouse",
  "HSN",
];

function MasterView({
  units,
  brands,
  categories,
  subCategories,
  items,
  warehouses,
  hsnList,
  itemCatwiseSubCategories,
  purchaseGlOptions,
  saleGlOptions,
  itemHsnOptions,
  loadingItemSubCategories,
  loadingItemLedgers,
  loadingItemHsn,
  loading,
  activeTab,
  setActiveTab,
  unitForm,
  brandForm,
  categoryForm,
  subCategoryForm,
  itemForm,
  warehouseForm,
  hsnForm,
  handleCreateUnit,
  handleCreateBrand,
  handleCreateCategory,
  handleCreateSubCategory,
  handleCreateItem,
  handleUpdateItem,
  handleCreateWarehouse,
  handleCreateHsn,
  handleUpdateUnit,
  handleUpdateBrand,
  handleUpdateCategory,
  handleUpdateSubCategory,
  handleUpdateWarehouse,
  handleUpdateHsn,
}: MasterViewProps) {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isHsnModalOpen, setIsHsnModalOpen] = useState(false);
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState<Unit | null>(
    null,
  );
  const [selectedBrandForEdit, setSelectedBrandForEdit] =
    useState<Brand | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<Category | null>(null);
  const [selectedSubCategoryForEdit, setSelectedSubCategoryForEdit] =
    useState<SubCategory | null>(null);
  const [selectedWarehouseForEdit, setSelectedWarehouseForEdit] =
    useState<Warehouse | null>(null);
  const [selectedHsnForEdit, setSelectedHsnForEdit] = useState<Hsn | null>(
    null,
  );
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<Item | null>(
    null,
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab} Setup
          </button>
        ))}
      </div>

      {activeTab === "Unit" && (
        <UnitTab
          units={units}
          loading={loading}
          onAddUnitClick={() => setIsUnitModalOpen(true)}
          onEditUnitClick={(unit) => {
            setSelectedUnitForEdit(unit);
            setIsUnitModalOpen(true);
          }}
        />
      )}

      {activeTab === "Brand" && (
        <BrandTab
          brands={brands}
          loading={loading}
          onAddBrandClick={() => setIsBrandModalOpen(true)}
          onEditBrandClick={(brand) => {
            setSelectedBrandForEdit(brand);
            setIsBrandModalOpen(true);
          }}
        />
      )}

      {activeTab === "Category" && (
        <CategoryTab
          categories={categories}
          loading={loading}
          onAddCategoryClick={() => setIsCategoryModalOpen(true)}
          onEditCategoryClick={(category) => {
            setSelectedCategoryForEdit(category);
            setIsCategoryModalOpen(true);
          }}
        />
      )}

      {activeTab === "Sub Category" && (
        <SubCategoryTab
          subCategories={subCategories}
          categories={categories}
          loading={loading}
          onAddSubCategoryClick={() => setIsSubCategoryModalOpen(true)}
          onEditSubCategoryClick={(sub) => {
            setSelectedSubCategoryForEdit(sub);
            setIsSubCategoryModalOpen(true);
          }}
        />
      )}

      {activeTab === "Item" && (
        <ItemTab
          items={items}
          loading={loading}
          onAddItemClick={() => setIsItemModalOpen(true)}
          onEditItemClick={(item) => {
            setSelectedItemForEdit(item);
            setIsItemModalOpen(true);
          }}
        />
      )}

      {activeTab === "Warehouse" && (
        <WarehouseTab
          warehouses={warehouses}
          loading={loading}
          onAddWarehouseClick={() => setIsWarehouseModalOpen(true)}
          onEditWarehouseClick={(warehouse) => {
            setSelectedWarehouseForEdit(warehouse);
            setIsWarehouseModalOpen(true);
          }}
        />
      )}

      {activeTab === "HSN" && (
        <HsnTab
          hsnList={hsnList}
          loading={loading}
          onAddHsnClick={() => setIsHsnModalOpen(true)}
          onEditHsnClick={(hsn) => {
            setSelectedHsnForEdit(hsn);
            setIsHsnModalOpen(true);
          }}
        />
      )}

      <CreateUnitDialog
        open={isUnitModalOpen}
        onOpenChange={(open) => {
          setIsUnitModalOpen(open);
          if (!open) setSelectedUnitForEdit(null);
        }}
        form={unitForm}
        onSubmit={(data) => {
          if (selectedUnitForEdit) {
            handleUpdateUnit(selectedUnitForEdit.id, data);
          } else {
            handleCreateUnit(data);
          }
        }}
        editingUnit={selectedUnitForEdit}
      />

      <CreateBrandDialog
        open={isBrandModalOpen}
        onOpenChange={(open) => {
          setIsBrandModalOpen(open);
          if (!open) setSelectedBrandForEdit(null);
        }}
        form={brandForm}
        onSubmit={(data) => {
          if (selectedBrandForEdit) {
            handleUpdateBrand(selectedBrandForEdit.id, data);
          } else {
            handleCreateBrand(data);
          }
        }}
        editingBrand={selectedBrandForEdit}
      />

      <CreateCategoryDialog
        open={isCategoryModalOpen}
        onOpenChange={(open) => {
          setIsCategoryModalOpen(open);
          if (!open) setSelectedCategoryForEdit(null);
        }}
        form={categoryForm}
        onSubmit={(data) => {
          if (selectedCategoryForEdit) {
            handleUpdateCategory(selectedCategoryForEdit.id, data);
          } else {
            handleCreateCategory(data);
          }
        }}
        editingCategory={selectedCategoryForEdit}
      />

      <CreateSubCategoryDialog
        open={isSubCategoryModalOpen}
        onOpenChange={(open) => {
          setIsSubCategoryModalOpen(open);
          if (!open) setSelectedSubCategoryForEdit(null);
        }}
        form={subCategoryForm}
        onSubmit={(data) => {
          if (selectedSubCategoryForEdit) {
            handleUpdateSubCategory(selectedSubCategoryForEdit.id, data);
          } else {
            handleCreateSubCategory(data);
          }
        }}
        editingSubCategory={selectedSubCategoryForEdit}
        categories={categories}
      />

      <CreateItemDialog
        open={isItemModalOpen}
        onOpenChange={(open) => {
          setIsItemModalOpen(open);
          if (!open) setSelectedItemForEdit(null);
        }}
        brands={brands}
        categories={categories}
        units={units}
        itemCatwiseSubCategories={itemCatwiseSubCategories}
        purchaseGlOptions={purchaseGlOptions}
        saleGlOptions={saleGlOptions}
        itemHsnOptions={itemHsnOptions}
        loadingItemSubCategories={loadingItemSubCategories}
        loadingItemLedgers={loadingItemLedgers}
        loadingItemHsn={loadingItemHsn}
        form={itemForm}
        editingItem={selectedItemForEdit}
        onSubmit={(data) => {
          if (selectedItemForEdit) {
            handleUpdateItem(selectedItemForEdit.id, data);
          } else {
            handleCreateItem(data);
          }
        }}
      />

      <CreateWarehouseDialog
        open={isWarehouseModalOpen}
        onOpenChange={(open) => {
          setIsWarehouseModalOpen(open);
          if (!open) setSelectedWarehouseForEdit(null);
        }}
        form={warehouseForm}
        onSubmit={(data) => {
          if (selectedWarehouseForEdit) {
            handleUpdateWarehouse(selectedWarehouseForEdit.id, data);
          } else {
            handleCreateWarehouse(data);
          }
        }}
        editingWarehouse={selectedWarehouseForEdit}
      />

      <CreateHsnDialog
        open={isHsnModalOpen}
        onOpenChange={(open) => {
          setIsHsnModalOpen(open);
          if (!open) setSelectedHsnForEdit(null);
        }}
        form={hsnForm}
        onSubmit={(data) => {
          if (selectedHsnForEdit) {
            handleUpdateHsn(selectedHsnForEdit.id, data);
          } else {
            handleCreateHsn(data);
          }
        }}
        editingHsn={selectedHsnForEdit}
      />
    </div>
  );
}

export default MasterView;
