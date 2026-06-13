"use client";

import React, { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { ShieldAlert, Copy, Check, Info } from "lucide-react";

interface InvalidPromptWarningProps {
  onSelectExample?: (exampleText: string) => void;
}

export function InvalidPromptWarning({ onSelectExample }: InvalidPromptWarningProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const examples = [
    "Write a Python script that cleans CSV files.",
    "Explain machine learning to a beginner.",
    "Create a SaaS marketing strategy.",
    "Design a REST API for an e-commerce platform."
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <GlassCard hoverEffect={false} className="border-amber-500/25 bg-amber-500/[0.02] p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto w-full select-none">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-400 shrink-0 shadow-lg shadow-amber-500/5">
          <ShieldAlert size={28} className="animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 tracking-tight">
            Invalid AI Prompt
          </h3>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed font-medium">
            This input does not appear to be an instruction for an AI system.
          </p>
          <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
            Please enter a task, request, or objective. PromptScore AI evaluates prompt-engineering structures rather than casual conversation.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Info size={13} className="text-blue-400" />
          <span>Examples of valid prompts</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 mt-1">
          {examples.map((example, index) => (
            <div
              key={index}
              onClick={() => onSelectExample?.(example)}
              className={`group flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/45 hover:border-blue-500/20 hover:bg-slate-950/70 transition-all ${
                onSelectExample ? "cursor-pointer" : ""
              }`}
            >
              <span className="text-xs font-mono text-slate-300 leading-normal pr-4 group-hover:text-slate-100 transition-colors">
                {example}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {onSelectExample && (
                  <span className="text-[10px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Use Example
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(example, index);
                  }}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy example to clipboard"
                >
                  {copiedIndex === index ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
