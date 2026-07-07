import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustBadge } from "@/components/trust-badge";
import { useCopilot } from "@/components/copilot-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { copilotChat } from "@/server/api/copilot";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Find scholarships",
  "Explain eligibility",
  "What documents do I need?",
  "How do I apply?",
  "Track my complaint",
];

const contextLabel = (ctx: ReturnType<typeof useCopilot>["context"]) => {
  if (!ctx) return null;
  if (ctx.page === "scheme") return `Context: ${ctx.scheme_name}`;
  if (ctx.page === "complaint") return `Context: Complaint ${ctx.complaint_id}`;
  return null;
};

export function CopilotDrawer() {
  const { open, setOpen, context, seedPrompt } = useCopilot();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && seedPrompt) setInput(seedPrompt);
  }, [open, seedPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build context for the API call
      const apiContext: {
        page?: "scheme" | "complaint" | null;
        schemeId?: string | null;
        complaintId?: string | null;
      } = {};

      if (context?.page === "scheme") {
        apiContext.page = "scheme";
        // Extract scheme ID from scheme_name — the copilot context has the name,
        // but we need the ID. We'll pass the name as schemeId and let the server handle it.
        apiContext.schemeId = (context as any).scheme_id ?? null;
      } else if (context?.page === "complaint") {
        apiContext.page = "complaint";
        apiContext.complaintId = (context as any).complaint_id ?? null;
      }

      const result = await copilotChat({
        data: {
          message: t,
          conversationId,
          context: apiContext,
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
      console.error("[copilot] Error:", error);
      // Fallback to a helpful error message
      const errorReply: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: context?.page === "scheme"
          ? `Here's what I know about ${(context as any).scheme_name}. I can help you check eligibility, prepare documents, or walk through how to apply. Please note that AI assistance is currently limited — try again in a moment.`
          : "I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can explore schemes and services directly through the navigation.",
      };
      setMessages((m) => [...m, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const ctxLabel = contextLabel(context);
  const empty = messages.length === 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "flex flex-col gap-0 p-0",
          isMobile ? "h-[92dvh] rounded-t-3xl" : "w-full sm:max-w-md md:max-w-lg lg:max-w-xl",
        )}
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              Ask Smart Bharat
            </SheetTitle>
            <TrustBadge variant="ai" />
          </div>
          {ctxLabel && (
            <p className="mt-2 text-xs text-muted-foreground">{ctxLabel}</p>
          )}
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          {empty ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Welcome to Smart Bharat.
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  How can I help you today?
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Suggested
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={isLoading}
                      className="rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
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
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border bg-background px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, eligibility, documents…"
              className="h-11 rounded-full border-border bg-surface"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              className="h-11 w-11 shrink-0 rounded-full"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI-assisted answers. Verify important details on official portals.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function CopilotFAB() {
  const { openCopilot } = useCopilot();
  const isMobile = useIsMobile();
  return (
    <button
      onClick={() => openCopilot()}
      className={cn(
        "fixed right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isMobile ? "bottom-20" : "bottom-6",
      )}
      aria-label="Ask Smart Bharat"
    >
      <Sparkles className="h-4 w-4" />
      Ask Smart Bharat
    </button>
  );
}

// Re-export X so unused import isn't flagged in some editors
export { X as _X };
