"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { User } from "@/containers/maintains/user-master/UserMasterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface UserRecordsTableProps {
  users: User[];
  loading?: boolean;
  onDeleteUser: (id: string) => void;
}

export function UserRecordsTable({
  users,
  loading = false,
  onDeleteUser,
}: UserRecordsTableProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 ">
      <table className="w-full text-left border-collapse text-sm min-w-[850px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              User Identity
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-56">
              Assigned Branch
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-64">
              System Role
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-36">
              Current Status
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <TableLoader colSpan={5} label="Loading users…" />
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-5 py-8 text-center text-slate-500 font-medium"
              >
                No users found. Click "Create New User" to register a user.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const firstLetter = user.name
                .split(" ")
                .map((n) => n.charAt(0))
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                        {firstLetter}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors whitespace-normal max-w-[200px]">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.branch === "UNASSIGNED"
                          ? "bg-slate-100 text-slate-600 border border-slate-200"
                          : "bg-indigo-500/10 text-primary border border-indigo-500/20"
                      }`}
                    >
                      {user.branch}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {user.role}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-400 hover:text-primary p-1 rounded hover:bg-primary/10 transition-all cursor-pointer">
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="text-rose-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" className="bg-slate-100" />
    </ScrollArea>
  );
}
