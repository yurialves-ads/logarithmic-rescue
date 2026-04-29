import { useSettings } from "./settings";

export function SettingsScreen({
  onBack,
  inGame,
}: {
  onBack: () => void;
  inGame?: boolean;
}) {
  const { settings, update } = useSettings();

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-[hsl(220_60%_3%)/0.92] backdrop-blur-sm">
      <div
        className="relative max-w-md w-full p-6 sm:p-8 font-pixel"
        style={{
          background: "hsl(220 55% 6% / 0.98)",
          border: "4px solid hsl(var(--lava-glow))",
          boxShadow:
            "0 0 0 2px hsl(220 60% 3%), 0 0 40px hsl(var(--lava-glow) / 0.5)",
        }}
      >
        <h2
          className="text-base sm:text-2xl text-[hsl(var(--lava-3))] text-center mb-6"
          style={{
            textShadow: "2px 2px 0 #000, 0 0 14px hsl(var(--lava-glow))",
          }}
        >
          ⚙ CONFIGURAÇÕES
        </h2>

        <div className="space-y-5 text-foreground">
          <Row
            label="CONTROLES NA TELA"
            hint="Ativa joystick + botão A mesmo no PC"
            value={settings.mobileControls}
            onToggle={() => update({ mobileControls: !settings.mobileControls })}
          />

          <Row
            label="CLIQUE / TOQUE INTERAGE"
            hint="Clicar em objetos próximos interage"
            value={settings.clickToInteract}
            onToggle={() => update({ clickToInteract: !settings.clickToInteract })}
          />

          <Row
            label="CRONÔMETRO DA PARTIDA"
            hint="Mostra o tempo total de jogo no HUD"
            value={settings.showTimer}
            onToggle={() => update({ showTimer: !settings.showTimer })}
          />

          <div>
            <div className="flex justify-between text-[9px] sm:text-[11px] mb-2">
              <span className="text-[hsl(var(--lava-3))]">🔍 ZOOM</span>
              <span className="text-[hsl(45_100%_70%)]">
                {settings.zoom.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.05}
              value={settings.zoom}
              onChange={(e) => update({ zoom: parseFloat(e.target.value) })}
              className="w-full accent-[hsl(var(--lava-3))]"
            />
            <div className="flex justify-between text-[7px] sm:text-[9px] text-[hsl(var(--muted-foreground))] mt-1">
              <span>CENÁRIO</span>
              <span>PERSONAGEM</span>
            </div>
            <div className="flex gap-2 mt-2">
              {[1, 1.25, 1.5, 1.75, 2].map((v) => (
                <button
                  key={v}
                  onClick={() => update({ zoom: v })}
                  className="flex-1 py-1 text-[8px] sm:text-[10px] border-2"
                  style={{
                    borderColor:
                      Math.abs(settings.zoom - v) < 0.01
                        ? "hsl(var(--lava-3))"
                        : "hsl(var(--foreground) / 0.3)",
                    background:
                      Math.abs(settings.zoom - v) < 0.01
                        ? "hsl(var(--lava-glow) / 0.2)"
                        : "hsl(220 50% 8%)",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="text-xs px-8 py-3 uppercase text-white"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              border: "3px solid hsl(45 100% 70%)",
              boxShadow:
                "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 24px hsl(var(--lava-glow) / 0.6)",
            }}
          >
            ◀ {inGame ? "VOLTAR AO JOGO" : "VOLTAR"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  hint,
  value,
  onToggle,
}: {
  label: string;
  hint: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <div className="text-[9px] sm:text-[11px] text-[hsl(var(--lava-3))]">
          {label}
        </div>
        <div
          className="text-[7px] sm:text-[9px] text-[hsl(var(--muted-foreground))] mt-1"
          style={{ fontFamily: "var(--font-pixel-body)" }}
        >
          {hint}
        </div>
      </div>
      <button
        onClick={onToggle}
        aria-pressed={value}
        className="relative w-14 h-7 shrink-0 border-2"
        style={{
          background: value ? "hsl(var(--lava-2))" : "hsl(220 50% 10%)",
          borderColor: value ? "hsl(45 100% 70%)" : "hsl(var(--foreground) / 0.4)",
          boxShadow: value
            ? "0 0 12px hsl(var(--lava-glow) / 0.7), inset 0 0 0 1px hsl(45 100% 65%)"
            : "inset 0 2px 0 hsl(0 0% 0% / 0.4)",
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 transition-all"
          style={{
            left: value ? "calc(100% - 22px)" : "2px",
            background: "hsl(45 100% 85%)",
            boxShadow: "0 2px 0 hsl(0 0% 0% / 0.5)",
          }}
        />
      </button>
    </div>
  );
}
