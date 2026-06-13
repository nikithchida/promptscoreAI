"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ResetPasswordFormContent() {
  const { user, verifyResetToken, completePasswordReset } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if user session already exists
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Validate the reset token on page mount
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setTokenError("Missing reset token. Please request a new password reset link.");
        setVerifying(false);
        return;
      }

      try {
        const associatedEmail = await verifyResetToken(token);
        setEmail(associatedEmail);
      } catch (err: any) {
        setTokenError(err.message || "Invalid or expired reset token. Please request a new password reset link.");
      } finally {
        setVerifying(false);
      }
    }

    checkToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    // Validate password length
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Validate confirmation match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await completePasswordReset(token, password);
      setSuccess("Password updated successfully! Redirecting to login page...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?message=Your password has been successfully reset. Please sign in with your new password.");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-xs font-semibold">Verifying reset token...</span>
        </div>
      </div>
    );
  }

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
            <h2 className="text-lg font-bold text-slate-100 font-sans">Reset Password</h2>
            {email ? (
              <p className="text-xs text-slate-400 mt-1">
                Enter a new password for <span className="text-blue-400 font-semibold">{email}</span>.
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Set a secure new password for your account.
              </p>
            )}
          </div>

          {tokenError ? (
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{tokenError}</span>
              </div>
              <Link
                href="/forgot-password"
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2 shadow active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
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

export default function ResetPasswordPage() {
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
      <ResetPasswordFormContent />
    </Suspense>
  );
}
