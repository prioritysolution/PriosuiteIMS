"use client";

import {
  MdCall,
  MdNotifications,
  MdOutlineArrowDropDown,
  MdMenu,
  MdPerson,
  MdLogout,
} from "react-icons/md";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { parseLocalDate } from "@/utils/dateHelpers";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface NavbarProps {
  logoutLoading: boolean;
  handleLogout: () => void;
  onMenuToggle: () => void;
}

function formatOpenDate(value: string): string {
  const d = parseLocalDate(value);
  return d ? format(d, "dd MMM yyyy") : value.trim();
}

const Navbar = ({ logoutLoading, handleLogout, onMenuToggle }: NavbarProps) => {
  const [orgName, setOrgName] = useState("");
  const [userName, setUserName] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOrgName(getCookieData("priosuite_Ims_userOrgName") ?? "");
    setUserName(getCookieData("priosuite_Ims_userName") ?? "");
    const begDate = getCookieData("priosuite_Ims_beg_date");
    setOpenDate(begDate ? formatOpenDate(String(begDate)) : "");
    setMounted(true);
  }, []);

  return (
    <header className="min-h-[64px] w-full bg-[#00264D] flex-shrink-0 flex items-center px-3 sm:px-5 gap-3 border-b border-white/10 shadow-md z-40 py-2">
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex-shrink-0 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle sidebar"
      >
        <MdMenu className="text-2xl" />
      </button>

      {/* <div className="flex-1 flex flex-col gap-0.5 min-w-0 overflow-hidden">      

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-xs font-medium whitespace-nowrap flex-shrink-0">
            Organisation:
          </span>
          {orgName ? (
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              {orgName}
            </span>
          ) : (
            <Skeleton className="w-28 h-4 bg-white/15 rounded" />
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 min-w-0">
          <span className="text-white/60 text-xs font-medium whitespace-nowrap">
            Open Date:
          </span>
          {mounted && openDate ? (
            <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
              {openDate}
            </span>
          ) : (
            <Skeleton className="w-20 h-4 bg-white/15 rounded" />
          )}
        </div>
      </div> */}

<div className="flex-1 flex flex-col md:flex-row justify-center md:justify-start md:items-center gap-0.5 md:gap-6 min-w-0 overflow-hidden">
        {/* Organisation */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-[10px] md:text-xs font-medium whitespace-nowrap flex-shrink-0">
            Organisation:
          </span>
          {/* max-w-[160px] md:max-w-[220px] lg:max-w-xs */}
          {orgName ? (
            <span className="text-white text-xs md:text-sm font-semibold truncate">
              {orgName}
            </span>
          ) : (
            <Skeleton className="w-28 h-3 sm:h-4 bg-white/15 rounded" />
          )}
        </div>

        {/* Open Date */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
            Open Date:
          </span>
          {mounted && openDate ? (
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              {openDate}
            </span>
          ) : (
            <Skeleton className="w-24 h-3 sm:h-4 bg-white/15 rounded" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <button
          className="relative p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-[#00264D]" />
        </button>

        <button
          className="hidden sm:flex p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Call"
        >
          <MdCall className="text-xl" />
        </button>

        <div className="h-6 w-px bg-white/20 mx-1 flex-shrink-0" />

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none bg-transparent hover:bg-transparent data-popup-open:bg-transparent">
            {!mounted ? (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            ) : userName ? (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 data-popup-open:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00264D] text-sm font-bold flex-shrink-0 shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-white text-sm font-medium max-w-[100px] truncate">
                  {userName}
                </span>
                <MdOutlineArrowDropDown className="hidden md:block text-white/60 text-lg group-hover:text-white transition-colors" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 bg-white text-slate-800 border border-slate-200 shadow-xl rounded-xl mt-2 p-1 ring-0"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-slate-800">
                <p className="text-xs text-slate-400 font-normal">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {userName}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-slate-200" />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-slate-700 data-highlighted:bg-[#00264D]/8 data-highlighted:!text-slate-700 focus:bg-[#00264D]/8 focus:!text-slate-700 data-highlighted:[&_svg]:!text-[#00264D]/70 focus:[&_svg]:!text-[#00264D]/70"
            >
              <MdPerson className="text-base text-[#00264D]/70" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={!logoutLoading ? handleLogout : undefined}
              disabled={logoutLoading}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-600 data-highlighted:bg-red-50 data-highlighted:!text-red-600 focus:bg-red-50 focus:!text-red-600 data-highlighted:[&_svg]:!text-red-600 focus:[&_svg]:!text-red-600"
            >
              <MdLogout className="text-base" />
              {logoutLoading ? "Logging out…" : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
