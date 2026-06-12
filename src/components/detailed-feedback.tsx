"use client";

import React from "react";
import { DetailedFeedback as FeedbackType } from "@/contexts/prompt-context";
import { GlassCard } from "./ui/glass-card";
import { Check, X, Info, Sparkles } from "lucide-react";

interface DetailedFeedbackProps {
  feedback: FeedbackType;
  delay?: number;
}

export function DetailedFeedback({ feedback, delay = 0.3 }: DetailedFeedbackProps) {
  const sections = [
    {
      title: "Strengths",
      items: feedback.strengths,
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
      icon: <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />,
    },
    {
      title: "Weaknesses",
      items: feedback.weaknesses,
      color: "border-rose-500/20 text-rose-400 bg-rose-500/5",
      icon: <X size={14} className="text-rose-400 mt-0.5 shrink-0" />,
    },
    {
      title: "Missing Information",
      items: feedback.missing,
      color: "border-amber-500/20 text-amber-400 bg-amber-500/5",
      icon: <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />,
    },
    {
      title: "Improvement Opportunities",
      items: feedback.opportunities,
      color: "border-blue-500/20 text-blue-400 bg-blue-500/5",
      icon: <Sparkles size={14} className="text-blue-400 mt-0.5 shrink-0" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section, idx) => (
        <GlassCard
          key={section.title}
          className={`border ${section.color.split(" ")[0]} h-full`}
          delay={delay + idx * 0.05}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`p-1.5 rounded-lg border ${section.color.split(" ")[0]} bg-slate-900/60`}>
              {section.icon}
            </span>
            <h4 className="font-bold text-sm text-slate-100">{section.title}</h4>
          </div>

          {section.items.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                  <span className="text-slate-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic mt-1">No items identified for this category.</p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
