"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { usePrompts } from "@/contexts/prompt-context";
import { PromptOptimizer } from "@/components/prompt-optimizer";
import { GlassCard } from "@/components/ui/glass-card";
import { GitCompare, History, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { history, activeAnalysis, setActiveAnalysis } = usePrompts();
  const [selectedId, setSelectedId] = useState<string>(activeAnalysis?.id || history[0]?.id || "");

  const currentAnalysis = history.find((h) => h.id === selectedId) || activeAnalysis || history[0];

  return (
    <AppLayout activeTab="compare">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <GitCompare className="text-blue-500 w-5 h-5" /> Prompt Comparison Workspace
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review original inputs side-by-side with compiled, optimized SaaS versions.</p>
        </div>

        {history.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center gap-4">
            <HelpCircle size={40} className="text-slate-600" />
            <h4 className="text-slate-200 font-bold">No prompts evaluated yet</h4>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Before you can compare optimization variants, you need to run at least one evaluation in the Analyzer.
            </p>
            <Link
              href="/analyzer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
            >
              Go to Analyzer
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Select prompt history list */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <GlassCard hoverEffect={false} className="p-4 border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <History size={15} className="text-blue-500" />
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Choose Prompt to Compare</h4>
                </div>

                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setActiveAnalysis(item);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-2 ${
                        (currentAnalysis?.id === item.id)
                          ? "bg-blue-600/10 border-blue-500/30 text-slate-100"
                          : "bg-slate-900/20 border-white/5 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] text-slate-500 font-bold font-mono">
                          {new Date(item.analyzedAt).toLocaleDateString()}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-black text-[9px] ${
                          item.scores.overall >= 80 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : item.scores.overall >= 60 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          Score: {item.scores.overall}
                        </span>
                      </div>
                      <p className="line-clamp-2 font-mono text-[11px] leading-relaxed break-all">
                        {item.originalPrompt}
                      </p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Side: Render Optimizer side-by-side */}
            <div className="lg:col-span-8">
              {currentAnalysis && (
                <PromptOptimizer
                  original={currentAnalysis.originalPrompt}
                  optimized={currentAnalysis.optimized}
                  delay={0.1}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
