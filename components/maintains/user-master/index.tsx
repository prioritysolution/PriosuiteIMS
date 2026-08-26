"use client";

import React, { useState } from "react";
import { UserPlus, Download, Users, Flame, Building2, ShieldAlert } from "lucide-react";
import { UserMasterViewProps } from "@/containers/maintains/user-master/UserMasterType";
import { UserRecordsTable } from "./UserRecordsTable";
import { CreateUserDialog } from "./CreateUserDialog";

const UserMasterComponent = ({
  users,
  loading,
  handleCreateUser,
  handleDeleteUser,
  form,
}: UserMasterViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Overview Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            User Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure and monitor system access for enterprise staff across all branches.
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer w-full sm:w-auto"
        >
          <UserPlus className="size-4" />
          Create New User
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-primary rounded-lg">
            <Users className="size-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Users</div>
            <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">124</div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Flame className="size-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Now</div>
            <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">18</div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Branches</div>
            <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">6</div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Approvals</div>
            <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">3</div>
          </div>
        </div>
      </div>

      {/* User Records List Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-bold text-slate-800">User Directory</h3>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200 font-bold uppercase tracking-wider">
              Showing {users.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-600 font-bold cursor-pointer focus:outline-none focus:border-primary">
              <option>All Branches</option>
            </select>
            <button className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer">
              <Download className="size-4" />
            </button>
          </div>
        </div>

        {/* Table component */}
        <UserRecordsTable users={users} loading={loading} onDeleteUser={handleDeleteUser} />

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-2">
          <span>Page 1 of 12</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-400 cursor-not-allowed">
              &lt;
            </button>
            <button disabled className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
              1
            </button>
            <button className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      <CreateUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UserMasterComponent;