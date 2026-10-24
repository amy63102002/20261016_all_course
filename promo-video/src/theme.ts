import { loadFont as loadNoto } from "@remotion/google-fonts/NotoSansTC";
import { loadFont as loadLilita } from "@remotion/google-fonts/LilitaOne";

// 色票與網站 index.html 的 :root 相同
export const C = {
  ink: "#141414",
  paper: "#FFFDF7",
  yellow: "#FFD43B",
  pink: "#F7AFC6",
  blue: "#93CBEA",
  green: "#5BB592",
  mint: "#CFEBDD",
  orange: "#FF6B3D",
  peach: "#FFB79E",
  cream: "#FFF4D6",
  line: "#06C755",
};

export const sans = loadNoto("normal", { weights: ["500", "700", "900"] }).fontFamily;
export const display = loadLilita().fontFamily;

export const SKY =
  "radial-gradient(ellipse 30% 10% at 20% 8%, rgba(255,255,255,.9), transparent 70%)," +
  "radial-gradient(ellipse 25% 8% at 78% 14%, rgba(255,255,255,.8), transparent 70%)," +
  "linear-gradient(180deg, #3E8FD6 0%, #7DB9E8 45%, #BFE0F5 100%)";

export const FPS = 30;
export const LINE_URL = "lin.ee/7j3Hi2Z";
export const SITE = "amy63102002.github.io/20261016_all_course";
