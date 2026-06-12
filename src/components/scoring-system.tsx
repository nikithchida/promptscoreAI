"use client";

import React from "react";
import { PromptScores } from "@/contexts/prompt-context";
import { GlassCard } from "./ui/glass-card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ScoringSystemProps {
  scores: PromptScores;
  delay?: number;
}

export function ScoringSystem({ scores, delay = 0.2 }: ScoringSystemProps) {
  // Helper to determine letter grade
  const getGrade = (score: number) => {
    if (score >= 95) return { text: "A+", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", label: "Excellent Prompt" };
    if (score >= 90) return { text: "A", color: "text-teal-400 border-teal-500/30 bg-teal-500/5", label: "Highly Optimised" };
    if (score >= 80) return { text: "B", color: "text-blue-400 border-blue-500/30 bg-blue-500/5", label: "Good Structure" };
    if (score >= 70) return { text: "C", color: "text-amber-400 border-amber-500/30 bg-amber-500/5", label: "Needs Improvement" };
    if (score >= 60) return { text: "D", color: "text-orange-400 border-orange-500/30 bg-orange-500/5", label: "Weak Structure" };
    return { text: "F", color: "text-red-400 border-red-500/30 bg-red-500/5", label: "Needs Redesign" };
  };

  const gradeInfo = getGrade(scores.overall);

  // SVG parameters for radial circle
  const radius = 50;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scores.overall / 100) * circumference;

  const metrics = [
    { label: "Clarity", value: scores.clarity, color: "from-blue-500 to-indigo-500", desc: "How simple and unambiguous the directive is." },
    { label: "Specificity", value: scores.specificity, color: "from-cyan-500 to-blue-500", desc: "Granularity of targets and context specified." },
    { label: "Context", value: scores.context, color: "from-blue-600 to-cyan-500", desc: "Background data or situational setup supplied." },
    { label: "Structure", value: scores.structure, color: "from-teal-500 to-emerald-500", desc: "Use of formatting, parameters, and headers." },
    { label: "Predictability", value: scores.predictability, color: "from-blue-500 to-indigo-600", desc: "Chances of getting expected deterministic outputs." },
    { label: "Creativity", value: scores.creativity, color: "from-amber-500 to-orange-500", desc: "Room given for creative flow and variety." },
  ];

  return (
    <GlassCard className="h-full border-slate-800" delay={delay}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">AI Scoring Matrix</h3>
        <p className="text-slate-400 text-xs">A comprehensive breakdown of prompt efficacy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Large Dial Grade Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
          <div className="relative flex items-center justify-center">
            {/* Circle progress ring */}
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.05)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#radialGlow)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="radialGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner score overlay */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black tracking-tight text-white">{scores.overall}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
            </div>
          </div>

          <div className={`mt-4 px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-1.5 ${gradeInfo.color}`}>
            <span>Grade: {gradeInfo.text}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="text-xs font-medium">{gradeInfo.label}</span>
          </div>

          <p className="text-slate-400 text-xs text-center mt-3 max-w-[200px]">
            {scores.overall >= 80 ? (
              <span className="flex items-center gap-1 text-emerald-400 justify-center">
                <CheckCircle size={12} /> Prompt is deployment ready!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 justify-center">
                <AlertCircle size={12} /> Needs structural tuning.
              </span>
            )}
          </p>
        </div>

        {/* Detailed Metrics List */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  {metric.label}
                  <span className="group relative inline-block text-[10px] text-slate-500 cursor-help border border-slate-600 rounded-full h-3.5 w-3.5 flex items-center justify-center font-serif">
                    ?
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-normal normal-case opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-[10px] shadow-xl leading-normal">
                      {metric.desc}
                    </span>
                  </span>
                </span>
                <span className="text-xs font-bold text-slate-100">{metric.value}%</span>
              </div>
              <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
