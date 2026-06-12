"use client";

import React, { useState } from "react";
import { usePrompts } from "@/contexts/prompt-context";
import { Sparkles, Trash2, Cpu, FileText, ChevronRight } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

interface PromptAnalyzerProps {
  onAnalysisSuccess?: () => void;
  initialValue?: string;
  initialCategory?: string;
}

export function PromptAnalyzer({ onAnalysisSuccess, initialValue = "", initialCategory = "General" }: PromptAnalyzerProps) {
  const { analyzePrompt } = usePrompts();
  const [promptText, setPromptText] = useState(initialValue);
  const [category, setCategory] = useState(initialCategory);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterCount = promptText.length;
  const wordCount = promptText.split(/\s+/).filter(Boolean).length;

  const handleAnalyze = async () => {
    if (!promptText.trim()) {
      setError("Please enter a prompt to analyze.");
      return;
    }
    setError(null);
    setAnalyzing(true);
    try {
      await analyzePrompt(promptText, category);
      if (onAnalysisSuccess) {
        onAnalysisSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while evaluating your prompt.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setPromptText("");
    setError(null);
  };

  const handleQuickImprove = () => {
    if (promptText.length > 0) {
      setPromptText(`Act as an expert tutor. Explain the main concepts of: "${promptText.trim()}" in a step-by-step layout using simple comparisons.`);
    }
  };

  return (
    <GlassCard className="border-slate-800" delay={0.1}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <Cpu className="text-blue-500 w-5 h-5" /> Prompt Analyzer
          </h2>
          <p className="text-slate-400 text-sm mt-1">Paste your AI prompt below to evaluate and grade its effectiveness.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input text-xs px-3 py-1.5 rounded-lg border-white/10 text-white bg-slate-900 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Writing">Writing</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Paste your ChatGPT, Claude, or Midjourney prompt here... (e.g., 'Write a python script to clean a CSV file')"
          className="w-full h-48 md:h-60 p-4 rounded-xl border border-white/10 bg-slate-900/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/40 resize-y text-sm leading-relaxed"
          maxLength={8000}
        />
        {characterCount > 0 && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-white/5"
            title="Clear prompt"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
        {/* Analytics counts */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <FileText size={14} className="text-slate-500" />
            <span>Characters: <strong className="text-slate-200">{characterCount}</strong></span>
          </div>
          <div>
            <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
          </div>
        </div>

        {/* Action button rows */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {characterCount > 0 && characterCount < 100 && (
            <button
              onClick={handleQuickImprove}
              className="px-3 py-2 text-xs rounded-xl bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 transition-all font-medium flex items-center gap-1.5"
            >
              <Sparkles size={13} /> Quick Format
            </button>
          )}

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !promptText.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-blue-500/10 active:scale-[0.98] transition-all"
          >
            {analyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Prompt <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
