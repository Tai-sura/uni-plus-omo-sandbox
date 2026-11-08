/**
 * 匿名規則檢查。不連畫面、不讀學生資料。
 * 執行：node --experimental-strip-types scripts/check-rules.ts
 */
import assert from "node:assert/strict";
import { lightOf } from "../lib/mastery.ts";
import { approveKocPass } from "../lib/koc-pass.ts";

assert.equal(lightOf(84), "light");
assert.equal(lightOf(85), "deep");
assert.equal(lightOf(70), "light");
assert.equal(lightOf(69), "yellow");
assert.equal(lightOf(50), "yellow");
assert.equal(lightOf(49), "red");
assert.equal(lightOf(null), "gray");

const base = { metal: 80, wood: 80, fire: 80, video: "uploaded" as const, promoted: false, royalty: 12.5, eduToken: 12.5 };
const first = approveKocPass(base);
assert.equal(first.ok, true);
if (first.ok) {
  assert.equal(first.royalty, 14);
  assert.equal(first.promoted, true);
}
assert.equal(approveKocPass({ ...base, metal: 40 }).ok, false);
assert.equal(approveKocPass({ ...base, video: "none" }).ok, false);
const again = approveKocPass({ ...base, video: "passed", promoted: true, royalty: 14, eduToken: 14 });
assert.equal(again.ok, false);
if (!again.ok) assert.equal(again.reason, "already");

console.log("check-rules: lightOf boundaries and KOC pass idempotency ok");
