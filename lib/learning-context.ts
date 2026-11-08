/**
 * 切科目、巡遊與角色導覽共用的學習上下文。
 * 畫面暫態（題眼、計時、揭曉）跟題目走；閃卡與獎勵留下。
 * 自由選課存在 carts，巡遊只改畫面上的 cart，不蓋掉原本的選課。
 */
import { leadExam, packOf, type SubjectKey } from "./curriculum";
import { lightOf } from "./mastery";

export type AttemptStage = "ask" | "eyes" | "steps" | "done";
export type DrawReview = "idle" | "pending" | "done";

export interface NoteCard {
  studentId: string;
  subject: SubjectKey;
  topicId: string;
  subtopicId: string;
  text: string;
}

export interface AttemptDraft {
  qStage: AttemptStage;
  eye: "none" | "hit" | "miss";
  ansonMissed: boolean;
  stepPage: number;
  capsules: boolean;
  lqSteps: boolean[];
}

export interface LearningSlice {
  subject: SubjectKey;
  focusId: string;
  cart: string[];
  carts: Record<SubjectKey, string[]>;
  cartSource: "free" | "tour";
  examCode: string | null;
  smokeCode: string | null;
  qStage: AttemptStage;
  eye: "none" | "hit" | "miss";
  ansonMissed: boolean;
  stepPage: number;
  stepSeconds: number;
  stepRunning: boolean;
  capsules: boolean;
  lqSteps: boolean[];
  drafts: Record<string, AttemptDraft>;
  hotkeys: string[];
}

const PHY_CART = ["JPWM07", "SPEM01", "JPWM06", "JPWM08", "SPEM02"];

export function defaultCart(subject: SubjectKey) {
  if (subject === "Phy") return [...PHY_CART];
  return [...packOf("Maths").topics]
    .sort((a, b) => Number(b.hot) - Number(a.hot))
    .slice(0, 5)
    .map((topic) => topic.code);
}

export function freshCarts(): Record<SubjectKey, string[]> {
  return { Maths: defaultCart("Maths"), Phy: defaultCart("Phy") };
}

function draftKey(studentId: string, examCode: string | null) {
  return `${studentId}|${examCode ?? ""}`;
}

function captureDraft(state: LearningSlice): AttemptDraft {
  return {
    qStage: state.qStage,
    eye: state.eye,
    ansonMissed: state.ansonMissed,
    stepPage: state.stepPage,
    capsules: state.capsules,
    lqSteps: [...state.lqSteps],
  };
}

function blankAttempt(): Pick<LearningSlice, "qStage" | "eye" | "ansonMissed" | "stepPage" | "stepSeconds" | "stepRunning" | "capsules" | "lqSteps" | "hotkeys"> {
  return {
    qStage: "ask",
    eye: "none",
    ansonMissed: false,
    stepPage: 0,
    stepSeconds: 15,
    stepRunning: false,
    capsules: false,
    lqSteps: [false, false, false, false],
    hotkeys: [],
  };
}

function rememberFreeCart(state: LearningSlice): Record<SubjectKey, string[]> {
  if (state.cartSource === "tour") return state.carts;
  return { ...state.carts, [state.subject]: [...state.cart] };
}

export function switchSubject<T extends LearningSlice>(
  state: T,
  subject: SubjectKey,
  opts: { mode: "manual" | "tour"; examCode?: string | null; smokeCode?: string | null; cart?: string[] },
): T {
  if (opts.mode === "manual" && subject === state.subject) return state;
  const carts = rememberFreeCart(state);
  const drafts = { ...state.drafts };
  if (state.examCode) drafts[draftKey(state.focusId, state.examCode)] = captureDraft(state);

  const exam = opts.examCode ? { code: opts.examCode, topic: opts.smokeCode ?? opts.examCode.split(".").slice(0, 1).join(".") } : leadExam(subject);
  const examCode = opts.examCode ?? exam.code;
  const smokeCode = opts.smokeCode ?? ("topic" in exam ? exam.topic : examCode.split(".")[0]);
  const saved = opts.mode === "manual" ? drafts[draftKey(state.focusId, examCode)] : undefined;
  const cart = opts.mode === "tour"
    ? [...(opts.cart ?? defaultCart(subject))]
    : [...(carts[subject] ?? defaultCart(subject))];

  return {
    ...state,
    subject,
    carts,
    cart,
    cartSource: opts.mode === "tour" ? "tour" : "free",
    examCode,
    smokeCode,
    drafts,
    ...(saved
      ? {
          qStage: saved.qStage,
          eye: saved.eye,
          ansonMissed: saved.ansonMissed,
          stepPage: saved.stepPage,
          stepSeconds: 15,
          stepRunning: false,
          capsules: saved.capsules,
          lqSteps: [...saved.lqSteps],
          hotkeys: [],
        }
      : blankAttempt()),
  };
}

/** 換學生時把未完成的作答留在原來那位，再讀回這位的草稿。 */
export function swapStudentDraft<T extends LearningSlice>(state: T, focusId: string): T {
  if (focusId === state.focusId) return state;
  const drafts = { ...state.drafts };
  if (state.examCode) drafts[draftKey(state.focusId, state.examCode)] = captureDraft(state);
  const saved = drafts[draftKey(focusId, state.examCode)];
  return {
    ...state,
    focusId,
    drafts,
    ...(saved
      ? {
          qStage: saved.qStage,
          eye: saved.eye,
          ansonMissed: saved.ansonMissed,
          stepPage: saved.stepPage,
          stepRunning: false,
          capsules: saved.capsules,
          lqSteps: [...saved.lqSteps],
        }
      : blankAttempt()),
  };
}

export function makeNote(
  state: { focusId: string; subject: SubjectKey; smokeCode: string | null; examCode: string | null },
  text: string,
): NoteCard {
  return {
    studentId: state.focusId,
    subject: state.subject,
    topicId: state.smokeCode ?? "",
    subtopicId: state.examCode ?? "",
    text,
  };
}

export function sameNote(a: NoteCard, b: NoteCard) {
  return a.studentId === b.studentId && a.subject === b.subject && a.subtopicId === b.subtopicId && a.text === b.text;
}

export function visibleNotes(
  notes: NoteCard[],
  filter: { studentId: string; subject?: SubjectKey; subtopicId?: string | null },
) {
  return notes.filter((note) => {
    if (note.studentId !== filter.studentId) return false;
    if (filter.subject && note.subject !== filter.subject) return false;
    if (filter.subtopicId && note.subtopicId !== filter.subtopicId) return false;
    return true;
  });
}

export function noteLabel(note: NoteCard) {
  const subject = note.subject === "Maths" ? "數學" : "物理";
  return `${subject} · ${note.subtopicId || note.topicId} · ${note.text}`;
}

export function idsInSubject(subject: SubjectKey, ids: string[]) {
  const known = new Set(packOf(subject).topics.map((topic) => topic.code));
  return ids.filter((id) => known.has(id));
}

/** 無效課題代號不給名字，呼叫端應顯示空狀態，而不是「課題」。 */
export function topicNames(subject: SubjectKey, ids: string[]) {
  const pack = packOf(subject);
  return idsInSubject(subject, ids)
    .map((id) => pack.topics.find((topic) => topic.code === id)?.name_zh)
    .filter((name): name is string => Boolean(name));
}

export function contextIssues(subject: SubjectKey, examCode: string | null, cart: string[]) {
  const known = new Set(packOf(subject).topics.map((topic) => topic.code));
  const badCart = cart.filter((id) => !known.has(id));
  const examOk = !examCode || packOf(subject).topics.some((topic) =>
    topic.code === examCode || topic.subtopics.some((sub) => sub.code === examCode) || examCode.startsWith(`${topic.code}.`) || examCode.startsWith(topic.code),
  );
  return { badCart, examOk };
}

export function sprintTopics<T extends { code: string; name: string; score: number }>(topics: T[]) {
  return topics.filter((topic) => {
    const light = lightOf(topic.score);
    return light === "red" || light === "yellow";
  });
}

export function reviewCopy(status: DrawReview) {
  if (status === "pending") return "自檢完成，已送出覆核請求（模擬，尚未覆核）。";
  if (status === "done") return "KOC 已覆核（模擬）。";
  return "";
}
