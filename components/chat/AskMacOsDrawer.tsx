"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AskMacOsDrawerProps {
  analysisId: string;
  targetRole: string;
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  focusedItem?: string;
  initialQuestion?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const COPILOT_MODES = [
  { id: "EXPLAIN", label: "Explain", prompt: "Why is this my biggest gap?" },
  { id: "EXPLORE", label: "Explore", prompt: "Show me real people who took a similar route." },
  { id: "PLAN", label: "Plan", prompt: "What should I prioritize this month?" },
  { id: "COMPARE", label: "Compare", prompt: "How is my journey different from researched trajectories?" },
  { id: "CHALLENGE", label: "Challenge", prompt: "What can I skip or ignore for now?" },
  { id: "RESEARCH", label: "Research", prompt: "What has changed recently in market expectations for this role?" },
];

const SECTION_SUGGESTED_QUESTIONS: Record<string, string[]> = {
  snapshot: [
    "Where do I stand right now?",
    "Why is this my biggest gap?",
    "What should I do first?",
    "What can I skip or ignore for now?",
  ],
  trajectories: [
    "Who followed a similar path to me?",
    "Why is this a realistic route for my background?",
    "What parts of this journey can I reproduce?",
    "Explain the transition catalyst in simple words",
  ],
  gaps: [
    "Why is this my biggest gap?",
    "Which gap should I fix first?",
    "How can I prove this capability with a project?",
    "Can I close this without an MBA or degree?",
  ],
  pathway: [
    "Why this first step?",
    "Can I complete this faster?",
    "What if I only have 3 months?",
    "Which project carries highest hiring leverage?",
  ],
  market: [
    "Which requirements matter most for hiring?",
    "Which requirements can I ignore for now?",
    "What are companies really looking for?",
  ],
  profile: [
    "What are my strongest demonstrated capabilities?",
    "Which skills transfer best to my target?",
    "What proof is missing from my resume?",
  ],
  resources: [
    "Do I actually need these courses?",
    "What is the single best resource for my top gap?",
  ],
  sources: [
    "Where did this information come from?",
    "How were the trajectory benchmarks verified?",
  ],
};

export function AskMacOsDrawer({
  analysisId,
  targetRole,
  isOpen,
  onClose,
  activeSection = "snapshot",
  focusedItem,
  initialQuestion,
}: AskMacOsDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your M.A.C.O.S. career intelligence copilot. I've ingested your profile, market benchmarks, and researched trajectories for **${targetRole}**. Ask me anything about your route, gaps, or real professional precedents.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string>("EXPLAIN");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedInitialQuestionRef = useRef<string | null>(null);

  const handleSend = React.useCallback(
    async (textToSend?: string, modeOverride?: string) => {
      const query = textToSend || input;
      if (!query.trim() || isLoading) return;

      const userMessage: Message = {
        role: "user",
        content: query.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const newHistory = [...messages, userMessage];
      setMessages(newHistory);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisId,
            section: activeSection,
            focusedItem: focusedItem || undefined,
            mode: modeOverride || activeMode,
            messages: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to get response from M.A.C.O.S.");
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error communicating with AI assistant.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, analysisId, activeSection, focusedItem, activeMode]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle triggered "Why?" buttons from parent components
  useEffect(() => {
    if (initialQuestion && isOpen && initialQuestion !== lastProcessedInitialQuestionRef.current) {
      lastProcessedInitialQuestionRef.current = initialQuestion;
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen, handleSend]);

  if (!isOpen) return null;

  const currentQuestions =
    SECTION_SUGGESTED_QUESTIONS[activeSection] ||
    SECTION_SUGGESTED_QUESTIONS.snapshot;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-[#121016] border-l border-white/10 shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] p-4 bg-[#090607]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Ask M.A.C.O.S.
              <span className="rounded-full bg-[#ac1ed6]/20 border border-[#ac1ed6]/40 text-[#d5d0dd] text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider">
                Career Intelligence Copilot
              </span>
            </h3>
            <p className="text-[11px] text-[#9a93a5]">
              {focusedItem ? `Focused on: ${focusedItem.slice(0, 30)}...` : `Analyzing: ${targetRole}`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9a93a5] hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 6 COPILOT MODES (Explain, Explore, Plan, Compare, Challenge, Research) */}
      <div className="border-b border-white/[0.06] bg-[#090607]/40 px-3.5 py-2.5 space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#757080] font-bold">
          <span>Copilot Modes</span>
          <span className="text-[#ac1ed6] font-mono">1-Click Intelligence</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {COPILOT_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMode(m.id);
                handleSend(m.prompt, m.id);
              }}
              disabled={isLoading}
              className={`rounded-xl py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider transition-all text-center border ${
                activeMode === m.id
                  ? "bg-[#ac1ed6]/25 border-[#ac1ed6] text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-[#9a93a5] hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Suggestion Chips (Dynamically adapt by active section) */}
      <div className="border-b border-white/[0.06] bg-[#090607]/20 p-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#757080]">
          Contextual Prompts for {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {currentQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-[#d5d0dd] transition-all hover:border-[#ac1ed6]/50 hover:bg-white/[0.06] hover:text-white disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-xs mt-1">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[90%] rounded-3xl p-4 leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-tr from-[#c26e73] to-[#ac1ed6] text-white rounded-br-none shadow-md shadow-[#ac1ed6]/20 font-medium"
                  : "bg-[#191522] text-[#f4f2f5] rounded-bl-none border border-white/[0.08] shadow-sm whitespace-pre-line space-y-1"
              }`}
            >
              {m.content}
              <div
                className={`mt-1.5 text-[9px] ${
                  m.role === "user" ? "text-white/70 text-right" : "text-[#757080]"
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-[#9a93a5] text-xs p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <Loader2 className="h-4 w-4 animate-spin text-[#ac1ed6]" />
            <span>M.A.C.O.S. is synthesizing evidence-backed advice...</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-white/[0.08] p-3.5 bg-[#090607]/80 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your route, real professionals, or proof artifacts..."
            disabled={isLoading}
            className="flex-1 rounded-full border border-white/10 bg-[#121016] px-4 py-2.5 text-xs text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
