"use client";

import React, { useState } from "react";
import { Plus, Filter, Download, Printer, Landmark, ClipboardList, BarChart3 } from "lucide-react";
import { VouchersViewProps } from "@/containers/voucher/vouchers/vouchersType";
import { VoucherRecordsTable } from "./VoucherRecordsTable";
import { CreateVoucherDialog } from "./CreateVoucherDialog";

const VouchersComponent = ({
  vouchers,
  loading,
  handleCreateVoucher,
  handleDeleteVoucher,
  form,
}: VouchersViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalValue = vouchers.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Overview Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Voucher Entry
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage and track your financial disbursements and receipts across all ledgers.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 rounded-lg text-xs font-bold transition-all cursor-pointer">
            <Filter className="size-4 text-slate-400" />
            Filter
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <Plus className="size-4" />
            Create New Voucher
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Landmark className="size-4 text-indigo-400" />
              Total Voucher Value
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              {formatCurrency(totalValue || 1284500)}
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-1">
              ↗ 12.5% increase this month
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <ClipboardList className="size-4 text-amber-400" />
              Pending Settlements
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              42 Items
            </div>
            <div className="text-xs text-amber-500 font-bold mt-1">
              ⚠ Requires immediate verification
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <BarChart3 className="size-4 text-primary" />
              Quick Analysis
            </div>
            <div className="flex items-end gap-1 h-8 mt-2">
              <span className="w-2.5 bg-indigo-500/20 h-4 rounded-sm"></span>
              <span className="w-2.5 bg-indigo-500/40 h-6 rounded-sm"></span>
              <span className="w-2.5 bg-primary h-8 rounded-sm animate-pulse"></span>
              <span className="w-2.5 bg-indigo-500/60 h-5 rounded-sm"></span>
            </div>
            <div className="text-[10px] text-primary hover:underline font-bold mt-1 cursor-pointer">
              View Detailed Reports
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers Directory List Card */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold text-white">Recent Voucher Records</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
              <Download className="size-4" />
            </button>
            <button className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
              <Printer className="size-4" />
            </button>
          </div>
        </div>

        {/* Table component */}
        <VoucherRecordsTable
          vouchers={vouchers}
          loading={loading}
          onDeleteVoucher={handleDeleteVoucher}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-2">
          <span>Showing 1 to {vouchers.length} of 128 entries</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-600 cursor-not-allowed">
              &lt;
            </button>
            <button disabled className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
              1
            </button>
            <button className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-400 hover:bg-slate-900 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-400 hover:bg-slate-900 transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-400 hover:bg-slate-900 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      <CreateVoucherDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={handleCreateVoucher}
      />
    </div>
  );
};

export default VouchersComponent;
