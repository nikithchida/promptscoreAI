"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePrompts } from "@/contexts/prompt-context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldAlert, ChevronDown, Cpu,
  Eye, FileDown, Download, Quote
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ScoringSystem } from "@/components/scoring-system";
import { DetailedFeedback } from "@/components/detailed-feedback";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const { analyzePrompt, activeAnalysis } = usePrompts();
  const [demoPrompt, setDemoPrompt] = useState("Write a python script that cleans CSV data.");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<"analysis" | "optimization" | "templates" | "sharing" | "analytics">("analysis");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Interactive Demo State
  const [demoStep, setDemoStep] = useState<"input" | "analyze" | "optimize" | "export">("input");
  
  // Active Navigation Scroll Tracking State
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["problems", "workflow", "features", "preview", "analyzer", "pricing"];
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

  const handleDemoAnalyze = async () => {
    if (!demoPrompt.trim()) return;
    setAnalyzing(true);
    try {
      await analyzePrompt(demoPrompt, "General");
      const element = document.getElementById("demo-results");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleScrollToAnalyzer = () => {
    const element = document.getElementById("analyzer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { value: "4.8M+", label: "Prompts Evaluated" },
    { value: "1.2M+", label: "Reports Generated" },
    { value: "+184%", label: "Average Efficacy Increase" },
  ];

  const trustedRoles = [
    "AI Engineers", "SaaS Developers", "Content Creators", "Product Managers", "Research Students"
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

  const faqs = [
    {
      q: "How does the PromptScore AI grading algorithm work?",
      a: "Our algorithm runs a 7-metric scan evaluating clear role assignments, primary objectives, output constraints, examples, format descriptors, and context clarity. If you configure your OpenAI credentials, it uses structured GPT models to build recommendations; otherwise, it utilizes our advanced regex rules engine."
    },
    {
      q: "Can I use my own OpenAI API keys?",
      a: "Yes! PromptScore AI operates in local-first sandbox mode out of the box. You can easily insert your OPENAI_API_KEY inside your .env.local file to activate structured GPT evaluations and diagnostics."
    },
    {
      q: "What is the difference between optimized prompt versions?",
      a: "We generate four styles: 'Improved' (all-round balance), 'Professional' (strict constraints and expert personas), 'Beginner' (step-by-step tutorials and simple terms), and 'Concise' (shortest directive to minimize token usage)."
    },
    {
      q: "How does the templates variable placeholder compiler work?",
      a: "You select a template with bracketed placeholders (like [Language]). Our UI displays inputs for each placeholder, automatically stitching the variables into the live preview code block as you type."
    },
    {
      q: "Is my prompt data secure?",
      a: "Absolutely. In sandbox mode, your prompt history and session details are stored locally inside your browser's localStorage. No prompt strings or credentials are sent to our servers."
    },
    {
      q: "Can I export my prompt scorecards?",
      a: "Yes. You can copy prompts, export full JSON analysis configurations, or trigger a print window to generate styled PDF reports containing diagnostics data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] grid-bg relative overflow-hidden flex flex-col justify-between scroll-smooth selection:bg-blue-500/20 selection:text-blue-200">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] radial-glow-cyan -z-10 pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] left-[-10%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-50" />

      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-all">
              P
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
              PromptScore<span className="text-blue-400">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <Link 
              href="/" 
              className={`transition-colors hover:text-blue-400 ${activeSection === "" || activeSection === "hero" ? "text-blue-400 font-bold" : "text-slate-300"}`}
            >
              Home
            </Link>
            <Link 
              href="/analyzer" 
              className="transition-colors hover:text-blue-400 text-slate-300"
            >
              Analyzer
            </Link>
            <Link 
              href="/templates" 
              className="transition-colors hover:text-blue-400 text-slate-300"
            >
              Templates
            </Link>
            <Link 
              href="/compare" 
              className="transition-colors hover:text-blue-400 text-slate-300"
            >
              Compare
            </Link>
            <Link 
              href="/dashboard" 
              className="transition-colors hover:text-blue-400 text-slate-300"
            >
              Dashboard
            </Link>
            <a 
              href="#pricing" 
              className={`transition-colors hover:text-blue-400 ${activeSection === "pricing" ? "text-blue-400 font-bold" : "text-slate-300"}`}
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-200 text-xs font-bold transition-all"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow active:scale-[0.98]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page Body sections */}
      {/* Reduced top padding by 35-40%: pt-4 md:pt-8 instead of py-12 md:py-24 */}
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
                href={user ? "/analyzer" : "/auth?tab=register"}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-all active:scale-[0.98] group"
              >
                Go to Workspace <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={handleScrollToAnalyzer}
                className="px-6 py-3 rounded-xl bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all"
              >
                Try Live Analyzer
              </button>
            </motion.div>
          </div>

          {/* Right Column: Large Product Mockup (Option A) */}
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
                {/* 1. Score Matrix & Radar Chart */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5 bg-slate-900/60 rounded-xl p-3 border border-white/5 text-center flex flex-col items-center justify-center">
                    <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Overall Grade</span>
                    <div className="relative flex items-center justify-center mt-2">
                      {/* Circle progress mockup */}
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

                {/* 2. Side-by-Side Prompt Comparison Box */}
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

        {/* 2. Interactive Product Demo (Directly Below Hero) */}
        <section className="scroll-mt-20 flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-1">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Interactive Walkthrough</span>
            <h2 className="text-2xl font-black text-white">Platform In Action</h2>
            <p className="text-slate-400 text-xs">Click the phases below to see our core optimization compiler trace a query.</p>
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
                      <span className="text-[10px] text-slate-500">Characters: 43</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20 text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                      Write a python script that cleans CSV data.
                    </div>
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
                      <h4 className="text-xs font-bold text-slate-200 mb-2 uppercase">Scan score: 37/100</h4>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
                        <div className="bg-red-500 h-full w-[37%]" />
                      </div>
                      <p className="text-[11px] text-slate-400">Fail metrics checked: No persona declared, open-ended csv formats, missing error-handling limits.</p>
                    </div>
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex flex-col gap-2">
                      <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1">
                        <ShieldAlert size={12} /> Flagged Diagnostics
                      </span>
                      <ul className="text-[10px] text-slate-400 flex flex-col gap-1 list-disc pl-4">
                        <li>Missing defined Python data library (e.g. pandas)</li>
                        <li>No validation boundaries for header format or cell limits</li>
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
                      <h4 className="text-xs font-bold text-slate-200 uppercase">Optimized Rewrite (Grade A+)</h4>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Score: 94</span>
                    </div>
                    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.02] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border-l-2 border-blue-500">
                      Act as a B2B Sales Ops Analyst. Clean CSV transactional records using python pandas. Standardise headers to snake_case, drop rows where key IDs are null, and export clean dataframe.
                    </div>
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
                    <h4 className="text-xs font-bold text-slate-300 uppercase">Diagnostics Model Exports Ready</h4>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("Act as a B2B Sales Ops Analyst. Clean CSV transactional records using python pandas. Standardise headers to snake_case, drop rows where key IDs are null, and export clean dataframe.");
                          alert("Copied optimized prompt to clipboard!");
                        }}
                        className="px-4 py-2 rounded-lg text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-500 shadow transition-colors"
                      >
                        <Eye size={12} /> Copy Prompt
                      </button>
                      <button className="px-4 py-2 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 flex items-center gap-1 transition-colors">
                        <FileDown size={12} /> Download PDF Report
                      </button>
                      <button className="px-4 py-2 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 flex items-center gap-1 transition-colors">
                        <Download size={12} /> Export JSON Schema
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 3. Why Prompts Fail Section */}
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

        {/* 4. Before vs After Section */}
        <section className="flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Before vs After</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Compare Efficacy Scores</h2>
            <p className="text-slate-400 text-xs">See how minor structural adjustments yield dramatic improvements in output consistency.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto w-full">
            {/* Weak case card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col rounded-2xl border border-red-500/25 bg-red-500/[0.01] p-6 justify-between gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Weak Input</span>
                  <span className="px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 font-black text-xs">
                    Score: 37
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-xs font-mono text-slate-500 whitespace-pre-wrap leading-relaxed h-28 overflow-y-auto">
                  Write a cold email to potential software customers. Make it sound good.
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h5 className="text-xs font-bold text-slate-300 mb-2">Flagged Issues:</h5>
                <ul className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <li className="flex gap-2"><span className="text-red-400 font-bold">✕</span> No designated professional role.</li>
                  <li className="flex gap-2"><span className="text-red-400 font-bold">✕</span> No target customer profile context.</li>
                  <li className="flex gap-2"><span className="text-red-400 font-bold">✕</span> Lacks size or format constraints.</li>
                </ul>
              </div>
            </motion.div>

            {/* Optimized case card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col rounded-2xl border border-blue-500/20 bg-blue-500/[0.02] p-6 justify-between gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wide">Optimized Rewrite</span>
                  <span className="px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black text-xs">
                    Score: 94
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-blue-500/20 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed h-28 overflow-y-auto">
                  Act as a B2B SaaS Copywriter. Write a 3-step cold email sequence targeting Engineering Directors at scale-ups. Goal: book a demo for our tool which cuts AWS costs. Rules: Keep under 150 words, use custom greetings, and avoid jargon.
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h5 className="text-xs font-bold text-slate-300 mb-2">Optimized Strengths:</h5>
                <ul className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">✓</span> Assigned copywriter persona.</li>
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">✓</span> Set target prospect profile and pitch context.</li>
                  <li className="flex gap-2"><span className="text-blue-400 font-bold">✓</span> Integrated strict negative boundaries and limits.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. How It Works Section */}
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

        {/* 6. Feature Showcase */}
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

        {/* 7. Product Preview Section */}
        <section id="preview" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Platform Interface</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Designed for High Performance</h2>
            <p className="text-slate-400 text-xs">Standardize outputs with structured comparisons, template forms, and scorecard reports.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-2xl border border-white/5 bg-slate-950/60 p-4 md:p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Browser Header mockup */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/40" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/40" />
                <span className="h-3 w-3 rounded-full bg-green-500/40" />
                <span className="text-[10px] text-slate-500 font-mono ml-4">https://promptscore.ai/dashboard</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Pro Sandbox Activated</span>
            </div>

            {/* Browser Body split grid mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score card dial list preview mockup */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.02] flex flex-col items-center">
                  <span className="text-[10px] text-blue-400 font-bold uppercase">Average Quality Scan</span>
                  <h4 className="text-4xl font-black text-white mt-1">84%</h4>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full w-[84%]" />
                  </div>
                </div>

                {/* SVG Mockup Radar Chart */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Metric Web Matrix</span>
                  <div className="w-full h-36 flex items-center justify-center mt-2">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 text-blue-500">
                      <polygon points="50,10 90,38 75,85 25,85 10,38" fill="rgba(59, 130, 246, 0.05)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      <polygon points="50,25 80,45 68,75 32,75 20,45" fill="rgba(59, 130, 246, 0.05)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      <polygon points="50,40 70,52 62,65 38,65 30,52" fill="rgba(59, 130, 246, 0.05)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      
                      <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <line x1="50" y1="50" x2="90" y2="38" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <line x1="50" y1="50" x2="75" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <line x1="50" y1="50" x2="25" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <line x1="50" y1="50" x2="10" y2="38" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                      <polygon points="50,20 85,40 68,80 38,82 18,44" fill="rgba(59, 130, 246, 0.25)" stroke="#3B82F6" strokeWidth="1.5" />
                      
                      <circle cx="50" cy="20" r="1.5" fill="#fff" />
                      <circle cx="85" cy="40" r="1.5" fill="#fff" />
                      <circle cx="68" cy="80" r="1.5" fill="#fff" />
                      <circle cx="38" cy="82" r="1.5" fill="#fff" />
                      <circle cx="18" cy="44" r="1.5" fill="#fff" />
                    </svg>
                  </div>
                  <div className="flex gap-4 text-[9px] text-slate-500 mt-1">
                    <span>Clarity: 80%</span>
                    <span>Context: 70%</span>
                    <span>Structure: 90%</span>
                  </div>
                </div>
              </div>

              {/* Side-by-side prompt comparisons preview */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="rounded-xl border border-white/5 bg-slate-900/20 overflow-hidden flex flex-col">
                  <div className="bg-slate-950/60 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Original Query</span>
                    <span className="text-[9px] text-red-400 uppercase font-bold">Grade F</span>
                  </div>
                  <div className="p-3 text-[10px] font-mono text-slate-500">
                    Write a python script that cleans CSV data.
                  </div>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.02] overflow-hidden flex flex-col">
                  <div className="bg-blue-500/10 px-4 py-2 border-b border-blue-500/20 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-300">Optimized Rewrite</span>
                    <span className="text-[9px] text-emerald-400 uppercase font-bold">Grade A+</span>
                  </div>
                  <div className="p-3 text-[10px] font-mono text-slate-300 leading-relaxed border-l-2 border-blue-500/40">
                    Act as a Senior Data Engineer. Write a Python script using pandas to clean sales CSV logs. Impose type conversions and save to target directory.
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 italic mt-2">
                  <span>* Simulated preview illustrating metric dashboards.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 8. Testimonials Section */}
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

        {/* 9. Analyzer Demo Section */}
        <section id="analyzer" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Live Sandbox</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Test Your Prompt Now</h2>
            <p className="text-slate-400 text-xs">Run a trial efficacy audit. Paste your query below and review structural suggestions.</p>
          </div>

          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <GlassCard className="border-slate-800 bg-slate-900/10">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-300">Enter a simple prompt to grade:</label>
                <textarea
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  className="w-full h-32 p-4 rounded-xl border border-white/10 bg-slate-950/60 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-mono resize-none leading-relaxed"
                />
                
                <button
                  onClick={handleDemoAnalyze}
                  disabled={analyzing || !demoPrompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold self-start disabled:opacity-50 flex items-center gap-1.5 transition-all shadow active:scale-95"
                >
                  {analyzing ? "Evaluating..." : "Run Test Efficacy"}
                  <ArrowRight size={12} />
                </button>
              </div>
            </GlassCard>

            <div id="demo-results" className="scroll-mt-24">
              {activeAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  <ScoringSystem scores={activeAnalysis.scores} />
                  <DetailedFeedback feedback={activeAnalysis.feedback} />
                  
                  <GlassCard hoverEffect={false} className="border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase">
                          <CheckCircle2 size={12} /> Optimized draft preview
                        </span>
                        <h4 className="font-mono text-xs text-slate-200 mt-2 line-clamp-3 leading-relaxed">
                          {activeAnalysis.optimized.improved}
                        </h4>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeAnalysis.optimized.improved);
                          alert("Copied to clipboard!");
                        }}
                        className="px-2.5 py-1 text-[10px] bg-slate-900 border border-white/5 rounded text-slate-300 font-bold hover:text-white shrink-0"
                      >
                        Copy Draft
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* 10. Pricing Section */}
        <section id="pricing" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Upgrade Tier</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Simple, Translucent Pricing</h2>
            <p className="text-slate-400 text-xs">Unlock detailed analysis metrics. Upgrade as your prompt libraries expand.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
            <GlassCard hoverEffect={false} className="flex flex-col justify-between border-white/5">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Basic Access</span>
                <h4 className="text-xl font-bold text-slate-100 mt-1">Free Sandbox</h4>
                <div className="text-3xl font-black text-white mt-4">$0 <span className="text-xs text-slate-500 font-semibold">/ lifetime</span></div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Basic checks and templates to draft elementary queries.</p>
                
                <ul className="flex flex-col gap-2.5 mt-6 border-t border-white/5 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Local Evaluation Rule scoring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Basic templates listing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Searchable logs (up to 5 history)</li>
                </ul>
              </div>
              <Link
                href="/auth?tab=register"
                className="w-full text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 font-semibold text-xs mt-8 transition-colors"
              >
                Sign Up Free
              </Link>
            </GlassCard>

            <GlassCard hoverEffect={false} className="flex flex-col justify-between border-blue-500/20 bg-blue-500/[0.01] relative">
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] font-bold uppercase tracking-wider">
                Popular
              </div>
              <div>
                <span className="text-blue-400 text-xs font-bold uppercase">Pro Engineer</span>
                <h4 className="text-xl font-bold text-slate-100 mt-1">SaaS Unlimited</h4>
                <div className="text-3xl font-black text-white mt-4">$15 <span className="text-xs text-slate-500 font-semibold">/ month</span></div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Deep OpenAI evaluations, high fidelity structured exports, and custom templates builder.</p>
                
                <ul className="flex flex-col gap-2.5 mt-6 border-t border-white/5 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Deep OpenAI structured metrics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Unlimited prompt history logs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> High-fidelity PDF & JSON Reports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Interactive placeholders template tool</li>
                </ul>
              </div>
              <Link
                href="/auth?tab=register"
                className="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs mt-8 transition-all shadow active:scale-[0.98]"
              >
                Unlock Pro Analytics
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* 11. FAQ Section */}
        <section id="faq" className="max-w-3xl mx-auto w-full flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Common Questions</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-white/5 bg-slate-900/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left text-xs font-bold text-slate-200 flex justify-between items-center hover:bg-slate-900/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={14} 
                    className={`text-slate-500 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 bg-slate-950/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* 12. Final Call To Action */}
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
              <button
                onClick={handleScrollToAnalyzer}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all hover:scale-102 active:scale-95"
              >
                Try Analyzer
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-200 font-bold text-xs transition-all flex items-center gap-1 group"
              >
                Go to Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </GlassCard>
        </motion.section>

      </div>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 py-8 mt-24 text-center text-xs text-slate-500">
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
