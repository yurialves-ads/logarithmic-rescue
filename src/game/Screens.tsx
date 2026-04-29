import labBg from "@/assets/lab-bg.png";
import profCage from "@/assets/professor-cage.png";

function StarField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const size = (i % 3) + 1;
        return (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 41) % 100}%`,
              width: size,
              height: size,
              background: i % 4 === 0 ? "hsl(var(--lava-3))" : "hsl(0 0% 90%)",
              boxShadow: `0 0 ${size * 3}px hsl(var(--lava-glow) / 0.5)`,
              animationDelay: `${(i % 8) * 0.3}s`,
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}

function CinematicBg() {
  return (
    <>
      <img
        src={labBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ imageRendering: "pixelated", filter: "brightness(0.45) saturate(1.2)" }}
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(220 70% 3% / 0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 animate-lava-pulse mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 70% 100%, hsl(var(--lava-glow) / 0.5), transparent 60%)",
        }}
      />
    </>
  );
}

export function MenuScreen({
  onPlay,
  onInstructions,
  onSettings,
  onExit,
}: {
  onPlay: () => void;
  onInstructions: () => void;
  onSettings: () => void;
  onExit: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(220_60%_3%)] overflow-hidden">
      <CinematicBg />
      <StarField />

      <div className="relative text-center max-w-3xl w-full">
        {/* Subtitle */}
        <div
          className="font-pixel text-[9px] sm:text-xs text-[hsl(var(--lava-3))] mb-3 tracking-[0.3em]"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          ━━━ MISSÃO LOGARÍTMICA ━━━
        </div>

        {/* Big title */}
        <h1
          className="font-pixel text-3xl sm:text-6xl md:text-7xl leading-tight mb-2"
          style={{
            color: "hsl(var(--lava-2))",
            textShadow:
              "3px 3px 0 hsl(0 80% 25%), 6px 6px 0 hsl(220 60% 3%), 0 0 28px hsl(var(--lava-glow))",
          }}
        >
          RESGATE
        </h1>
        <h1
          className="font-pixel text-3xl sm:text-6xl md:text-7xl leading-tight mb-6"
          style={{
            color: "hsl(var(--lava-3))",
            textShadow:
              "3px 3px 0 hsl(20 80% 25%), 6px 6px 0 hsl(220 60% 3%), 0 0 32px hsl(var(--lava-glow))",
          }}
        >
          NA LAVA
        </h1>

        <p
          className="font-pixel text-[8px] sm:text-[10px] text-[hsl(45_100%_75%)] mb-6 tracking-widest"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          LABORATÓRIO DE INFORMÁTICA · CURSO DE ADS
        </p>

        {/* Cage scene */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 sm:w-44 animate-cage-sway">
            <div
              className="absolute -inset-6 rounded-full animate-lava-pulse"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--lava-glow) / 0.6), transparent 70%)",
              }}
            />
            <img
              src={profCage}
              alt="Professor preso na cela suspensa"
              className="relative w-full"
              style={{
                imageRendering: "pixelated",
                filter:
                  "drop-shadow(0 0 16px hsl(var(--lava-glow) / 0.7)) drop-shadow(2px 6px 0 hsl(220 60% 3%))",
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button onClick={onPlay} className="menu-btn menu-btn-primary">
            ▶ JOGAR
          </button>
          <button onClick={onInstructions} className="menu-btn">
            ✦ INSTRUÇÕES
          </button>
          <button onClick={onSettings} className="menu-btn">
            ⚙ CONFIGURAÇÕES
          </button>
          <button onClick={onExit} className="menu-btn">
            ✕ SAIR
          </button>
        </div>

        <div
          className="font-pixel text-[7px] sm:text-[9px] text-[hsl(var(--muted-foreground))] mt-8 tracking-widest"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          © 2025 · MISSÃO LOGARÍTMICA · v1.0
        </div>
      </div>

      <style>{`
        .menu-btn {
          font-family: var(--font-pixel);
          font-size: 12px;
          padding: 14px 36px;
          width: 260px;
          color: hsl(var(--foreground));
          background: linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%));
          border: 3px solid hsl(var(--lava-glow) / 0.7);
          box-shadow: inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%), 0 0 20px hsl(var(--lava-glow) / 0.2);
          letter-spacing: 0.1em;
          transition: transform 80ms steps(2), filter 100ms;
          text-transform: uppercase;
        }
        .menu-btn:hover { filter: brightness(1.3); transform: translateY(-2px); }
        .menu-btn:active { transform: translateY(2px); box-shadow: inset 0 0 0 1px hsl(220 30% 30%), 0 0 0 hsl(220 60% 3%); }
        .menu-btn-primary {
          background: linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)));
          color: white;
          border-color: hsl(45 100% 70%);
          text-shadow: 1px 1px 0 hsl(0 80% 20%);
          box-shadow: inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 32px hsl(var(--lava-glow) / 0.7);
        }
        @media (min-width: 640px) { .menu-btn { font-size: 14px; padding: 16px 40px; } }
      `}</style>
    </div>
  );
}

export function InstructionsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(220_60%_3%)]">
      <CinematicBg />
      <div
        className="relative max-w-xl w-full p-6 sm:p-8"
        style={{
          background: "hsl(220 55% 6% / 0.95)",
          border: "4px solid hsl(var(--lava-glow))",
          boxShadow:
            "0 0 0 2px hsl(220 60% 3%), 0 0 40px hsl(var(--lava-glow) / 0.4), inset 0 0 0 1px hsl(45 100% 60% / 0.2)",
        }}
      >
        <h2
          className="font-pixel text-base sm:text-2xl text-[hsl(var(--lava-3))] text-center mb-6"
          style={{
            textShadow:
              "2px 2px 0 #000, 0 0 14px hsl(var(--lava-glow))",
          }}
        >
          ✦ INSTRUÇÕES ✦
        </h2>
        <div className="font-pixel-body text-lg sm:text-xl text-foreground space-y-2 leading-snug">
          <p>► O <span className="text-[hsl(var(--lava-3))]">PROF. JOSE VITOR</span> foi capturado e está preso em uma cela sobre a lava.</p>
          <p>
            ► Explore as <span className="text-[hsl(var(--lava-3))]">6 salas</span>: 2 laboratórios, sala de aula, sala dos professores, corredor e a sala da lava.
          </p>
          <p>
            ► Movimente-se com{" "}
            <span className="text-[hsl(var(--lava-3))] font-pixel text-xs">WASD</span> /{" "}
            <span className="text-[hsl(var(--lava-3))] font-pixel text-xs">SETAS</span> (PC) ou pelo joystick (celular).
          </p>
          <p>
            ► Aperte{" "}
            <span className="text-[hsl(var(--lava-3))] font-pixel text-xs">[E]</span> / botão{" "}
            <span className="text-[hsl(var(--lava-3))] font-pixel text-xs">A</span> para falar com NPCs e responder questões.
          </p>
          <p>
            ► <span className="text-[hsl(var(--accent))]">8 questões</span>: 4 logarítmicas + 4 exponenciais. Você tem{" "}
            <span className="text-[hsl(var(--lava-3))]">1 minuto</span> por questão!
          </p>
          <p>► Acerte todas para resgatar o professor. Erre as 8 e ele cai na lava!</p>
          <p>► Converse com os NPCs (ANA, BIA, ALEX, etc.) para receber DICAS valiosas.</p>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="font-pixel text-xs px-8 py-3 uppercase text-white"
            style={{
              background: "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              border: "3px solid hsl(45 100% 70%)",
              boxShadow:
                "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 24px hsl(var(--lava-glow) / 0.6)",
            }}
          >
            ◀ VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
}

export function PauseScreen({
  onResume,
  onMenu,
  onSettings,
}: {
  onResume: () => void;
  onMenu: () => void;
  onSettings: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(220_60%_3%)/0.85] backdrop-blur-sm">
      <div
        className="text-center min-w-[300px] p-8"
        style={{
          background: "hsl(220 55% 6%)",
          border: "4px solid hsl(var(--lava-glow))",
          boxShadow:
            "0 0 0 2px hsl(220 60% 3%), 0 0 40px hsl(var(--lava-glow) / 0.5)",
        }}
      >
        <h2
          className="font-pixel text-xl sm:text-3xl text-[hsl(var(--lava-3))] mb-6"
          style={{ textShadow: "2px 2px 0 #000, 0 0 16px hsl(var(--lava-glow))" }}
        >
          ❚❚ PAUSADO
        </h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="font-pixel text-xs px-8 py-3 uppercase text-white"
            style={{
              background: "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              border: "3px solid hsl(45 100% 70%)",
              boxShadow: "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%)",
            }}
          >
            ▶ CONTINUAR
          </button>
          <button
            onClick={onSettings}
            className="font-pixel text-xs px-8 py-3 uppercase text-foreground"
            style={{
              background: "linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%))",
              border: "3px solid hsl(var(--lava-3) / 0.7)",
              boxShadow: "inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ⚙ CONFIGURAÇÕES
          </button>
          <button
            onClick={onMenu}
            className="font-pixel text-xs px-8 py-3 uppercase text-foreground"
            style={{
              background: "linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow: "inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ⌂ MENU PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
}

export function WinScreen({
  correct,
  total,
  onReplay,
  onMenu,
}: {
  correct: number;
  total: number;
  onReplay: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(140_50%_4%)] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(140 60% 12%) 0%, hsl(220 60% 3%) 80%)",
        }}
      />
      <StarField />
      <div className="relative text-center max-w-lg">
        <div
          className="font-pixel text-[10px] text-[hsl(var(--accent))] tracking-widest mb-2"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          ★ ★ ★ ★ ★
        </div>
        <h2
          className="font-pixel text-3xl sm:text-5xl mb-2"
          style={{
            color: "hsl(var(--accent))",
            textShadow:
              "3px 3px 0 hsl(140 80% 15%), 6px 6px 0 hsl(220 60% 3%), 0 0 32px hsl(var(--accent) / 0.8)",
          }}
        >
          VITÓRIA!
        </h2>
        <p
          className="font-pixel text-[10px] sm:text-sm text-foreground mb-6"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          PROFESSOR RESGATADO COM SEGURANÇA
        </p>
        <div className="flex justify-center mb-6">
          <div
            className="p-4 relative"
            style={{
              background: "hsl(var(--accent) / 0.1)",
              border: "4px solid hsl(var(--accent))",
              boxShadow:
                "0 0 0 2px hsl(220 60% 3%), 0 0 40px hsl(var(--accent) / 0.6)",
            }}
          >
            <img
              src={profCage}
              alt="Professor salvo"
              className="w-32 sm:w-40"
              style={{
                imageRendering: "pixelated",
                filter:
                  "hue-rotate(80deg) saturate(0.7) brightness(1.1) drop-shadow(0 0 12px hsl(var(--accent) / 0.7))",
              }}
            />
          </div>
        </div>
        <p className="font-pixel-body text-2xl text-foreground mb-6">
          ACERTOS:{" "}
          <span className="text-[hsl(var(--accent))] font-pixel text-base">
            {correct}/{total}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReplay}
            className="font-pixel text-xs px-6 py-3 uppercase text-white"
            style={{
              background:
                "linear-gradient(180deg, hsl(140 70% 45%), hsl(140 80% 30%))",
              border: "3px solid hsl(140 90% 70%)",
              boxShadow:
                "inset 0 0 0 1px hsl(140 80% 60%), 0 4px 0 hsl(140 80% 15%), 0 0 24px hsl(var(--accent) / 0.6)",
            }}
          >
            ↻ JOGAR NOVAMENTE
          </button>
          <button
            onClick={onMenu}
            className="font-pixel text-xs px-6 py-3 uppercase text-foreground"
            style={{
              background: "linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow: "inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ⌂ MENU
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoseScreen({
  onReplay,
  onMenu,
}: {
  onReplay: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(0_60%_5%)] overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-lava animate-lava-pulse" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, hsl(var(--lava-glow) / 0.4), transparent 60%)",
        }}
      />
      <div className="relative text-center max-w-lg">
        <h2
          className="font-pixel text-3xl sm:text-5xl text-[hsl(var(--destructive))] mb-2 animate-shake"
          style={{
            textShadow:
              "3px 3px 0 hsl(0 80% 15%), 6px 6px 0 hsl(220 60% 3%), 0 0 32px hsl(var(--destructive) / 0.8)",
          }}
        >
          DERROTA
        </h2>
        <p
          className="font-pixel text-[10px] sm:text-sm text-foreground mb-6"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          O PROFESSOR CAIU NA LAVA...
        </p>
        <div className="flex justify-center mb-6 opacity-70">
          <img
            src={profCage}
            alt=""
            className="w-28 sm:w-36 animate-pulse"
            style={{
              imageRendering: "pixelated",
              filter:
                "hue-rotate(-30deg) saturate(2) brightness(0.7) drop-shadow(0 0 16px hsl(var(--destructive)))",
            }}
          />
        </div>
        <p
          className="font-pixel-body text-2xl text-[hsl(var(--lava-3))] mb-6"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          Estude mais logaritmos e tente outra vez!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReplay}
            className="font-pixel text-xs px-6 py-3 uppercase text-white"
            style={{
              background: "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              border: "3px solid hsl(45 100% 70%)",
              boxShadow:
                "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 24px hsl(var(--lava-glow) / 0.6)",
            }}
          >
            ↻ TENTAR NOVAMENTE
          </button>
          <button
            onClick={onMenu}
            className="font-pixel text-xs px-6 py-3 uppercase text-foreground"
            style={{
              background: "linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow: "inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ⌂ MENU
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExitScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(220_60%_3%)]">
      <CinematicBg />
      <div className="relative text-center">
        <h2
          className="font-pixel text-base sm:text-2xl text-[hsl(var(--lava-3))] mb-4"
          style={{ textShadow: "2px 2px 0 #000, 0 0 14px hsl(var(--lava-glow))" }}
        >
          OBRIGADO POR JOGAR!
        </h2>
        <p className="font-pixel-body text-2xl text-foreground mb-6">
          Até a próxima missão.
        </p>
        <button
          onClick={onBack}
          className="font-pixel text-xs px-6 py-3 uppercase text-white"
          style={{
            background: "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
            border: "3px solid hsl(45 100% 70%)",
            boxShadow:
              "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 24px hsl(var(--lava-glow) / 0.6)",
          }}
        >
          ◀ VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
}
