import { useEffect, useState } from "react";

/** Generic dialog box for NPC conversations and Professor talk. */
export function DialogModal({
  speaker,
  role,
  lines,
  accentColor,
  onClose,
}: {
  speaker: string;
  role: string;
  lines: string[];
  accentColor: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");

  // Typewriter effect
  useEffect(() => {
    setShown("");
    const text = lines[idx] ?? "";
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(t);
    }, 18);
    return () => window.clearInterval(t);
  }, [idx, lines]);

  const next = () => {
    if (shown.length < (lines[idx]?.length ?? 0)) {
      setShown(lines[idx]);
      return;
    }
    if (idx + 1 >= lines.length) {
      onClose();
    } else {
      setIdx(idx + 1);
    }
  };

  // Keyboard: space/enter advances
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter" || e.key.toLowerCase() === "e") {
        e.preventDefault();
        next();
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, idx]);

  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-6 pointer-events-auto">
      <div
        className="absolute inset-0 bg-[hsl(220_60%_3%)/0.4]"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-[640px] cursor-pointer"
        onClick={next}
        style={{
          background: "linear-gradient(180deg, hsl(220 50% 10%) 0%, hsl(220 60% 5%) 100%)",
          border: `4px solid ${accentColor}`,
          boxShadow:
            `0 0 0 3px hsl(220 60% 3%), inset 0 0 0 2px hsl(220 30% 18%), 0 0 32px ${accentColor}`,
          padding: "16px 18px 18px",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div
              className="font-pixel text-[10px] sm:text-xs"
              style={{ color: accentColor, textShadow: "1px 1px 0 #000" }}
            >
              {speaker}
            </div>
            <div
              className="font-pixel text-[7px] sm:text-[9px] mt-0.5 tracking-widest"
              style={{ color: "hsl(var(--muted-foreground))", textShadow: "1px 1px 0 #000" }}
            >
              {role}
            </div>
          </div>
          <div
            className="font-pixel text-[7px] sm:text-[9px]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {idx + 1}/{lines.length}
          </div>
        </div>

        <div
          className="font-pixel-body text-base sm:text-xl text-foreground min-h-[80px] sm:min-h-[100px] leading-snug"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          {shown}
          <span
            className="inline-block w-2 h-4 sm:h-5 ml-1 align-middle animate-pulse"
            style={{ background: accentColor }}
          />
        </div>

        <div className="text-right mt-2">
          <span
            className="font-pixel text-[8px] sm:text-[10px]"
            style={{ color: accentColor, textShadow: "1px 1px 0 #000" }}
          >
            ▶ [E] / CLIQUE PARA CONTINUAR
          </span>
        </div>
      </div>
    </div>
  );
}
