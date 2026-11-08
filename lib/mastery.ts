export type HintLevel = 0 | 1 | 2 | 3;
export type Light = "deep" | "light" | "yellow" | "red" | "gray";

export const HINT_WEIGHT: Record<HintLevel, number> = {
  0: 1,
  1: 0.8,
  2: 0.65,
  3: 0.5,
};

export const LIGHT_META: Record<
  Light,
  { label: string; mark: string; range: string; bg: string; fg: string }
> = {
  deep: { label: "深綠", mark: "🌲", range: "≥85%", bg: "#0e8f5b", fg: "#f3fff8" },
  light: { label: "淺綠", mark: "🟢", range: "70–84%", bg: "#3aaa6a", fg: "#f3fff8" },
  yellow: { label: "黃燈", mark: "🟡", range: "50–69%", bg: "#e0a825", fg: "#1c1503" },
  red: { label: "紅燈", mark: "🔴", range: "<50%", bg: "#e24b3c", fg: "#fff6f5" },
  gray: { label: "未測", mark: "⚪", range: "不入分母", bg: "#667588", fg: "#f4f7fb" },
};

export function lightOf(score: number | null): Light {
  if (score == null || Number.isNaN(score)) return "gray";
  if (score >= 85) return "deep";
  if (score >= 70) return "light";
  if (score >= 50) return "yellow";
  return "red";
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function calcMastery(mInit: number, hint: HintLevel, m48: number) {
  const raw = round1(mInit * HINT_WEIGHT[hint]);
  const day1 = Math.min(raw, 84);
  const blendA = round1(0.6 * raw + 0.4 * m48);
  const blendB = round1(0.45 * raw + 0.55 * m48);
  let smooth = Math.max(blendA, blendB);
  let guarded = false;
  if (raw < 50 && smooth >= 85) {
    smooth = 84;
    guarded = true;
  }
  smooth = round1(smooth);
  return {
    raw,
    day1,
    blendA,
    blendB,
    smooth,
    naive: m48,
    guarded,
    light: lightOf(smooth),
    day1Light: lightOf(day1),
  };
}
