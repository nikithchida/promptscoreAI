"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PublicNavbar } from "@/components/public-navbar";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] grid-bg relative overflow-hidden flex flex-col justify-between scroll-smooth selection:bg-blue-500/20 selection:text-blue-200">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] radial-glow-cyan -z-10 pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] left-[-10%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-50" />

      {/* Navbar */}
      <PublicNavbar activeSection="pricing" />

      {/* Pricing content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col gap-16 justify-center items-center">
        <div className="text-center max-w-xl flex flex-col gap-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Upgrade Tier</span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Simple, Translucent Pricing
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-2">
            Unlock deep analytics and templates. Upgrade as your team and prompt libraries expand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full items-stretch">
          {/* Free Sandbox */}
          <GlassCard hoverEffect={false} className="flex flex-col justify-between border-white/5 p-8 h-full">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Basic Access</span>
              <h4 className="text-2xl font-bold text-slate-100 mt-1">Free Sandbox</h4>
              <div className="text-4xl font-black text-white mt-4">$0 <span className="text-xs text-slate-500 font-semibold">/ lifetime</span></div>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">Basic checks and templates to draft elementary queries.</p>
              
              <ul className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Local Evaluation Rule scoring</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Basic templates listing</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Searchable logs (up to 5 history)</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 font-semibold text-xs mt-8 transition-colors"
            >
              Sign Up Free
            </Link>
          </GlassCard>

          {/* Pro Engineer */}
          <GlassCard hoverEffect={false} className="flex flex-col justify-between border-blue-500/25 bg-blue-500/[0.01] relative p-8 h-full">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] font-bold uppercase tracking-wider">
              Popular
            </div>
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase">Pro Engineer</span>
              <h4 className="text-2xl font-bold text-slate-100 mt-1">SaaS Unlimited</h4>
              <div className="text-4xl font-black text-white mt-4">$15 <span className="text-xs text-slate-500 font-semibold">/ month</span></div>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">Deep OpenAI evaluations, high fidelity structured exports, and custom templates builder.</p>
              
              <ul className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Deep OpenAI structured metrics</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Unlimited prompt history logs</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> High-fidelity PDF & JSON Reports</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-500" /> Interactive placeholders template tool</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs mt-8 transition-all shadow active:scale-[0.98]"
            >
              Unlock Pro Analytics
            </Link>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 py-8 text-center text-xs text-slate-500 bg-[#070b16]/80 backdrop-blur-md">
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
