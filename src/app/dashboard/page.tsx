"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { DashboardView } from "@/components/dashboard-view";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLoadPromptToEditor = (promptText: string) => {
    // Navigate to /analyzer and pre-load the selected prompt using query string parameter
    router.push(`/analyzer?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <AppLayout activeTab="dashboard">
      <DashboardView onLoadPromptToEditor={handleLoadPromptToEditor} />
    </AppLayout>
  );
}
