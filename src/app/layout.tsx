import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { PromptProvider } from "@/contexts/prompt-context";

export const metadata: Metadata = {
  title: "PromptScore AI - Professional AI Prompt Analyzer & Optimizer",
  description: "Analyze, grade, and optimize your AI prompts instantly. Get detailed clarity, context, and output predictability scores with actionable feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen relative bg-[#0B1020] text-slate-100 selection:bg-blue-500/20 selection:text-blue-200">
        {/* Decorative Glow Elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] radial-glow-blue -z-10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] radial-glow-cyan -z-10 pointer-events-none" />
        
        <AuthProvider>
          <PromptProvider>
            {children}
          </PromptProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
