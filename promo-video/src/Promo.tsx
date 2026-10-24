import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import narration from "../capture/narration.json";
import durations from "../public/vo/durations.json";
import { C, FPS } from "./theme";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Clip, PageScene, sceneFrames } from "./PageScene";
import { Cta, Doors, Hook, Plans } from "./Scenes";

// 錄影切點（秒）：見 capture/record.mjs 的操作順序
const INDEX: Clip[] = [{ from: 0.8, to: 24.5, rate: 1.5 }];
const ISLAND: Clip[] = [{ from: 2.5, to: 24, rate: 1.4 }];
const GAME: Clip[] = [
  { from: 3, to: 10.5, rate: 1.3 }, // 抽牌、重抽
  { from: 10.5, to: 50.5, rate: 5 }, // 12 週快轉
  { from: 50.5, to: 58.5, rate: 1.3 }, // 結局
];

const T = 15;
const HOOK = 150;
const DOORS = 135;
const PLANS = 330;
const CTA = 270;

export const SCENES = [HOOK, DOORS, sceneFrames(INDEX), sceneFrames(ISLAND), sceneFrames(GAME), PLANS, CTA];
export const PROMO_FRAMES = SCENES.reduce((a, b) => a + b, 0) - T * (SCENES.length - 1);

const tr = (dir: "from-right" | "from-bottom" | null) => (
  <TransitionSeries.Transition
    presentation={dir ? slide({ direction: dir }) : fade()}
    timing={linearTiming({ durationInFrames: T })}
  />
);

// 女聲旁白（capture/tts.mjs 產生），at 是全片秒數
const Narration: React.FC = () => (
  <>
    {narration.map((n) => (
      <Sequence key={n.id} from={Math.round(n.at * FPS)} layout="none">
        <Audio src={staticFile(`vo/${n.id}.wav`)} />
      </Sequence>
    ))}
  </>
);

// 配樂：把 Suno 匯出的檔案放進 public/，再把檔名填在這裡；null = 不放配樂
const BGM_FILE: string | null = null;
const BGM_LOUD = 0.32; // 沒有旁白時
const BGM_DUCK = 0.1; // 旁白說話時壓低

// 旁白期間（含前後 0.3 秒緩衝）壓低配樂，頭尾淡入淡出
const bgmVolume = (f: number) => {
  const t = f / FPS;
  const talking = narration.some((n) => t > n.at - 0.3 && t < n.at + (durations as Record<string, number>)[n.id] + 0.3);
  const fadeIn = Math.min(1, t / 1.5);
  const fadeOut = Math.min(1, (PROMO_FRAMES / FPS - t) / 2.5);
  return (talking ? BGM_DUCK : BGM_LOUD) * Math.max(0, Math.min(fadeIn, fadeOut));
};

export const Promo: React.FC = () => (
  <AbsoluteFill>
    {BGM_FILE && <Audio src={staticFile(BGM_FILE)} volume={bgmVolume} loop />}
    <Narration />
    <Scenes />
  </AbsoluteFill>
);

const Scenes: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={HOOK}>
      <Hook />
    </TransitionSeries.Sequence>
    {tr(null)}
    <TransitionSeries.Sequence durationInFrames={DOORS}>
      <Doors />
    </TransitionSeries.Sequence>
    {tr("from-right")}
    <TransitionSeries.Sequence durationInFrames={sceneFrames(INDEX)}>
      <PageScene
        num="01"
        title="課程首頁"
        path="index.html"
        color={C.pink}
        video="rec/index.webm"
        clips={INDEX}
        cam={[
          { f: 0, s: 1, x: 50, y: 30 },
          { f: 60, s: 1.04, x: 50, y: 40 },
          { f: 95, s: 1.3, x: 33, y: 50 },
          { f: 215, s: 1.3, x: 33, y: 58 },
          { f: 245, s: 1.02, x: 50, y: 50 },
          { f: 330, s: 1.05, x: 50, y: 40 },
          { f: 380, s: 1.22, x: 50, y: 45 },
          { f: 474, s: 1.25, x: 50, y: 50 },
        ]}
        captions={[
          { f: 8, text: "先看學完能帶走什麼", sub: "四類作品、交得出去的工作、網頁工具、LINE 接單", bg: C.yellow },
          { f: 90, text: "① 點一個最像你的狀況", sub: "11 種常見卡關，例如「完全沒碰過 AI」", bg: C.pink },
          { f: 175, text: "② 線會連到你該先上的那一門", sub: "附上今天就能做的一件小事", bg: C.blue },
          { f: 250, text: "③ 五個方案，帶走什麼一目了然", bg: C.mint },
          { f: 360, text: "④ 每門課都有完整時程", sub: "一小時一小時寫清楚", bg: C.peach },
        ]}
      />
    </TransitionSeries.Sequence>
    {tr("from-right")}
    <TransitionSeries.Sequence durationInFrames={sceneFrames(ISLAND)}>
      <PageScene
        num="02"
        title="AI 職涯島"
        path="island.html"
        color={C.blue}
        video="rec/island.webm"
        clips={ISLAND}
        cam={[
          { f: 0, s: 1.15, x: 50, y: 50 },
          { f: 50, s: 1, x: 50, y: 50 },
          { f: 130, s: 1.12, x: 45, y: 50 },
          { f: 185, s: 1, x: 50, y: 50 },
          { f: 260, s: 1.25, x: 25, y: 35 },
          { f: 340, s: 1.05, x: 40, y: 45 },
          { f: 461, s: 1.12, x: 45, y: 40 },
        ]}
        captions={[
          { f: 10, text: "3D 職涯島", sub: "島中央是阿茲的工作室，四周是 A–E 五個課程區", bg: C.blue },
          { f: 120, text: "拖一下，整座島跟著轉", sub: "清晨、白天、黃昏、夜晚，島上的人都在忙", bg: C.yellow },
          { f: 195, text: "11 個常見狀況", sub: "小人把它們搬到能解決的課程區", bg: C.mint },
          { f: 265, text: "點一個狀況就知道", sub: "先上哪門課，加上今天就能做的一件小事", bg: C.pink },
        ]}
      />
    </TransitionSeries.Sequence>
    {tr("from-right")}
    <TransitionSeries.Sequence durationInFrames={sceneFrames(GAME)}>
      <PageScene
        num="03"
        title="90 天小遊戲"
        path="game.html"
        color={C.yellow}
        video="rec/game.webm"
        clips={GAME}
        fast={{ from: 173, to: 413, label: "×5 快轉 12 週" }}
        cam={[
          { f: 0, s: 1.05, x: 50, y: 40 },
          { f: 40, s: 1, x: 50, y: 40 },
          { f: 80, s: 1.18, x: 50, y: 35 },
          { f: 165, s: 1.12, x: 50, y: 45 },
          { f: 185, s: 1.18, x: 40, y: 30 },
          { f: 400, s: 1.18, x: 40, y: 30 },
          { f: 440, s: 1.05, x: 50, y: 40 },
          { f: 598, s: 1.2, x: 50, y: 45 },
        ]}
        captions={[
          { f: 8, text: "重新上場的 90 天", sub: "12 種起點・54 個事件・14 種結局", bg: C.yellow },
          { f: 70, text: "抽三張起點牌", sub: "你的狀況、想去的方向、AI 程度，每張能重抽一次", bg: C.pink },
          { f: 180, text: "每三週選節奏，每週遇到一件事", sub: "已讀不回、家人一句話、程式跑不動", bg: C.blue },
          { f: 300, text: "精力或家人見底", sub: "分數再高也不算贏", bg: C.peach },
          { f: 425, text: "結局會告訴你", sub: "如果是真的，先從哪一門開始", bg: C.mint },
        ]}
      />
    </TransitionSeries.Sequence>
    {tr("from-bottom")}
    <TransitionSeries.Sequence durationInFrames={PLANS}>
      <Plans />
    </TransitionSeries.Sequence>
    {tr(null)}
    <TransitionSeries.Sequence durationInFrames={CTA}>
      <Cta />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
