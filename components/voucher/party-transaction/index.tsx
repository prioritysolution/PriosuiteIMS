"use client";

import React, { useState } from "react";
import { Plus, Filter, Landmark, Shuffle, ShieldAlert, ArrowUpRight } from "lucide-react";
import { PartyTransactionViewProps } from "@/containers/voucher/party-transaction/PartyTransactionType";
import { PartyTransactionRecordsTable } from "./PartyTransactionRecordsTable";
import { CreateTransactionDialog } from "./CreateTransactionDialog";

const PartyTransactionComponent = ({
  transactions,
  loading,
  handleCreateTransaction,
  handleDeleteTransaction,
  form,
}: PartyTransactionViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Recent">("All");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "Pending") return t.status !== "VERIFIED";
    return true; // Simple mock filter
  });

  return (
    <div className="space-y-6">
      {/* Overview Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            Accounting &gt; Party Transaction
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
            Party Transaction Directory
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage and resolve financial settlements with your business partners.
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
            Record Transaction
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Landmark className="size-4 text-indigo-400" />
              Outstanding Balances
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              {formatCurrency(4285200)}
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-1">
              +12.4% vs LY
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Shuffle className="size-4 text-emerald-400" />
              Total Transactions
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              1,248
            </div>
            <div className="text-xs text-slate-500 font-bold mt-1">
              Monthly Avg, calculated across 64 active party masters
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <ShieldAlert className="size-4 text-rose-400" />
              Credit Utilization
            </div>
            <div className="text-xl font-bold text-rose-400 mt-2">
              High Risk: 12 Parties
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 leading-relaxed whitespace-normal max-w-[280px]">
              System identified 12 parties exceeding 90% of their credit limit. Immediate attention required for voucher processing.
            </div>
          </div>
        </div>
      </div>

      {/* Directory List Card */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800/80 flex gap-1 self-start">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === "All"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab("Pending")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Pending"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pending Clearing
            </button>
            <button
              onClick={() => setActiveTab("Recent")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Recent"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Recent Entries
            </button>
          </div>
          <button className="flex items-center gap-1 text-xs text-primary hover:underline font-bold self-end cursor-pointer">
            View Full Statement
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>

        {/* Table component */}
        <PartyTransactionRecordsTable
          transactions={filteredTransactions}
          loading={loading}
          onDeleteTransaction={handleDeleteTransaction}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-2">
          <span>Showing 1 to {filteredTransactions.length} of 1,248 transactions</span>
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
            <span className="px-2 py-1 text-slate-600">...</span>
            <button className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-400 hover:bg-slate-900 transition-colors">
              250
            </button>
            <button className="px-3 py-1 bg-slate-950/40 border border-slate-800/50 rounded-md text-slate-400 hover:bg-slate-900 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      <CreateTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
};

export default PartyTransactionComponent;
