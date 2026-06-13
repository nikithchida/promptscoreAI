"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Cpu, LayoutDashboard, LogOut, ChevronRight, User, Terminal, Home, GitCompare, Menu, X, FileDown } from "lucide-react";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: "home" | "analyzer" | "templates" | "compare" | "dashboard" | "reports" | "account";
}

export function AppLayout({ children, activeTab }: AppLayoutProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Auth Protection - Redirect to /login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col justify-center items-center gap-4">
        <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-400 text-xs font-semibold">Loading session data...</span>
      </div>
    );
  }

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: <Home size={15} /> },
    { id: "analyzer", label: "Prompt Analyzer", href: "/analyzer", icon: <Terminal size={15} /> },
    { id: "templates", label: "Template Library", href: "/templates", icon: <Cpu size={15} /> },
    { id: "compare", label: "Prompt Compare", href: "/compare", icon: <GitCompare size={15} /> },
    { id: "reports", label: "Reports & Exports", href: "/reports", icon: <FileDown size={15} /> },
    { id: "dashboard", label: "Dashboard & History", href: "/dashboard", icon: <LayoutDashboard size={15} /> },
    { id: "account", label: "Account Profile", href: "/account", icon: <User size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] grid-bg flex flex-col md:flex-row relative">
      {/* Sidebar navigation - desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 p-6 shrink-0 justify-between">
        <div className="flex flex-col gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-all">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
              PromptScore<span className="text-blue-400">.AI</span>
            </span>
          </Link>

          <nav className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">
              General
            </span>

            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User profile */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300">
              <User size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-slate-200 truncate">{user.name || "Prompt Engineer"}</h5>
              <span className="text-[10px] text-blue-400 font-semibold uppercase">{user.plan} Account</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
          >
            <LogOut size={15} /> Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Top Navbar */}
      <header className="flex md:hidden sticky top-0 z-30 glass-panel border-b border-white/5 py-4 px-6 justify-between items-center backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            P
          </div>
          <span className="font-extrabold text-xs tracking-tight text-white">
            PromptScore<span className="text-blue-400">.AI</span>
          </span>
        </Link>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-950/80 backdrop-blur-sm pt-20 px-6">
          <div className="flex flex-col gap-6">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-900/40"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300">
                  <User size={14} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-200">{user.name || "Prompt Engineer"}</h5>
                  <span className="text-[10px] text-blue-400 font-semibold uppercase">{user.plan} Account</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
              >
                <LogOut size={15} /> Logout Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar details */}
        <header className="sticky top-0 z-10 hidden md:flex glass-panel border-b border-white/5 py-4 px-8 items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Workspace</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-xs font-bold text-slate-200 capitalize">{activeTab}</span>
          </div>
        </header>

        {/* Dynamic Pages Area content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
