"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface PublicNavbarProps {
  activeSection?: string;
}

export function PublicNavbar({ activeSection = "" }: PublicNavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
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
            className={`transition-colors hover:text-blue-400 ${
              activeSection === "hero" || activeSection === "" 
                ? "text-blue-400 font-bold" 
                : "text-slate-300"
            }`}
          >
            Home
          </Link>
          <a 
            href="/#features" 
            className="transition-colors hover:text-blue-400 text-slate-300"
          >
            Features
          </a>
          <Link 
            href="/templates" 
            className="transition-colors hover:text-blue-400 text-slate-300"
          >
            Template
          </Link>
          <Link 
            href="/compare" 
            className="transition-colors hover:text-blue-400 text-slate-300"
          >
            Compare
          </Link>
        </nav>
 
        <div className="flex items-center gap-3">
          <Link
            href="/analyzer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow active:scale-[0.98]"
          >
            Go to Analyzer
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-200 text-xs font-bold transition-all shadow"
          >
            Dashboard
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
