"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { runLocalEvaluation } from "@/contexts/prompt-context";
import { isValidPrompt } from "@/lib/prompt-validator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldAlert, Cpu,
  Eye, FileDown, Download, Quote
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PublicNavbar } from "@/components/public-navbar";

export default function LandingPage() {
  const { user } = useAuth();
  const [demoPrompt, setDemoPrompt] = useState("Write a python script that cleans CSV data.");
  const [activeFeatureTab, setActiveFeatureTab] = useState<"analysis" | "optimization" | "templates" | "sharing" | "analytics">("analysis");
  
  // Interactive Demo State
  const [demoStep, setDemoStep] = useState<"input" | "analyze" | "optimize" | "export">("input");
  
  // Active Navigation Scroll Tracking State
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["problems", "workflow", "platform-in-action", "features"];
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleScrollToDemo = () => {
    const element = document.getElementById("platform-in-action");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { value: "4.8M+", label: "Prompts Evaluated" },
    { value: "1.2M+", label: "Reports Generated" },
    { value: "+184%", label: "Average Efficacy Increase" },
  ];

  const promptProblems = [
    {
      title: "Vague Instructions",
      description: "AI models output generic fluff when tasks aren't specified with precision or clear parameters.",
      badge: "Inconsistent Outputs"
    },
    {
      title: "Missing Context",
      description: "Failing to set up a persona, target audience, or background scenario leads to flat, out-of-context answers.",
      badge: "Flat Responses"
    },
    {
      title: "Poor Formatting Details",
      description: "Outputs generated without strict formatting constraints (e.g. JSON schemas, markdown lists) break integration pipelines.",
      badge: "Parsing Errors"
    },
    {
      title: "Low Predictability",
      description: "Omitting positive and negative boundary conditions means response formats drift wildly across queries.",
      badge: "High Variance"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Ingest & Analyze",
      description: "Paste your prompt into the analyzer, choose a target category, and run a structural diagnostics scan."
    },
    {
      step: "02",
      title: "Detect Vulnerabilities",
      description: "Our rules engine audits missing contexts, vague parameters, missing boundary rules, and constraints."
    },
    {
      step: "03",
      title: "Variational Tuning",
      description: "Instantly draft optimized alternatives: Professional Expert, Concise Short, or Beginner guides."
    },
    {
      step: "04",
      title: "Export & Integrate",
      description: "Copy codeblocks, export JSON diagnostics schemas, or download branded PDF reports for your team."
    }
  ];

  const features = {
    analysis: [
      { title: "7-Metric Audit", desc: "Evaluate Clarity, Specificity, Context, Structure, Creativity, and Predictability parameters." },
      { title: "Grade Boundaries", desc: "Grades calculated from F to A+ using industry-standard engineering benchmarks." },
      { title: "Vulnerability Check", desc: "Flags missing parameters, unanchored context fields, and open-ended queries." }
    ],
    optimization: [
      { title: "Style Rewriting", desc: "Alternative drafts optimized for varying developer, business, or educational roles." },
      { title: "Constraints Tuning", desc: "Automatically inject negative constraints to stop fluff or corporate jargon." },
      { title: "One-Click Apply", desc: "Instantly feed optimized variants back into your active workspace editor." }
    ],
    templates: [
      { title: "Placeholder Variable", desc: "Use bracketed placeholders like [Language] to stitch reusable prompt configurations." },
      { title: "Pre-Built Libraries", desc: "Quick-start templates tailored for developer refactoring, SEO optimization, and outreach." },
      { title: "Custom Save", desc: "Build, categorize, search, and favorite your team's custom prompt assets." }
    ],
    sharing: [
      { title: "JSON Schemas", desc: "Export full diagnostic models to share across prompt pipelines." },
      { title: "Branded PDF Logs", desc: "Print clean summaries including scorecards, original vs optimized text, and tips." },
      { title: "Raw Markdown Copies", desc: "Export and copy cleaned versions instantly to your system clipboard." }
    ],
    analytics: [
      { title: "Score Progress Charts", desc: "Observe prompts score trajectories and usage trends over time on your dashboard." },
      { title: "Historical Archives", desc: "Searchable logs filterable by date, favorites, score ranges, and category tags." },
      { title: "Team Efficacy Tracking", desc: "Evaluate prompts across categories to standardize team LLM outputs." }
    ]
  };

  const testimonials = [
    {
      quote: "PromptScore AI changed our entire workflow. We stopped guessing how prompts would perform across models and started testing them systematically.",
      author: "Alex Rivera",
      role: "Lead AI Architect, Vercel",
      avatar: "AR"
    },
    {
      quote: "The variational compiler is incredible. Translating a developer prompt into a concise block saved us hours of API tokens.",
      author: "Sarah Chen",
      role: "Sr. Product Manager, Stripe",
      avatar: "SC"
    },
    {
      quote: "Before PromptScore, our templates were a mess. The bracketed placeholder variable compiler standardizes how our copywriting team queries LLMs.",
      author: "Marcus Vance",
      role: "Developer Advocate, Supabase",
      avatar: "MV"
    }
  ];

  // Dynamic evaluation for Interactive Demo
  const demoAnalysis = useMemo(() => {
    return runLocalEvaluation(demoPrompt, "General");
  }, [demoPrompt]);

  const getGrade = (score: number) => {
    if (score >= 95) return { text: "A+", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", label: "Excellent Prompt" };
    if (score >= 90) return { text: "A", color: "text-teal-400 border-teal-500/30 bg-teal-500/5", label: "Highly Optimised" };
    if (score >= 80) return { text: "B", color: "text-blue-400 border-blue-500/30 bg-blue-500/5", label: "Good Structure" };
    if (score >= 70) return { text: "C", color: "text-amber-400 border-amber-500/30 bg-amber-500/5", label: "Needs Improvement" };
    if (score >= 60) return { text: "D", color: "text-orange-400 border-orange-500/30 bg-orange-500/5", label: "Weak Structure" };
    return { text: "F", color: "text-red-400 border-red-500/30 bg-red-500/5", label: "Needs Redesign" };
  };

  const handleExportDemoJson = (analysis: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `promptscore_demo_report_${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadDemoPdf = (analysis: any) => {
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
              <ul>${analysis.feedback.strengths.map((s: string) => `<li>${s}</li>`).join("")}</ul>
            </div>

            <div class="list-group">
              <h3>Weaknesses</h3>
              <ul>${analysis.feedback.weaknesses.map((w: string) => `<li>${w}</li>`).join("")}</ul>
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

  return (
    <div className="min-h-screen bg-[#0B1020] grid-bg relative overflow-hidden flex flex-col justify-between scroll-smooth selection:bg-blue-500/20 selection:text-blue-200">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] radial-glow-cyan -z-10 pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] left-[-10%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-50" />

      {/* Header/Navbar */}
      <PublicNavbar activeSection={activeSection} />

      {/* Page Body sections */}
      <div className="flex flex-col gap-24 max-w-7xl mx-auto px-6 pt-4 md:pt-8 pb-16 w-full">
        
        {/* 1. Hero Section */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 md:py-10">
          {/* Left Side: marketing values */}
          <div className="lg:col-span-6 flex flex-col gap-5 text-left items-start">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-[10px] font-bold tracking-wider uppercase"
            >
              <Sparkles size={11} /> Stop Guessing AI Performance
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white animate-fade-in"
            >
              Consistent LLM Outputs Require{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Structured Prompts.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-400 text-sm md:text-md leading-relaxed max-w-xl"
            >
              Don't leave model response formatting to chance. PromptScore AI scans your directives for clarity, specificity, and constraints, returning instant quality scorecards and optimized rewrites.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-row items-center gap-3 mt-2"
            >
              <Link
                href={user ? "/analyzer" : "/register"}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-all active:scale-[0.98] group"
              >
                Go to Workspace <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={handleScrollToDemo}
                className="px-6 py-3 rounded-xl bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all"
              >
                Try Live Analyzer
              </button>
            </motion.div>
          </div>

          {/* Right Column: Large Product Mockup */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full bg-slate-950/70 rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm"
            >
              {/* Mockup Browser Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500/40" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/40" />
                  <span className="h-2 w-2 rounded-full bg-green-500/40" />
                  <span className="text-[9px] text-slate-500 font-mono ml-2">workspace/analyzer</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-wider">
                  Active Analysis
                </div>
              </div>

              {/* Mockup Workspace Grid */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5 bg-slate-900/60 rounded-xl p-3 border border-white/5 text-center flex flex-col items-center justify-center">
                    <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Overall Grade</span>
                    <div className="relative flex items-center justify-center mt-2">
                      <svg height="64" width="64" className="transform -rotate-90">
                        <circle stroke="rgba(255, 255, 255, 0.05)" fill="transparent" strokeWidth="4" r="26" cx="32" cy="32" />
                        <circle stroke="#3B82F6" fill="transparent" strokeWidth="4" strokeDasharray="163.3" strokeDashoffset="26.1" strokeLinecap="round" r="26" cx="32" cy="32" />
                      </svg>
                      <div className="absolute text-sm font-black text-white">94%</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 mt-2 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">A+ Highly Optimised</span>
                  </div>

                  <div className="sm:col-span-7 bg-slate-900/60 rounded-xl p-3 border border-white/5 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-medium">Clarity</span>
                      <span className="text-slate-200 font-bold">95%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full w-[95%]" />
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-medium">Specificity</span>
                      <span className="text-slate-200 font-bold">90%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[90%]" />
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-medium">Context</span>
                      <span className="text-slate-200 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full w-[92%]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 flex flex-col">
                    <div className="bg-slate-950/60 px-3 py-1.5 border-b border-white/5 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Original Prompt</span>
                      <span className="text-[8px] text-red-400 uppercase font-bold px-1 rounded bg-red-500/10 border border-red-500/10">37%</span>
                    </div>
                    <div className="p-3 text-[10px] font-mono text-slate-500 leading-normal line-clamp-3">
                      "Write a python script that cleans CSV data."
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.02] flex flex-col">
                    <div className="bg-blue-500/10 px-3 py-1.5 border-b border-blue-500/20 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-blue-300 uppercase">Optimized Prompt</span>
                      <span className="text-[8px] text-emerald-400 uppercase font-bold px-1 rounded bg-emerald-500/10 border border-emerald-500/10">94%</span>
                    </div>
                    <div className="p-3 text-[10px] font-mono text-slate-200 leading-normal line-clamp-3 border-l-2 border-blue-500/30">
                      "Act as a Python Data Engineer. Clean sales CSV files using pandas. Convert headers to snake_case, drop null row IDs, and save."
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Problems Section */}
        <section id="problems" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">The Prompt Paradox</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Why Most AI Prompts Fail</h2>
            <p className="text-slate-400 text-xs">Standard inputs lead to subpar outputs. Here are the core vulnerabilities that limit LLM response quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promptProblems.map((prob, idx) => (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard hoverEffect={false} className="border-red-500/10 bg-red-500/[0.01] flex flex-col gap-3 h-full">
                  <div className="flex justify-between items-center">
                    <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                      <ShieldAlert size={16} />
                    </span>
                    <span className="text-[9px] font-bold text-red-400/80 px-2 py-0.5 rounded border border-red-500/20 bg-red-500/5">
                      {prob.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-200 mt-2">{prob.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{prob.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Workflow Section */}
        <section id="workflow" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Streamlined Pipeline</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">How PromptScore AI Works</h2>
            <p className="text-slate-400 text-xs">Four simple steps to refactor instructions into structured, reliable prompts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, idx) => (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex flex-col"
              >
                <GlassCard hoverEffect={false} className="flex-1 flex flex-col gap-4 border-slate-800 h-full relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-blue-500/20 font-mono">{st.step}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-200 mt-1 uppercase tracking-wide">{st.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{st.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Platform In Action (Interactive Walkthrough Demo) */}
        <section id="platform-in-action" className="scroll-mt-20 flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-1">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Interactive Walkthrough</span>
            <h2 className="text-2xl font-black text-white">Platform In Action</h2>
            <p className="text-slate-400 text-xs">Type a prompt and click the phases below to see our core optimizer in action.</p>
          </div>

          <div className="w-full bg-slate-950/45 rounded-2xl border border-white/5 p-5 md:p-6 shadow-xl">
            {/* Demo Stepper Buttons */}
            <div className="grid grid-cols-4 gap-2 border-b border-white/5 pb-4 mb-6">
              {[
                { id: "input", label: "01 Ingest Prompt" },
                { id: "analyze", label: "02 Scan Weaknesses" },
                { id: "optimize", label: "03 Compile Variants" },
                { id: "export", label: "04 Ready Export" }
              ].map((stepItem) => (
                <button
                  key={stepItem.id}
                  onClick={() => setDemoStep(stepItem.id as any)}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                    demoStep === stepItem.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {stepItem.label}
                </button>
              ))}
            </div>

            {/* Step Content Rendering */}
            <div className="min-h-[160px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {demoStep === "input" && (
                  <motion.div
                    key="input-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col gap-3 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 uppercase">Input Text Editor</h4>
                      <span className="text-[10px] text-slate-500">Characters: {demoPrompt.length}</span>
                    </div>
                    <textarea
                      value={demoPrompt}
                      onChange={(e) => setDemoPrompt(e.target.value)}
                      className="w-full h-32 p-4 rounded-xl border border-white/5 bg-slate-900/20 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/40 focus:outline-none resize-none leading-relaxed"
                      placeholder="Type or paste your prompt here to see the optimizer in action..."
                    />
                  </motion.div>
                )}
 
                {demoStep === "analyze" && (
                  <motion.div
                    key="analyze-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 mb-2 uppercase">
                        Scan score: {demoAnalysis.scores.overall}/100
                      </h4>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            demoAnalysis.isValid === false
                              ? "bg-red-500 w-[1%]"
                              : demoAnalysis.scores.overall >= 80
                              ? "bg-emerald-500"
                              : demoAnalysis.scores.overall >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${demoAnalysis.isValid === false ? 1 : demoAnalysis.scores.overall}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {demoAnalysis.isValid === false
                          ? "Fail metrics checked: The input is not a valid AI prompt structure."
                          : demoAnalysis.scores.overall >= 80
                          ? "Success metrics met: Explicit persona assigned, formatting constraints defined, clear goal context."
                          : "Fail metrics checked: Missing key attributes like persona, constraints, or format rules."}
                      </p>
                    </div>
                    <div 
                      className={`p-3 border rounded-xl flex flex-col gap-2 ${
                        demoAnalysis.isValid === false || demoAnalysis.scores.overall < 80
                          ? "bg-red-500/5 border-red-500/20 text-red-400"
                          : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                        {demoAnalysis.isValid === false || demoAnalysis.scores.overall < 80 ? (
                          <ShieldAlert size={12} />
                        ) : (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        )} 
                        {demoAnalysis.isValid === false
                          ? "Invalid Prompt Structure"
                          : "Flagged Diagnostics"}
                      </span>
                      <ul className="text-[10px] text-slate-400 flex flex-col gap-1 list-disc pl-4">
                        {demoAnalysis.isValid === false ? (
                          <>
                            <li>
                              Reason: {isValidPrompt(demoPrompt).reason || "No instruction or task detected."}
                            </li>
                            <li>
                              A valid prompt needs instruction verbs (e.g. create, clean, explain) and at least 3 meaningful words.
                            </li>
                          </>
                        ) : (
                          <>
                            {demoAnalysis.feedback.weaknesses.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                            {demoAnalysis.feedback.missing.map((m, idx) => (
                              <li key={`m-${idx}`}>{m}</li>
                            ))}
                            {demoAnalysis.feedback.weaknesses.length === 0 && demoAnalysis.feedback.missing.length === 0 && (
                              <li>No significant weaknesses flagged! Your prompt follows best engineering practices.</li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
 
                {demoStep === "optimize" && (
                  <motion.div
                    key="optimize-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col gap-3 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 uppercase">
                        {demoAnalysis.isValid === false
                          ? "Optimization Failed"
                          : `Optimized Rewrite (Grade ${getGrade(demoAnalysis.scores.overall).text})`}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        {demoAnalysis.isValid === false ? "Score: 0" : `Score: ${Math.max(90, demoAnalysis.scores.overall + 10)}`}
                      </span>
                    </div>
                    {demoAnalysis.isValid === false ? (
                      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.02] text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed border-l-2 border-red-500">
                        Please enter a valid prompt in Step 1 to generate optimized variations.
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.02] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border-l-2 border-blue-500">
                        {demoAnalysis.optimized.standard}
                      </div>
                    )}
                  </motion.div>
                )}
 
                {demoStep === "export" && (
                  <motion.div
                    key="export-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col gap-4 text-left items-center justify-center py-4"
                  >
                    <h4 className="text-xs font-bold text-slate-300 uppercase font-bold">
                      {demoAnalysis.isValid === false
                        ? "Export Unavailable"
                        : "Diagnostics Model Exports Ready"}
                    </h4>
                    {demoAnalysis.isValid === false ? (
                      <p className="text-[11px] text-slate-400 text-center max-w-sm">
                        Please enter a valid prompt in Step 1 to unlock prompt copy and diagnostic report downloads.
                      </p>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(demoAnalysis.optimized.standard);
                            alert("Copied optimized prompt to clipboard!");
                          }}
                          className="px-4 py-2 rounded-lg text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-500 shadow transition-colors"
                        >
                          <Eye size={12} /> Copy Prompt
                        </button>
                        <button 
                          onClick={() => handleDownloadDemoPdf(demoAnalysis)}
                          className="px-4 py-2 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          <FileDown size={12} /> Download PDF Report
                        </button>
                        <button 
                          onClick={() => handleExportDemoJson(demoAnalysis)}
                          className="px-4 py-2 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          <Download size={12} /> Export JSON Schema
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. Features Showcase Section */}
        <section id="features" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Feature Inventory</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Full-Stack Prompt Toolkit</h2>
            <p className="text-slate-400 text-xs">Explore structural metrics, category templates, usage analytics logs, and export systems.</p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 justify-center max-w-lg mx-auto w-full">
              {Object.keys(features).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFeatureTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    activeFeatureTab === tab
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <AnimatePresence mode="wait">
                {features[activeFeatureTab].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <GlassCard hoverEffect={false} className="border-white/5 h-full">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                        <CheckCircle2 size={16} />
                      </div>
                      <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section className="flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">User Reviews</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">What AI Builders Say</h2>
            <p className="text-slate-400 text-xs">Discover how teams standardise queries and minimize LLM response variance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <motion.div
                key={test.author}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <GlassCard hoverEffect={false} className="flex flex-col justify-between h-full border-slate-800">
                  <div className="flex flex-col gap-4">
                    <Quote size={20} className="text-blue-500/40" />
                    <p className="text-slate-300 text-xs italic leading-relaxed">"{test.quote}"</p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-6">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-300">
                      {test.avatar}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{test.author}</h5>
                      <span className="text-[10px] text-slate-500">{test.role}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Final Call To Action */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <GlassCard hoverEffect={false} className="border-blue-500/20 bg-gradient-to-br from-blue-500/[0.01] to-cyan-500/[0.01] p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 radial-glow-blue opacity-30 pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Start Building Better Prompts Today
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Standardize your prompt pipeline. Reduce LLM API variance, optimize token length, and compile clean variables now.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link
                href="/analyzer"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all hover:scale-102 active:scale-95"
              >
                Try Analyzer
              </Link>
              <Link
                href={user ? "/dashboard" : "/register"}
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-200 font-bold text-xs transition-all flex items-center gap-1 group"
              >
                Go to Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </GlassCard>
        </motion.section>

      </div>

      {/* 8. Footer */}
      <footer className="w-full glass-panel border-t border-white/5 py-8 mt-24 text-center text-xs text-slate-500 bg-[#070b16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 PromptScore AI. All rights reserved. pair-programmed by Antigravity.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
