import { AnalysisResult } from "../contexts/prompt-context";
import { isValidPrompt } from "./prompt-validator";

// Centralized prompt evaluator
export async function evaluatePrompt(
  promptText: string,
  category: string = "General"
): Promise<Partial<AnalysisResult>> {
  const validation = isValidPrompt(promptText);
  if (!validation.isValid) {
    return {
      id: `eval-${Math.random().toString(36).substring(2, 9)}`,
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

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const systemPrompt = `You are a world-class Prompt Engineer and AI Optimization expert. 
Your job is to analyze the user's provided prompt and evaluate it based on key attributes.

You must output a strict JSON object structure:
{
  "scores": {
    "overall": number (0-100),
    "clarity": number (0-100),
    "specificity": number (0-100),
    "context": number (0-100),
    "structure": number (0-100),
    "creativity": number (0-100),
    "predictability": number (0-100)
  },
  "feedback": {
    "strengths": string[],
    "weaknesses": string[],
    "missing": string[],
    "opportunities": string[]
  },
  "optimized": {
    "standard": "highly improved prompt incorporating context, constraints, and clarity",
    "professional": "expert/senior phrasing of the prompt with deep constraints and structures",
    "beginner": "simplified version of the prompt that is easy to customize and understand",
    "expert": "deeply technical and rigorous phrasing with expert domain constraints",
    "interview": "structured as a mock interview prompt or scenario testing prompt with edge cases",
    "production": "robust, production-ready system instruction prompt with strict schema requirements, error handling, and JSON/XML output constraints"
  }
}

Be thorough and critical. Grade prompts strictly based on standard engineering best practices:
- Assignment of role/persona (expert, manager, etc.)
- Clear primary goal
- Definition of clear formatting instructions (markdown, JSON, etc.)
- Negative constraints (what NOT to do)
- Context details (audience, products, goals)
- Few-shot examples if necessary.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Evaluate this prompt in the category "${category}":\n\n"${promptText}"` },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const json = await response.json();
      const parsed = JSON.parse(json.choices[0].message.content);
      
      return {
        id: `eval-${Math.random().toString(36).substring(2, 9)}`,
        originalPrompt: promptText,
        analyzedAt: new Date().toISOString(),
        scores: parsed.scores,
        feedback: parsed.feedback,
        optimized: parsed.optimized,
        isFavorite: false,
        category,
      };
    } catch (e) {
      console.error("OpenAI analysis failed, falling back to local analysis", e);
    }
  }

  // Local Evaluator Fallback logic
  return runLocalAnalysisRules(promptText, category);
}

function runLocalAnalysisRules(promptText: string, category: string): Partial<AnalysisResult> {
  const len = promptText.length;
  const wordCount = promptText.split(/\s+/).filter(Boolean).length;
  
  const hasRole = /\b(act as|you are|role|expert|specialist|designer|developer|writer)\b/i.test(promptText);
  const hasFormat = /\b(format|markdown|table|list|bullet|xml|json|codeblock|output|headers|structure)\b/i.test(promptText);
  const hasConstraints = /\b(limit|not|avoid|exclude|dont|don't|only|under|words|characters)\b/i.test(promptText);
  const hasContext = /\b(context|background|project|company|product|audience|client)\b/i.test(promptText) || len > 120;
  const hasExamples = /\b(example|instance|sample|illustration|like:|\bfor example\b)\b/i.test(promptText);
  
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
