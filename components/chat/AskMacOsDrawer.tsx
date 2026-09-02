"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AskMacOsDrawerProps {
  analysisId: string;
  targetRole: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  "Why is this my biggest gap?",
  "Why did you recommend this project?",
  "How did you determine my readiness?",
  "What would make me more competitive?",
];

export function AskMacOsDrawer({
  analysisId,
  targetRole,
  isOpen,
  onClose,
}: AskMacOsDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your M.A.C.O.S. career navigation assistant. I have reviewed your profile and the trajectory intelligence for **${targetRole}**. How can I help you navigate your pathway?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card border-l shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              Ask M.A.C.O.S.
              <span className="rounded bg-primary/10 text-primary text-[10px] px-1.5 py-0.2 font-semibold uppercase">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Directly answers from your stored analysis
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="border-b bg-muted/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Suggested Questions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="rounded-full border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-50"
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
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none border whitespace-pre-line"
              }`}
            >
              {m.content}
              <div
                className={`mt-1 text-[9px] ${
                  m.role === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                }`}
              >
                {m.timestamp}
              </div>
            </div>
            {m.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>M.A.C.O.S. is synthesizing analysis context...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-3 bg-card">
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
            placeholder="Ask about your gaps, milestones, or readiness..."
            disabled={isLoading}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
