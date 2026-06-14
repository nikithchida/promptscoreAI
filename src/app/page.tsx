"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldAlert
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PublicNavbar } from "@/components/public-navbar";

export default function LandingPage() {
  const { user } = useAuth();
  
  // Active Navigation Scroll Tracking State
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["problems", "workflow", "features"];
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

  const promptProblems = [
    {
      title: "Low Quality Prompts",
      description: "Simple, unrefined queries produce generic and unhelpful fluff instead of precise solutions.",
      badge: "Subpar Results"
    },
    {
      title: "Missing Context",
      description: "Failing to establish a persona, goal, or background situation limits the model's accuracy.",
      badge: "Flat Responses"
    },
    {
      title: "Weak Instructions",
      description: "Omitting constraints, formatting guidelines, and clear steps leads to parsing and logic failures.",
      badge: "Parsing Errors"
    },
    {
      title: "Poor Output Consistency",
      description: "Vague boundary parameters cause model output format and quality to drift wildly across runs.",
      badge: "High Variance"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Analyze Prompt",
      description: "Paste your prompt into the analyzer, select your target category, and trigger the diagnostics scan."
    },
    {
      step: "02",
      title: "Detect Weaknesses",
      description: "Audits missing contexts, vague parameters, missing boundary rules, and output formatting errors."
    },
    {
      step: "03",
      title: "Optimize Prompt",
      description: "Instantly draft optimized alternatives with tailored personas and custom constraint rules applied."
    },
    {
      step: "04",
      title: "Export Results",
      description: "Copy refined text directly, export full JSON schemas, or generate printable PDF diagnostic reports."
    }
  ];

  const featuresList = [
    {
      title: "Prompt Analysis",
      description: "Audits clarity, specificity, and structure with instant grade boundaries from F to A+."
    },
    {
      title: "Prompt Optimization",
      description: "Drafts optimized versions instantly, injecting expert personas and negative constraints."
    },
    {
      title: "Prompt Comparison",
      description: "Compares prompt variations side-by-side to track score improvements and response adjustments."
    },
    {
      title: "Template Library",
      description: "Builds, searches, and saves customized prompt templates with dynamic placeholder variables."
    },
    {
      title: "Report Export",
      description: "Exports diagnostic JSON schemas, copies clean markdown, or downloads print-ready PDF reports."
    }
  ];

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
              Grade, Improve and Compare{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                AI Prompts.
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
                Open Workspace <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
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

        {/* 3. Features Section */}
        <section id="features" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Feature Inventory</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Full-Stack Prompt Toolkit</h2>
            <p className="text-slate-400 text-xs">Explore structural metrics, category templates, comparison tools, and export systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 justify-center">
            {featuresList.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={idx === 4 ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <GlassCard hoverEffect={true} className="border-white/5 h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                      <CheckCircle2 size={16} />
                    </div>
                    <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Workflow Section */}
        <section id="workflow" className="scroll-mt-20 flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Streamlined Pipeline</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">How It Works</h2>
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

        {/* 5. Final Call To Action */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <GlassCard hoverEffect={false} className="border-blue-500/20 bg-gradient-to-br from-blue-500/[0.01] to-cyan-500/[0.01] p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 radial-glow-blue opacity-30 pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Ready to improve your prompts?
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Standardize your prompt pipeline. Reduce LLM API variance, optimize token length, and compile clean variables now.
            </p>

            <div className="flex flex-row items-center gap-4 mt-2">
              <Link
                href={user ? "/analyzer" : "/register"}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all hover:scale-102 active:scale-95"
              >
                Open Workspace
              </Link>
            </div>
          </GlassCard>
        </motion.section>

      </div>

      {/* 6. Footer */}
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
