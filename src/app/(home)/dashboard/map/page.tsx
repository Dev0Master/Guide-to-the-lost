"use client";

import { InteractiveMapDashboard } from "@/components/dashboard/maps/InteractiveMapDashboard";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <InteractiveMapDashboard />
      </div>
    </div>
  );
}