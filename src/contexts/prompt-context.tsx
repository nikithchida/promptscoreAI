"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

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
  improved: string;
  professional: string;
  beginner: string;
  concise: string;
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

// Initial mock history for rich display out of the box
const MOCK_INITIAL_HISTORY: AnalysisResult[] = [
  {
    id: "hist-1",
    originalPrompt: "Write a python script that cleans CSV data.",
    analyzedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    scores: {
      overall: 48,
      clarity: 65,
      specificity: 30,
      context: 20,
      structure: 25,
      creativity: 50,
      predictability: 35,
    },
    feedback: {
      strengths: ["Clear primary objective (cleaning CSV data).", "Specifies the scripting language (Python)."],
      weaknesses: ["No details on what defines 'clean' data.", "Missing structure or library constraints.", "No sample CSV structure provided."],
      missing: ["Input CSV format and schema.", "Handling of null or corrupt rows.", "Specific cleanups (e.g., lowercase headers, strip spaces, trim dates)."],
      opportunities: ["Assign a role to the AI (e.g., Data Engineer).", "Use pandas or csv native modules explicitly.", "Request output in a clean markdown codeblock."],
    },
    optimized: {
      improved: "Act as a Python Data Engineer. Write a Python script using pandas to clean a CSV file named 'sales_data.csv'. The cleaning operations must: 1. Convert all column headers to snake_case. 2. Remove rows where the 'Email' column is empty. 3. Fill missing values in 'Quantity' with 0. 4. Format the 'OrderDate' column as YYYY-MM-DD. Provide the script inside a clean code block with brief explanations of the cleaning steps.",
      professional: "You are an expert data pipeline developer. Build a production-ready Python utility script utilizing the `pandas` library to sanitize raw sales transaction logs loaded from a CSV path. The utility must include error logging, handle NaN values in numeric fields by imputing the column median, validate email addresses using regex, and output the cleaned DataFrame to a new CSV file. Ensure type hinting and docstrings are provided.",
      beginner: "Help me write a Python program to clean up a CSV file. The file has columns named 'Name', 'Email', and 'Amount'. Please write a script that makes all names lowercase, removes rows where email is missing, and rounds the Amount column to 2 decimal places. Use comments to explain what each line of code does.",
      concise: "Write a Python script using pandas to clean a CSV file. Steps: 1. Fill missing numeric values with 0. 2. Convert 'date' column to datetime. 3. Drop duplicate rows. Save output to 'clean.csv'. Include error handling.",
    },
    isFavorite: true,
    category: "Development",
  },
  {
    id: "hist-2",
    originalPrompt: "Tell me how to make a landing page.",
    analyzedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    scores: {
      overall: 35,
      clarity: 45,
      specificity: 20,
      context: 15,
      structure: 10,
      creativity: 60,
      predictability: 20,
    },
    feedback: {
      strengths: ["Clear topic focus (landing page design/creation)."],
      weaknesses: ["Vague request that can lead to endless variations.", "No context about the product, industry, or target audience.", "No specification on format (e.g., guide, HTML code, design principles)."],
      missing: ["Product details.", "Target audience profile.", "Conversion goal (e.g., email signups, product purchases).", "Desired tech stack (e.g., React, Tailwind, Webflow)."],
      opportunities: ["Provide the landing page's copy theme.", "Specify section breakdowns (Hero, Features, Social Proof, CTA).", "Assign a conversion optimizer role."],
    },
    optimized: {
      improved: "Act as a Senior Conversion Rate Optimization (CRO) expert. Outline a detailed, step-by-step layout guide for a landing page targeting software freelancers. The landing page is for a time-tracking SaaS. Include: 1. Hero Section copy hierarchy (headline, subhead, CTA). 2. Key structural components needed for high conversions. 3. Examples of social proof placement.",
      professional: "You are a lead UX Designer and CRO specialist. Generate a modular structural blueprint and wireframe specification for a B2B SaaS landing page. The solution must address sign-up attrition by organizing content into a logical conversion funnel: Hero (unique value proposition, primary action), Social Proof ribbon, Feature Grid with contextual benefit descriptions, Testimonial cards, pricing comparison table, and a closing FAQ block. Detail UX copywriting guidelines for each.",
      beginner: "I want to create a landing page for my new bakery shop. Explain the basic sections I need to put on the page, like the header, the about section, and how customers can contact me. Keep it simple and easy to understand for someone who has never built a website.",
      concise: "Outline a conversion-focused landing page structure for a B2B SaaS product. List the 5 key sections needed from top to bottom, including layout guides and placeholder descriptions for a standard signup funnel.",
    },
    isFavorite: false,
    category: "Marketing",
  },
];

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [templates] = useState<PromptTemplate[]>(MOCK_TEMPLATES);

  // Initialize and load prompt history
  useEffect(() => {
    const localHistory = localStorage.getItem("promptscore_history");
    if (localHistory) {
      try {
        setHistory(JSON.parse(localHistory));
      } catch (e) {
        setHistory(MOCK_INITIAL_HISTORY);
      }
    } else {
      setHistory(MOCK_INITIAL_HISTORY);
      localStorage.setItem("promptscore_history", JSON.stringify(MOCK_INITIAL_HISTORY));
    }
    setLoading(false);
  }, []);

  const analyzePrompt = async (promptText: string, category: string = "General"): Promise<AnalysisResult> => {
    setLoading(true);
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

      const updatedHistory = [newAnalysis, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("promptscore_history", JSON.stringify(updatedHistory));
      setActiveAnalysis(newAnalysis);
      setLoading(false);
      return newAnalysis;
    } catch (err) {
      console.warn("API evaluation failed, running client-side fallback evaluation...", err);
      // Fallback local rules-based evaluation
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = runLocalEvaluation(promptText, category, user?.id);
          const updatedHistory = [result, ...history];
          setHistory(updatedHistory);
          localStorage.setItem("promptscore_history", JSON.stringify(updatedHistory));
          setActiveAnalysis(result);
          setLoading(false);
          resolve(result);
        }, 1500);
      });
    }
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("promptscore_history", JSON.stringify(updated));
    if (activeAnalysis?.id === id) {
      setActiveAnalysis(updated.length > 0 ? updated[0] : null);
    }
  };

  const toggleFavorite = (id: string) => {
    const updated = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updated);
    localStorage.setItem("promptscore_history", JSON.stringify(updated));
    if (activeAnalysis?.id === id) {
      setActiveAnalysis({ ...activeAnalysis, isFavorite: !activeAnalysis.isFavorite });
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
function runLocalEvaluation(promptText: string, category: string, userId?: string): AnalysisResult {
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
    clarity = 25;
    specificity = 15;
    contextScore = 10;
    structure = 10;
    predictability = 15;
    creativity = 40;
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
  const improved = `${hasRole ? "" : "Act as an expert in this task. "}Please process: "${cleanPrompt}". ${hasFormat ? "" : "Format the output using clear markdown header tags and bullet points."} ${hasConstraints ? "" : "Keep explanations concise and practical, avoiding general filler."} ${hasContext ? "" : "Ensure the output is tailored for a professional reader looking for actionable items."}`;

  const professional = `You are a Senior Advisor and Subject Matter Expert. Analyze and resolve the following initiative: 
"${cleanPrompt}"

To ensure an optimal deliverable:
- Establish a logical framework, outlining your methodology before outputting final answers.
- Constantly validate against standard best-practices.
- Deliver findings in a comprehensive format containing inline subsections.`;

  const beginner = `I need help understanding or doing this: "${cleanPrompt}". Can you explain it in simple terms, step-by-step? Please use easy-to-understand language, avoid complex jargon, and give simple examples where appropriate to help me learn how this works.`;

  const concise = `Execute the following directive: "${cleanPrompt}". 
Deliver response in bullet points. Be direct, remove background explanations, and focus purely on the target resolution.`;

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
      improved,
      professional,
      beginner,
      concise,
    },
    isFavorite: false,
    category,
  };
}
