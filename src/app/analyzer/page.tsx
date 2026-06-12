"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { PromptAnalyzer } from "@/components/prompt-analyzer";
import { Cpu } from "lucide-react";

function AnalyzerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  return (
    <div className="flex flex-col gap-6">
      <PromptAnalyzer 
        initialValue={initialPrompt}
        onAnalysisSuccess={() => {
          router.push("/dashboard");
        }} 
      />
      
      {/* Dynamic suggestion card */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <Cpu className="text-blue-400 shrink-0 mt-0.5" size={16} />
        <div className="flex-1">
          <h6 className="text-xs font-bold text-slate-200">Pro Tip: Inject variables into prompt templates</h6>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Check the **Template Library** page to choose parameterized templates, customize values, and automatically compile full instructions to save time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <AppLayout activeTab="analyzer">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-12">
          <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs text-slate-500">Loading analyzer workspace...</span>
        </div>
      }>
        <AnalyzerContent />
      </Suspense>
    </AppLayout>
  );
}
