"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  getAuthToken,
  logoutAndRedirectToPortal,
  redirectToPortal,
} from "@/utils/authRedirect";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = () => {
      const token = getAuthToken();
      if (!token) {
        redirectToPortal();
        return;
      }
      setAuthChecked(true);
    };

    // Retry briefly so CookieSetter / home cookie write can finish
    let attempts = 0;
    const maxAttempts = 8;

    const run = () => {
      const token = getAuthToken();
      if (token) {
        setAuthChecked(true);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        verifyAuth();
        return;
      }
      window.setTimeout(run, 50);
    };

    run();
  }, []);

  const handleLogout = () => {
    setLogoutLoading(true);
    logoutAndRedirectToPortal();
  };

  if (!authChecked) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-[#00264D] text-white/80 text-sm">
        Checking session…
      </div>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-[#00264D] text-foreground flex flex-col h-svh overflow-hidden">
        <Navbar
          logoutLoading={logoutLoading}
          handleLogout={handleLogout}
          onMenuToggle={toggleSidebar}
        />

        <div className="flex-1 p-4 overflow-y-auto bg-white text-slate-900 w-full min-h-0">
          {children}
        </div>

        <Footer />
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
