"use client";

import { StatisticsOverview } from "@/components/dashboard/statistics/StatisticsOverview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <StatisticsOverview />
      </div>
    </div>
  );
}