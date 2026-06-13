"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { user, resetPasswordForEmail, isDemoMode } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoResetLink, setDemoResetLink] = useState<string | null>(null);

  // Redirect if user session already exists
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDemoResetLink(null);

    // 1. System validates email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // 2. Perform checks and trigger reset
      await resetPasswordForEmail(email, "/reset-password");
      
      // 3. Show success message
      setSuccessMessage("Password reset link sent. Please check your email.");
      
      // In demo mode, fetch the generated token link so the user can easily test it
      if (isDemoMode) {
        const latestLink = localStorage.getItem("promptscore_latest_reset_link");
        if (latestLink) {
          setDemoResetLink(latestLink);
        }
      }
    } catch (err: any) {
      // 4. Handle "No account found" or formatting validation errors
      setError(err.message || "An error occurred. Please try again.");
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
            <h2 className="text-lg font-bold text-slate-100 font-sans">Recover Password</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your email address to receive a secure password reset link.
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-start gap-2">
                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
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
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Simulated Email Dev Helper for Testing */}
          {isDemoMode && demoResetLink && (
            <div className="mt-5 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col gap-2 animate-fadeIn">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={12} /> Sandbox Email Simulation
              </span>
              <p className="text-[10px] text-slate-300">
                A secure reset token was created for testing. Click the link below to bypass email delivery:
              </p>
              <Link 
                href={demoResetLink}
                className="text-[10px] text-blue-300 font-bold hover:underline break-all bg-slate-950/50 p-2 rounded border border-white/5"
              >
                {demoResetLink}
              </Link>
            </div>
          )}

          {/* Back to Login link */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            <Link href="/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors font-semibold">
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
