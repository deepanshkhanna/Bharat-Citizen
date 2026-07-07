import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustBadge } from "@/components/trust-badge";
import { copilotChat } from "@/server/api/copilot";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "Copilot — Smart Bharat" },
      {
        name: "description",
        content:
          "Deep conversational assistance for schemes, eligibility, and civic workflows.",
      },
    ],
  }),
  component: CopilotPage,
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What scholarships can I apply for?",
  "Find farmer schemes in my state",
  "Explain eligibility for PM-KISAN",
  "What documents do I need for Ayushman Bharat?",
  "How do I report a broken road?",
  "Track my complaint status",
];

function CopilotPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await copilotChat({
        data: {
          message: t,
          conversationId,
        },
      });
      setConversationId(result.conversationId);
      const reply: Msg = {
        id: result.messageId,
        role: "assistant",
        text: result.content,
      };
      setMessages((m) => [...m, reply]);
    } catch (error) {
      console.error("[copilot-page] Error:", error);
      const errorReply: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((m) => [...m, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-4xl flex-col md:h-[calc(100dvh-2rem)]">
      {/* Header */}
      <header className="shrink-0 px-5 pt-8 md:px-10 md:pt-12">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Ask Smart Bharat
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <TrustBadge variant="ai" />
              <span className="text-xs text-muted-foreground">
                AI-powered civic guidance
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 md:px-10"
      >
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-foreground">
              Welcome to Smart Bharat
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask me about government schemes, eligibility, required documents,
              or how to report civic issues. I'm here to help.
            </p>
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Try asking
              </p>
              <div className="flex max-w-lg flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-foreground shadow-sm",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-surface px-5 py-3 text-sm text-muted-foreground shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 border-t border-border bg-background px-5 py-4 md:px-10"
      >
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about schemes, eligibility, documents…"
            className="h-12 rounded-full border-border bg-surface text-base"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            className="h-12 w-12 shrink-0 rounded-full"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4.5 w-4.5" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          AI-assisted answers. Verify important details on official portals.
        </p>
      </form>
    </div>
  );
}
