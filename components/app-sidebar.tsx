"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, FolderOpen, LayoutGrid, Home, X } from "lucide-react";
import { MdArrowLeft } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import IconDisplay from "@/common/IconDisplay";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  closeMobileMenu?: () => void;
  isLoading?: boolean;
  sideBarData?: any[];
  expandedLink?: string;
  handleExpandedLink?: (title: string) => void;
  isMounted?: boolean;
  endDate?: any;
}

const formatPathName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

function SidebarLogoHeader({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void;
}) {
  return (
    <SidebarHeader className="relative h-[64px] min-h-[64px] max-h-[64px] flex items-center border-b border-white/5 px-4 bg-[#00264D] overflow-hidden">
      <div className="flex flex-1 min-w-0 items-center h-16">
        <Image
          src="/logobg1.png"
          alt="PrioSuite CBS"
          width={831}
          height={300}
          className="h-full w-auto max-w-full object-contain object-left mix-blend-lighten"
          priority
        />
      </div>

      <span className="absolute right-4 bottom-1.5 text-white/30 text-[10px] leading-none pointer-events-none">
        v1.0.1
      </span>

      {closeMobileMenu && (
        <button
          onClick={closeMobileMenu}
          className="lg:hidden flex-shrink-0 ml-2 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </SidebarHeader>
  );
}

const dummySideBarData = [
  {
    menu_id: 1,
    menu_name: "Maintains",
    icon: "FaFolderOpen",
    icon_name: "FaFolderOpen",
    submenus: [
      {
        sub_menu_id: 11,
        sub_menu_name: "Master Setup",
        route: "/maintains/master-setup",
      },
      {
        sub_menu_id: 12,
        sub_menu_name: "Opening Stock",
        route: "/maintains/opening-stock",
      },
      {
        sub_menu_id: 13,
        sub_menu_name: "Party Master",
        route: "/maintains/party-master",
      },
      {
        sub_menu_id: 14,
        sub_menu_name: "User Master",
        route: "/maintains/user-master",
      },
      {
        sub_menu_id: 15,
        sub_menu_name: "Map Item Rate",
        route: "/maintains/map-item-rate",
      },
    ],
  },
  {
    menu_id: 2,
    menu_name: "Voucher",
    icon: "FaReceipt",
    icon_name: "FaReceipt",
    submenus: [
      {
        sub_menu_id: 21,
        sub_menu_name: "Voucher Entry",
        route: "/voucher/vouchers",
      },
      {
        sub_menu_id: 22,
        sub_menu_name: "Party Transaction",
        route: "/voucher/party-transaction",
      },
      {
        sub_menu_id: 23,
        sub_menu_name: "Adjustment Voucher",
        route: "/voucher/adjustmentVoucher",
      },
    ],
  },
  {
    menu_id: 3,
    menu_name: "Chalan Receive",
    icon: "FaDownload",
    icon_name: "FaDownload",
    route: "/chalan_receive",
    submenus: [],
  },
  {
    menu_id: 4,
    menu_name: "Purchase",
    icon: "FaShoppingCart",
    icon_name: "FaShoppingCart",
    route: "/purchases",
    submenus: [],
  },
  {
    menu_id: 5,
    menu_name: "Sale",
    icon: "FaPercent",
    icon_name: "FaPercent",
    route: "/sales",
    submenus: [],
  },
];

export function AppSidebar({
  closeMobileMenu,
  isLoading = false,
  sideBarData = dummySideBarData,
  expandedLink,
  handleExpandedLink,
  isMounted,
  endDate = new Date(Date.now() - 86400000).toISOString(), // Yesterday to show adjustmentVoucher by default
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Local state fallbacks if props are not provided
  const [mounted, setMounted] = React.useState(false);
  const [localExpandedLink, setLocalExpandedLink] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentIsMounted = isMounted !== undefined ? isMounted : mounted;
  const currentExpandedLink =
    expandedLink !== undefined ? expandedLink : localExpandedLink;
  const currentHandleExpandedLink =
    handleExpandedLink ||
    ((title: string) => {
      setLocalExpandedLink((prev) => (prev === title ? "" : title));
    });

  if (!currentIsMounted) {
    return (
      <Sidebar
        {...props}
        className="border-r border-slate-800 bg-[#00264D] text-slate-100"
      >
        <SidebarLogoHeader />
        <SidebarContent className="px-3 pt-5 space-y-3 bg-background">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-10 rounded-lg bg-white/5" />
          ))}
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-800 bg-[#00264D] text-slate-100"
    >
      <SidebarLogoHeader closeMobileMenu={closeMobileMenu} />

      {/* ── Scrollable nav list ── */}
      <SidebarContent className="flex-1 py-3 px-2 space-y-1 bg-[#00264D] custom-scrollbar">
        {isLoading || !sideBarData || !sideBarData.length ? (
          /* Loading skeletons */
          <div className="space-y-3 px-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-10 rounded-lg bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* Dashboard Link */}
            <div className="px-1">
              <button
                onClick={() => {
                  currentHandleExpandedLink("");
                  router.replace("/dashboard");
                  closeMobileMenu?.();
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group border cursor-pointer",
                  pathname === "/dashboard" || pathname === "/"
                    ? "bg-white/15 text-white border-white/25 shadow-sm"
                    : "text-white/80 border-transparent hover:text-white hover:bg-white/5",
                )}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "text-[20px] flex-shrink-0 transition-colors",
                      pathname === "/dashboard" || pathname === "/"
                        ? "text-white"
                        : "text-white/80",
                    )}
                  >
                    <Home size={20} />
                  </span>
                  <span className="truncate text-[15px]">Dashboard</span>
                </span>
              </button>
            </div>

            {sideBarData.map((menu: any, id: number) => {
              const hasChildren = menu.submenus && menu.submenus.length > 0;
              const isExpanded = menu.menu_name === currentExpandedLink;

              // Check if any submenu is active
              const hasActiveChild =
                hasChildren &&
                menu.submenus.some((sub: any) => {
                  let subPath =
                    sub.route ||
                    `/${formatPathName(menu.menu_name)}/${formatPathName(sub.sub_menu_name)}`;
                  if (subPath.includes("group-loan")) {
                    subPath = subPath.replace("group-loan", "new-application");
                  }
                  return pathname === subPath;
                });

              const isActive = hasChildren
                ? hasActiveChild
                : pathname ===
                  (menu.route || `/${formatPathName(menu.menu_name)}`);

              return (
                <div key={menu.menu_id || id} className="px-1">
                  {/* ── Parent nav item ── */}
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        currentHandleExpandedLink(menu.menu_name);
                      } else {
                        currentHandleExpandedLink("");
                        const path =
                          menu.route || `/${formatPathName(menu.menu_name)}`;
                        router.replace(path);
                        closeMobileMenu?.();
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group border cursor-pointer",
                      isActive
                        ? "bg-white/15 text-white border-white/25 shadow-sm"
                        : "text-white/80 border-transparent hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "text-[20px] flex-shrink-0 transition-colors",
                          isActive ? "text-white" : "text-white/80",
                        )}
                      >
                        {menu.icon || menu.icon_name ? (
                          <IconDisplay
                            iconName={menu.icon || menu.icon_name}
                            iconSet={(menu.icon || menu.icon_name)
                              .slice(0, 2)
                              .toLowerCase()}
                            className="text-xl"
                          />
                        ) : (
                          <LayoutGrid size={20} />
                        )}
                      </span>
                      <span className="truncate text-[15px]">
                        {menu.menu_name}
                      </span>
                    </span>

                    {hasChildren && (
                      <span className="flex-shrink-0 text-white/60">
                        {isExpanded ? (
                          <ChevronRight className="rotate-90 transition-transform duration-200 size-4" />
                        ) : (
                          <ChevronRight className="transition-transform duration-200 size-4" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* ── Child nav items ── */}
                  {hasChildren && isExpanded && (
                    <div
                      className={cn(
                        "relative mb-1.5 mt-1",
                        // vertical connector bar
                        "before:absolute before:left-[18px] before:top-0 before:h-full before:w-[1.5px] before:rounded-sm before:bg-white/20",
                      )}
                    >
                      {menu.submenus.map((sub: any, idx: number) => {
                        let subPath =
                          sub.route ||
                          `/${formatPathName(menu.menu_name)}/${formatPathName(sub.sub_menu_name)}`;
                        if (subPath.includes("group-loan")) {
                          subPath = subPath.replace(
                            "group-loan",
                            "new-application",
                          );
                        }
                        const isChildActive = pathname === subPath;
                        const isHidden =
                          subPath === "/voucher/adjustmentVoucher" &&
                          new Date(endDate) > new Date();

                        if (isHidden) return null;

                        return (
                          <button
                            key={sub.sub_menu_id || idx}
                            onClick={() => {
                              router.push(subPath);
                              closeMobileMenu?.();
                            }}
                            className={cn(
                              "w-full text-left pl-9 pr-4 py-[9px] rounded-md transition-all duration-155 relative flex items-center justify-between cursor-pointer",
                              isChildActive
                                ? "before:absolute before:left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-[1.5px] before:bg-white/70"
                                : "before:absolute before:left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-[1.5px] before:bg-white/20",
                              isChildActive
                                ? "bg-white/10 text-white font-semibold"
                                : "text-white/70 hover:text-white hover:bg-white/5",
                            )}
                          >
                            <span className="text-[13.5px] tracking-wide truncate">
                              {sub.sub_menu_name}
                            </span>
                            {isChildActive && (
                              <MdArrowLeft className="text-lg text-white flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SidebarContent>

      {/* ── Bottom brand bar ── */}
      <SidebarFooter className="flex-shrink-0 border-t border-white/5 px-4 h-10 flex items-center justify-center bg-[#00264D]">
        <Link
          href="https://prioritysolutions.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 text-[10px] font-medium tracking-widest uppercase hover:text-white transition-colors"
        >
          By Priority Solutions
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
