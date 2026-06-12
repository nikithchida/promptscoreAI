"use client";

import React, { useState } from "react";
import { usePrompts, PromptTemplate } from "@/contexts/prompt-context";
import { GlassCard } from "./ui/glass-card";
import { Copy, Sparkles, BookOpen, Check, ArrowRight, Play } from "lucide-react";

interface PromptTemplatesProps {
  onSelectPrompt: (promptText: string) => void;
  delay?: number;
}

export function PromptTemplates({ onSelectPrompt, delay = 0.5 }: PromptTemplatesProps) {
  const { templates, generatePromptFromIdea } = usePrompts();
  const [activeTab, setActiveTab] = useState<"templates" | "generator">("templates");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Generator states
  const [idea, setIdea] = useState("");
  const [genCategory, setGenCategory] = useState("Development");
  const [genRole, setGenRole] = useState("");
  const [generatedResult, setGeneratedResult] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copiedGenerator, setCopiedGenerator] = useState(false);

  const categories = ["All", "Development", "Marketing", "Writing", "Business"];

  const filteredTemplates = selectedCategory === "All"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const initialVals: Record<string, string> = {};
    template.placeholders.forEach(p => {
      initialVals[p] = "";
    });
    setPlaceholderValues(initialVals);
  };

  const getStitchedPrompt = () => {
    if (!selectedTemplate) return "";
    let txt = selectedTemplate.templateText;
    selectedTemplate.placeholders.forEach(p => {
      const val = placeholderValues[p] || `[${p}]`;
      txt = txt.replace(`[${p}]`, val);
    });
    return txt;
  };

  const handleCopyStitched = () => {
    const txt = getStitchedPrompt();
    navigator.clipboard.writeText(txt);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setGenerating(true);
    try {
      const text = await generatePromptFromIdea(idea, genCategory, genRole);
      setGeneratedResult(text);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopiedGenerator(true);
    setTimeout(() => setCopiedGenerator(false), 2000);
  };

  return (
    <GlassCard className="border-slate-800" delay={delay}>
      {/* Selector Headers */}
      <div className="flex border-b border-white/5 pb-4 mb-4 justify-between items-center flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab("templates"); setSelectedTemplate(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "templates"
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <BookOpen size={14} /> Templates Library
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "generator"
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Sparkles size={14} /> AI Prompt Builder
          </button>
        </div>

        {activeTab === "templates" && !selectedTemplate && (
          <div className="flex gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode Rendering */}
      {activeTab === "templates" ? (
        <div>
          {!selectedTemplate ? (
            /* Templates list Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className="p-4 rounded-xl border border-white/5 bg-slate-900/20 hover:border-blue-500/30 hover:bg-slate-900/60 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-white/5 uppercase">
                        {tpl.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mt-2 group-hover:text-blue-400 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-400/80 group-hover:text-blue-300 transition-colors mt-3">
                    Configure Template <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Template configure form */
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Library
                </button>
                <span className="text-xs font-bold text-blue-400">{selectedTemplate.title}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Form Inputs panel */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fill Variables</h5>
                  {selectedTemplate.placeholders.map((ph) => (
                    <div key={ph} className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-300">{ph}</label>
                      <input
                        type="text"
                        value={placeholderValues[ph] || ""}
                        onChange={(e) =>
                          setPlaceholderValues({ ...placeholderValues, [ph]: e.target.value })
                        }
                        placeholder={`Enter ${ph.toLowerCase()}`}
                        className="glass-input text-xs px-3 py-2 rounded-lg"
                      />
                    </div>
                  ))}
                </div>

                {/* Live Output preview panel */}
                <div className="md:col-span-7 flex flex-col rounded-xl border border-blue-500/20 bg-slate-950/60 overflow-hidden">
                  <div className="flex justify-between items-center bg-blue-500/5 px-4 py-2 border-b border-blue-500/20">
                    <span className="text-xs font-bold text-blue-300">Live Preview</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPrompt(getStitchedPrompt())}
                        className="text-[10px] text-blue-300 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 font-semibold"
                      >
                        <Play size={10} /> Load to Editor
                      </button>
                      <button
                        onClick={handleCopyStitched}
                        className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5"
                      >
                        {copiedTemplate ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        {copiedTemplate ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 text-xs font-mono text-slate-200 h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                    {getStitchedPrompt()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Generator Form UI */
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Role / Persona (Optional)</label>
              <input
                type="text"
                value={genRole}
                onChange={(e) => setGenRole(e.target.value)}
                placeholder="e.g. Senior Copywriter, React Architect"
                className="glass-input text-xs px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={genCategory}
                onChange={(e) => setGenCategory(e.target.value)}
                className="glass-input text-xs px-3 py-2 rounded-lg cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">What is the core goal of your prompt?</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., Explain how quantum computing works to a 10 year old, or Write a script to fetch crypto prices."
              className="glass-input text-xs p-3 rounded-lg h-20 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !idea.trim()}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 self-start disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all active:scale-95"
          >
            {generating ? "Building..." : "Generate AI Prompt"}
          </button>

          {generatedResult && (
            <div className="flex flex-col rounded-xl border border-blue-500/20 bg-slate-950/60 overflow-hidden mt-3">
              <div className="flex justify-between items-center bg-blue-500/5 px-4 py-2 border-b border-blue-500/20">
                <span className="text-xs font-bold text-blue-300">Stitched Structure Prompt</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPrompt(generatedResult)}
                    className="text-[10px] text-blue-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 font-semibold"
                  >
                    Load into Editor
                  </button>
                  <button
                    onClick={handleCopyGenerated}
                    className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-900 border border-white/5"
                  >
                    {copiedGenerator ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copiedGenerator ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="p-4 text-xs font-mono text-slate-200 h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                {generatedResult}
              </div>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
