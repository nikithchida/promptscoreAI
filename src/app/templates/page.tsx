"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { PromptTemplates } from "@/components/prompt-templates";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectPrompt = (promptText: string) => {
    router.push(`/analyzer?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <AppLayout activeTab="templates">
      <PromptTemplates onSelectPrompt={handleSelectPrompt} />
    </AppLayout>
  );
}
