"use client";

import React, { useState } from "react";
import { UserPlus, Filter } from "lucide-react";
import { PartyMasterViewProps } from "@/containers/maintains/party-master/PartyMasterType";
import { PartyRecordsTable } from "./PartyRecordsTable";
import { CreatePartyDialog } from "./CreatePartyDialog";

const PartyMasterComponent = ({
  parties,
  loading,
  saving,
  nextLoading,
  partyTypes,
  partyTypesLoading,
  isEditMode,
  handleSaveParty,
  handleEditParty,
  handleOpenCreate,
  handleCloseDialog,
  handleMemberSelect,
  handleNext,
  form,
}: PartyMasterViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openCreateDialog = () => {
    handleOpenCreate();
    setIsDialogOpen(true);
  };

  const openEditDialog = (party: Parameters<typeof handleEditParty>[0]) => {
    handleEditParty(party);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      handleCloseDialog();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Entity Directory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your customers and vendors across all warehouse locations.
          </p>
        </div>
        <div className="flex gap-2">
         
          <button
            onClick={openCreateDialog}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <UserPlus className="size-4" />
            Create New Party
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <PartyRecordsTable
          parties={parties}
          loading={loading}
          onEdit={openEditDialog}
        />

        <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-2">
          <span>
            Showing {parties.length > 0 ? `1-${parties.length}` : "0"} of{" "}
            {parties.length} parties
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-400 cursor-not-allowed"
            >
              &lt;
            </button>
            <button
              disabled
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
            >
              1
            </button>
            <button className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <CreatePartyDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        form={form}
        onSubmit={handleSaveParty}
        nextLoading={nextLoading}
        saving={saving}
        isEditMode={isEditMode}
        partyTypes={partyTypes}
        partyTypesLoading={partyTypesLoading}
        handleMemberSelect={handleMemberSelect}
        handleNext={handleNext}
      />
    </div>
  );
};

export default PartyMasterComponent;
