"use client";

import React, { useState } from "react";
import { OptimizedPrompts } from "@/contexts/prompt-context";
import { GlassCard } from "./ui/glass-card";
import { Copy, Check, RefreshCw, Eye } from "lucide-react";

interface PromptOptimizerProps {
  original: string;
  optimized: OptimizedPrompts;
  onApply?: (optimizedText: string) => void;
  delay?: number;
}

export function PromptOptimizer({ original, optimized, onApply, delay = 0.4 }: PromptOptimizerProps) {
  const [activeTab, setActiveTab] = useState<keyof OptimizedPrompts>("improved");
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const activeOptimizedText = optimized[activeTab] || "";

  const tabs: { id: keyof OptimizedPrompts; label: string; desc: string }[] = [
    { id: "improved", label: "Improved Version", desc: "Best default optimization balancing detail and flow." },
    { id: "professional", label: "Professional", desc: "Adds formal expert persona constraints and precise goals." },
    { id: "beginner", label: "Beginner-Friendly", desc: "Simpler terminology with inline guidance and explanations." },
    { id: "concise", label: "Concise / Short", desc: "Direct, brief directive omitting background instructions." },
  ];

  const handleCopy = (text: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedOptimized(true);
      setTimeout(() => setCopiedOptimized(false), 2000);
    }
  };

  return (
    <GlassCard className="border-slate-800" delay={delay}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <RefreshCw size={18} className="text-blue-500" /> Prompt Optimizer
          </h3>
          <p className="text-slate-400 text-xs mt-1">Review alternative generated models and compare original vs optimized versions side-by-side.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* active tab helper text */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-2.5 mb-4 text-xs text-blue-300">
        <strong>Style description:</strong> {tabs.find((t) => t.id === activeTab)?.desc}
      </div>

      {/* Side-by-side Grid comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Original prompt panel */}
        <div className="flex flex-col rounded-xl bg-slate-950/40 border border-white/5 overflow-hidden">
          <div className="flex justify-between items-center bg-slate-950/60 px-4 py-2 border-b border-white/5">
            <span className="text-xs font-bold text-slate-400">Original Prompt</span>
            <button
              onClick={() => handleCopy(original, true)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5"
            >
              {copiedOriginal ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedOriginal ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 text-xs font-mono text-slate-400 whitespace-pre-wrap select-text h-48 overflow-y-auto leading-relaxed">
            {original}
          </div>
        </div>

        {/* Optimized prompt panel */}
        <div className="flex flex-col rounded-xl bg-slate-950/40 border border-blue-500/20 overflow-hidden">
          <div className="flex justify-between items-center bg-blue-500/10 px-4 py-2 border-b border-blue-500/20">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <Eye size={12} /> Optimized Prompt ({tabs.find((t) => t.id === activeTab)?.label})
            </span>
            <div className="flex items-center gap-2">
              {onApply && (
                <button
                  onClick={() => onApply(activeOptimizedText)}
                  className="text-[10px] text-blue-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 font-semibold"
                >
                  Apply to Editor
                </button>
              )}
              <button
                onClick={() => handleCopy(activeOptimizedText, false)}
                className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5"
              >
                {copiedOptimized ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedOptimized ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="p-4 text-xs font-mono text-slate-200 bg-slate-900/60 whitespace-pre-wrap select-text h-48 overflow-y-auto leading-relaxed border-l-2 border-blue-500/30">
            {activeOptimizedText}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
