"use client";

import React, { useState } from "react";
import { Plus, Download } from "lucide-react";
import { MapItemRateViewProps } from "@/containers/maintains/map-item-rate/MapItemRateType";
import { MappedRateRecordsTable } from "./MappedRateRecordsTable";
import { CreateMappingDialog } from "./CreateMappingDialog";

const MapItemRateComponent = ({
  mappings,
  loading,
  handleCreateMapping,
  handleDeleteMapping,
  form,
}: MapItemRateViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Active" | "Archived">("Active");

  const filteredMappings = mappings.filter((item) => item.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Overview Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            Inventory &gt; Map Item Rate
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Map Item Rate
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure and manage real-time rates for inventory stock mapping.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <Plus className="size-4" />
            Create New Mapping
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all cursor-pointer">
            <Download className="size-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Item Rate Mapped Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold text-slate-800">Mapped Inventory Items</h3>
          {/* Active / Archived Toggle */}
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex gap-1">
            <button
              onClick={() => setActiveTab("Active")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Active"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("Archived")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Archived"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Table component */}
        <MappedRateRecordsTable
          mappings={filteredMappings}
          loading={loading}
          onDeleteMapping={handleDeleteMapping}
        />
      </div>

      {/* Creation Modal */}
      <CreateMappingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={handleCreateMapping}
      />
    </div>
  );
};

export default MapItemRateComponent;
