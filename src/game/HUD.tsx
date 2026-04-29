import profCage from "@/assets/professor-cage.png";

export function HUD({
  current,
  total,
  correct,
  wrong,
  dropping,
  timeLeft,
  showTimer,
  elapsed,
  showElapsed,
}: {
  current: number;
  total: number;
  correct: number;
  wrong: number;
  dropping: boolean;
  timeLeft: number; // seconds (per-question)
  showTimer: boolean;
  elapsed: number; // global elapsed seconds
  showElapsed: boolean;
}) {
  const pct = Math.min(100, (current / total) * 100);
  const lives = total - wrong; // not really used as life, but visualizes urgency
  const timerPct = Math.max(0, Math.min(100, (timeLeft / 60) * 100));
  const timerColor =
    timeLeft > 30 ? "hsl(var(--accent))" : timeLeft > 10 ? "hsl(var(--lava-3))" : "hsl(var(--destructive))";

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-2 sm:p-3 md:p-4 flex items-start justify-between gap-2">
      {/* LEFT */}
      <div
        className="font-pixel relative"
        style={{
          background: "linear-gradient(180deg, hsl(220 55% 8%) 0%, hsl(220 60% 5%) 100%)",
          border: "3px solid hsl(var(--lava-glow))",
          boxShadow:
            "0 0 0 2px hsl(220 60% 3%), 0 0 24px hsl(var(--lava-glow) / 0.45), inset 0 0 0 1px hsl(45 100% 60% / 0.25)",
          padding: "10px 14px",
          minWidth: 240,
          maxWidth: "min(60vw, 460px)",
        }}
      >
        <h1
          className="text-[9px] sm:text-[11px] md:text-[13px] leading-tight text-[hsl(var(--lava-3))] mb-1"
          style={{
            textShadow:
              "1px 1px 0 #000, 2px 2px 0 hsl(0 70% 25%), 0 0 8px hsl(var(--lava-glow) / 0.7)",
          }}
        >
          MISSÃO LOGARÍTMICA
        </h1>
        <div
          className="text-[7px] sm:text-[9px] text-[hsl(45_100%_70%)] mb-2"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          RESGATE NA LAVA
        </div>

        <div
          className="relative h-3 sm:h-4 w-full border-2 border-[hsl(var(--foreground))]"
          style={{
            background: "hsl(220 60% 4%)",
            boxShadow: "inset 0 2px 0 hsl(0 0% 0% / 0.6)",
          }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, hsl(var(--lava-1)), hsl(var(--lava-2)) 60%, hsl(var(--lava-3)))",
              boxShadow: "0 0 12px hsl(var(--lava-glow) / 0.9)",
            }}
          />
          <div className="absolute inset-0 flex">
            {Array.from({ length: total - 1 }).map((_, i) => (
              <div key={i} className="flex-1 border-r-2 border-[hsl(220_60%_4%)/0.6]" />
            ))}
            <div className="flex-1" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-1 mt-2 text-[7px] sm:text-[9px] md:text-[10px]">
          <div className="text-[hsl(var(--lava-3))]">
            Q: <span className="text-foreground">{current}/{total}</span>
          </div>
          <div className="text-[hsl(var(--lava-3))]">
            ✓ <span className="text-[hsl(var(--accent))]">{correct}</span>
          </div>
          <div className="text-[hsl(var(--lava-3))]">
            ✗ <span className="text-[hsl(var(--destructive))]">{wrong}</span>
          </div>
        </div>

        {showTimer && (
          <div className="mt-2">
            <div
              className="text-[7px] sm:text-[9px] mb-1 flex justify-between"
              style={{ color: timerColor, textShadow: "1px 1px 0 #000" }}
            >
              <span>⏱ TEMPO</span>
              <span>{Math.ceil(timeLeft).toString().padStart(2, "0")}s</span>
            </div>
            <div
              className="relative h-2 sm:h-2.5 w-full border-2"
              style={{
                background: "hsl(220 60% 4%)",
                borderColor: timerColor,
                boxShadow: "inset 0 2px 0 hsl(0 0% 0% / 0.6)",
              }}
            >
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${timerPct}%`,
                  background: timerColor,
                  boxShadow: `0 0 8px ${timerColor}`,
                }}
              />
            </div>
          </div>
        )}

        {showElapsed && (
          <div
            className="text-[7px] sm:text-[9px] mt-2 flex justify-between"
            style={{ color: "hsl(45 100% 70%)", textShadow: "1px 1px 0 #000" }}
          >
            <span>⌛ PARTIDA</span>
            <span>
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(Math.floor(elapsed % 60)).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT — cage status */}
      <div
        className="font-pixel relative"
        style={{
          background: "linear-gradient(180deg, hsl(220 55% 8%) 0%, hsl(0 50% 8%) 100%)",
          border: "3px solid hsl(var(--lava-glow))",
          boxShadow:
            "0 0 0 2px hsl(220 60% 3%), 0 0 28px hsl(var(--lava-glow) / 0.55), inset 0 0 16px hsl(0 80% 30% / 0.3)",
          padding: "8px 10px 4px",
          width: "clamp(110px, 16vw, 180px)",
        }}
      >
        <div
          className="text-[6px] sm:text-[8px] text-center text-[hsl(var(--lava-3))] mb-1"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          PROF. JOSE VITOR
        </div>
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-lava animate-lava-pulse" style={{ opacity: 0.85 }} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center bottom, hsl(45 100% 65% / 0.5), transparent 60%)",
            }}
          />
          <div
            className={
              "absolute left-1/2 -translate-x-1/2 top-0 w-[88%] " +
              (dropping ? "animate-cage-drop" : "animate-cage-sway")
            }
            style={{ transformOrigin: "top center" }}
          >
            <img
              src={profCage}
              alt="Professor preso"
              className="w-full h-full object-contain"
              style={{
                imageRendering: "pixelated",
                filter:
                  "drop-shadow(0 0 6px hsl(var(--lava-glow) / 0.6)) drop-shadow(2px 4px 0 hsl(220 60% 3% / 0.8))",
              }}
              draggable={false}
            />
          </div>
        </div>
        <div
          className="text-[6px] sm:text-[8px] text-center text-[hsl(45_100%_70%)] mt-1"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          {dropping ? "QUEDA!" : `VIDAS: ${lives}`}
        </div>
      </div>
    </div>
  );
}
