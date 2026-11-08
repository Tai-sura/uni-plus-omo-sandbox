/** LDC「Pass」的唯一結算。版稅與晉升是同一次核准，重複點擊不再加幣。 */

export interface KocPassInput {
  metal: number;
  wood: number;
  fire: number;
  video: "none" | "uploaded" | "passed";
  promoted: boolean;
  royalty: number;
  eduToken: number;
}

export type KocPassResult =
  | { ok: false; reason: "review" | "no-video" | "already" }
  | { ok: true; royalty: number; eduToken: number; promoted: true; video: "passed" };

export function approveKocPass(input: KocPassInput): KocPassResult {
  const ready = input.metal >= 60 && input.wood >= 60 && input.fire >= 60;
  if (!ready) return { ok: false, reason: "review" };
  if (input.video !== "uploaded" && input.video !== "passed") return { ok: false, reason: "no-video" };
  if (input.promoted && input.video === "passed") return { ok: false, reason: "already" };
  return {
    ok: true,
    royalty: Math.round((input.royalty + 1.5) * 10) / 10,
    eduToken: Math.round((input.eduToken + 1.5) * 10) / 10,
    promoted: true,
    video: "passed",
  };
}
