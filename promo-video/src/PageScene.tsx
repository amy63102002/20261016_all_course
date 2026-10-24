import React from "react";
import { Video } from "@remotion/media";
import { Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, SITE, display } from "./theme";
import { Cam, Pill, PopIn, Sky, camAt, panel } from "./ui";

// 一段錄影：src 秒數 from→to，以 rate 倍速播放
export type Clip = { from: number; to: number; rate: number };
export type Caption = { f: number; text: string; sub?: string; bg: string };

export const clipFrames = (c: Clip) => Math.round(((c.to - c.from) * FPS) / c.rate);
export const sceneFrames = (clips: Clip[]) => clips.reduce((a, c) => a + clipFrames(c), 0);

const FRAME_W = 1400;
const FRAME_H = (FRAME_W * 1080) / 1920;
const BAR = 54;

export const PageScene: React.FC<{
  num: string;
  title: string;
  path: string;
  color: string;
  video: string;
  clips: Clip[];
  cam: Cam[];
  captions: Caption[];
  fast?: { from: number; to: number; label: string };
}> = ({ num, title, path, color, video, clips, cam, captions, fast }) => {
  const frame = useCurrentFrame();
  const { s, x, y } = camAt(frame, cam);
  // 外框本身也輕輕浮動，增加景深
  const float = Math.sin(frame / 40) * 4;

  const current = [...captions].reverse().find((c) => frame >= c.f);
  const showFast = fast && frame >= fast.from && frame < fast.to;

  return (
    <Sky>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 18 }}>
        <PopIn delay={0} from="left">
          <Pill bg={color} style={{ fontSize: 34, padding: "8px 28px" }}>
            <b style={{ fontFamily: display, fontWeight: 400 }}>{num}</b>
            <b style={{ fontWeight: 900 }}>{title}</b>
          </Pill>
        </PopIn>
      </div>

      {/* 瀏覽器外框 */}
      <div
        style={{
          ...panel,
          position: "absolute",
          right: 70,
          top: 120 + float,
          width: FRAME_W,
          height: FRAME_H + BAR,
          overflow: "hidden",
          borderRadius: 28,
        }}
      >
        <div style={{ height: BAR, borderBottom: `5px solid ${C.ink}`, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: C.cream }}>
          {[C.orange, C.yellow, C.green].map((c) => (
            <i key={c} style={{ width: 18, height: 18, borderRadius: 9, border: `3px solid ${C.ink}`, background: c }} />
          ))}
          <div style={{ marginLeft: 16, flex: 1, background: "#fff", border: `3px solid ${C.ink}`, borderRadius: 999, padding: "2px 18px", fontSize: 22, fontWeight: 700 }}>
            {SITE}/{path}
          </div>
        </div>
        <div style={{ width: FRAME_W, height: FRAME_H, overflow: "hidden", position: "relative" }}>
          <div style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${s})`, transformOrigin: `${x}% ${y}%` }}>
            <Series>
              {clips.map((c, i) => (
                <Series.Sequence key={i} durationInFrames={clipFrames(c)}>
                  <Video
                    src={staticFile(video)}
                    trimBefore={Math.round(c.from * FPS)}
                    trimAfter={Math.round(c.to * FPS)}
                    playbackRate={c.rate}
                    muted
                    style={{ width: FRAME_W, height: FRAME_H }}
                  />
                </Series.Sequence>
              ))}
            </Series>
          </div>
          {showFast && (
            <div style={{ position: "absolute", right: 24, top: 20 }}>
              <Pill bg={C.orange} style={{ color: "#fff", fontFamily: display, fontWeight: 400, fontSize: 36 }}>
                ▶▶ {fast.label}
              </Pill>
            </div>
          )}
        </div>
      </div>

      {/* 字卡：同時只放一張，換的時候重新彈出 */}
      {current && (
        <div style={{ position: "absolute", left: 50, bottom: 70, width: 600 }} key={current.f}>
          <CaptionCard c={current} start={current.f} />
        </div>
      )}
    </Sky>
  );
};

const CaptionCard: React.FC<{ c: Caption; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tilt = interpolate(p, [0, 1], [-6, -1.5]);
  return (
    <div
      style={{
        ...panel,
        background: c.bg,
        padding: "26px 32px",
        transform: `translateY(${(1 - p) * 50}px) rotate(${tilt}deg)`,
        opacity: p,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.35 }}>{c.text}</div>
      {c.sub && <div style={{ fontSize: 28, fontWeight: 700, marginTop: 10, lineHeight: 1.5 }}>{c.sub}</div>}
    </div>
  );
};
