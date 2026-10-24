// 照 SCRIPT.md 的 S3–S5 實際操作三個頁面並錄影，輸出到 public/rec/*.webm
// 用法：先在 repo 根目錄起本機伺服器（BASE），再 node capture/record.mjs [index|island|game]
import { chromium } from "playwright";
import { mkdirSync, renameSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:8799";
// 職涯島重製中時，可以指向另一個資料夾的伺服器錄製最新版
const ISLAND_BASE = process.env.ISLAND_BASE || BASE;
const OUT = path.resolve("public/rec");
const SIZE = { width: 1920, height: 1080 };
mkdirSync(OUT, { recursive: true });

// 錄影看不到滑鼠，自己畫一個游標和點擊漣漪
const CURSOR = `
  addEventListener("DOMContentLoaded", () => {
    // 頁面本身的 scroll-behavior: smooth 會跟逐格捲動打架
    document.documentElement.style.scrollBehavior = "auto";
    const c = document.createElement("div");
    c.style.cssText = "position:fixed;left:0;top:0;width:34px;height:34px;margin:-6px 0 0 -6px;z-index:2147483647;pointer-events:none;transition:transform .08s";
    c.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#141414" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.appendChild(c);
    addEventListener("mousemove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
    addEventListener("mousedown", (e) => {
      c.style.transform = "scale(.85)";
      const r = document.createElement("div");
      r.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;border:4px solid #FF6B3D;border-radius:50%;width:16px;height:16px;left:" + (e.clientX - 8) + "px;top:" + (e.clientY - 8) + "px;transition:all .55s ease-out;opacity:1";
      document.body.appendChild(r);
      requestAnimationFrame(() => { r.style.width = r.style.height = "70px"; r.style.left = e.clientX - 35 + "px"; r.style.top = e.clientY - 35 + "px"; r.style.opacity = "0"; });
      setTimeout(() => r.remove(), 700);
    }, true);
    addEventListener("mouseup", () => { c.style.transform = ""; }, true);
  });
  try { sessionStorage.setItem("popupShown", "2"); } catch (e) {}
`;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function smoothScrollTo(page, target, ms = 1600) {
  await page.evaluate(([target, ms]) => new Promise((done) => {
    const y0 = scrollY;
    const y1 = typeof target === "number" ? target : document.querySelector(target).getBoundingClientRect().top + scrollY - 90;
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    (function step(now) {
      const t = Math.min(1, (now - t0) / ms);
      scrollTo(0, y0 + (y1 - y0) * ease(t));
      t < 1 ? requestAnimationFrame(step) : done();
    })(t0);
  }), [target, ms]);
}

// 游標用多步移動，看起來像人在移動滑鼠
let mouse = { x: 960, y: 540 };
async function moveTo(page, x, y, steps = 28) {
  await page.mouse.move(x, y, { steps });
  mouse = { x, y };
}
async function clickEl(page, locator, pause = 350) {
  await locator.scrollIntoViewIfNeeded();
  const b = await locator.boundingBox();
  await moveTo(page, b.x + b.width / 2, b.y + b.height / 2);
  await wait(pause);
  await page.mouse.down(); await wait(90); await page.mouse.up();
}

const SHOTS = {
  async index(page) {
    await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });
    await moveTo(page, 1300, 700, 1);
    await wait(1800);
    await moveTo(page, 960, 520);
    await smoothScrollTo(page, "#diagnose", 1800);
    await wait(700);
    await clickEl(page, page.locator("#chips .chip").first());
    await wait(2600);
    await clickEl(page, page.locator("#chips .chip").nth(7));
    await wait(2400);
    await smoothScrollTo(page, "#takeaway", 1800);
    await wait(1800);
    await smoothScrollTo(page, "#cards", 1500);
    await clickEl(page, page.locator(".ptab").nth(3));
    await wait(2400);
  },

  // 職涯島重製版：選課小測驗、15 個狀況、Q&A 告示牌、案例展
  async island(page) {
    await page.goto(ISLAND_BASE + "/island.html", { waitUntil: "networkidle" });
    await moveTo(page, 960, 700, 1);
    await page.waitForFunction(() => !document.getElementById("start").disabled, null, { timeout: 30000 });
    await wait(900);
    await clickEl(page, page.locator("#start"));
    await wait(2000);
    // 拖曳鏡頭繞島半圈，帶到案例展小島
    await moveTo(page, 700, 560);
    await page.mouse.down();
    await page.mouse.move(1350, 520, { steps: 90 });
    await page.mouse.up();
    await wait(1400);
    // 3 題選課小測驗：已經會用 AI → 想用 LINE 接單 → 要個人作品
    await clickEl(page, page.locator("#quiz-open"));
    await wait(1300);
    for (const pick of [1, 3, 0]) {
      const opts = page.locator("#detail .opt");
      if (!(await opts.count())) break;
      await clickEl(page, opts.nth(Math.min(pick, (await opts.count()) - 1)), 300);
      await wait(1300);
    }
    await wait(2200);
    await clickEl(page, page.locator("#t-home"));
    await wait(2200);
    await clickEl(page, page.locator(".tag.sym:not(.extra)").nth(2));
    await wait(2800);
    await clickEl(page, page.locator(".tag.extra").first());
    await wait(2800);
  },

  async game(page) {
    await page.goto(BASE + "/game.html", { waitUntil: "networkidle" });
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await moveTo(page, 1200, 760, 1);
    await wait(1600);
    await clickEl(page, page.locator(".hero [data-go='setup']"));
    await wait(1800);
    await clickEl(page, page.locator("[data-redraw='dir']"));
    await wait(1500);
    await clickEl(page, page.locator("#start-run"));
    await wait(1000);
    // 照「顧作品也顧家」的路線選，避免太早燒完；每一步停一下讓字卡讀得到
    // 依序找第一個符合的選項；廣告片不要示範掏錢上當
    const prefer = ["專心做作品", "邊學邊顧家", "找人一起讀", "帶著作品", "反問", "邊做邊說明", "把錯誤訊息", "好好聊", "先問清楚", "接，用 AI", "整理成一頁", "先把個資遮掉", "問對方", "問有沒有退費", "滑過去", "回家想三天", "照實說", "帶著問題清單", "把待辦刪掉", "好，謝謝你", "這週真的停下來", "加入", "每週發一篇", "請 AI", "開始自己接單", "接下一份工作"];
    const avoid = ["報名", "刷卡", "直接貼", "說應該沒關係", "硬撐", "吃顆止痛藥"];
    for (let i = 0; i < 24 && (await page.locator("#result").isHidden()); i++) {
      const choices = page.locator("#stage .choice");
      const texts = await choices.allInnerTexts();
      let idx = -1;
      for (const p of prefer) { idx = texts.findIndex((t) => t.includes(p)); if (idx >= 0) break; }
      if (idx < 0) idx = texts.findIndex((t) => !avoid.some((a) => t.includes(a)));
      if (idx < 0) idx = texts.length - 1;
      await clickEl(page, choices.nth(idx), 250);
      await page.evaluate(() => scrollTo(0, document.getElementById("hud").getBoundingClientRect().top + scrollY - 20));
      await wait(850);
    }
    await smoothScrollTo(page, "#result", 1000);
    await wait(3500);
  }
};

const only = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=1940,1200", "--hide-scrollbars"] });
for (const [name, run] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const ctx = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 1, recordVideo: { dir: OUT, size: SIZE } });
  await ctx.addInitScript(CURSOR);
  const page = await ctx.newPage();
  const t0 = Date.now();
  await run(page);
  const video = page.video();
  await ctx.close();
  const dest = path.join(OUT, name + ".webm");
  if (existsSync(dest)) rmSync(dest);
  renameSync(await video.path(), dest);
  console.log(name, ((Date.now() - t0) / 1000).toFixed(1) + "s", "->", dest);
}
await browser.close();
