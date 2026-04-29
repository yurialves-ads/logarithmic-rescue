// Tiny WebAudio chiptune helpers - no assets required.
let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function blip(freq: number, duration = 0.12, type: OscillatorType = "square", vol = 0.08) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(vol, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  select: () => blip(660, 0.06, "square", 0.05),
  correct: () => {
    blip(660, 0.1, "square");
    setTimeout(() => blip(880, 0.1, "square"), 90);
    setTimeout(() => blip(1320, 0.18, "square"), 180);
  },
  wrong: () => {
    blip(220, 0.18, "sawtooth", 0.1);
    setTimeout(() => blip(140, 0.28, "sawtooth", 0.1), 160);
  },
  step: () => blip(180, 0.03, "square", 0.03),
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => blip(f, 0.18, "square", 0.08), i * 130)
    );
  },
  lose: () => {
    [400, 320, 240, 160, 100].forEach((f, i) =>
      setTimeout(() => blip(f, 0.22, "sawtooth", 0.09), i * 140)
    );
  },
};
