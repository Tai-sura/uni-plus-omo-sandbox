/**
 * 匿名規則檢查。不連畫面、不讀學生資料。
 * 執行：node --experimental-strip-types scripts/check-rules.ts
 */
import assert from "node:assert/strict";
import { lightOf } from "../lib/mastery.ts";
import { approveKocPass } from "../lib/koc-pass.ts";
import { contextIssues, freshCarts, makeNote, reviewCopy, sprintTopics, switchSubject, topicNames, visibleNotes, type LearningSlice } from "../lib/learning-context.ts";
import { seatFocusTopics } from "../lib/student-profile.ts";
import { freshDesk, offListTaught, onSchoolList, saveLesson } from "../lib/lesson-desk.ts";

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

function slice(over: Partial<LearningSlice> = {}): LearningSlice {
  const carts = freshCarts();
  return {
    subject: "Maths",
    focusId: "anson",
    cart: [...carts.Maths],
    carts,
    cartSource: "free",
    examCode: "SM02.2",
    smokeCode: "SM02",
    qStage: "ask",
    eye: "none",
    ansonMissed: false,
    stepPage: 0,
    stepSeconds: 15,
    stepRunning: false,
    capsules: false,
    lqSteps: [false, false, false, false],
    drafts: {},
    hotkeys: [],
    ...over,
  };
}

const wrong = slice({ qStage: "eyes", eye: "miss", ansonMissed: true, cart: ["SM02", "JM29"] });
const act3 = switchSubject(wrong, "Phy", { mode: "tour", examCode: "JPWM07.2", smokeCode: "JPWM07" });
assert.equal(act3.examCode, "JPWM07.2");
assert.equal(act3.qStage, "ask");
assert.equal(act3.ansonMissed, false);
assert.equal(contextIssues(act3.subject, act3.examCode, act3.cart).badCart.length, 0);
assert.ok(act3.cart.includes("JPWM07"));
assert.deepEqual(topicNames("Phy", ["SM02", "JM29"]), []);
assert.ok(topicNames("Phy", act3.cart).includes("光的折射"));
assert.deepEqual(act3.carts.Maths, ["SM02", "JM29"]);

const edited = slice({ cart: ["SM02", "JM29", "JM20"] });
const physics = switchSubject(edited, "Phy", { mode: "manual" });
assert.ok(physics.cart.includes("JPWM07"));
assert.deepEqual(physics.carts.Maths, ["SM02", "JM29", "JM20"]);
const mathsAgain = switchSubject({ ...physics, cart: ["JPWM07"] }, "Maths", { mode: "manual" });
assert.deepEqual(mathsAgain.cart, ["SM02", "JM29", "JM20"]);

const anson = makeNote({ focusId: "anson", subject: "Maths", smokeCode: "SM02", examCode: "SM02.2" }, "SM02.2 · Δ > 0");
const other = makeNote({ focusId: "s10", subject: "Maths", smokeCode: "SM02", examCode: "SM02.2" }, "另一位學生的卡");
const notes = [anson, other];
assert.equal(visibleNotes(notes, { studentId: "anson", subject: "Phy" }).length, 0);
assert.equal(visibleNotes(notes, { studentId: "s10", subject: "Maths" }).length, 1);
assert.equal(visibleNotes(notes, { studentId: "anson", subject: "Maths", subtopicId: "SM02.2" }).length, 1);

const phyTopics = seatFocusTopics("Phy", "anson", 84, "JPWM07.2");
assert.equal(phyTopics.find((topic) => topic.code === "JPWM07")?.score, 84);
const sprint = sprintTopics(phyTopics);
assert.equal(sprint.some((topic) => topic.code === "JPWM07"), false);
assert.ok(sprint.every((topic) => topic.score < 70));

assert.match(reviewCopy("pending"), /尚未覆核/);
assert.equal(reviewCopy("pending").includes("KOC 已覆核"), false);
assert.match(reviewCopy("done"), /KOC 已覆核/);
assert.notEqual(reviewCopy("pending"), reviewCopy("done"));

const desk = freshDesk();
assert.equal(desk.suggestion.Maths, "SM02.2");
assert.equal(desk.suggestion.Phy, "JPWM07.2");
assert.equal(onSchoolList("Phy", "JPWM07.2"), true);
assert.equal(onSchoolList("Phy", "SPEM01.1"), false);
const taught = saveLesson(desk, {
  subject: "Phy",
  kind: "class",
  groups: [{ tutor: "Oscar 黃朗", topicCode: "JPWM07.2", mode: "concept", students: ["anson"] }],
});
assert.equal(taught.desk.suggestion.Phy, "JPWM07.2");
assert.equal(taught.desk.cells["Phy|anson|JPWM07.2"].concept, true);
assert.equal(taught.desk.cells["Phy|anson|JPWM07.2"].exercise, false);
assert.match(taught.lines[0], /模擬，尚未送出公司表/);
assert.equal(taught.lines[0].includes("已送出"), false);
const extra = saveLesson(taught.desk, {
  subject: "Phy",
  kind: "extra",
  groups: [{ tutor: "Oscar 黃朗", topicCode: "JPWM07.2", mode: "exercise", students: ["anson"] }],
});
assert.equal(extra.desk.suggestion.Phy, desk.suggestion.Phy);
assert.equal(extra.desk.cells["Phy|anson|JPWM07.2"].concept, true);
assert.equal(extra.desk.cells["Phy|anson|JPWM07.2"].exercise, true);
assert.match(extra.lines[0], /^\[Oscar 黃朗\] 補課：/);
const split = saveLesson(extra.desk, {
  subject: "Phy",
  kind: "class",
  groups: [
    { tutor: "Oscar 黃朗", topicCode: "JPWM07.2", mode: "both", students: ["anson"] },
    { tutor: "Chloe 李晴", topicCode: "SPEM01.1", mode: "both", students: ["s4"] },
  ],
});
assert.equal(split.lines.length, 2);
assert.match(split.lines[1], /Chloe 李晴/);
assert.equal(split.desk.suggestion.Phy, "JPWM07.2");
assert.equal(offListTaught(split.desk, "Phy", "s4", "SPEM01.1"), true);
assert.equal(offListTaught(split.desk, "Phy", "anson", "JPWM07.2"), false);
assert.equal(saveLesson(desk, { subject: "Maths", kind: "class", groups: [] }).error?.includes("請先選課題"), true);

console.log("check-rules: lightOf, pass idempotency, subject switch, carts, notes, sprint scores, review states, lesson desk ok");
