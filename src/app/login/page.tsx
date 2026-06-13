"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Cpu, ShieldCheck, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function LoginFormContent() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Check for success messages from query params (e.g. redirected after password reset)
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setInfoMessage(message);
    }
  }, [searchParams]);

  // Redirect if user session already exists
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors and info messages
    setError(null);
    setInfoMessage(null);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password requirements
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg relative flex flex-col justify-center items-center px-4 overflow-hidden bg-[#0B1020]">
      {/* Glow backgrounds */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] radial-glow-blue -z-10 pointer-events-none opacity-50" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] radial-glow-cyan -z-10 pointer-events-none opacity-40" />

      {/* Main card */}
      <div className="w-full max-w-md flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 group justify-center mb-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            P
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            PromptScore<span className="text-blue-400">.AI</span>
          </span>
        </Link>

        <GlassCard hoverEffect={false} className="border-slate-800 shadow-2xl relative p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-100">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter credentials to access prompt scores.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-white/10 bg-slate-950/40 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-blue-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-white/10 bg-slate-950/40 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200"
                />
              </div>
            </div>

            {infoMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-start gap-2">
                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2 shadow active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 font-bold hover:underline">
              Register Here
            </Link>
          </div>

          {/* Sandbox security badge */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-blue-400" />
              <span>Only registered user accounts are allowed access.</span>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
