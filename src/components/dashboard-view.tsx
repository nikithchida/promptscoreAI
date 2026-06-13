"use client";

import React, { useState, useMemo } from "react";
import { usePrompts, AnalysisResult } from "@/contexts/prompt-context";
import { ScoringSystem } from "./scoring-system";
import { DetailedFeedback } from "./detailed-feedback";
import { PromptOptimizer } from "./prompt-optimizer";
import { GlassCard } from "./ui/glass-card";
import { InvalidPromptWarning } from "./invalid-prompt-warning";
import {
  Search,
  Star,
  Trash2,
  Download,
  Copy,
  Check,
  TrendingUp,
  Award,
  Layers,
  History,
  FileDown,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface DashboardViewProps {
  onLoadPromptToEditor: (prompt: string) => void;
}

export function DashboardView({ onLoadPromptToEditor }: DashboardViewProps) {
  const { history, activeAnalysis, setActiveAnalysis, deleteAnalysis, toggleFavorite, analyzePrompt } = usePrompts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "Development" | "Marketing" | "Writing" | "Business">("all");
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Filtered prompt list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "all") return matchesSearch;
      if (filter === "favorites") return item.isFavorite && matchesSearch;
      return item.category === filter && matchesSearch;
    });
  }, [history, searchTerm, filter]);

  // Analytics stats
  const stats = useMemo(() => {
    if (history.length === 0) return { total: 0, avg: 0, favorites: 0 };
    const total = history.length;
    const favorites = history.filter((h) => h.isFavorite).length;
    const validHistory = history.filter((h) => h.isValid !== false);
    const avg = validHistory.length > 0 
      ? Math.round(validHistory.reduce((sum, curr) => sum + curr.scores.overall, 0) / validHistory.length) 
      : 0;
    return { total, avg, favorites };
  }, [history]);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = (analysis: AnalysisResult) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `promptscore_report_${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadPdf = (analysis: AnalysisResult) => {
    setExportingId(analysis.id);
    setTimeout(() => {
      // Print window mockup/print css triggers
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>PromptScore AI Analysis Report</title>
              <style>
                body { font-family: sans-serif; color: #1e293b; padding: 40px; }
                h1 { color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
                .meta { color: #64748b; font-size: 14px; margin-bottom: 20px; }
                .score-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
                .scores-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
                .score-bar { background: #e2e8f0; height: 10px; border-radius: 5px; margin-top: 5px; }
                .score-fill { background: #3b82f6; height: 100%; border-radius: 5px; }
                .prompt-section { background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 15px; font-family: monospace; font-size: 13px; white-space: pre-wrap; margin-bottom: 25px; }
                .list-group { margin-bottom: 20px; }
                .list-group h3 { color: #334155; margin-bottom: 8px; font-size: 16px;}
                .list-group ul { padding-left: 20px; margin: 0; }
                .list-group li { margin-bottom: 6px; font-size: 14px; }
              </style>
            </head>
            <body>
              <h1>PromptScore AI analysis Report</h1>
              <div class="meta">Analyzed on: ${new Date(analysis.analyzedAt).toLocaleString()} | Category: ${analysis.category || "General"}</div>
              
              <div class="score-box">
                <h2>Overall Score: ${analysis.scores.overall}/100</h2>
                <div class="scores-grid">
                  <div>Clarity: ${analysis.scores.clarity}% <div class="score-bar"><div class="score-fill" style="width: ${analysis.scores.clarity}%"></div></div></div>
                  <div>Specificity: ${analysis.scores.specificity}% <div class="score-bar"><div class="score-fill" style="width: ${analysis.scores.specificity}%"></div></div></div>
                  <div>Context: ${analysis.scores.context}% <div class="score-bar"><div class="score-fill" style="width: ${analysis.scores.context}%"></div></div></div>
                  <div>Structure: ${analysis.scores.structure}% <div class="score-bar"><div class="score-fill" style="width: ${analysis.scores.structure}%"></div></div></div>
                </div>
              </div>

              <div class="list-group">
                <h3>Original Prompt</h3>
                <div class="prompt-section">${analysis.originalPrompt}</div>
              </div>

              <div class="list-group">
                <h3>Strengths</h3>
                <ul>${analysis.feedback.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
              </div>

              <div class="list-group">
                <h3>Weaknesses</h3>
                <ul>${analysis.feedback.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>
              </div>

              <div class="list-group">
                <h3>Optimized Version</h3>
                <div class="prompt-section">${analysis.optimized.standard}</div>
              </div>
              
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      setExportingId(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Analytics Banner Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard hoverEffect={false} delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Average Quality</span>
              <h4 className="text-2xl font-black text-slate-100 mt-0.5">{stats.avg}%</h4>
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} delay={0.15}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
              <Award size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Evaluated</span>
              <h4 className="text-2xl font-black text-slate-100 mt-0.5">{stats.total}</h4>
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
              <Star size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Favorites</span>
              <h4 className="text-2xl font-black text-slate-100 mt-0.5">{stats.favorites}</h4>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main dashboard columns */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: history listing */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <GlassCard hoverEffect={false} className="p-4" delay={0.25}>
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-blue-500" />
                <h4 className="font-bold text-sm text-slate-200">History Log</h4>
              </div>

              {/* Search inputs */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-white/10 bg-slate-950/60 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/40 focus:outline-none placeholder-slate-500 text-slate-200"
                />
              </div>

              {/* Filter buttons scrollable */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-white/5 no-scrollbar scroll-smooth">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 ${
                    filter === "all" ? "bg-blue-500/15 text-blue-300 border-blue-500/20" : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("favorites")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 flex items-center gap-1 ${
                    filter === "favorites" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  <Star size={10} className="fill-current" /> Favorites
                </button>
                {["Development", "Marketing", "Writing", "Business"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 ${
                      filter === cat ? "bg-blue-500/15 text-blue-300 border-blue-500/20" : "text-slate-400 border-transparent hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List scrollbox */}
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveAnalysis(item)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex justify-between items-center ${
                        activeAnalysis?.id === item.id
                          ? "bg-blue-500/10 border-blue-500/30"
                          : "bg-slate-900/10 border-white/5 hover:border-blue-500/25 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.isValid === false ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-slate-900 uppercase text-amber-500 border-amber-500/20">
                              ⚠️ Invalid
                            </span>
                          ) : (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border bg-slate-900 uppercase ${
                              item.scores.overall >= 80 ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"
                            }`}>
                              {item.scores.overall}%
                            </span>
                          )}
                          {item.category && (
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{item.category}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 truncate font-mono">{item.originalPrompt}</p>
                      </div>

                      {/* Actions on hover/select */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`p-1.5 rounded-lg border border-transparent hover:bg-slate-800 transition-colors ${
                            item.isFavorite ? "text-yellow-400" : "text-slate-500 hover:text-yellow-400"
                          }`}
                        >
                          <Star size={11} className={item.isFavorite ? "fill-current" : ""} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnalysis(item.id);
                          }}
                          className="p-1.5 rounded-lg border border-transparent hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500 italic">No search entries found.</div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Panel: selected item details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeAnalysis ? (
              activeAnalysis.isValid === false ? (
                <InvalidPromptWarning onSelectExample={onLoadPromptToEditor} />
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Header card with action bars */}
                  <GlassCard hoverEffect={false} className="py-4 px-6 border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-md font-bold text-slate-100 flex items-center gap-1.5">
                          <Layers size={16} className="text-blue-500" /> Analysis Report Details
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Prompt categorized as <strong className="text-blue-300">{activeAnalysis.category || "General"}</strong> • 
                          Analyzed {new Date(activeAnalysis.analyzedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onLoadPromptToEditor(activeAnalysis.originalPrompt)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center gap-1"
                        >
                          <Copy size={12} /> Edit Original
                        </button>

                        <button
                          onClick={() => handleDownloadPdf(activeAnalysis)}
                          disabled={exportingId === activeAnalysis.id}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5 flex items-center gap-1"
                        >
                          <FileDown size={12} /> {exportingId === activeAnalysis.id ? "Saving..." : "PDF"}
                        </button>

                        <button
                          onClick={() => handleExportJson(activeAnalysis)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5 flex items-center gap-1"
                          title="Export analysis as JSON"
                        >
                          <Download size={12} /> JSON
                        </button>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Score breakdown charts */}
                  <ScoringSystem scores={activeAnalysis.scores} />

                  {/* Feedbacks bullet box list */}
                  <DetailedFeedback feedback={activeAnalysis.feedback} />

                  {/* Side by side comparison selector */}
                  <PromptOptimizer
                    original={activeAnalysis.originalPrompt}
                    optimized={activeAnalysis.optimized}
                    originalScore={activeAnalysis.scores.overall}
                    onApply={onLoadPromptToEditor}
                    onReanalyze={async (text) => {
                      await analyzePrompt(text, activeAnalysis.category);
                    }}
                  />
                </div>
              )
            ) : (
              <GlassCard hoverEffect={false} className="py-16 text-center border-dashed border-white/10">
                <div className="p-4 bg-slate-900/60 rounded-full border border-white/5 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={24} />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">No Active Evaluation Selected</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Run a prompt evaluation in the analyzer, or select a log card from the history sidebar log to review detailed optimized variants.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      ) : (
        <GlassCard hoverEffect={false} className="py-16 text-center border-dashed border-white/10 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto w-full mt-4">
          <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-full w-20 h-20 flex items-center justify-center text-blue-400 animate-pulse">
            <Sparkles size={36} />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">Welcome to PromptScore AI</h3>
            <h4 className="text-sm font-semibold text-blue-400">You have not analyzed any prompts yet.</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              No prompts analyzed yet. Start by analyzing your first prompt.
            </p>
          </div>
          <button
            onClick={() => onLoadPromptToEditor("")}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg active:scale-[0.98] mt-2 flex items-center gap-2"
          >
            Analyze First Prompt <ArrowRight size={14} />
          </button>
        </GlassCard>
      )}
    </div>
  );
}
