"use client";

import React, { useState } from "react";
import { OptimizedPrompts } from "@/contexts/prompt-context";
import { GlassCard } from "./ui/glass-card";
import { Copy, Check, RefreshCw, Eye, Zap, AlertTriangle, CheckCircle2, Play } from "lucide-react";

interface PromptOptimizerProps {
  original: string;
  optimized: OptimizedPrompts;
  originalScore?: number;
  onApply?: (optimizedText: string) => void;
  onReanalyze?: (optimizedText: string) => Promise<void>;
  delay?: number;
}

export function PromptOptimizer({
  original,
  optimized,
  originalScore = 15,
  onApply,
  onReanalyze,
  delay = 0.4
}: PromptOptimizerProps) {
  const [activeTab, setActiveTab] = useState<keyof OptimizedPrompts>("standard");
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);

  const activeOptimizedText = optimized[activeTab] || "";

  const tabs: { id: keyof OptimizedPrompts; label: string; desc: string }[] = [
    { id: "standard", label: "Standard", desc: "Highly improved prompt balancing instructions, context, and clear boundaries." },
    { id: "professional", label: "Professional", desc: "Expert framing incorporating formal workflow procedures and methodologies." },
    { id: "beginner", label: "Beginner-Friendly", desc: "Tutorial phrasing that asks the model to explain assumptions and concepts step-by-step." },
    { id: "expert", label: "Expert Mode", desc: "Elite research specialist style imposing academic-grade standards and edge case analysis." },
    { id: "interview", label: "Interview Ready", desc: "Structured for technical mock interview preparation and scenario trade-off tests." },
    { id: "production", label: "Production Ready", desc: "Robust system instruction schema requiring structured JSON/XML data formats and error resiliency." }
  ];

  // Helper to calculate score of optimized text in real time
  const calculateTextScore = (text: string): number => {
    const len = text.length;
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    const hasRole = /\b(act as|you are|role|expert|specialist|designer|developer|writer)\b/i.test(text);
    const hasFormat = /\b(format|markdown|table|list|bullet|xml|json|codeblock|output|headers|structure)\b/i.test(text);
    const hasConstraints = /\b(limit|not|avoid|exclude|dont|don't|only|under|words|characters)\b/i.test(text);
    const hasContext = /\b(context|background|project|company|product|audience|client)\b/i.test(text) || len > 120;
    const hasExamples = /\b(example|instance|sample|illustration|like:|\bfor example\b)\b/i.test(text);

    const clarity = Math.min(40 + (wordCount > 10 ? 25 : 10) + (len > 50 ? 25 : 10) + (hasFormat ? 10 : 0), 100);
    const specificity = Math.min(20 + (wordCount > 20 ? 30 : 10) + (hasConstraints ? 25 : 0) + (hasRole ? 25 : 0), 100);
    const contextScore = Math.min(10 + (hasContext ? 45 : 10) + (len > 150 ? 45 : 15), 100);
    const structure = Math.min(10 + (hasFormat ? 50 : 10) + (text.includes("\n") ? 40 : 10), 100);
    const predictability = Math.min(20 + (hasFormat ? 30 : 0) + (hasConstraints ? 30 : 0) + (hasExamples ? 20 : 0), 100);

    return Math.round((clarity * 0.25) + (specificity * 0.25) + (contextScore * 0.2) + (structure * 0.15) + (predictability * 0.15));
  };

  const expectedScore = calculateTextScore(activeOptimizedText);
  const pointImprovement = Math.max(0, expectedScore - originalScore);

  // Original prompt components check (to show missing items)
  const origHasRole = /\b(act as|you are|role|expert|specialist|designer|developer|writer)\b/i.test(original);
  const origHasFormat = /\b(format|markdown|table|list|bullet|xml|json|codeblock|output|headers|structure)\b/i.test(original);
  const origHasConstraints = /\b(limit|not|avoid|exclude|dont|don't|only|under|words|characters)\b/i.test(original);
  const origHasContext = /\b(context|background|project|company|product|audience|client)\b/i.test(original) || original.length > 120;
  const origHasExamples = /\b(example|instance|sample|illustration|like:|\bfor example\b)\b/i.test(original);

  const missingReport: string[] = [];
  const addedReport: string[] = [];

  if (!origHasRole) {
    missingReport.push("Role Definition");
    addedReport.push("Role Definition");
  }
  if (!origHasContext) {
    missingReport.push("Context");
    addedReport.push("Context");
  }
  if (!origHasConstraints) {
    missingReport.push("Constraints");
    addedReport.push("Requirements");
  }
  if (!origHasExamples) {
    missingReport.push("Examples");
  }
  if (!origHasFormat) {
    missingReport.push("Output Format");
    addedReport.push("Structure");
    addedReport.push("Output Instructions");
  }

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

  const handleReanalyze = async () => {
    if (!onReanalyze) return;
    setReanalyzing(true);
    try {
      await onReanalyze(activeOptimizedText);
    } catch (e) {
      console.error(e);
    } finally {
      setReanalyzing(false);
    }
  };

  // Semantic highlighting parser
  const renderHighlightedText = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Semantic colors definition
    const roleSpan = (t: string) => `<span class="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1 py-0.5 rounded font-medium" title="Role/Persona Definition">${t}</span>`;
    const formatSpan = (t: string) => `<span class="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1 py-0.5 rounded font-medium" title="Output Formatting">${t}</span>`;
    const constraintSpan = (t: string) => `<span class="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1 py-0.5 rounded font-medium" title="Constraints & Limits">${t}</span>`;
    const contextSpan = (t: string) => `<span class="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-1 py-0.5 rounded font-medium" title="Context & Target Audience">${t}</span>`;

    // Standard replacements
    html = html.replace("Act as an expert in this task.", roleSpan("Act as an expert in this task."));
    html = html.replace("Format the output using clear markdown header tags and bullet points.", formatSpan("Format the output using clear markdown header tags and bullet points."));
    html = html.replace("Keep explanations concise and practical, avoiding general filler.", constraintSpan("Keep explanations concise and practical, avoiding general filler."));
    html = html.replace("Ensure the output is tailored for a professional reader looking for actionable items.", contextSpan("Ensure the output is tailored for a professional reader looking for actionable items."));

    // Professional replacements
    html = html.replace("You are a Senior Advisor and Subject Matter Expert.", roleSpan("You are a Senior Advisor and Subject Matter Expert."));
    html = html.replace("Establish a logical framework, outlining your methodology before outputting final answers.", contextSpan("Establish a logical framework, outlining your methodology before outputting final answers."));
    html = html.replace("Constantly validate against standard best-practices.", constraintSpan("Constantly validate against standard best-practices."));
    html = html.replace("Deliver findings in a comprehensive format containing inline subsections.", formatSpan("Deliver findings in a comprehensive format containing inline subsections."));

    // Beginner replacements
    html = html.replace("Can you explain it in simple terms, step-by-step?", formatSpan("Can you explain it in simple terms, step-by-step?"));
    html = html.replace("Please use easy-to-understand language, avoid complex jargon, and give simple examples where appropriate to help me learn how this works.", constraintSpan("Please use easy-to-understand language, avoid complex jargon, and give simple examples where appropriate to help me learn how this works."));

    // Expert replacements
    html = html.replace("Act as an elite domain specialist and research lead.", roleSpan("Act as an elite domain specialist and research lead."));
    html = html.replace("Analyze the following request under rigorous academic and technical standards:", contextSpan("Analyze the following request under rigorous academic and technical standards:"));
    html = html.replace("1. Deconstruct the request into core theoretical and practical principles.", contextSpan("1. Deconstruct the request into core theoretical and practical principles."));
    html = html.replace("2. Outline advanced methodologies, edge cases, and failure modes.", constraintSpan("2. Outline advanced methodologies, edge cases, and failure modes."));
    html = html.replace("3. Use domain-specific terminology with deep analysis.", formatSpan("3. Use domain-specific terminology with deep analysis."));

    // Interview replacements
    html = html.replace("Act as an expert interviewer and technical assessor.", roleSpan("Act as an expert interviewer and technical assessor."));
    html = html.replace("Formulate a response structured for an interview preparation scenario:", contextSpan("Formulate a response structured for an interview preparation scenario:"));
    html = html.replace("1. Provide a step-by-step breakdown of how a top candidate would answer.", formatSpan("1. Provide a step-by-step breakdown of how a top candidate would answer."));
    html = html.replace("2. Identify 3 critical follow-up questions the interviewer might ask.", constraintSpan("2. Identify 3 critical follow-up questions the interviewer might ask."));
    html = html.replace("3. List key trade-offs and behavioral checkpoints related to this topic.", formatSpan("3. List key trade-offs and behavioral checkpoints related to this topic."));

    // Production replacements
    html = html.replace("Act as a production-grade software system component.", roleSpan("Act as a production-grade software system component."));
    html = html.replace("Execute the following directive with high robustness and error resilience:", contextSpan("Execute the following directive with high robustness and error resilience:"));
    html = html.replace("- Format the output strictly as valid JSON conforming to a schema, or clear XML.", formatSpan("- Format the output strictly as valid JSON conforming to a schema, or clear XML."));
    html = html.replace("- Provide comprehensive error handling, input validation notes, and boundary condition checks.", constraintSpan("- Provide comprehensive error handling, input validation notes, and boundary condition checks."));
    html = html.replace("- Do not output conversational preamble or postscript commentary. Pure structured data only.", constraintSpan("- Do not output conversational preamble or postscript commentary. Pure structured data only."));

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <GlassCard className="border-slate-800 flex flex-col gap-6" delay={delay}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 tracking-tight">
            <Zap size={20} className="text-blue-500 animate-pulse animate-duration-1000" /> Smart Prompt Optimizer
          </h3>
          <p className="text-slate-400 text-xs mt-1">Review alternative generated models, compare improvements, and apply optimized variations.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 self-start md:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab description */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-2.5 text-xs text-blue-300 flex items-center gap-2 leading-relaxed">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
        <div>
          <strong className="uppercase text-[9px] tracking-wider text-blue-400">Mode Description:</strong> {tabs.find((t) => t.id === activeTab)?.desc}
        </div>
      </div>

      {/* Score Improvement Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.03] to-cyan-500/[0.03] p-4 text-center items-center gap-4 relative overflow-hidden">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Original Score</span>
          <div className="text-2xl font-black text-slate-400 mt-1">{originalScore}/100</div>
        </div>

        <div className="flex flex-col items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-4 shadow-inner">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Expected Score</span>
          <div className="text-3xl font-black text-white mt-0.5">{expectedScore}/100</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Estimated Boost</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">+{pointImprovement} Points</div>
        </div>
      </div>

      {/* Improvement Report Details */}
      {missingReport.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle size={12} /> Missing parameters in original
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingReport.map((m) => (
                <span key={m} className="px-2 py-1 rounded bg-red-500/5 border border-red-500/10 text-[10px] text-red-400 font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={12} /> Automatically added
            </span>
            <div className="flex flex-wrap gap-1.5">
              {addedReport.map((a) => (
                <span key={a} className="px-2 py-1 rounded bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Grid comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Original prompt panel */}
        <div className="flex flex-col rounded-xl bg-slate-950/45 border border-white/5 overflow-hidden shadow-lg">
          <div className="flex justify-between items-center bg-slate-950/60 px-4 py-2.5 border-b border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Original Prompt</span>
            <button
              onClick={() => handleCopy(original, true)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5 font-semibold"
            >
              {copiedOriginal ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copiedOriginal ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 text-xs font-mono text-slate-400 whitespace-pre-wrap select-text h-56 overflow-y-auto leading-relaxed">
            {original}
          </div>
        </div>

        {/* Optimized prompt panel */}
        <div className="flex flex-col rounded-xl bg-slate-950/45 border border-blue-500/25 overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="flex justify-between items-center bg-blue-500/10 px-4 py-2.5 border-b border-blue-500/20">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
              <Eye size={12} /> Optimized ({tabs.find((t) => t.id === activeTab)?.label})
            </span>
            <button
              onClick={() => handleCopy(activeOptimizedText, false)}
              className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5 font-semibold"
            >
              {copiedOptimized ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copiedOptimized ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 text-xs font-mono text-slate-200 bg-slate-900/30 whitespace-pre-wrap select-text h-56 overflow-y-auto leading-relaxed border-l-2 border-blue-500/40">
            {renderHighlightedText(activeOptimizedText)}
          </div>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/5 pt-4">
        {onApply && (
          <button
            onClick={() => onApply(activeOptimizedText)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={13} className="text-emerald-400" />
            Replace Original Prompt
          </button>
        )}
        
        {onReanalyze && (
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 transition-all shadow shadow-blue-500/10 disabled:opacity-50 active:scale-95"
          >
            {reanalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <Play size={12} className="fill-current text-white/95" />
                Re-analyze Optimized Prompt
              </>
            )}
          </button>
        )}
      </div>
      
    </GlassCard>
  );
}
