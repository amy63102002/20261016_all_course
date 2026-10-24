import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SKY, display, sans } from "./theme";

export const Sky: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // 雲慢慢飄，背景不要完全靜止
  const drift = interpolate(frame, [0, 600], [0, -60]);
  return (
    <AbsoluteFill style={{ background: SKY, backgroundPosition: `${drift}px 0`, fontFamily: sans, color: C.ink }}>
      {children}
    </AbsoluteFill>
  );
};

export const panel: React.CSSProperties = {
  background: C.paper,
  border: `5px solid ${C.ink}`,
  borderRadius: 40,
  boxShadow: `12px 12px 0 ${C.ink}`,
};

export const Pill: React.FC<{ bg?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ bg = "#fff", children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      border: `4px solid ${C.ink}`,
      borderRadius: 999,
      padding: "6px 24px",
      fontWeight: 700,
      fontSize: 30,
      background: bg,
      ...style,
    }}
  >
    {children}
  </span>
);

// 從 delay 開始彈進來：回傳 0→1 的進度
export const usePop = (delay: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 140 } });
};

export const PopIn: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties; from?: "up" | "left" }> = ({
  delay,
  children,
  style,
  from = "up",
}) => {
  const p = usePop(delay);
  const off = (1 - p) * 60;
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: from === "up" ? `translateY(${off}px) scale(${0.9 + p * 0.1})` : `translateX(${-off * 2}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: display, letterSpacing: "0.14em", fontSize: 30, textTransform: "uppercase" }}>{children}</div>
);

// 關鍵影格運鏡：在 frame 之間內插 scale 與焦點位置
export type Cam = { f: number; s: number; x: number; y: number };
export const camAt = (frame: number, keys: Cam[]) => {
  const fs = keys.map((k) => k.f);
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  return {
    s: interpolate(frame, fs, keys.map((k) => k.s), opt),
    x: interpolate(frame, fs, keys.map((k) => k.x), opt),
    y: interpolate(frame, fs, keys.map((k) => k.y), opt),
  };
};
