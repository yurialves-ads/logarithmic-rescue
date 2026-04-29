import { useEffect, useRef, useState } from "react";
import type { Question } from "./questions";
import { sfx } from "./sounds";

const QUESTION_TIME_MS = 60_000;

export function QuestionModal({
  question,
  onAnswer,
  onPause,
  onReturn,
  onTimeout,
}: {
  question: Question;
  onAnswer: (correct: boolean) => void;
  onPause: () => void;
  onReturn: () => void;
  onTimeout: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(QUESTION_TIME_MS);
  const startedAt = useRef(performance.now());

  useEffect(() => {
    setPicked(null);
    setLocked(false);
    setRemaining(QUESTION_TIME_MS);
    startedAt.current = performance.now();
  }, [question.id]);

  useEffect(() => {
    let raf = 0;
    function tick() {
      const elapsed = performance.now() - startedAt.current;
      const left = Math.max(0, QUESTION_TIME_MS - elapsed);
      setRemaining(left);
      if (left <= 0) {
        if (!locked) {
          setLocked(true);
          sfx.wrong();
          setTimeout(onTimeout, 600);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [question.id, locked, onTimeout]);

  const handlePick = (i: number) => {
    if (locked) return;
    setPicked(i);
    setLocked(true);
    const isCorrect = i === question.correct;
    if (isCorrect) sfx.correct();
    else sfx.wrong();
    setTimeout(() => onAnswer(isCorrect), 1100);
  };

  const seconds = Math.ceil(remaining / 1000);
  const pct = (remaining / QUESTION_TIME_MS) * 100;
  const timerColor =
    seconds > 30 ? "hsl(var(--accent))" : seconds > 10 ? "hsl(var(--lava-3))" : "hsl(var(--destructive))";

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 pointer-events-auto">
      <div className="absolute inset-0 bg-[hsl(220_60%_3%)/0.55] backdrop-blur-[1px]" />

      <div className="relative w-full max-w-[560px]">
        <div
          className="font-pixel text-[8px] sm:text-[10px] inline-block px-3 py-1 mb-[-4px] relative z-10 ml-3"
          style={{
            background: "hsl(var(--lava-1))",
            color: "hsl(0 0% 100%)",
            border: "3px solid hsl(var(--lava-glow))",
            borderBottom: "none",
            textShadow: "1px 1px 0 #000",
            boxShadow: "0 0 12px hsl(var(--lava-glow) / 0.7)",
          }}
        >
          {question.category === "logaritmica" ? "● LOGARITMO" : "● EXPONENCIAL"}
        </div>

        <div
          className="relative animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: "linear-gradient(180deg, hsl(220 45% 10%) 0%, hsl(220 55% 6%) 100%)",
            border: "4px solid hsl(var(--lava-glow))",
            boxShadow:
              "0 0 0 3px hsl(220 60% 3%), inset 0 0 0 2px hsl(220 30% 18%), 0 16px 0 hsl(220 60% 3% / 0.6), 0 0 48px hsl(var(--lava-glow) / 0.35)",
            padding: "20px 22px 24px",
          }}
        >
          {/* Timer bar inside modal */}
          <div
            className="font-pixel text-[8px] sm:text-[10px] mb-3 flex justify-between items-center"
            style={{ color: timerColor, textShadow: "1px 1px 0 #000" }}
          >
            <span>⏱ TEMPO RESTANTE</span>
            <span className={seconds <= 10 ? "animate-pulse" : ""}>
              {seconds.toString().padStart(2, "0")}s
            </span>
          </div>
          <div
            className="relative h-2 mb-3 border-2"
            style={{
              background: "hsl(220 60% 4%)",
              borderColor: timerColor,
            }}
          >
            <div
              className="h-full transition-[width] duration-100"
              style={{
                width: `${pct}%`,
                background: timerColor,
                boxShadow: `0 0 10px ${timerColor}`,
              }}
            />
          </div>

          <button
            aria-label="Fechar"
            onClick={onReturn}
            className="absolute top-2 right-3 font-pixel text-[10px] sm:text-xs text-[hsl(var(--lava-3))] hover:text-[hsl(var(--destructive))] transition-colors"
          >
            [ X ]
          </button>

          <p className="font-pixel text-[9px] sm:text-[12px] leading-relaxed text-center text-foreground uppercase">
            {question.prompt}
          </p>

          <div className="my-4 sm:my-5">
            <div
              className="mx-auto inline-block w-full text-center py-3 px-4"
              style={{
                background: "hsl(220 60% 4%)",
                border: "2px dashed hsl(var(--lava-3) / 0.7)",
                boxShadow:
                  "inset 0 0 24px hsl(var(--lava-glow) / 0.15), 0 2px 0 hsl(220 60% 2%)",
              }}
            >
              <div
                className="font-pixel-body text-3xl sm:text-4xl text-[hsl(var(--lava-3))]"
                style={{
                  textShadow:
                    "0 0 10px hsl(var(--lava-glow) / 0.7), 2px 2px 0 hsl(220 60% 2%)",
                  letterSpacing: "0.05em",
                }}
              >
                {question.equation}{" "}
                <span className="text-foreground opacity-90">= ?</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = locked && i === question.correct;
              const isWrong = locked && isPicked && i !== question.correct;
              return (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => handlePick(i)}
                  className={[
                    "font-pixel text-[11px] sm:text-base px-4 py-3 uppercase text-center transition-all",
                    locked && !isCorrect && !isWrong ? "opacity-50" : "",
                    !locked ? "hover:brightness-125 hover:-translate-y-[2px]" : "",
                    isCorrect ? "text-[hsl(var(--accent))]" : "",
                    isWrong ? "text-[hsl(var(--destructive))]" : "",
                    !isCorrect && !isWrong ? "text-foreground" : "",
                  ].join(" ")}
                  style={{
                    background: isCorrect
                      ? "hsl(var(--accent) / 0.18)"
                      : isWrong
                      ? "hsl(var(--destructive) / 0.18)"
                      : "linear-gradient(180deg, hsl(220 35% 14%), hsl(220 45% 8%))",
                    border: isCorrect
                      ? "3px solid hsl(var(--accent))"
                      : isWrong
                      ? "3px solid hsl(var(--destructive))"
                      : "3px solid hsl(var(--lava-glow) / 0.7)",
                    boxShadow: isCorrect
                      ? "0 0 0 2px hsl(var(--accent) / 0.5), 0 0 24px hsl(var(--accent) / 0.9), inset 0 0 18px hsl(var(--accent) / 0.3)"
                      : isWrong
                      ? "0 0 0 2px hsl(var(--destructive) / 0.5), 0 0 22px hsl(var(--destructive) / 0.8)"
                      : "inset 0 0 0 1px hsl(0 0% 0% / 0.4), 0 4px 0 hsl(220 60% 3%), 0 6px 12px hsl(220 60% 3% / 0.5)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onPause}
            className="font-pixel text-[9px] sm:text-xs px-5 py-2 uppercase text-foreground hover:brightness-125 transition-all"
            style={{
              background: "linear-gradient(180deg, hsl(220 25% 26%), hsl(220 30% 16%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow: "inset 0 0 0 1px hsl(220 25% 35%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ❚❚ PAUSE
          </button>
          <button
            onClick={onReturn}
            className="font-pixel text-[9px] sm:text-xs px-5 py-2 uppercase text-foreground hover:brightness-125 transition-all"
            style={{
              background: "linear-gradient(180deg, hsl(220 25% 26%), hsl(220 30% 16%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow: "inset 0 0 0 1px hsl(220 25% 35%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ↶ RETORNAR
          </button>
        </div>
      </div>
    </div>
  );
}
