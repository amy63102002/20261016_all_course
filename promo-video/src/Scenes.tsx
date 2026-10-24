import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, LINE_URL, SITE, display } from "./theme";
import { Kicker, Pill, PopIn, Sky, panel, usePop } from "./ui";

/* S1 開場 */
const FLOATING = [
  { t: "完全沒碰過 AI", x: 120, y: 170, bg: C.pink },
  { t: "通知簡報都從零做", x: 1380, y: 150, bg: C.blue },
  { t: "訂單散在聊天紀錄", x: 90, y: 830, bg: C.yellow },
  { t: "轉職需要作品", x: 1450, y: 860, bg: C.mint },
  { t: "想把工作做成工具", x: 1570, y: 520, bg: C.peach },
  { t: "空窗期好長", x: 160, y: 500, bg: "#fff" },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Sky>
      {FLOATING.map((f, i) => (
        <PopIn key={f.t} delay={30 + i * 6} style={{ position: "absolute", left: f.x, top: f.y + Math.sin((frame + i * 20) / 25) * 10 }}>
          <Pill bg={f.bg} style={{ boxShadow: `5px 5px 0 ${C.ink}` }}>{f.t}</Pill>
        </PopIn>
      ))}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <PopIn delay={4}>
          <div style={{ ...panel, padding: "70px 100px", textAlign: "center" }}>
            <Pill bg={C.yellow}>AI 數位職涯培育 × 阿茲</Pill>
            <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.3, marginTop: 30 }}>
              <PopIn delay={14}>想重新開始，</PopIn>
              <PopIn delay={26}>
                卻不知道<span style={{ background: `linear-gradient(transparent 58%, ${C.yellow} 58%)` }}>第一步</span>在哪？
              </PopIn>
            </div>
          </div>
        </PopIn>
      </AbsoluteFill>
    </Sky>
  );
};

/* S2 三個入口 */
const DOORS = [
  { n: "01", t: "課程首頁", s: "點你的狀況，告訴你從哪門開始", bg: C.pink, icon: "🗺️" },
  { n: "02", t: "AI 職涯島", s: "3D 逛一圈，看狀況被搬到哪一區", bg: C.blue, icon: "🏝️" },
  { n: "03", t: "90 天小遊戲", s: "抽三張牌，玩一輪看你的結局", bg: C.yellow, icon: "🎲" },
];

export const Doors: React.FC = () => (
  <Sky>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
      <PopIn delay={0}>
        <div style={{ textAlign: "center" }}>
          <Kicker>Three ways in</Kicker>
          <div style={{ fontSize: 84, fontWeight: 900 }}>三個入口，幫你找到起點</div>
        </div>
      </PopIn>
      <div style={{ display: "flex", gap: 44 }}>
        {DOORS.map((d, i) => (
          <Door key={d.n} d={d} delay={14 + i * 10} />
        ))}
      </div>
    </AbsoluteFill>
  </Sky>
);

const Door: React.FC<{ d: (typeof DOORS)[number]; delay: number }> = ({ d, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ transform: `perspective(1200px) rotateY(${(1 - p) * 80}deg)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ ...panel, width: 500, overflow: "hidden", borderRadius: 32 }}>
        <div style={{ background: d.bg, borderBottom: `5px solid ${C.ink}`, padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: display, fontSize: 48 }}>{d.n}</span>
          <span style={{ fontSize: 56 }}>{d.icon}</span>
        </div>
        <div style={{ padding: "26px 28px 30px" }}>
          <div style={{ fontSize: 52, fontWeight: 900 }}>{d.t}</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1.5 }}>{d.s}</div>
        </div>
      </div>
    </div>
  );
};

/* S6 五個方案 */
const PLANS = [
  { code: "A", name: "AI 工具一日班", price: "8,800", take: "文案、圖片、簡報、短影音四類作品", bg: C.pink },
  { code: "B", name: "工作任務實作班", price: "14,800", take: "一份從接任務到查核交付的成果包", bg: C.blue },
  { code: "C", name: "網頁工具實作班", price: "20,000", take: "能操作的網頁工具＋展示網址", bg: C.yellow },
  { code: "D", name: "LINE 接單進階班", price: "20,000", take: "LINE 接單入口＋商品與訂單後台", bg: C.mint },
  { code: "E", name: "轉職作品強化方案", price: "29,800", take: "C 或 D 擇一＋四週個人專題輔導", bg: C.peach },
];

export const Plans: React.FC = () => {
  const frame = useCurrentFrame();
  const path = interpolate(frame, [150, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sky>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <PopIn delay={0}>
          <div style={{ textAlign: "center" }}>
            <Kicker>5 Plans</Kicker>
            <div style={{ fontSize: 76, fontWeight: 900 }}>五個方案，學完各自帶走什麼</div>
          </div>
        </PopIn>
        <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
          {PLANS.map((p, i) => (
            <PopIn key={p.code} delay={16 + i * 9}>
              <div style={{ ...panel, width: 330, height: 520, overflow: "hidden", borderRadius: 30, display: "flex", flexDirection: "column" }}>
                <div style={{ background: p.bg, borderBottom: `5px solid ${C.ink}`, padding: "20px 24px" }}>
                  <div style={{ fontFamily: display, fontSize: 100, lineHeight: 1 }}>{p.code}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, lineHeight: 1.3, whiteSpace: "nowrap" }}>{p.name}</div>
                </div>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <div style={{ fontFamily: display, fontSize: 52 }}>
                    <span style={{ fontSize: 28 }}>NT$</span>
                    {p.price}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#555" }}>學完帶走</div>
                  <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.45 }}>{p.take}</div>
                </div>
              </div>
            </PopIn>
          ))}
        </div>
        <div style={{ marginTop: 44, opacity: path, transform: `translateY(${(1 - path) * 30}px)` }}>
          <Pill bg={C.ink} style={{ color: "#fff", fontSize: 36, padding: "12px 34px" }}>
            AI 新手從 A 開始 → 再依目標走 B、C 或 D → 要轉職作品選 E
          </Pill>
        </div>
        <div style={{ position: "absolute", bottom: 34, fontSize: 24, fontWeight: 700, opacity: path }}>
          學費不含 AI 工具訂閱費；課程以做出作品為目標，不保證就業或收入。時數與場次以開課前公告為準。
        </div>
      </AbsoluteFill>
    </Sky>
  );
};

/* S7 行動呼籲 */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.max(0, Math.sin((frame - 60) / 8)) * 0.04 * (frame > 60 ? 1 : 0);
  return (
    <Sky>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <PopIn delay={0}>
          <div style={{ ...panel, padding: "60px 90px", display: "flex", gap: 70, alignItems: "center" }}>
            <PopIn delay={8}>
              <div style={{ width: 340, height: 340, borderRadius: "50%", border: `6px solid ${C.ink}`, overflow: "hidden", boxShadow: `10px 10px 0 ${C.ink}`, background: C.yellow }}>
                <Img src={staticFile("arz.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ textAlign: "center", marginTop: 22, fontSize: 34, fontWeight: 900 }}>
                講師 阿茲 <span style={{ fontFamily: display, fontWeight: 400 }}>ARZ</span>
              </div>
              <div style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}>AI 自動化工程師・20 年工程經驗</div>
            </PopIn>
            <div style={{ maxWidth: 900 }}>
              <PopIn delay={16}>
                <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.3 }}>不確定選哪一門？</div>
              </PopIn>
              <PopIn delay={26}>
                <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.55, marginTop: 14 }}>
                  先加 LINE，用文字說說你的狀況，
                  <br />
                  幫你判斷從哪一門開始。
                </div>
              </PopIn>
              <PopIn delay={40}>
                <div
                  style={{
                    marginTop: 36,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 20,
                    background: C.line,
                    color: "#fff",
                    border: `5px solid ${C.ink}`,
                    borderRadius: 999,
                    padding: "18px 44px",
                    fontSize: 48,
                    fontWeight: 900,
                    boxShadow: `8px 8px 0 ${C.ink}`,
                    transform: `scale(${pulse})`,
                  }}
                >
                  加 LINE 文字諮詢 →
                </div>
                <div style={{ marginTop: 26, fontSize: 36, fontWeight: 900 }}>
                  <span style={{ fontFamily: display, fontWeight: 400 }}>{LINE_URL}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 26, fontWeight: 700 }}>網站：{SITE}</div>
              </PopIn>
            </div>
          </div>
        </PopIn>
      </AbsoluteFill>
    </Sky>
  );
};
