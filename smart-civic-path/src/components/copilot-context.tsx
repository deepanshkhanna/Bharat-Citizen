import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type CopilotContextData =
  | { page: "scheme"; scheme_name: string; scheme_id?: string }
  | { page: "complaint"; complaint_id: string }
  | null;

type CopilotState = {
  open: boolean;
  context: CopilotContextData;
  seedPrompt?: string;
  openCopilot: (opts?: { context?: CopilotContextData; seedPrompt?: string }) => void;
  closeCopilot: () => void;
  setOpen: (open: boolean) => void;
};

const Ctx = createContext<CopilotState | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<CopilotContextData>(null);
  const [seedPrompt, setSeedPrompt] = useState<string | undefined>(undefined);

  const openCopilot = useCallback(
    (opts?: { context?: CopilotContextData; seedPrompt?: string }) => {
      setContext(opts?.context ?? null);
      setSeedPrompt(opts?.seedPrompt);
      setOpen(true);
    },
    [],
  );

  const closeCopilot = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, context, seedPrompt, openCopilot, closeCopilot, setOpen }),
    [open, context, seedPrompt, openCopilot, closeCopilot],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCopilot() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCopilot must be used within CopilotProvider");
  return v;
}
