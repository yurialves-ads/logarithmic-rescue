import { useState } from "react";
import maleImg from "@/assets/player-male.png";
import femaleImg from "@/assets/player-female.png";

export type CharacterId =
  | "prog_m" | "prog_f"
  | "fullstack_m" | "fullstack_f"
  | "mobile_m" | "mobile_f"
  | "devops_m" | "devops_f"
  | "qa_m" | "qa_f"
  | "uiux_m" | "uiux_f"
  | "architect_m" | "architect_f"
  | "data_m" | "data_f"
  | "game_m" | "game_f";

type Tint = { hue: number; saturate: number; brightness: number };

export type CharacterDef = {
  name: string;
  role: string;
  gender: "M" | "F";
  sprite: string;
  accent: string;
  tint: Tint;
};

// 9 roles × 2 genders = 18 (we cover the requested 8 + base programmer)
export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  prog_m:       { name: "PROGRAMADOR",      role: "BACK-END / ADS",     gender: "M", sprite: maleImg,   accent: "hsl(215 80% 55%)", tint: { hue: 0,    saturate: 1,   brightness: 1 } },
  prog_f:       { name: "PROGRAMADORA",     role: "BACK-END / ADS",     gender: "F", sprite: femaleImg, accent: "hsl(320 80% 60%)", tint: { hue: 0,    saturate: 1,   brightness: 1 } },
  fullstack_m:  { name: "FULL STACK",       role: "FRONT + BACK",       gender: "M", sprite: maleImg,   accent: "hsl(160 70% 50%)", tint: { hue: 130,  saturate: 1.1, brightness: 1 } },
  fullstack_f:  { name: "FULL STACK",       role: "FRONT + BACK",       gender: "F", sprite: femaleImg, accent: "hsl(160 70% 55%)", tint: { hue: -30,  saturate: 1.1, brightness: 1 } },
  mobile_m:     { name: "MOBILE DEV",       role: "iOS / ANDROID",      gender: "M", sprite: maleImg,   accent: "hsl(280 75% 60%)", tint: { hue: 70,   saturate: 1.2, brightness: 1 } },
  mobile_f:     { name: "MOBILE DEV",       role: "iOS / ANDROID",      gender: "F", sprite: femaleImg, accent: "hsl(280 75% 65%)", tint: { hue: 80,   saturate: 1.2, brightness: 1 } },
  devops_m:     { name: "DEVOPS",           role: "INFRA / CI-CD",      gender: "M", sprite: maleImg,   accent: "hsl(20 90% 55%)",  tint: { hue: -50,  saturate: 1.3, brightness: 0.95 } },
  devops_f:     { name: "DEVOPS",           role: "INFRA / CI-CD",      gender: "F", sprite: femaleImg, accent: "hsl(20 90% 60%)",  tint: { hue: -50,  saturate: 1.3, brightness: 0.95 } },
  qa_m:         { name: "QA ENGINEER",      role: "QUALITY ASSURANCE",  gender: "M", sprite: maleImg,   accent: "hsl(45 95% 55%)",  tint: { hue: -110, saturate: 1.4, brightness: 1.05 } },
  qa_f:         { name: "QA ENGINEER",      role: "QUALITY ASSURANCE",  gender: "F", sprite: femaleImg, accent: "hsl(45 95% 60%)",  tint: { hue: -110, saturate: 1.4, brightness: 1.05 } },
  uiux_m:       { name: "UI/UX DESIGNER",   role: "DESIGN / FIGMA",     gender: "M", sprite: maleImg,   accent: "hsl(330 80% 60%)", tint: { hue: 180,  saturate: 1,   brightness: 1.05 } },
  uiux_f:       { name: "UI/UX DESIGNER",   role: "DESIGN / FIGMA",     gender: "F", sprite: femaleImg, accent: "hsl(330 80% 65%)", tint: { hue: 180,  saturate: 1,   brightness: 1.05 } },
  architect_m:  { name: "ARCHITECT",        role: "SOFTWARE ARCH.",     gender: "M", sprite: maleImg,   accent: "hsl(210 30% 70%)", tint: { hue: 200,  saturate: 0.4, brightness: 0.95 } },
  architect_f:  { name: "ARCHITECT",        role: "SOFTWARE ARCH.",     gender: "F", sprite: femaleImg, accent: "hsl(210 30% 75%)", tint: { hue: 200,  saturate: 0.4, brightness: 0.95 } },
  data_m:       { name: "DATA SCIENTIST",   role: "DATA / ML",          gender: "M", sprite: maleImg,   accent: "hsl(190 80% 55%)", tint: { hue: 160,  saturate: 1.2, brightness: 1 } },
  data_f:       { name: "DATA SCIENTIST",   role: "DATA / ML",          gender: "F", sprite: femaleImg, accent: "hsl(190 80% 60%)", tint: { hue: 160,  saturate: 1.2, brightness: 1 } },
  game_m:       { name: "GAME DEV",         role: "UNITY / UNREAL",     gender: "M", sprite: maleImg,   accent: "hsl(0 85% 60%)",   tint: { hue: -80,  saturate: 1.5, brightness: 1 } },
  game_f:       { name: "GAME DEV",         role: "UNITY / UNREAL",     gender: "F", sprite: femaleImg, accent: "hsl(0 85% 65%)",   tint: { hue: -80,  saturate: 1.5, brightness: 1 } },
};

export function characterFilter(t: Tint): string {
  return `hue-rotate(${t.hue}deg) saturate(${t.saturate}) brightness(${t.brightness})`;
}

const ROLES: { key: string; label: string }[] = [
  { key: "prog",       label: "PROGRAMADOR(A)" },
  { key: "fullstack",  label: "FULL STACK" },
  { key: "mobile",     label: "MOBILE DEV" },
  { key: "devops",     label: "DEVOPS" },
  { key: "qa",         label: "QA ENGINEER" },
  { key: "uiux",       label: "UI/UX DESIGNER" },
  { key: "architect",  label: "ARCHITECT" },
  { key: "data",       label: "DATA SCIENTIST" },
  { key: "game",       label: "GAME DEV" },
];

export function CharacterSelect({
  onConfirm,
  onBack,
}: {
  onConfirm: (id: CharacterId) => void;
  onBack: () => void;
}) {
  const [role, setRole] = useState<string>("prog");
  const [gender, setGender] = useState<"M" | "F">("M");

  const id = `${role}_${gender === "M" ? "m" : "f"}` as CharacterId;
  const def = CHARACTERS[id];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-[hsl(220_60%_3%)] overflow-y-auto">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(220 55% 8%) 0%, hsl(220 70% 2%) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, hsl(0 0% 0% / 0.5) 0 1px, transparent 1px 3px)",
        }}
      />

      <div className="relative w-full max-w-5xl text-center my-4">
        <div
          className="font-pixel text-[8px] sm:text-xs text-[hsl(var(--lava-3))] mb-2 tracking-[0.3em]"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          ━━━ ESCOLHA SEU PERSONAGEM ━━━
        </div>
        <h2
          className="font-pixel text-xl sm:text-3xl mb-4"
          style={{
            color: "hsl(var(--lava-3))",
            textShadow:
              "2px 2px 0 hsl(0 80% 25%), 4px 4px 0 hsl(220 60% 3%), 0 0 24px hsl(var(--lava-glow))",
          }}
        >
          QUEM VAI AO RESGATE?
        </h2>

        {/* Preview + role grid */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 items-start">
          {/* Preview card */}
          <div
            className="p-4 mx-auto w-full max-w-[320px]"
            style={{
              background: `linear-gradient(180deg, hsl(220 50% 12%), hsl(220 60% 5%))`,
              border: `4px solid ${def.accent}`,
              boxShadow: `0 0 0 2px hsl(220 60% 3%), 0 0 32px ${def.accent}`,
            }}
          >
            <div
              className="aspect-[3/5] mx-auto flex items-end justify-center mb-3"
              style={{
                background:
                  "linear-gradient(180deg, hsl(220 40% 10%) 0%, hsl(220 60% 5%) 100%)",
                border: `2px solid ${def.accent}`,
              }}
            >
              <img
                src={def.sprite}
                alt={def.name}
                className="animate-step"
                style={{
                  height: "94%",
                  objectFit: "contain",
                  imageRendering: "pixelated",
                  filter: `${characterFilter(def.tint)} drop-shadow(0 0 12px ${def.accent}) drop-shadow(2px 4px 0 hsl(220 60% 3%))`,
                }}
              />
            </div>
            <div
              className="font-pixel text-[11px] sm:text-sm"
              style={{ color: def.accent, textShadow: "1px 1px 0 #000" }}
            >
              {def.name} {def.gender === "F" ? "♀" : "♂"}
            </div>
            <div
              className="font-pixel text-[8px] sm:text-[10px] mt-1 tracking-widest"
              style={{
                color: "hsl(var(--muted-foreground))",
                textShadow: "1px 1px 0 #000",
              }}
            >
              {def.role}
            </div>

            {/* Gender toggle */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="font-pixel text-[10px] py-2 uppercase"
                  style={{
                    background:
                      gender === g
                        ? "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))"
                        : "hsl(220 40% 10%)",
                    color: gender === g ? "white" : "hsl(var(--muted-foreground))",
                    border: `2px solid ${gender === g ? "hsl(45 100% 65%)" : "hsl(220 30% 22%)"}`,
                    textShadow: "1px 1px 0 #000",
                  }}
                >
                  {g === "M" ? "♂ MASCULINO" : "♀ FEMININO"}
                </button>
              ))}
            </div>
          </div>

          {/* Role grid */}
          <div
            className="p-3 sm:p-4"
            style={{
              background: "hsl(220 55% 6% / 0.85)",
              border: "3px solid hsl(var(--lava-glow) / 0.7)",
              boxShadow: "0 0 0 2px hsl(220 60% 3%)",
            }}
          >
            <div
              className="font-pixel text-[8px] sm:text-[10px] text-[hsl(var(--lava-3))] mb-3 tracking-widest"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              ► PROFISSÕES DISPONÍVEIS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const sel = role === r.key;
                const previewId = `${r.key}_${gender === "M" ? "m" : "f"}` as CharacterId;
                const p = CHARACTERS[previewId];
                return (
                  <button
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    onDoubleClick={() => onConfirm(previewId)}
                    className="relative p-2 transition-transform"
                    style={{
                      background: sel
                        ? "linear-gradient(180deg, hsl(220 45% 14%), hsl(220 55% 6%))"
                        : "hsl(220 50% 8%)",
                      border: `3px solid ${sel ? p.accent : "hsl(220 30% 22%)"}`,
                      boxShadow: sel
                        ? `0 0 0 2px hsl(220 60% 3%), 0 0 16px ${p.accent}`
                        : "0 0 0 2px hsl(220 60% 3%)",
                      transform: sel ? "translateY(-2px)" : undefined,
                    }}
                  >
                    <div
                      className="aspect-square mx-auto flex items-end justify-center mb-1"
                      style={{ background: "hsl(220 55% 5%)" }}
                    >
                      <img
                        src={p.sprite}
                        alt={p.name}
                        style={{
                          height: "92%",
                          objectFit: "contain",
                          imageRendering: "pixelated",
                          filter: characterFilter(p.tint),
                        }}
                      />
                    </div>
                    <div
                      className="font-pixel text-[7px] sm:text-[8px] leading-tight"
                      style={{
                        color: sel ? p.accent : "hsl(var(--foreground))",
                        textShadow: "1px 1px 0 #000",
                      }}
                    >
                      {r.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
          <button
            onClick={() => onConfirm(id)}
            className="font-pixel text-xs sm:text-sm px-8 py-3 uppercase text-white"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              border: "3px solid hsl(45 100% 70%)",
              boxShadow:
                "inset 0 0 0 1px hsl(45 100% 65%), 0 4px 0 hsl(0 70% 20%), 0 0 24px hsl(var(--lava-glow) / 0.6)",
            }}
          >
            ▶ COMEÇAR MISSÃO
          </button>
          <button
            onClick={onBack}
            className="font-pixel text-xs sm:text-sm px-8 py-3 uppercase text-foreground"
            style={{
              background:
                "linear-gradient(180deg, hsl(220 35% 18%), hsl(220 50% 8%))",
              border: "3px solid hsl(var(--foreground) / 0.5)",
              boxShadow:
                "inset 0 0 0 1px hsl(220 30% 30%), 0 4px 0 hsl(220 60% 3%)",
            }}
          >
            ◀ VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
}
