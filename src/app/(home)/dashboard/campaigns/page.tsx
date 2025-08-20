"use client";

import { CampaignsManagement } from "@/components/dashboard/campaigns/CampaignsManagement";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <CampaignsManagement />
      </div>
    </div>
  );
}