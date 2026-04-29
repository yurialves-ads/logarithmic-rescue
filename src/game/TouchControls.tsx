import { useEffect, useRef, useState } from "react";

function getCtl() {
  return (window as any).__labControls as
    | { setDir: (dx: number, dy: number) => void; interact: () => void }
    | undefined;
}

export function TouchControls({ forceShow = false }: { forceShow?: boolean }) {
  const [show, setShow] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const [stick, setStick] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const isTouch =
      matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    setShow(isTouch || forceShow);
  }, [forceShow]);

  useEffect(() => {
    return () => getCtl()?.setDir(0, 0);
  }, []);

  function handleStart(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    const rect = padRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    updateFrom(point.clientX, point.clientY, cx, cy, rect.width / 2);
  }
  function handleMove(e: TouchEvent | MouseEvent) {
    if (!stick.active && !padRef.current) return;
    const rect = padRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const cx_ = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const cy_ = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    updateFrom(cx_, cy_, cx, cy, rect.width / 2);
  }
  function updateFrom(px: number, py: number, cx: number, cy: number, r: number) {
    let dx = (px - cx) / r;
    let dy = (py - cy) / r;
    const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    const dead = 0.18;
    if (Math.abs(dx) < dead) dx = 0;
    if (Math.abs(dy) < dead) dy = 0;
    setStick({ x: dx, y: dy, active: true });
    getCtl()?.setDir(dx, dy);
  }
  function handleEnd() {
    setStick({ x: 0, y: 0, active: false });
    getCtl()?.setDir(0, 0);
  }

  useEffect(() => {
    if (!stick.active) return;
    window.addEventListener("touchmove", handleMove as any, { passive: false });
    window.addEventListener("mousemove", handleMove as any);
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);
    window.addEventListener("mouseup", handleEnd);
    return () => {
      window.removeEventListener("touchmove", handleMove as any);
      window.removeEventListener("mousemove", handleMove as any);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
      window.removeEventListener("mouseup", handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stick.active]);

  if (!show) return null;

  return (
    <div className="absolute bottom-4 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-end justify-between px-4 sm:px-8">
        {/* Analog joystick */}
        <div className="pointer-events-auto">
          <div
            ref={padRef}
            onTouchStart={handleStart}
            onMouseDown={handleStart}
            className="relative select-none touch-none"
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsl(220 40% 14%), hsl(220 60% 5%))",
              border: "4px solid hsl(var(--lava-glow) / 0.7)",
              boxShadow:
                "inset 0 0 16px hsl(0 0% 0% / 0.5), 0 0 16px hsl(var(--lava-glow) / 0.3)",
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
                border: "3px solid hsl(45 100% 70%)",
                boxShadow:
                  "inset 0 0 0 1px hsl(45 100% 65%), 0 0 16px hsl(var(--lava-glow) / 0.7)",
                transform: `translate(calc(-50% + ${stick.x * 32}px), calc(-50% + ${stick.y * 32}px))`,
                transition: stick.active ? "none" : "transform 120ms ease-out",
              }}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pointer-events-auto">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              getCtl()?.interact();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              getCtl()?.interact();
            }}
            className="font-pixel text-2xl flex items-center justify-center select-none active:translate-y-[2px] active:brightness-125"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background:
                "linear-gradient(180deg, hsl(var(--lava-2)), hsl(var(--lava-1)))",
              color: "white",
              border: "4px solid hsl(45 100% 70%)",
              boxShadow:
                "inset 0 0 0 2px hsl(45 100% 65%), 0 5px 0 hsl(0 70% 20%), 0 0 28px hsl(var(--lava-glow) / 0.7)",
              textShadow: "1px 2px 0 hsl(0 80% 20%)",
            }}
          >
            A
          </button>
        </div>
      </div>
    </div>
  );
}
