import { useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "./sounds";
import worldBg from "@/assets/world-map.png";
import defaultPlayerImg from "@/assets/player-male.png";
import { useSettings } from "./settings";
import {
  COMPUTERS,
  DOORS,
  INTERACT_RADIUS,
  NPCS,
  PROFESSOR,
  ROOMS,
  currentRoom,
  isWalkable,
  type NPC,
} from "./world";

const BG_W = 1920;
const BG_H = 1080;
const ASPECT = BG_W / BG_H;

// Movement speed in normalized units per second.
const SPEED = 0.18;

export type InteractionTarget =
  | { kind: "computer"; id: number }
  | { kind: "npc"; npc: NPC }
  | { kind: "professor" };

export function LabScene({
  onInteractComputer,
  onInteractNPC,
  onInteractProfessor,
  paused,
  flash,
  activeStationId,
  playerSprite,
  playerFilter,
}: {
  onInteractComputer: (stationId: number) => void;
  onInteractNPC: (npc: NPC) => void;
  onInteractProfessor: () => void;
  paused: boolean;
  flash: "green" | "red" | null;
  activeStationId: number | null;
  playerSprite?: string;
  playerFilter?: string;
}) {
  const { settings } = useSettings();
  const playerImg = playerSprite ?? defaultPlayerImg;

  // Spawn the player in the hall (center bottom room) for natural exploration.
  const [pos, setPos] = useState({ x: 0.5, y: 0.72 });
  const posRef = useRef(pos);
  posRef.current = pos;

  const [facing, setFacing] = useState<"left" | "right">("right");
  const [walking, setWalking] = useState(false);
  const lastStepSfx = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, ox: 0, oy: 0 });

  // Held keys + virtual joystick state (continuous direction)
  const dirRef = useRef({ dx: 0, dy: 0 });

  // Fit background using "contain" math
  useEffect(() => {
    function fit() {
      const el = wrapRef.current?.parentElement;
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const containerAspect = cw / ch;
      let w: number, h: number, ox: number, oy: number;
      if (containerAspect > ASPECT) {
        h = ch;
        w = ch * ASPECT;
        ox = (cw - w) / 2;
        oy = 0;
      } else {
        w = cw;
        h = cw / ASPECT;
        ox = 0;
        oy = (ch - h) / 2;
      }
      setBox({ w, h, ox, oy });
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Smooth movement loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    function tick(t: number) {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const { dx, dy } = dirRef.current;
      if (!paused && (dx || dy)) {
        // normalize diagonal
        const mag = Math.hypot(dx, dy) || 1;
        const ndx = (dx / mag) * SPEED * dt;
        const ndy = (dy / mag) * SPEED * dt;
        if (dx < 0) setFacing("left");
        else if (dx > 0) setFacing("right");

        setPos((p) => {
          const tryX = p.x + ndx;
          const tryY = p.y + ndy;
          // axis-by-axis sliding
          let nx = p.x;
          let ny = p.y;
          if (isWalkable(tryX, p.y)) nx = tryX;
          if (isWalkable(nx, tryY)) ny = tryY;
          // clamp
          nx = Math.max(0.01, Math.min(0.99, nx));
          ny = Math.max(0.01, Math.min(0.99, ny));
          if (nx !== p.x || ny !== p.y) {
            const now = performance.now();
            if (now - lastStepSfx.current > 220) {
              sfx.step();
              lastStepSfx.current = now;
            }
          }
          return { x: nx, y: ny };
        });
        setWalking(true);
      } else {
        setWalking(false);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Find nearest interactable around the player.
  function nearestInteractable(): InteractionTarget | null {
    const p = posRef.current;
    let best: { d: number; t: InteractionTarget } | null = null;

    for (const c of COMPUTERS) {
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      if (d < INTERACT_RADIUS && (!best || d < best.d)) {
        best = { d, t: { kind: "computer", id: c.id } };
      }
    }
    for (const n of NPCS) {
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d < INTERACT_RADIUS + 0.01 && (!best || d < best.d)) {
        best = { d, t: { kind: "npc", npc: n } };
      }
    }
    // Professor is in the lava cage — interact from the safe edge.
    const dp = Math.hypot(PROFESSOR.x - p.x, PROFESSOR.y - p.y);
    if (dp < 0.09 && (!best || dp < best.d)) {
      best = { d: dp, t: { kind: "professor" } };
    }
    return best?.t ?? null;
  }

  function tryInteract() {
    const target = nearestInteractable();
    if (!target) return;
    if (target.kind === "computer") onInteractComputer(target.id);
    else if (target.kind === "npc") onInteractNPC(target.npc);
    else onInteractProfessor();
  }

  // Keyboard controls
  useEffect(() => {
    const held = new Set<string>();
    function recompute() {
      let dx = 0, dy = 0;
      if (held.has("arrowup") || held.has("w")) dy -= 1;
      if (held.has("arrowdown") || held.has("s")) dy += 1;
      if (held.has("arrowleft") || held.has("a")) dx -= 1;
      if (held.has("arrowright") || held.has("d")) dx += 1;
      dirRef.current = { dx, dy };
    }
    function onDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "enter"].includes(k)) {
        e.preventDefault();
      }
      held.add(k);
      recompute();
      if (k === " " || k === "enter" || k === "e") tryInteract();
    }
    function onUp(e: KeyboardEvent) {
      held.delete(e.key.toLowerCase());
      recompute();
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch controls bridge (continuous)
  useEffect(() => {
    (window as any).__labControls = {
      setDir: (dx: number, dy: number) => {
        dirRef.current = { dx, dy };
      },
      interact: () => tryInteract(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const near = useMemo(() => nearestInteractable(), [pos]);
  const room = useMemo(() => currentRoom(pos.x, pos.y), [pos]);
  const flashClass =
    flash === "green" ? "flash-green" : flash === "red" ? "flash-red animate-shake" : "";

  // Px helpers
  const pxX = (nx: number) => box.ox + nx * box.w;
  const pxY = (ny: number) => box.oy + ny * box.h;
  const playerH = box.h * 0.075;
  const playerW = playerH * 0.55;

  // Camera transform: scale around player, clamped so the map stays on screen.
  const zoom = settings.zoom;
  const el = wrapRef.current;
  const cw = el?.clientWidth ?? box.w;
  const ch = el?.clientHeight ?? box.h;
  const focusX = pxX(pos.x);
  const focusY = pxY(pos.y);
  // Translate so player stays centered when zoomed; clamp to map edges.
  let tx = cw / 2 - focusX * zoom;
  let ty = ch / 2 - focusY * zoom;
  if (zoom > 1) {
    const minX = cw - (box.ox + box.w) * zoom;
    const maxX = -box.ox * zoom;
    const minY = ch - (box.oy + box.h) * zoom;
    const maxY = -box.oy * zoom;
    tx = Math.min(maxX, Math.max(minX, tx));
    ty = Math.min(maxY, Math.max(minY, ty));
  } else {
    tx = 0;
    ty = 0;
  }
  const cameraStyle: React.CSSProperties = {
    transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
    transformOrigin: "0 0",
    transition: "transform 120ms linear",
    width: "100%",
    height: "100%",
    position: "absolute",
    inset: 0,
  };

  // Click/tap-to-interact: find nearest interactable at click point.
  function handleSceneClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!settings.clickToInteract || paused) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    // convert client -> camera-local -> world
    const lx = (e.clientX - rect.left - tx) / zoom;
    const ly = (e.clientY - rect.top - ty) / zoom;
    const wx = (lx - box.ox) / box.w;
    const wy = (ly - box.oy) / box.h;
    // search interactables within a generous screen radius (~10% world units)
    const R = 0.08;
    let best: { d: number; run: () => void } | null = null;
    for (const c of COMPUTERS) {
      const d = Math.hypot(c.x - wx, c.y - wy);
      if (d < R && (!best || d < best.d))
        best = { d, run: () => onInteractComputer(c.id) };
    }
    for (const n of NPCS) {
      const d = Math.hypot(n.x - wx, n.y - wy);
      if (d < R && (!best || d < best.d))
        best = { d, run: () => onInteractNPC(n) };
    }
    const dp = Math.hypot(PROFESSOR.x - wx, PROFESSOR.y - wy);
    if (dp < R && (!best || dp < best.d))
      best = { d: dp, run: () => onInteractProfessor() };

    if (best) {
      // Also require the PLAYER to be close enough (so clicks aren't teleport-interactions)
      // — if not, just nudge feedback: only fire when within interaction range of nearest.
      const target = nearestInteractable();
      if (target) best.run();
    }
  }

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden"
      onClick={handleSceneClick}
    >
      {/* Ambient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(220 55% 6%) 0%, hsl(220 70% 2%) 100%)",
        }}
      />
      <img
        src={worldBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md pointer-events-none"
        draggable={false}
      />

      {/* Camera wrapper (zoom + follow) */}
      <div style={cameraStyle}>

      {/* World */}
      <img
        src={worldBg}
        alt="Mapa da faculdade de ADS"
        className={"absolute select-none pointer-events-none " + flashClass}
        style={{
          left: box.ox,
          top: box.oy,
          width: box.w,
          height: box.h,
          imageRendering: "pixelated",
        }}
        draggable={false}
      />

      {/* Lava room glow overlay */}
      <div
        className="absolute pointer-events-none animate-lava-pulse mix-blend-screen"
        style={{
          left: pxX(0.66),
          top: pxY(0.46),
          width: box.w * 0.34,
          height: box.h * 0.5,
          background:
            "radial-gradient(ellipse at 55% 65%, hsl(20 100% 60% / 0.45) 0%, transparent 70%)",
        }}
      />

      {/* Door markers */}
      {DOORS.map((d, i) => {
        const cx = (d.x1 + d.x2) / 2;
        const cy = (d.y1 + d.y2) / 2;
        const w = (d.x2 - d.x1) * box.w;
        const h = (d.y2 - d.y1) * box.h;
        return (
          <div
            key={`door-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: pxX(cx) - w / 2,
              top: pxY(cy) - h / 2,
              width: w,
              height: h,
              background:
                "linear-gradient(180deg, hsl(var(--lava-glow) / 0.25), hsl(var(--lava-3) / 0.15))",
              border: "1px dashed hsl(var(--lava-3) / 0.6)",
              boxShadow: "0 0 10px hsl(var(--lava-glow) / 0.4)",
            }}
          />
        );
      })}

      {/* Computer highlight rings */}
      {COMPUTERS.map((c) => {
        const isNear =
          near?.kind === "computer" && (near as any).id === c.id;
        const isActive = activeStationId === c.id;
        const size = box.h * 0.06;
        return (
          <div
            key={c.id}
            className={`absolute pointer-events-none ${isActive ? "animate-pulse" : ""}`}
            style={{
              left: pxX(c.x) - size / 2,
              top: pxY(c.y) - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `2px ${isNear || isActive ? "solid" : "dashed"} hsl(var(--lava-3) / ${isNear || isActive ? 0.95 : 0.45})`,
              boxShadow: isNear || isActive
                ? "0 0 18px hsl(var(--lava-3) / 0.8)"
                : undefined,
            }}
          />
        );
      })}

      {/* NPCs */}
      {NPCS.map((n) => {
        const isNear = near?.kind === "npc" && (near as any).npc?.id === n.id;
        const npcH = box.h * 0.065;
        const npcW = npcH * 0.55;
        return (
          <div
            key={n.id}
            className="absolute"
            style={{
              left: pxX(n.x) - npcW / 2,
              top: pxY(n.y) - npcH * 0.92,
              width: npcW,
              height: npcH,
              zIndex: 15,
            }}
          >
            <img
              src={defaultPlayerImg}
              alt={n.name}
              className="animate-step"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: `drop-shadow(2px 4px 0 hsl(220 60% 4% / 0.7)) hue-rotate(${n.id.length * 47}deg) saturate(1.3)`,
              }}
            />
            {/* Floating "!" indicator */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 font-pixel text-[10px]"
              style={{
                color: n.color,
                textShadow: "1px 1px 0 #000, 0 0 6px " + n.color,
                animation: "playerStep 1s steps(2) infinite",
              }}
            >
              {isNear ? "▼" : "!"}
            </div>
          </div>
        );
      })}

      {/* Professor in cage marker (visual is on the bg, we add interaction zone) */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: pxX(PROFESSOR.x) - box.h * 0.04,
          top: pxY(PROFESSOR.y) - box.h * 0.04,
          width: box.h * 0.08,
          height: box.h * 0.08,
          borderRadius: "50%",
          border: "2px dashed hsl(45 100% 65% / 0.7)",
          animation: "lavaPulse 2.5s ease-in-out infinite",
          zIndex: 10,
        }}
      />
      <div
        className="absolute font-pixel text-[7px] sm:text-[9px] pointer-events-none"
        style={{
          left: pxX(PROFESSOR.x),
          top: pxY(PROFESSOR.y) - box.h * 0.07,
          transform: "translateX(-50%)",
          color: "hsl(45 100% 70%)",
          textShadow: "1px 1px 0 #000, 0 0 6px hsl(var(--lava-glow))",
          background: "hsl(220 60% 4% / 0.7)",
          padding: "2px 4px",
          border: "1px solid hsl(var(--lava-3))",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        PROF. JOSE VITOR
      </div>

      {/* Player */}
      <div
        className="absolute"
        style={{
          left: pxX(pos.x) - playerW / 2,
          top: pxY(pos.y) - playerH * 0.92,
          width: playerW,
          height: playerH,
          zIndex: 20,
          transform: facing === "left" ? "scaleX(-1)" : undefined,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -playerH * 0.04,
            width: playerW * 0.7,
            height: playerH * 0.12,
            background:
              "radial-gradient(ellipse at center, hsl(220 50% 3% / 0.6), transparent 70%)",
          }}
        />
        <img
          src={playerImg}
          alt="Personagem"
          className={walking ? "animate-step" : ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            filter: `${playerFilter ?? ""} drop-shadow(2px 4px 0 hsl(220 60% 4% / 0.65))`,
          }}
        />
      </div>

      {/* Interaction prompt */}
      {near && (
        <div
          className="absolute font-pixel text-[8px] sm:text-[10px] md:text-xs pointer-events-none"
          style={{
            left: pxX(pos.x),
            top: pxY(pos.y) - playerH - 18,
            transform: "translateX(-50%)",
            zIndex: 25,
            color: "hsl(var(--lava-3))",
            textShadow: "1px 1px 0 #000, 2px 2px 0 #000, 0 0 8px hsl(var(--lava-glow))",
            whiteSpace: "nowrap",
            background: "hsl(220 50% 4% / 0.85)",
            border: "2px solid hsl(var(--lava-3))",
            padding: "4px 8px",
          }}
        >
          [E]{" "}
          {near.kind === "computer"
            ? "RESPONDER"
            : near.kind === "npc"
            ? `FALAR COM ${(near as any).npc.name}`
            : "FALAR COM PROF. JOSE VITOR"}
        </div>
      )}

      </div>
      {/* /Camera wrapper */}

      {/* Room label */}
      {room && (
        <div
          className="absolute font-pixel text-[8px] sm:text-[10px] pointer-events-none"
          style={{
            left: "50%",
            top: 12,
            transform: "translateX(-50%)",
            color: "hsl(var(--lava-3))",
            textShadow: "1px 1px 0 #000, 0 0 8px hsl(var(--lava-glow))",
            background: "hsl(220 60% 4% / 0.85)",
            border: "2px solid hsl(var(--lava-3))",
            padding: "4px 12px",
            zIndex: 25,
            letterSpacing: "0.2em",
          }}
        >
          ► {room.name} ◄
        </div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, hsl(220 60% 3% / 0.55) 100%)",
          zIndex: 30,
        }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, hsl(0 0% 0% / 0.4) 0 1px, transparent 1px 3px)",
          zIndex: 31,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
