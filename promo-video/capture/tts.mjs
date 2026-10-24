// 用 Gemini TTS（女聲 Achernar）合成每段旁白，輸出 public/vo/*.wav 與 durations.json
// 金鑰沿用 20260927_Gemini_3.8_Flash_TTS/.env 的 GEMINI_API_KEY1/2；不裁句尾（見該專案 docs/20261008-005）
// 用法：node capture/tts.mjs [段落 id ...]   不帶參數＝全部重做
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const ENV = "D:/case/arzbar/20260927_Gemini_3.8_Flash_TTS/.env";
const OUT = path.resolve("public/vo");
const VOICE = process.env.VOICE || "Achernar";
const STYLE = "[warm, friendly, clear]";
const MODELS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts", "gemini-2.5-flash-preview-tts"];
mkdirSync(OUT, { recursive: true });

export const LINES = JSON.parse(readFileSync(path.resolve("capture/narration.json"), "utf-8"));

const keys = [...readFileSync(ENV, "utf-8").matchAll(/^GEMINI_API_KEY\d*\s*=\s*(.+)$/gm)]
  .map((m) => m[1].trim().replace(/^["']|["']$/g, ""))
  .filter((k, i, a) => k && a.indexOf(k) === i);
if (!keys.length) throw new Error("找不到 GEMINI_API_KEY");

function wav(pcm, rate = 24000) {
  if (pcm.toString("ascii", 0, 4) === "RIFF") return pcm;
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
const seconds = (buf) => buf.readUInt32LE(40) / buf.readUInt32LE(28);

let keyIdx = 0;
async function synth(text) {
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: `${STYLE} ${text}` }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
  });
  for (let attempt = 1; attempt <= 4; attempt++) {
    for (let k = 0; k < keys.length; k++) {
      const ki = (keyIdx + k) % keys.length;
      for (const model of MODELS) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": keys[ki] },
            body,
          });
          const data = await res.json();
          if (res.status === 429) { console.warn(`  金鑰#${ki + 1} ${model} 429`); continue; }
          if (!res.ok) { console.warn(`  金鑰#${ki + 1} ${model} ${res.status} ${(data.error?.message || "").slice(0, 80)}`); continue; }
          const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
          if (part) {
            keyIdx = (ki + 1) % keys.length;
            const m = /rate=(\d+)/.exec(part.inlineData.mimeType || "");
            return { buf: wav(Buffer.from(part.inlineData.data, "base64"), m ? +m[1] : 24000), model };
          }
        } catch (e) { console.warn(`  金鑰#${ki + 1} ${model} 網路錯誤 ${e.message}`); }
      }
    }
    console.warn(`  全部限速，15 秒後重試（${attempt}/4）`);
    await new Promise((r) => setTimeout(r, 15000));
  }
  throw new Error("合成失敗：" + text.slice(0, 20));
}

const only = process.argv.slice(2);
const durFile = path.join(OUT, "durations.json");
const durations = existsSync(durFile) ? JSON.parse(readFileSync(durFile, "utf-8")) : {};
for (const l of LINES) {
  if (only.length && !only.includes(l.id)) continue;
  const { buf, model } = await synth(l.text);
  writeFileSync(path.join(OUT, l.id + ".wav"), buf);
  durations[l.id] = +seconds(buf).toFixed(2);
  console.log(`${l.id}  ${durations[l.id]}s / 上限 ${l.max}s  ${durations[l.id] > l.max ? "⚠️ 太長" : "OK"}  (${model})`);
}
writeFileSync(durFile, JSON.stringify(durations, null, 2));
