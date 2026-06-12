import { NextResponse } from "next/server";
import { evaluatePrompt } from "@/lib/prompt-evaluator";

export async function POST(request: Request) {
  try {
    const { prompt, category } = await request.json();
    
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const analysis = await evaluatePrompt(prompt, category);
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("API Analyze Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during prompt evaluation." },
      { status: 500 }
    );
  }
}
