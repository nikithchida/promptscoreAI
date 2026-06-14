"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/contexts/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Shield, Award, Calendar, Check, AlertCircle } from "lucide-react";

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile(name);
      setSuccess("Profile name updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout activeTab="account">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <User className="text-blue-500" size={20} /> Account & Profile Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account settings, profile variables, and active subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Settings form column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <GlassCard hoverEffect={false} className="p-6">
              <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider border-b border-white/5 pb-2">
                Personal Profile Details
              </h3>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-white/10 bg-slate-950/40 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-600" size={14} />
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-white/5 bg-slate-950/20 rounded-xl text-slate-500 cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
                    <Check size={14} className="shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all self-start shadow active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Save Settings"}
                </button>
              </form>
            </GlassCard>
          </div>

          {/* Subscription info column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <GlassCard hoverEffect={false} className="p-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 radial-glow-blue opacity-20 pointer-events-none" />

              <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider border-b border-white/5 pb-2">
                Account Information
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Account Role</span>
                    <h4 className="text-sm font-bold text-slate-200">Developer</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Date Created</span>
                    <h4 className="text-sm font-bold text-slate-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
                    <Shield size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">API Verification</span>
                    <h4 className="text-sm font-bold text-emerald-400">Sandbox Verified</h4>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
