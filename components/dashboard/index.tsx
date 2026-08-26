"use client";

import { DashboardHeader } from "./DashboardHeader";
import { StatsGrid, defaultStats } from "./StatsGrid";
import { StockLevelDonutChart } from "./StockLevelDonutChart";
import { StockMovementChart } from "./StockMovementChart";
import { TopLowStockCard } from "./TopLowStockCard";
import { RecentTransactionsCard } from "./RecentTransactionsCard";
import { WarehouseStockCard } from "./WarehouseStockCard";
import { QuickActionsBar } from "./QuickActionsBar";

function DashboardView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 lg:gap-6">
      <DashboardHeader />

      <StatsGrid stats={defaultStats} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <StockLevelDonutChart />
        <StockMovementChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TopLowStockCard />
        <RecentTransactionsCard />
        <div className="md:col-span-2 xl:col-span-1">
          <WarehouseStockCard />
        </div>
      </div>

      <QuickActionsBar />
    </div>
  );
}

export default DashboardView;
