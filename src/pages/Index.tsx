import { useEffect, useMemo, useRef, useState } from "react";
import { HUD } from "@/game/HUD";
import { LabScene } from "@/game/LabScene";
import { QuestionModal } from "@/game/QuestionModal";
import { DialogModal } from "@/game/DialogModal";
import { TouchControls } from "@/game/TouchControls";
import { SettingsScreen } from "@/game/SettingsScreen";
import {
  DEFAULT_SETTINGS,
  SettingsContext,
  type GameSettings,
} from "@/game/settings";
import {
  ExitScreen,
  InstructionsScreen,
  LoseScreen,
  MenuScreen,
  PauseScreen,
  WinScreen,
} from "@/game/Screens";
import {
  CharacterSelect,
  CHARACTERS,
  characterFilter,
  type CharacterId,
} from "@/game/CharacterSelect";
import { shuffleQuestions } from "@/game/questions";
import { sfx } from "@/game/sounds";
import { PROFESSOR, type NPC } from "@/game/world";

type GameState =
  | "menu"
  | "instructions"
  | "settings"
  | "exit"
  | "select"
  | "playing"
  | "question"
  | "dialog"
  | "paused"
  | "win"
  | "lose";

type DialogPayload = {
  speaker: string;
  role: string;
  lines: string[];
  accent: string;
};

const SETTINGS_KEY = "mlrl.settings.v1";

const Index = () => {
  const [state, setState] = useState<GameState>("menu");
  const [prevState, setPrevState] = useState<GameState>("menu");
  const [character, setCharacter] = useState<CharacterId>("prog_m");
  const [questions, setQuestions] = useState(() => shuffleQuestions());
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const [dropping, setDropping] = useState(false);
  const [dialog, setDialog] = useState<DialogPayload | null>(null);
  const [worldTimer, setWorldTimer] = useState(60);

  // Global match timer
  const [elapsed, setElapsed] = useState(0);
  const runStartRef = useRef<number | null>(null);

  // Settings (persisted)
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_SETTINGS;
  });
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);
  const settingsCtx = useMemo(
    () => ({
      settings,
      update: (patch: Partial<GameSettings>) =>
        setSettings((s) => ({ ...s, ...patch })),
    }),
    [settings]
  );

  useEffect(() => {
    document.title = "Missão Logarítmica: Resgate na Lava — Jogo de Matemática";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute(
      "content",
      "Jogo educativo em pixel art 16-bit: explore a faculdade de ADS, converse com NPCs e resgate o Prof. Jose Vitor da lava respondendo questões de funções exponenciais e logarítmicas."
    );
  }, []);

  const total = questions.length;
  const currentQuestion = useMemo(() => questions[qIndex], [questions, qIndex]);
  const charDef = CHARACTERS[character];
  const playerFilter = characterFilter(charDef.tint);

  function startGame(charId?: CharacterId) {
    if (charId) setCharacter(charId);
    setQuestions(shuffleQuestions());
    setQIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setActiveStation(null);
    setDropping(false);
    setDialog(null);
    setWorldTimer(60);
    setElapsed(0);
    runStartRef.current = performance.now();
    setState("playing");
  }

  function handleInteractComputer(stationId: number) {
    if (state !== "playing") return;
    setActiveStation(stationId);
    setState("question");
  }

  function handleInteractNPC(npc: NPC) {
    if (state !== "playing") return;
    setDialog({
      speaker: npc.name,
      role: npc.role,
      lines: npc.lines,
      accent: npc.color,
    });
    setState("dialog");
  }

  function handleInteractProfessor() {
    if (state !== "playing") return;
    const remaining = total - qIndex;
    const intro = `${PROFESSOR.lines[0]} (Faltam ${remaining} computador${remaining === 1 ? "" : "es"})`;
    setDialog({
      speaker: PROFESSOR.name,
      role: PROFESSOR.role,
      lines: [intro, ...PROFESSOR.lines.slice(1)],
      accent: "hsl(var(--lava-3))",
    });
    setState("dialog");
  }

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) {
      const next = qIndex + 1;
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFlash("green");
      setTimeout(() => setFlash(null), 600);
      setActiveStation(null);
      if (next >= total) {
        sfx.win();
        setState("win");
      } else {
        setQIndex(next);
        setState("playing");
      }
    } else {
      handleWrong();
    }
  }

  function handleWrong() {
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    setFlash("red");
    setTimeout(() => setFlash(null), 600);
    setActiveStation(null);

    if (nextWrong >= total) {
      setDropping(true);
      setTimeout(() => {
        sfx.lose();
        setState("lose");
      }, 1100);
      return;
    }
    const next = qIndex + 1;
    if (next >= total) {
      if (correctCount >= total) {
        sfx.win();
        setState("win");
      } else {
        setDropping(true);
        setTimeout(() => {
          sfx.lose();
          setState("lose");
        }, 1100);
      }
    } else {
      setQIndex(next);
      setState("playing");
    }
  }

  function handleTimeout() {
    handleWrong();
  }

  // Per-question timer (visual)
  useEffect(() => {
    if (state !== "question") {
      setWorldTimer(60);
      return;
    }
    const start = performance.now();
    let raf = 0;
    function tick(t: number) {
      const left = Math.max(0, 60 - (t - start) / 1000);
      setWorldTimer(left);
      if (left > 0 && state === "question") {
        raf = requestAnimationFrame(tick);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, qIndex]);

  // Global match timer (pauses during "paused")
  useEffect(() => {
    const inGame =
      state === "playing" ||
      state === "question" ||
      state === "dialog";
    if (!inGame) return;
    let raf = 0;
    let last = performance.now();
    function tick(t: number) {
      const dt = (t - last) / 1000;
      last = t;
      setElapsed((e) => e + dt);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Esc to pause
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (state === "playing") {
          setPrevState("playing");
          setState("paused");
        } else if (state === "paused") setState("playing");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  const showGameUI =
    state === "playing" ||
    state === "question" ||
    state === "dialog" ||
    state === "paused" ||
    state === "settings";

  const inGameSettings = state === "settings" && prevState !== "menu";

  return (
    <SettingsContext.Provider value={settingsCtx}>
      <main className="fixed inset-0 bg-background overflow-hidden">
        {showGameUI && (
          <>
            <HUD
              current={Math.min(qIndex + (state === "question" ? 1 : 0), total)}
              total={total}
              correct={correctCount}
              wrong={wrongCount}
              dropping={dropping}
              timeLeft={worldTimer}
              showTimer={state === "question"}
              elapsed={elapsed}
              showElapsed={settings.showTimer}
            />
            <div className="absolute inset-0">
              <LabScene
                onInteractComputer={handleInteractComputer}
                onInteractNPC={handleInteractNPC}
                onInteractProfessor={handleInteractProfessor}
                paused={state !== "playing"}
                flash={flash}
                activeStationId={activeStation}
                playerSprite={charDef.sprite}
                playerFilter={playerFilter}
              />
            </div>
            <TouchControls forceShow={settings.mobileControls} />

            {/* Floating pause/settings button — always reachable */}
            {state === "playing" && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40 flex gap-2 pointer-events-auto">
                <button
                  onClick={() => {
                    setPrevState("playing");
                    setState("settings");
                  }}
                  className="font-pixel text-[10px] sm:text-xs w-10 h-10 flex items-center justify-center text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(220 40% 20%), hsl(220 55% 10%))",
                    border: "2px solid hsl(var(--lava-3))",
                    boxShadow: "0 0 10px hsl(var(--lava-glow) / 0.4)",
                  }}
                  aria-label="Configurações"
                >
                  ⚙
                </button>
                <button
                  onClick={() => {
                    setPrevState("playing");
                    setState("paused");
                  }}
                  className="font-pixel text-[10px] sm:text-xs w-10 h-10 flex items-center justify-center text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
                    border: "2px solid hsl(45 100% 70%)",
                    boxShadow: "0 0 12px hsl(var(--lava-glow) / 0.6)",
                  }}
                  aria-label="Pausar"
                >
                  ❚❚
                </button>
              </div>
            )}
          </>
        )}

        {state === "question" && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            onAnswer={handleAnswer}
            onTimeout={handleTimeout}
            onPause={() => {
              setPrevState("question");
              setState("paused");
            }}
            onReturn={() => {
              setActiveStation(null);
              setState("playing");
            }}
          />
        )}

        {state === "dialog" && dialog && (
          <DialogModal
            speaker={dialog.speaker}
            role={dialog.role}
            lines={dialog.lines}
            accentColor={dialog.accent}
            onClose={() => {
              setDialog(null);
              setState("playing");
            }}
          />
        )}

        {state === "paused" && (
          <PauseScreen
            onResume={() =>
              setState(
                activeStation !== null ? "question" : dialog ? "dialog" : "playing"
              )
            }
            onSettings={() => {
              setPrevState("paused");
              setState("settings");
            }}
            onMenu={() => setState("menu")}
          />
        )}

        {state === "settings" && (
          <SettingsScreen
            inGame={inGameSettings}
            onBack={() =>
              setState(
                prevState === "menu"
                  ? "menu"
                  : prevState === "playing"
                  ? "playing"
                  : "paused"
              )
            }
          />
        )}

        {state === "menu" && (
          <MenuScreen
            onPlay={() => setState("select")}
            onInstructions={() => setState("instructions")}
            onSettings={() => {
              setPrevState("menu");
              setState("settings");
            }}
            onExit={() => setState("exit")}
          />
        )}

        {state === "select" && (
          <CharacterSelect
            onConfirm={(id) => startGame(id)}
            onBack={() => setState("menu")}
          />
        )}

        {state === "instructions" && (
          <InstructionsScreen onBack={() => setState("menu")} />
        )}
        {state === "exit" && <ExitScreen onBack={() => setState("menu")} />}

        {state === "win" && (
          <WinScreen
            correct={correctCount}
            total={total}
            onReplay={() => startGame()}
            onMenu={() => setState("menu")}
          />
        )}
        {state === "lose" && (
          <LoseScreen onReplay={() => startGame()} onMenu={() => setState("menu")} />
        )}
      </main>
    </SettingsContext.Provider>
  );
};

export default Index;
