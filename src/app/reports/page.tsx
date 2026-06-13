"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { usePrompts, AnalysisResult } from "@/contexts/prompt-context";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  FileDown, Download, Copy, Check, BarChart3, TrendingUp, Award, Clock
} from "lucide-react";

export default function ReportsPage() {
  const { history } = usePrompts();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
            <h1>PromptScore AI Analysis Report</h1>
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
  };

  // Calculate statistics
  const validHistory = history.filter((h) => h.isValid !== false);
  const totalReports = validHistory.length;
  const avgScore = totalReports > 0
    ? Math.round(validHistory.reduce((sum, curr) => sum + curr.scores.overall, 0) / totalReports)
    : 0;
  
  const highQualityCount = validHistory.filter(h => h.scores.overall >= 80).length;

  return (
    <AppLayout activeTab="reports">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} /> Prompt Quality & Reports Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze overall prompt score trajectories and export comprehensive PDF/JSON metrics log sheets.
          </p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Average Efficacy</span>
                <h4 className="text-2xl font-black text-slate-100 mt-0.5">{avgScore}%</h4>
              </div>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                <Award size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Optimized Prompts</span>
                <h4 className="text-2xl font-black text-slate-100 mt-0.5">{highQualityCount} / {totalReports}</h4>
              </div>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Scanned</span>
                <h4 className="text-2xl font-black text-slate-100 mt-0.5">{totalReports} reports</h4>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Detailed Reports List */}
        <GlassCard hoverEffect={false} className="p-6">
          <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider border-b border-white/5 pb-2">
            Generated Reports Log
          </h3>

          <div className="flex flex-col gap-4">
            {validHistory.length > 0 ? (
              validHistory.map((report) => (
                <div 
                  key={report.id}
                  className="p-4 rounded-xl border border-white/5 bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/20 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border bg-slate-900 uppercase ${
                        report.scores.overall >= 80 ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"
                      }`}>
                        Score: {report.scores.overall}%
                      </span>
                      {report.category && (
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{report.category}</span>
                      )}
                      <span className="text-[9px] text-slate-500">
                        • {new Date(report.analyzedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 truncate">{report.originalPrompt}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Clarity: {report.scores.clarity}% | Specificity: {report.scores.specificity}% | Context: {report.scores.context}% | Structure: {report.scores.structure}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyPrompt(report.optimized.standard, report.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                      title="Copy standard optimized draft"
                    >
                      {copiedId === report.id ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === report.id ? "Copied" : "Copy Optimized"}
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(report)}
                      className="p-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 transition-colors flex items-center gap-1.5"
                      title="Download PDF Report"
                    >
                      <FileDown size={14} /> PDF
                    </button>

                    <button
                      onClick={() => handleExportJson(report)}
                      className="p-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 transition-colors flex items-center gap-1.5"
                      title="Export JSON Schema"
                    >
                      <Download size={14} /> JSON
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 italic">
                No prompt evaluation records found. Visit the Analyzer to create reports!
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
