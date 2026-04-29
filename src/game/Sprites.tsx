import React from "react";

type Px = (string | 0)[];

function Sprite({
  pixels, cols, scale = 4, className = "", style,
}: {
  pixels: Px; cols: number; scale?: number; className?: string; style?: React.CSSProperties;
}) {
  const rows = pixels.length / cols;
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${scale}px)`,
        gridTemplateRows: `repeat(${rows}, ${scale}px)`,
        width: cols * scale,
        height: rows * scale,
        ...style,
      }}
    >
      {pixels.map((p, i) =>
        p === 0 ? <div key={i} /> : <div key={i} style={{ background: p as string }} />
      )}
    </div>
  );
}

/* ---------- PLAYER (top-down student) ---------- */
const SK = "hsl(28 60% 72%)";
const HR = "hsl(25 60% 22%)";
const SH = "hsl(215 65% 45%)";
const SH2 = "hsl(215 70% 32%)";
const PT = "hsl(220 30% 15%)";
const WT = "hsl(0 0% 95%)";
const BK = "hsl(220 50% 6%)";

export function PlayerSprite({ scale = 3, walking = false }: { scale?: number; walking?: boolean }) {
  const p: Px = [
    0,0,0,HR,HR,HR,HR,HR,HR,0,0,0,
    0,0,HR,HR,HR,HR,HR,HR,HR,HR,0,0,
    0,0,HR,SK,SK,SK,SK,SK,SK,HR,0,0,
    0,0,HR,SK,BK,SK,SK,BK,SK,HR,0,0,
    0,0,HR,SK,SK,SK,SK,SK,SK,HR,0,0,
    0,0,0,SK,SK,SK,SK,SK,SK,0,0,0,
    0,SH,SH,SH,WT,WT,WT,WT,SH,SH,SH,0,
    SH,SH,SH,SH,WT,SH2,SH2,WT,SH,SH,SH,SH,
    SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,
    SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,SH,
    SK,0,SH2,SH2,SH2,SH2,SH2,SH2,SH2,SH2,0,SK,
    SK,0,PT,PT,PT,PT,PT,PT,PT,PT,0,SK,
    0,0,PT,PT,PT,0,0,PT,PT,PT,0,0,
    0,0,PT,PT,PT,0,0,PT,PT,PT,0,0,
    0,0,BK,BK,0,0,0,0,BK,BK,0,0,
  ];
  return <Sprite pixels={p} cols={12} scale={scale} className={walking ? "animate-step" : ""} />;
}

/* ---------- A SINGLE CRT MONITOR (small, sits on a long desk) ---------- */
export function CRTMonitor({ scale = 2, active = false, codeColor = "green" }: { scale?: number; active?: boolean; codeColor?: "green" | "blue" | "amber" }) {
  const MON = "hsl(220 30% 14%)";
  const MON2 = "hsl(220 35% 8%)";
  const screenBg = active ? "hsl(45 80% 35%)" : "hsl(195 60% 22%)";
  const codeMap = { green: "hsl(130 90% 55%)", blue: "hsl(195 95% 65%)", amber: "hsl(45 100% 60%)" };
  const C = codeMap[codeColor];
  const p: Px = [
    // 14w x 14h
    0,MON2,MON,MON,MON,MON,MON,MON,MON,MON,MON,MON,MON2,0,
    MON2,MON,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,MON,MON2,
    MON,MON,screenBg,C,C,C,0,0,C,C,C,screenBg,MON,MON,
    MON,MON,screenBg,C,0,0,C,C,0,0,C,screenBg,MON,MON,
    MON,MON,screenBg,C,C,C,C,C,C,C,C,screenBg,MON,MON,
    MON,MON,screenBg,0,C,C,0,0,C,C,0,screenBg,MON,MON,
    MON,MON,screenBg,C,0,0,C,C,0,0,C,screenBg,MON,MON,
    MON,MON,screenBg,C,C,C,C,C,C,C,C,screenBg,MON,MON,
    MON,MON,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,screenBg,MON,MON,
    0,MON2,MON,MON,MON,MON,MON,MON,MON,MON,MON,MON,MON2,0,
    0,0,MON2,MON2,MON,MON,MON,MON,MON,MON,MON2,MON2,0,0,
    0,0,0,MON2,MON2,MON,MON,MON,MON,MON2,MON2,0,0,0,
    0,0,0,0,0,MON2,MON2,MON2,MON2,0,0,0,0,0,
    0,0,0,MON2,MON2,MON2,MON2,MON2,MON2,MON2,MON2,0,0,0,
  ];
  return <Sprite pixels={p} cols={14} scale={scale} className={active ? "animate-flicker" : ""} />;
}

/* ---------- A LONG DESK (horizontal, fits multiple monitors on top) ---------- */
export function LongDesk({ scale = 2, widthTiles = 8 }: { scale?: number; widthTiles?: number }) {
  const D = "hsl(22 45% 32%)";
  const D2 = "hsl(22 50% 22%)";
  const D3 = "hsl(22 55% 14%)";
  const HL = "hsl(22 40% 42%)";
  // build a deck of widthTiles*16 pixels wide x 18 tall
  const cols = widthTiles * 16;
  const rows = 18;
  const out: Px = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let color: string | 0 = D;
      if (r === 0) color = HL;
      else if (r === 1 || r === 2) color = D;
      else if (r >= 3 && r <= 12) color = D2;
      else if (r === 13) color = D3;
      else if (r === 14) color = D3;
      else color = 0;
      // legs
      if (r >= 14) {
        const legSpacing = cols / 4;
        const isLeg =
          (c >= 4 && c < 8) ||
          (c >= cols - 8 && c < cols - 4) ||
          (c >= legSpacing - 2 && c < legSpacing + 2) ||
          (c >= legSpacing * 3 - 2 && c < legSpacing * 3 + 2);
        color = isLeg ? D3 : 0;
      }
      // wood grain hint
      if (r === 6 && c % 24 === 12) color = D3;
      if (r === 9 && c % 32 === 8) color = D3;
      out.push(color);
    }
  }
  return <Sprite pixels={out} cols={cols} scale={scale} />;
}

/* ---------- CHAIR (office chair top-down) ---------- */
export function Chair({ scale = 2 }: { scale?: number }) {
  const C = "hsl(220 18% 22%)";
  const C2 = "hsl(220 18% 14%)";
  const M = "hsl(220 15% 35%)";
  const p: Px = [
    0,C,C,C,C,C,C,C,C,0,
    C,C,C2,C2,C2,C2,C2,C2,C,C,
    C,C2,C2,C2,C2,C2,C2,C2,C2,C,
    C,C2,C2,C2,C2,C2,C2,C2,C2,C,
    C,C,C2,C2,C2,C2,C2,C2,C,C,
    0,C,C,C,C,C,C,C,C,0,
    0,0,0,0,M,M,0,0,0,0,
    0,0,M,M,M,M,M,M,0,0,
    0,M,0,0,0,0,0,0,M,0,
    M,0,0,0,0,0,0,0,0,M,
  ];
  return <Sprite pixels={p} cols={10} scale={scale} />;
}

/* ---------- BOOKSHELF (wider, dense like in the image) ---------- */
export function Bookshelf({ scale = 2, widthTiles = 4 }: { scale?: number; widthTiles?: number }) {
  const W = "hsl(22 40% 18%)";
  const W2 = "hsl(22 45% 10%)";
  const cols = widthTiles * 16;
  const rows = 32;
  const palette = [
    "hsl(0 60% 38%)", "hsl(45 70% 45%)", "hsl(140 50% 32%)",
    "hsl(220 60% 42%)", "hsl(280 50% 42%)", "hsl(15 70% 45%)",
    "hsl(195 60% 40%)", "hsl(35 60% 35%)",
  ];
  const out: Px = [];
  for (let r = 0; r < rows; r++) {
    const isShelfBoard = r % 8 === 0 || r === rows - 1;
    for (let c = 0; c < cols; c++) {
      if (c === 0 || c === cols - 1) { out.push(W2); continue; }
      if (isShelfBoard) { out.push(W); continue; }
      // book
      const bookIdx = Math.floor((c + r * 3) / 3) % palette.length;
      const inGap = (c + r) % 7 === 0;
      out.push(inGap ? W2 : palette[bookIdx]);
    }
  }
  return <Sprite pixels={out} cols={cols} scale={scale} />;
}

/* ---------- WHITEBOARD WITH FORMULAS ---------- */
export function Whiteboard({ scale = 2, lines, widthTiles = 6 }: { scale?: number; lines: string[]; widthTiles?: number }) {
  return (
    <div
      className="relative font-pixel-body leading-tight"
      style={{
        background: "hsl(0 0% 96%)",
        border: `${scale * 2}px solid hsl(0 0% 12%)`,
        boxShadow: `inset 0 0 0 ${scale}px hsl(0 0% 75%), 0 ${scale}px 0 hsl(0 0% 0% / 0.4)`,
        padding: `${scale * 2}px ${scale * 4}px`,
        color: "hsl(220 70% 18%)",
        fontSize: scale * 5,
        width: widthTiles * 16 * scale,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "nowrap", lineHeight: 1.1 }}>{l}</div>
      ))}
    </div>
  );
}

/* ---------- PROFESSOR IN CAGE ---------- */
const CG = "hsl(30 8% 32%)";
const CG2 = "hsl(30 8% 18%)";
const CG3 = "hsl(30 8% 45%)";
const CHN = "hsl(30 5% 55%)";
const CHN2 = "hsl(30 5% 38%)";
const PWT = "hsl(0 0% 96%)";
const PWT2 = "hsl(0 0% 78%)";
const PSK = "hsl(28 55% 72%)";
const PHR = "hsl(25 55% 26%)";
const GLS = "hsl(0 0% 100%)";
const TIE = "hsl(0 70% 38%)";
const BDG = "hsl(48 95% 55%)";
const PBK = "hsl(220 50% 6%)";

export function ProfessorCage({ scale = 3, dropping = false }: { scale?: number; dropping?: boolean }) {
  // Long chain hanging from the top
  const chain: Px = [];
  const chainCols = 6;
  const chainRows = 10;
  for (let r = 0; r < chainRows; r++) {
    for (let c = 0; c < chainCols; c++) {
      let color: string | 0 = 0;
      // alternating chain link pattern
      const linkPhase = r % 2;
      if (linkPhase === 0) {
        if (c === 1 || c === 4) color = CHN;
        if (c === 2 || c === 3) color = CHN;
      } else {
        if (c === 2) color = CHN;
        if (c === 3) color = CHN;
      }
      if (color === CHN && (r + c) % 3 === 0) color = CHN2;
      chain.push(color);
    }
  }
  // Hook at bottom of chain
  const hook: Px = [
    0,0,CHN2,CHN,CHN,CHN2,0,0,
    0,CHN,CHN,0,0,CHN,CHN,0,
    CHN,CHN,0,0,0,0,CHN,CHN,
    CHN,CHN2,0,0,0,0,CHN2,CHN,
    CHN,0,0,0,0,0,0,CHN,
    0,CHN,0,0,0,0,CHN,0,
    0,CHN,CHN,CHN,CHN,CHN,CHN,0,
  ];

  // Cage: 22 wide x 22 tall
  const W = 22;
  const cage: Px = [
    // top bar / hook attachment
    CG2,CG,CG,CG,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG3,CG,CG,CG,CG,CG2,
    CG2,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG2,
    CG,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,CG,
    // hair top
    CG,0,0,0,0,0,0,PHR,PHR,PHR,PHR,PHR,PHR,PHR,PHR,0,0,0,0,0,0,CG,
    CG,0,0,0,0,0,PHR,PHR,PHR,PHR,PHR,PHR,PHR,PHR,PHR,PHR,0,0,0,0,0,CG,
    CG,0,0,0,0,0,PHR,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PHR,0,0,0,0,0,CG,
    // glasses row
    CG,0,0,0,0,0,PSK,GLS,GLS,PSK,PSK,PSK,GLS,GLS,PSK,PSK,0,0,0,0,0,CG,
    CG,0,0,0,0,0,PSK,GLS,PBK,GLS,PSK,GLS,PBK,GLS,PSK,PSK,0,0,0,0,0,CG,
    CG,0,0,0,0,0,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,0,0,0,0,0,CG,
    // mouth
    CG,0,0,0,0,0,PSK,PSK,PBK,PBK,PBK,PBK,PBK,PSK,PSK,PSK,0,0,0,0,0,CG,
    CG,0,0,0,0,0,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,PSK,0,0,0,0,0,CG,
    // shirt + tie + badge + raised arms
    CG,0,0,0,PSK,PSK,PWT,PWT,PWT,TIE,TIE,TIE,PWT,PWT,PWT,PWT,PSK,PSK,0,0,0,CG,
    CG,0,0,PSK,PSK,PSK,PWT,BDG,PWT,TIE,TIE,TIE,PWT,PWT,PWT,PWT,PSK,PSK,PSK,0,0,CG,
    CG,0,0,PSK,PSK,PWT,PWT,BDG,PWT,TIE,TIE,TIE,PWT,PWT,PWT,PWT,PWT,PSK,PSK,0,0,CG,
    CG,0,0,0,0,PWT,PWT,PWT,PWT,PWT,TIE,PWT,PWT,PWT,PWT,PWT,PWT,0,0,0,0,CG,
    CG,0,0,0,0,PWT,PWT,PWT,PWT,PWT,PWT,PWT,PWT,PWT,PWT,PWT,PWT,0,0,0,0,CG,
    CG,0,0,0,0,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,PWT2,0,0,0,0,CG,
    CG,0,0,0,0,PT,PT,PT,PT,PT,PT,PT,PT,PT,PT,PT,PT,0,0,0,0,CG,
    // bars
    CG,CG2,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,CG2,CG,
    CG,CG2,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,CG2,CG,
    CG,CG2,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,0,CG,0,CG2,CG,
    CG2,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG,CG2,
  ];

  return (
    <div className="flex flex-col items-center" style={{ filter: "drop-shadow(0 4px 0 hsl(220 50% 4% / 0.5))" }}>
      <div className="animate-chain">
        <Sprite pixels={chain} cols={chainCols} scale={scale} />
        <Sprite pixels={hook} cols={8} scale={scale} style={{ marginLeft: -((8 - chainCols) / 2) * scale }} />
      </div>
      <div className={dropping ? "animate-cage-drop" : "animate-cage-sway"} style={{ marginTop: -scale }}>
        <Sprite pixels={cage} cols={W} scale={scale} />
      </div>
    </div>
  );
}

