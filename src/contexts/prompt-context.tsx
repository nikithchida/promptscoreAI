"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { isValidPrompt } from "@/lib/prompt-validator";

export interface PromptScores {
  overall: number;
  clarity: number;
  specificity: number;
  context: number;
  structure: number;
  creativity: number;
  predictability: number;
}

export interface DetailedFeedback {
  strengths: string[];
  weaknesses: string[];
  missing: string[];
  opportunities: string[];
}

export interface OptimizedPrompts {
  standard: string;
  professional: string;
  beginner: string;
  expert: string;
  interview: string;
  production: string;
}

export interface AnalysisResult {
  id: string;
  userId?: string;
  originalPrompt: string;
  analyzedAt: string;
  scores: PromptScores;
  feedback: DetailedFeedback;
  optimized: OptimizedPrompts;
  isFavorite: boolean;
  category?: string;
  isValid?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  templateText: string;
  placeholders: string[];
}

interface PromptContextType {
  history: AnalysisResult[];
  activeAnalysis: AnalysisResult | null;
  setActiveAnalysis: (analysis: AnalysisResult | null) => void;
  analyzePrompt: (promptText: string, category?: string) => Promise<AnalysisResult>;
  deleteAnalysis: (id: string) => void;
  toggleFavorite: (id: string) => void;
  loading: boolean;
  templates: PromptTemplate[];
  generatePromptFromIdea: (idea: string, category: string, role?: string) => Promise<string>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

// Initial mock templates
const MOCK_TEMPLATES: PromptTemplate[] = [
  {
    id: "1",
    title: "Code Refactoring Expert",
    description: "Refactor code for performance, readability, and clean architecture principles.",
    category: "Development",
    templateText: "Act as a senior software engineer. Refactor the following [Language] code to improve [Goal - e.g., performance, readability] while maintaining original functionality. Point out the changes made and explain why.\n\nCode:\n[CodeBlock]",
    placeholders: ["Language", "Goal - e.g., performance, readability", "CodeBlock"],
  },
  {
    id: "2",
    title: "SaaS Marketing Copywriter",
    description: "Write conversion-focused copy for landing page hero sections.",
    category: "Marketing",
    templateText: "Act as an expert conversion copywriter. Write 3 alternative hero section copy variations (headline, subheadline, and Call To Action) for a SaaS product called [Product Name] that solves [Core Problem] for [Target Audience]. Tone should be [Tone].",
    placeholders: ["Product Name", "Core Problem", "Target Audience", "Tone"],
  },
  {
    id: "3",
    title: "SEO Blog Outline Creator",
    description: "Build an SEO-optimized outline for a blog post based on target keywords.",
    category: "Writing",
    templateText: "You are an SEO content strategist. Create a detailed outline for a blog post targeting the keyword '[Target Keyword]'. Include H1, H2, and H3 structures, suggested talking points under each heading, search intent analysis, and a list of secondary keywords to target.",
    placeholders: ["Target Keyword"],
  },
  {
    id: "4",
    title: "Cold Email Outreach Writer",
    description: "Draft high-converting cold email sequences for B2B prospects.",
    category: "Business",
    templateText: "You are a B2B sales development representative. Draft a 3-step cold email outreach sequence targeting [Prospect Title] at [Prospect Industry] companies. The goal is to book a demo for [Our Product], which helps them [Value Proposition]. Keep emails under 150 words.",
    placeholders: ["Prospect Title", "Prospect Industry", "Our Product", "Value Proposition"],
  },
];

// No mock initial history for production users
const MOCK_INITIAL_HISTORY: AnalysisResult[] = [];

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [templates] = useState<PromptTemplate[]>(MOCK_TEMPLATES);

  // Initialize and load prompt history specific to the logged-in user
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setActiveAnalysis(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const localHistory = localStorage.getItem("promptscore_history");
    if (localHistory) {
      try {
        const parsed = JSON.parse(localHistory) as AnalysisResult[];
        // Filter by user ID
        const userHistory = parsed.filter(item => item.userId === user.id);
        setHistory(userHistory);
        if (userHistory.length > 0) {
          setActiveAnalysis(userHistory[0]);
        } else {
          setActiveAnalysis(null);
        }
      } catch (e) {
        setHistory([]);
        setActiveAnalysis(null);
      }
    } else {
      setHistory([]);
      setActiveAnalysis(null);
    }
    setLoading(false);
  }, [user]);

  const analyzePrompt = async (promptText: string, category: string = "General"): Promise<AnalysisResult> => {
    setLoading(true);
    
    const validation = isValidPrompt(promptText);
    if (!validation.isValid) {
      const result: AnalysisResult = {
        id: `eval-${Math.random().toString(36).substring(2, 9)}`,
        userId: user?.id,
        originalPrompt: promptText,
        analyzedAt: new Date().toISOString(),
        scores: {
          overall: 0,
          clarity: 0,
          specificity: 0,
          context: 0,
          structure: 0,
          creativity: 0,
          predictability: 0,
        },
        feedback: {
          strengths: [],
          weaknesses: [],
          missing: [],
          opportunities: [],
        },
        optimized: {
          standard: "",
          professional: "",
          beginner: "",
          expert: "",
          interview: "",
          production: "",
        },
        isFavorite: false,
        category,
        isValid: false,
      };

      const globalHistory = JSON.parse(localStorage.getItem("promptscore_history") || "[]") as AnalysisResult[];
      const updatedGlobal = [result, ...globalHistory];
      localStorage.setItem("promptscore_history", JSON.stringify(updatedGlobal));

      setHistory([result, ...history]);
      setActiveAnalysis(result);
      setLoading(false);
      return result;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, category }),
      });

      if (!response.ok) {
        throw new Error("API analysis request failed");
      }

      const data = await response.json();
      const newAnalysis: AnalysisResult = {
        ...data.analysis,
        userId: user?.id,
      };

      const globalHistory = JSON.parse(localStorage.getItem("promptscore_history") || "[]") as AnalysisResult[];
      const updatedGlobal = [newAnalysis, ...globalHistory];
      localStorage.setItem("promptscore_history", JSON.stringify(updatedGlobal));

      setHistory([newAnalysis, ...history]);
      setActiveAnalysis(newAnalysis);
      setLoading(false);
      return newAnalysis;
    } catch (err) {
      console.warn("API evaluation failed, running client-side fallback evaluation...", err);
      // Fallback local rules-based evaluation
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = runLocalEvaluation(promptText, category, user?.id);
          
          const globalHistory = JSON.parse(localStorage.getItem("promptscore_history") || "[]") as AnalysisResult[];
          const updatedGlobal = [result, ...globalHistory];
          localStorage.setItem("promptscore_history", JSON.stringify(updatedGlobal));

          setHistory([result, ...history]);
          setActiveAnalysis(result);
          setLoading(false);
          resolve(result);
        }, 1500);
      });
    }
  };

  const deleteAnalysis = (id: string) => {
    const updatedLocal = history.filter((item) => item.id !== id);
    setHistory(updatedLocal);
    
    const globalHistory = JSON.parse(localStorage.getItem("promptscore_history") || "[]") as AnalysisResult[];
    const updatedGlobal = globalHistory.filter((item) => item.id !== id);
    localStorage.setItem("promptscore_history", JSON.stringify(updatedGlobal));

    if (activeAnalysis?.id === id) {
      setActiveAnalysis(updatedLocal.length > 0 ? updatedLocal[0] : null);
    }
  };

  const toggleFavorite = (id: string) => {
    const updatedLocal = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updatedLocal);
    
    const globalHistory = JSON.parse(localStorage.getItem("promptscore_history") || "[]") as AnalysisResult[];
    const updatedGlobal = globalHistory.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    localStorage.setItem("promptscore_history", JSON.stringify(updatedGlobal));

    if (activeAnalysis?.id === id) {
      const activeItem = updatedLocal.find((item) => item.id === id);
      setActiveAnalysis(activeItem || null);
    }
  };

  // Generate a prompt from simple input idea
  const generatePromptFromIdea = async (idea: string, category: string, role?: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assignedRole = role || `expert ${category.toLowerCase()} assistant`;
        const generated = `Act as an ${assignedRole}. I want you to help me with my task of: "${idea}". 

To do this successfully, please follow these guidelines:
1. Provide a step-by-step breakdown of your approach.
2. Structure the output clearly with headers and bullet points.
3. Highlight any limitations or assumptions in your solution.
4. If there are code components, use clean markdown blocks and write robust comments.

Let's begin! Please ask any clarifying questions if you need more context before writing the solution.`;
        resolve(generated);
      }, 800);
    });
  };

  return (
    <PromptContext.Provider
      value={{
        history,
        activeAnalysis,
        setActiveAnalysis,
        analyzePrompt,
        deleteAnalysis,
        toggleFavorite,
        loading,
        templates,
        generatePromptFromIdea,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePrompts must be used within a PromptProvider");
  }
  return context;
}

// Client-side helper rules for Prompt Scoring Fallback
export function runLocalEvaluation(promptText: string, category: string, userId?: string): AnalysisResult {
  const validation = isValidPrompt(promptText);
  if (!validation.isValid) {
    return {
      id: `eval-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      originalPrompt: promptText,
      analyzedAt: new Date().toISOString(),
      scores: {
        overall: 0,
        clarity: 0,
        specificity: 0,
        context: 0,
        structure: 0,
        creativity: 0,
        predictability: 0,
      },
      feedback: {
        strengths: [],
        weaknesses: [],
        missing: [],
        opportunities: [],
      },
      optimized: {
        standard: "",
        professional: "",
        beginner: "",
        expert: "",
        interview: "",
        production: "",
      },
      isFavorite: false,
      category,
      isValid: false,
    };
  }

  const len = promptText.length;
  const wordCount = promptText.split(/\s+/).filter(Boolean).length;
  
  // Rule checks
  const hasRole = /\b(act as|you are|role|expert|specialist|designer|developer|writer)\b/i.test(promptText);
  const hasFormat = /\b(format|markdown|table|list|bullet|xml|json|codeblock|output|headers|structure)\b/i.test(promptText);
  const hasConstraints = /\b(limit|not|avoid|exclude|dont|don't|only|under|words|characters)\b/i.test(promptText);
  const hasContext = /\b(context|background|project|company|product|audience|client)\b/i.test(promptText) || len > 120;
  const hasExamples = /\b(example|instance|sample|illustration|like:|\bfor example\b)\b/i.test(promptText);
  
  // Custom score calculations
  let clarity = Math.min(40 + (wordCount > 10 ? 25 : 10) + (len > 50 ? 25 : 10) + (hasFormat ? 10 : 0), 100);
  let specificity = Math.min(20 + (wordCount > 20 ? 30 : 10) + (hasConstraints ? 25 : 0) + (hasRole ? 25 : 0), 100);
  let contextScore = Math.min(10 + (hasContext ? 45 : 10) + (len > 150 ? 45 : 15), 100);
  let structure = Math.min(10 + (hasFormat ? 50 : 10) + (promptText.includes("\n") ? 40 : 10), 100);
  let predictability = Math.min(20 + (hasFormat ? 30 : 0) + (hasConstraints ? 30 : 0) + (hasExamples ? 20 : 0), 100);
  let creativity = Math.min(50 + (promptText.toLowerCase().includes("creativ") ? 30 : 10), 100);
  
  if (len < 15) {
    clarity = 5;
    specificity = 0;
    contextScore = 0;
    structure = 0;
    predictability = 5;
    creativity = 0;
  }
  
  const overall = Math.round((clarity * 0.25) + (specificity * 0.25) + (contextScore * 0.2) + (structure * 0.15) + (predictability * 0.15));

  // Determine feedback lists
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missing: string[] = [];
  const opportunities: string[] = [];

  if (hasRole) {
    strengths.push("Explicitly assigns a persona or role to the AI model.");
  } else {
    weaknesses.push("Missing a designated expert persona for the AI model.");
    opportunities.push("Begin the prompt with an active role assignment, e.g., 'Act as a Senior UX Writer'.");
  }

  if (len > 150) {
    strengths.push("Detailed description with descriptive content length.");
  } else {
    weaknesses.push("Very short prompt, limiting details and situational background.");
    missing.push("Background context explaining the 'why' behind this request.");
  }

  if (hasFormat) {
    strengths.push("Clear instructions regarding desired output formatting.");
  } else {
    weaknesses.push("No explicit formatting or structure specified for the response.");
    opportunities.push("Add structure constraints, like 'Provide output in a neat markdown table with columns X, Y, Z'.");
  }

  if (hasConstraints) {
    strengths.push("Defines active constraints or boundary rules (what to avoid).");
  } else {
    missing.push("Response boundaries or size limits (word count, sentence limits).");
    opportunities.push("Specify negative constraints, e.g., 'Do not use corporate jargon or marketing fluff'.");
  }

  if (hasExamples) {
    strengths.push("Includes practical examples or reference formats.");
  } else {
    missing.push("Example input/output cases to anchor model behavior.");
    opportunities.push("Utilize few-shot learning by adding a 'For Example: ...' section.");
  }

  if (strengths.length === 0) {
    strengths.push("The prompt focuses on a singular request topic.");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("None identified, prompt is well-rounded.");
  }

  // Create optimizations based on content
  const cleanPrompt = promptText.trim().replace(/\.+$/, "");
  const standard = `${hasRole ? "" : "Act as an expert in this task. "}Please process: "${cleanPrompt}". ${hasFormat ? "" : "Format the output using clear markdown header tags and bullet points."} ${hasConstraints ? "" : "Keep explanations concise and practical, avoiding general filler."} ${hasContext ? "" : "Ensure the output is tailored for a professional reader looking for actionable items."}`;

  const professional = `You are a Senior Advisor and Subject Matter Expert. Analyze and resolve the following initiative: 
"${cleanPrompt}"

To ensure an optimal deliverable:
- Establish a logical framework, outlining your methodology before outputting final answers.
- Constantly validate against standard best-practices.
- Deliver findings in a comprehensive format containing inline subsections.`;

  const beginner = `I need help understanding or doing this: "${cleanPrompt}". Can you explain it in simple terms, step-by-step? Please use easy-to-understand language, avoid complex jargon, and give simple examples where appropriate to help me learn how this works.`;

  const expert = `Act as an elite domain specialist and research lead. Analyze the following request under rigorous academic and technical standards:
"${cleanPrompt}"

Provide a detailed, expert-level solution:
1. Deconstruct the request into core theoretical and practical principles.
2. Outline advanced methodologies, edge cases, and failure modes.
3. Use domain-specific terminology with deep analysis.`;

  const interview = `Act as an expert interviewer and technical assessor. Given the task description:
"${cleanPrompt}"

Formulate a response structured for an interview preparation scenario:
1. Provide a step-by-step breakdown of how a top candidate would answer.
2. Identify 3 critical follow-up questions the interviewer might ask.
3. List key trade-offs and behavioral checkpoints related to this topic.`;

  const production = `Act as a production-grade software system component. Execute the following directive with high robustness and error resilience:
"${cleanPrompt}"

Response specifications:
- Format the output strictly as valid JSON conforming to a schema, or clear XML.
- Provide comprehensive error handling, input validation notes, and boundary condition checks.
- Do not output conversational preamble or postscript commentary. Pure structured data only.`;

  return {
    id: `eval-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    originalPrompt: promptText,
    analyzedAt: new Date().toISOString(),
    scores: {
      overall,
      clarity,
      specificity,
      context: contextScore,
      structure,
      creativity,
      predictability,
    },
    feedback: {
      strengths,
      weaknesses,
      missing,
      opportunities,
    },
    optimized: {
      standard,
      professional,
      beginner,
      expert,
      interview,
      production,
    },
    isFavorite: false,
    category,
  };
}
