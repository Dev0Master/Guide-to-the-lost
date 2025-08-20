"use client";

import { CentersManagement } from "@/components/dashboard/centers/CentersManagement";

export default function CentersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <CentersManagement />
      </div>
    </div>
  );
}