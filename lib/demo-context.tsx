"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { activeTopics, isEbookPoint, JM29_LINES, lqTwinCard, packOf, teleScript, type EbookTab, type SubjectKey } from "./curriculum";
import { HERO, PAYOUT_OK, SEATS, TOPICS } from "./mock-data";
import { approveKocPass } from "./koc-pass";
import { freshCarts, makeNote, reviewCopy, sameNote, swapStudentDraft, switchSubject, type AttemptDraft, type DrawReview, type NoteCard } from "./learning-context";
import { lightOf, type HintLevel, type Light } from "./mastery";

export type Role = "student" | "parent" | "ldc" | "koc" | "csm";
export type Phase = "day1" | "h48" | "decay" | "preexam";
export type Act = 1 | 2 | 3 | 4 | 5;
export type Desk = "koc" | "ldc" | "csm";
export type Phone = "student" | "parent";
export type ElementKey = "water" | "wood" | "metal" | "fire" | "earth";
export type TicketTier = "priority" | "regular" | "convert";

export interface Ticket {
  id: string;
  title: string;
  tier: TicketTier;
  owner: "jason" | "chloe" | "csm";
}
export type QStage = "ask" | "eyes" | "steps" | "done";
export type Freshness = "idle" | "quiz" | "buffer" | "locked";

export interface StudentCard {
  kind: "ice" | "challenge" | "twin" | "steps" | "ebook";
  title: string;
  body: string;
  steps?: string[];
  phases?: { title: string; body: string }[];
}

export interface ParentBrief {
  title: string;
  body: string;
  ink?: boolean;
}

export interface Callout {
  act: Act;
  title: string;
  body: string;
}

interface State {
  role: Role;
  split: boolean;
  phase: Phase;
  act: Act | null;
  callout: Callout | null;
  highlight: string | null;
  toast: string | null;
  tourNotice: string | null;
  includeUntested: boolean;
  showHiddenAxes: boolean;
  cart: string[];
  carts: Record<SubjectKey, string[]>;
  cartSource: "free" | "tour";
  drafts: Record<string, AttemptDraft>;
  drawReview: DrawReview;
  ansonMissed: boolean;
  ansonWrongs: number;
  instructionOpen: boolean;
  qStage: QStage;
  eye: "none" | "hit" | "miss";
  stepPage: number;
  overlay: number;
  deduct: [boolean, boolean];
  photo: boolean;
  capsules: boolean;
  notes: NoteCard[];
  twinCorrect: boolean;
  twinWrong: number;
  burst: number;
  flash: "idle" | "flipped" | "locked";
  flashLeft: number;
  lqSteps: boolean[];
  lqClaimed: boolean;
  starCoins: number;
  mInit: number;
  hint: HintLevel;
  m48: number;
  pin: string;
  unlocked: boolean;
  pinError: boolean;
  voice: "none" | "ldc" | "koc";
  utConfirmed: boolean;
  diagStep: number;
  badge: boolean;
  voucher: boolean;
  classMode: "large" | "small";
  batchLogged: boolean;
  hotkeys: string[];
  recording: boolean;
  paused: boolean;
  audit: { metal: number; wood: number; fire: number };
  video: "none" | "uploaded" | "passed";
  royalty: number;
  mask: number;
  maskAccepted: boolean;
  variant: boolean;
  eduToken: number;
  promoted: boolean;
  overflow: boolean;
  copied: boolean;
  poolNote: string;
  freshness: Freshness;
  sprintOld: number;
  entered: boolean;
  barCollapsed: boolean;
  phone: Phone;
  desk: Desk;
  duo: boolean;
  focusId: string;
  autoTour: boolean;
  tourLeft: number;
  coins: Record<string, number>;
  bonusSeats: string[];
  studentUt: number | null;
  utAdjusted: boolean;
  predictedLive: number;
  speedQueue: boolean;
  silence: boolean;
  tickets: Ticket[];
  iceStep: number;
  iceHeat: { refr: number; elec: number };
  element: ElementKey;
  tla: { t: boolean; l: boolean; a: boolean };
  poolRows: { name: string; pct: number }[] | null;
  poolFrozen: boolean;
  coTeach: boolean;
  utClass: boolean;
  mentorClaimed: boolean;
  waOpened: boolean;
  linkArmed: boolean;
  linkSpent: boolean;
  timeoutLocked: boolean;
  emi: boolean;
  stepSeconds: number;
  stepRunning: boolean;
  eyeWeight: number;
  regrouped: boolean;
  isOpen: string | null;
  subject: SubjectKey;
  levelView: "chapter" | "topic";
  smokeCode: string | null;
  examCode: string | null;
  studentCard: StudentCard | null;
  kocAlert: boolean;
  parentBrief: ParentBrief | null;
  ebookOpen: boolean;
  ebookShown: number;
  ebookBreak: number | null;
  ebookRun: number;
  ebookPen: "P" | "H" | "both";
  ebookTab: EbookTab;
  kocEbook: boolean;
  labOpen: boolean;
  labTrace: string | null;
  commute: boolean;
  studentTab: "radar" | "quest" | "cart" | "notes";
  phonePulse: number;
}

const initial: State = {
  role: "student",
  split: false,
  phase: "day1",
  act: null,
  callout: null,
  highlight: null,
  toast: null,
  tourNotice: null,
  includeUntested: false,
  showHiddenAxes: false,
  cart: freshCarts().Maths,
  carts: freshCarts(),
  cartSource: "free",
  drafts: {},
  drawReview: "idle",
  ansonMissed: false,
  ansonWrongs: 2,
  instructionOpen: false,
  qStage: "ask",
  eye: "none",
  stepPage: 0,
  overlay: 35,
  deduct: [false, false],
  photo: false,
  capsules: false,
  notes: [],
  twinCorrect: false,
  twinWrong: 0,
  burst: 0,
  flash: "idle",
  flashLeft: 0,
  lqSteps: [false, false, false, false],
  lqClaimed: false,
  starCoins: 128,
  mInit: 92,
  hint: 0,
  m48: 96,
  pin: "",
  unlocked: false,
  pinError: false,
  voice: "none",
  utConfirmed: false,
  diagStep: 0,
  badge: false,
  voucher: false,
  classMode: "large",
  batchLogged: false,
  hotkeys: [],
  recording: false,
  paused: false,
  audit: { metal: 80, wood: 75, fire: 70 },
  video: "none",
  royalty: 12.5,
  mask: 12,
  maskAccepted: false,
  variant: false,
  eduToken: 46,
  promoted: false,
  overflow: false,
  copied: false,
  poolNote: "本週擬發放 0.7%，合計 2.3%，安全閥通過。",
  freshness: "idle",
  sprintOld: 1,
  entered: false,
  barCollapsed: false,
  phone: "student",
  desk: "koc",
  duo: false,
  focusId: "anson",
  autoTour: false,
  tourLeft: 40,
  coins: Object.fromEntries(SEATS.map((seat) => [seat.id, seat.id === "anson" ? 128 : 24 + (seat.mastery % 17)])),
  bonusSeats: [],
  studentUt: null,
  utAdjusted: false,
  predictedLive: HERO.predicted,
  speedQueue: false,
  silence: false,
  tickets: [
    { id: "t1", title: "攻堅支援 [重點] · 陳*軒折射", tier: "priority", owner: "jason" },
    { id: "t2", title: "節奏連繫 [常規] · 黃*諾", tier: "regular", owner: "jason" },
    { id: "t3", title: "暖心作息 [重點] · 何*言", tier: "priority", owner: "jason" },
    { id: "t4", title: "正向突破 [轉化] · 李*晴", tier: "convert", owner: "jason" },
    { id: "t5", title: "課後確認 [常規] · 周*恩", tier: "regular", owner: "jason" },
  ],
  iceStep: 0,
  iceHeat: { refr: 45, elec: 45 },
  element: "water",
  tla: { t: false, l: false, a: false },
  poolRows: null,
  poolFrozen: false,
  coTeach: false,
  utClass: false,
  mentorClaimed: false,
  waOpened: false,
  linkArmed: false,
  linkSpent: false,
  timeoutLocked: false,
  emi: false,
  stepSeconds: 15,
  stepRunning: false,
  eyeWeight: 100,
  regrouped: false,
  isOpen: null,
  subject: "Maths",
  levelView: "topic",
  smokeCode: "SM02",
  examCode: "SM02.2",
  studentCard: null,
  kocAlert: false,
  parentBrief: null,
  ebookOpen: false,
  ebookShown: 0,
  ebookBreak: null,
  ebookRun: 0,
  ebookPen: "both",
  ebookTab: "rhombus",
  kocEbook: false,
  labOpen: false,
  labTrace: null,
  commute: false,
  studentTab: "radar",
  phonePulse: 0,
};

type Action =
  | { type: "patch"; patch: Partial<State> }
  | { type: "toast"; text: string }
  | { type: "act"; act: Act; keepTour?: boolean }
  | { type: "phase"; phase: Phase }
  | { type: "cart"; id: string }
  | { type: "miss" }
  | { type: "correct-answer" }
  | { type: "eye"; kind: "hit" | "miss" }
  | { type: "submit-steps" }
  | { type: "note"; text?: string }
  | { type: "draw-review"; status: "pending" | "done" }
  | { type: "twin"; ok: boolean }
  | { type: "flash"; ok: boolean }
  | { type: "flash-unlock" }
  | { type: "lq"; index: number }
  | { type: "claim"; mode: "fair" | "blank" }
  | { type: "pin"; value: string }
  | { type: "unlock" }
  | { type: "hotkey"; key: "1" | "2" | "3" }
  | { type: "audit"; key: "metal" | "wood" | "fire"; value: number }
  | { type: "pass" }
  | { type: "mask-accept" }
  | { type: "upload" }
  | { type: "diag" }
  | { type: "fresh"; ok: boolean }
  | { type: "fresh-confirm" }
  | { type: "sprint-old" }
  | { type: "enter"; role: Role }
  | { type: "focus"; id: string }
  | { type: "tour-start" }
  | { type: "tour-stop" }
  | { type: "tour-tick" }
  | { type: "ut-submit"; score: number }
  | { type: "ut-adjust" }
  | { type: "book-ut" }
  | { type: "silence" }
  | { type: "new-ticket" }
  | { type: "overflow" }
  | { type: "ice" }
  | { type: "tla"; key: "t" | "l" | "a" }
  | { type: "payout"; over: boolean }
  | { type: "invite" }
  | { type: "wa-open" }
  | { type: "arm-link" }
  | { type: "timeout" }
  | { type: "mentor" }
  | { type: "coteach" }
  | { type: "subject"; subject: SubjectKey }
  | { type: "dispatch-card"; card: StudentCard }
  | { type: "koc-alert" }
  | { type: "parent-brief" }
  | { type: "csm-handoff" }
  | { type: "ebook-nav"; dir: "next" | "all" | "prev" | "reset" }
  | { type: "ebook-break"; line: number }
  | { type: "ebook-sync" };

function parentBriefFor(subject: SubjectKey, examCode: string | null, hotkeys: string[], focusId: string) {
  const pack = packOf(subject);
  const ebook = isEbookPoint(examCode);
  const pointTopic = pack.topics.find((topic) =>
    topic.subtopics.some((sub) => sub.code === examCode),
  );
  const lead = ebook
    ? pack.topics.find((topic) => topic.code === "JM29") ?? pack.topics[0]
    : pointTopic ?? pack.topics.find((topic) => topic.hot) ?? pack.topics[0];
  const name = SEATS.find((seat) => seat.id === focusId)?.name ?? "鄭*博";
  if (ebook) {
    return {
      title: "四邊形 · LQ 步驟得分率",
      body: `${name}今週喺【四邊形】長題目透過課堂互動 e-Book 練成「先標菱形對角線平分 ∠DFE 搶 1M 步驟分」，並補齊定理理由 [prop. of rhombus]，由 42° 計到 34.5°，下次校內 UT 幾何長題目預計可穩袋滿分！`,
      ink: true,
    };
  }
  return {
    title: `${lead.name_zh} · LQ 步驟得分率`,
    body: `${teleScript(subject, hotkeys, name, examCode)} 長題目佔校內卷 70%，這週的目標是把斷點 1M 補上，由 1 分走向 2M + 1A。`,
    // Physics reports always carry the refraction ink; Maths only when the
    // rhombus e-Book point is the one on screen.
    ink: subject === "Phy",
  };
}

const ACTS: Record<Act, Callout & { patch: Partial<State> }> = {
  1: {
    act: 1,
    title: "第 1 幕 · 校本定錨與可視重心",
    body: "Level 2 Topic 是唯一派發、紅綠燈與掌握度層。打開「包含灰色未測」，雷達會被未教課題拉塌；關掉就回到 Active-Only 分母。Topic Cart 最多 5 個，系統只點亮最緊急的 Top 2。",
      patch: {
      role: "student",
      split: false,
      duo: false,
      phone: "student",
      desk: "koc",
      focusId: "anson",
      subject: "Phy",
      smokeCode: "JPWM07",
      examCode: "JPWM07.2",
      cart: ["JPWM07", "SPEM01", "JPWM06", "JPWM08", "SPEM02"],
      labOpen: false,
      phase: "day1",
      highlight: "radar",
      freshness: "idle",
      ansonMissed: false,
    },
  },
  2: {
    act: 2,
    title: "第 2 幕 · 課堂冒煙與雙師分流",
    body: "左屏陳*軒選了 A，錯題數升到 4。84% 仍是淺綠。右屏 KOC 把他放進「錯 ≥4 題」，可改看 LDC 分流。",
    patch: {
      role: "koc",
      split: true,
      duo: false,
      phone: "student",
      desk: "koc",
      focusId: "anson",
      subject: "Phy",
      smokeCode: "JPWM07",
      examCode: "JPWM07.2",
      labOpen: false,
      phase: "day1",
      highlight: "seat-anson",
      ansonMissed: true,
      ansonWrongs: 4,
      instructionOpen: true,
      regrouped: true,
      classMode: "small",
      qStage: "eyes",
      freshness: "idle",
    },
  },
  3: {
    act: 3,
    title: "第 3 幕 · 破關、48 小時雙胞胎與考後回流",
    body: "先點題眼，再滑 15 秒雙軌分步卡。時間機器停在 +48h：答對雙胞胎後，進度由淺綠 84% 衝上深綠 91%，並蓋上「平時免做」。右屏可拖動試卷頂部 12% 遮罩。",
    patch: {
      role: "koc",
      split: true,
      duo: false,
      phone: "student",
      desk: "koc",
      phase: "h48",
      subject: "Phy",
      smokeCode: "JPWM07",
      examCode: "JPWM07.2",
      highlight: "twin",
      twinCorrect: false,
      qStage: "eyes",
      freshness: "idle",
    },
  },
  4: {
    act: 4,
    title: "第 4 幕 · 家長戰報與跨科漏斗",
    body: "用家長手機尾 4 碼 8821 解鎖。戰報用純中文課題名，播雙師語音，並列 3 句地鐵靜音金句。深綠突破後，可做 3 分鐘跨科微診斷並領取課後沙盤券。",
    patch: {
      role: "parent",
      split: false,
      duo: false,
      phone: "parent",
      desk: "koc",
      phase: "h48",
      subject: "Phy",
      smokeCode: "JPWM07",
      examCode: "JPWM07.2",
      highlight: "parent-lock",
      twinCorrect: true,
      burst: 1,
      freshness: "idle",
      waOpened: false,
    },
  },
  5: {
    act: 5,
    title: "第 5 幕 · KOC 造血飛輪與獎金池",
    body: "左屏 KOC 勾完 Teach、Learn、Apply 再上傳。右屏 LDC 用金、木、火 Pass。通過後兩邊同時變成 KOC Leader：時薪 +20%、可接副講、可開 UT 加操，帶教新人 +10。",
    patch: {
      role: "koc",
      split: true,
      duo: true,
      desk: "ldc",
      subject: "Maths",
      smokeCode: "JM29",
      examCode: "JM29.2",
      highlight: "leader",
      freshness: "idle",
    },
  },
};

export function actScript(act: Act | null) {
  if (!act) return null;
  const spec = ACTS[act];
  return { title: spec.title, body: spec.body };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    case "toast":
      return { ...state, toast: action.text };
    case "act": {
      const spec = ACTS[action.act];
      const subject = spec.patch.subject ?? state.subject;
      const aligned = switchSubject(state, subject, {
        mode: "tour",
        examCode: spec.patch.examCode,
        smokeCode: spec.patch.smokeCode,
        cart: spec.patch.cart,
      });
      const studentTab = action.act === 1 ? "radar" : action.act === 2 || action.act === 3 ? "quest" : state.studentTab;
      const next = {
        ...aligned,
        ...spec.patch,
        carts: aligned.carts,
        drafts: aligned.drafts,
        cart: spec.patch.cart ?? aligned.cart,
        cartSource: "tour" as const,
        notes: state.notes,
        starCoins: state.starCoins,
        studentTab,
        phonePulse: state.phonePulse + 1,
        act: action.act,
        callout: spec,
        entered: true,
        labOpen: false,
        barCollapsed: false,
        tourNotice: null,
        autoTour: action.keepTour ? state.autoTour : false,
        tourLeft: action.keepTour ? 40 : state.tourLeft,
      };
      // Act 4 promises an ink snapshot on the parent phone, so attach it on entry.
      if (action.act === 4 && !next.parentBrief) {
        next.parentBrief = parentBriefFor(next.subject, next.examCode, next.hotkeys, next.focusId);
      }
      return next;
    }
    case "phase": {
      const freshness: Freshness = action.phase === "preexam" ? "quiz" : "idle";
      return {
        ...state,
        phase: action.phase,
        freshness,
        twinCorrect: action.phase === "h48" ? false : state.twinCorrect,
        highlight: action.phase === "h48" ? "twin" : action.phase === "preexam" ? "freshness" : "hero-score",
        studentTab: action.phase === "h48" || action.phase === "preexam" ? "quest" : state.studentTab,
        phonePulse: state.phonePulse + 1,
      };
    }
    case "cart": {
      const known = packOf(state.subject).topics.some((topic) => topic.code === action.id);
      if (!known) return { ...state, toast: `${action.id} 不屬於目前這一科，沒有加入購物車。` };
      const has = state.cart.includes(action.id);
      if (has) return { ...state, cart: state.cart.filter((id) => id !== action.id) };
      if (state.cart.length >= 5) return { ...state, toast: "Topic Cart 最多 5 個。請先取消一個，再加入新課題。" };
      return { ...state, cart: [...state.cart, action.id] };
    }
    case "miss":
      return {
        ...state,
        ansonMissed: true,
        ansonWrongs: Math.min(6, state.ansonWrongs + 1),
        instructionOpen: true,
        qStage: "eyes",
        highlight: "seat-anson",
        regrouped: true,
        classMode: "small",
        toast: "選了 A。錯題數加 1。燈色仍只看掌握度，不會因為這一題改色。",
      };
    case "correct-answer":
      return {
        ...state,
        ansonMissed: false,
        qStage: "done",
        toast: "答對。課堂不冒煙，座位紅點熄滅。",
      };
    case "eye":
      return {
        ...state,
        eye: action.kind,
        qStage: "steps",
        stepPage: 0,
        stepSeconds: 15,
        stepRunning: true,
        eyeWeight: action.kind === "hit" ? 80 : 65,
        hint: action.kind === "hit" ? 1 : 2,
        highlight: "socratic",
        toast:
          action.kind === "hit"
            ? "題眼正確。80% 權重已寫進掌握度公式，15 秒分步卡開始。"
            : "題眼未中。權重降至 65%，並已寫進掌握度公式。",
      };
    case "submit-steps":
      return {
        ...state,
        capsules: true,
        qStage: "done",
        toast: "已解鎖 3 顆戰術發問膠囊。初練封頂 84% 淺綠，等待 48 小時驗證。",
      };
    case "note": {
      const text = action.text ?? (state.subject === "Maths" ? "SM02.2 · 相異實根要寫 Δ > 0" : "JPWM07.2 · 水入空氣 · 遠離法線");
      const card = makeNote(state, text);
      if (state.notes.some((note) => sameNote(note, card))) return state;
      return { ...state, notes: [...state.notes, card], capsules: true, toast: "1 秒已存入這位學生、這一科的閃卡庫。" };
    }
    case "twin":
      if (!action.ok) {
        const twinWrong = state.twinWrong + 1;
        return {
          ...state,
          twinWrong,
          speedQueue: twinWrong >= 2,
          toast:
            twinWrong >= 2
              ? "雙胞胎再錯。明早第一格與 KOC 工單都已改成這題。"
              : "雙胞胎未過。維持淺綠封頂，不會直接跌回紅燈。",
        };
      }
      return {
        ...state,
        twinCorrect: true,
        ansonMissed: false,
        burst: state.burst + 1,
        highlight: "hero-score",
        toast: "48 小時驗證通過。84% 淺綠衝上 91% 深綠，座位紅點熄滅，並蓋上「平時免做」。",
      };
    case "flash":
      if (!action.ok) return { ...state, flash: "locked", flashLeft: 3, toast: "選錯。閃卡鎖定 3 秒，避免連點蒙答。" };
      return { ...state, flash: "flipped", toast: "0.5 秒翻卡。關鍵字已回到正面。" };
    case "flash-unlock":
      return { ...state, flash: "idle", flashLeft: 0 };
    case "lq": {
      const lqSteps = state.lqSteps.map((on, i) => (i === action.index ? !on : on));
      return { ...state, lqSteps };
    }
    case "claim": {
      if (state.lqClaimed) return state;
      if (action.mode === "blank") {
        return { ...state, toast: "交白卷不能勾「全錯」領幣。須先達到 50% 步驟分。" };
      }
      const got = state.lqSteps.slice(0, 3).filter(Boolean).length;
      if (got < 2) return { ...state, toast: `目前只自評 ${got}/3 步，未過一半步驟分，不能領取 +2 StarCoins。` };
      return {
        ...state,
        lqClaimed: true,
        starCoins: state.starCoins + 2,
        coins: { ...state.coins, anson: (state.coins.anson ?? state.starCoins) + 2 },
        toast: "誠信自評通過。+2 StarCoins。這枚學習幣不能換成 EduToken。",
      };
    }
    case "pin":
      return { ...state, pin: action.value.replace(/\D/g, "").slice(0, 4), pinError: false };
    case "unlock":
      if (state.pin === HERO.parentPin) {
        return { ...state, unlocked: true, pinError: false, highlight: "parent-report", toast: "家長端已解鎖。這是雙週戰報，不是成績單牆。" };
      }
      return { ...state, pinError: true, toast: "尾碼不對。示範請輸入 8821。" };
    case "hotkey": {
      const hotkeys = [...state.hotkeys, action.key].slice(-4);
      const hasR = hotkeys.includes("2");
      const hasE = hotkeys.includes("3");
      const maths = state.subject === "Maths";
      const ebook = isEbookPoint(state.examCode);
      const scheduled = hasR && hasE;
      const jump = action.key === "1" ? 8 : action.key === "2" ? 5 : 12;
      return {
        ...state,
        hotkeys,
        ...(ebook
          ? {
              ebookOpen: true,
              ebookShown: Math.max(state.ebookShown, jump),
              ebookBreak: jump,
              ...(!state.ebookOpen ? { split: true, phone: "student" as const, highlight: "student-ebook" } : {}),
            }
          : {}),
        ...(scheduled
          ? {
              studentCard: lqTwinCard(state.subject, state.examCode),
              split: true,
              phone: "student" as const,
              highlight: "student-card",
            }
          : {}),
        toast: scheduled
          ? ebook
            ? "2+3 已排程：明晚 90 秒只補菱形 Step 8 的 1M，下週才交完整手寫 LQ。輔助標示 MA3 / MA2。"
            : maths
              ? "2+3 已排程：明晚 90 秒只補 Step 2 的 1M，下週才交完整手寫 LQ。數學科附 MA3 / MA2。"
              : "2+3 已排程：明晚 90 秒只補斷點 1M，下週才交完整手寫 LQ。物理科只顯示 C / R / E。"
          : ebook
            ? action.key === "1"
              ? "C 概念：定位 Step 8，∠DFC = ∠DFE，[property of rhombus] 未寫。輔助：MA1 概念理解 / MA5 幾何處理。"
              : action.key === "2"
                ? "R 審題：∠BAC = 42° 未代入 2∠ACB。輔助：MA3 圖文轉化。"
                : "E 執行：34.5° 有答案，但漏寫 [property of rhombus] 或角度單位。輔助：MA2 代數運算。"
            : `已記錄熱鍵 ${action.key}。`,
      };
    }
    case "audit":
      return { ...state, audit: { ...state.audit, [action.key]: action.value } };
    case "pass": {
      const result = approveKocPass({
        metal: state.audit.metal,
        wood: state.audit.wood,
        fire: state.audit.fire,
        video: state.video,
        promoted: state.promoted,
        royalty: state.royalty,
        eduToken: state.eduToken,
      });
      if (!result.ok && result.reason === "review") {
        return { ...state, toast: "三軸未過 60。這次是 Review，退回 KOC 重錄，不蓋印章。" };
      }
      if (!result.ok && result.reason === "no-video") {
        return { ...state, toast: "KOC 尚未上傳本月 Topic 錄影。版稅與晉升都尚未結算。" };
      }
      if (!result.ok) {
        return { ...state, toast: `已經 Pass。督導版稅維持 ${state.royalty.toFixed(1)} EduToken，不會再加。` };
      }
      return {
        ...state,
        video: result.video,
        promoted: result.promoted,
        royalty: result.royalty,
        eduToken: result.eduToken,
        toast: `Pass。督導版稅 ${state.royalty.toFixed(1)} → ${result.royalty.toFixed(1)} EduToken，Oscar 晉升 KOC Leader。再按不會加幣。`,
      };
    }
    case "mask-accept": {
      if (state.maskAccepted) return { ...state, toast: "這份母卷已經採納過，不會重複發幣。" };
      const warn = state.mask < 10 || state.mask > 16;
      return {
        ...state,
        maskAccepted: true,
        starCoins: state.starCoins + 15,
        eduToken: state.eduToken + 3,
        bonusSeats: ["s2", "s3"],
        coins: {
          ...state.coins,
          anson: (state.coins.anson ?? state.starCoins) + 15,
          s2: (state.coins.s2 ?? 0) + 5,
          s3: (state.coins.s3 ?? 0) + 5,
        },
        toast: warn
          ? "遮罩偏離 12% 預警帶，已標記複核。陳*軒 +15，李*晴與黃*諾各 +5，KOC +3 EduToken。"
          : "1 秒採納。首發 +15，同堂兩位同學各 +5 StarCoins，KOC +3 EduToken。",
      };
    }
    case "upload": {
      if (!state.tla.t || !state.tla.l || !state.tla.a) {
        return { ...state, toast: "請先勾完 Teach、Learn、Apply 三段，再送審。" };
      }
      return { ...state, video: "uploaded", highlight: "leader", toast: "6 分鐘錄影已送往右屏。等待 LDC 金、木、火審核。" };
    }
    case "diag": {
      const next = state.diagStep + 1;
      if (next >= 3) return { ...state, diagStep: 3, badge: true, toast: "3 題完成。跨科邏輯思維亮點徽章已點亮。" };
      return { ...state, diagStep: next };
    }
    case "fresh":
      if (!action.ok) return { ...state, toast: "保鮮題未過。雙重確認緩衝未開啟，雷達暫不改寫。" };
      return { ...state, freshness: "buffer", toast: "第一重通過。請再按一次雙重確認，先緩衝、後寫入。" };
    case "fresh-confirm":
      return { ...state, freshness: "locked", toast: "雙重確認完成。考前掌握度維持深綠，沒有單題改寫雷達。" };
    case "sprint-old":
      return { ...state, toast: "今日舊題額度最多 2 題。第 3 題舊題被擋住，空位留給焦點新題。" };
    case "enter": {
      const role = action.role;
      return {
        ...state,
        entered: true,
        role,
        phone: role === "parent" ? "parent" : "student",
        desk: role === "ldc" ? "ldc" : role === "csm" ? "csm" : "koc",
        duo: false,
        split: false,
        barCollapsed: false,
      };
    }
    case "focus": {
      const aligned = swapStudentDraft(state, action.id);
      const name = SEATS.find((seat) => seat.id === action.id)?.name ?? "這位同學";
      return {
        ...aligned,
        phone: "student",
        studentTab: "radar",
        phonePulse: state.phonePulse + 1,
        split: true,
        instructionOpen: action.id === "anson" ? true : state.instructionOpen,
        highlight: action.id === "anson" ? "seat-anson" : "focus-profile",
        toast: `左屏已切到${name}的個人雷達。`,
      };
    }
    case "tour-start":
      return {
        ...reducer({ ...state, autoTour: true, tourLeft: 40, entered: true }, { type: "act", act: 1, keepTour: true }),
        autoTour: true,
        tourLeft: 40,
        tourNotice: null,
      };
    case "tour-stop": {
      const spec = state.act ? ACTS[state.act] : null;
      const where = spec ? `已停止巡遊，停在${spec.title}。` : "已停止巡遊。";
      return {
        ...state,
        autoTour: false,
        toast: where,
        tourNotice: spec ? `${spec.title}。${spec.body}` : "巡遊已停止。",
        callout: spec ?? state.callout,
      };
    }
    case "tour-tick": {
      if (!state.autoTour) return state;
      if (state.tourLeft > 1) return { ...state, tourLeft: state.tourLeft - 1 };
      const next = (((state.act ?? 1) % 5) + 1) as Act;
      return { ...reducer(state, { type: "act", act: next, keepTour: true }), autoTour: true, tourLeft: 40 };
    }
    case "ut-submit":
      return {
        ...state,
        studentUt: action.score,
        toast: `15 秒微表單已送出：校內 UT ${action.score} 分。家長端可以 1 秒確認。`,
      };
    case "ut-adjust": {
      if (state.studentUt == null || !state.utConfirmed) {
        return { ...state, toast: "要先由學生申報、家長確認，才能做臨場調校。" };
      }
      const gap = state.predictedLive - state.studentUt;
      if (gap < 15) return { ...state, toast: "差距未到 15 分，預測分維持不變。" };
      return {
        ...state,
        utAdjusted: true,
        predictedLive: state.studentUt,
        toast: `預測由 ${HERO.predicted} 調校為 ${state.studentUt}。差額記入臨場發揮，不判退步。`,
      };
    }
    case "book-ut":
      return { ...state, utClass: true, toast: "已排入 KOC Leader 的校本 UT 加操堂。" };
    case "silence":
      return { ...state, silence: !state.silence, toast: state.silence ? "考前靜默已解除。" : "考前 10 日靜默已開啟。新工單會被擋下。" };
    case "new-ticket": {
      if (state.silence || state.phase === "preexam") {
        return { ...state, toast: "考前 10 日靜默中。這張新工單沒有建立。" };
      }
      const jasonCount = state.tickets.filter((ticket) => ticket.owner === "jason").length;
      const owner = jasonCount >= 5 ? "chloe" : "jason";
      return {
        ...state,
        tickets: [...state.tickets, { id: `t${state.tickets.length + 1}`, title: "新觸發 · 攻堅支援 [重點]", tier: "priority", owner }],
        toast: owner === "chloe" ? "Oscar 已滿 5 單。這張重點工單直接飛到 Chloe。" : "新工單已派給 Oscar。",
      };
    }
    case "overflow":
      return {
        ...state,
        overflow: true,
        tickets: state.tickets.map((ticket) => {
          if (ticket.tier === "priority") return { ...ticket, owner: "chloe" as const };
          if (ticket.tier === "convert") return { ...ticket, owner: "csm" as const };
          return ticket;
        }),
        toast: "重點工單已飛到 Chloe。常規工單仍留在 Oscar。",
      };
    case "ice": {
      const next = Math.min(state.iceStep + 1, 3);
      const heat = [
        { refr: 45, elec: 45 },
        { refr: 62, elec: 45 },
        { refr: 62, elec: 58 },
        { refr: 71, elec: 58 },
      ][next];
      return {
        ...state,
        iceStep: next,
        iceHeat: heat,
        batchLogged: next === 3,
        toast: next === 3 ? "3 題破冰完成。全班熱力已回寫，可開始分流。" : `第 ${next} 題已入帳。`,
      };
    }
    case "tla":
      return { ...state, tla: { ...state.tla, [action.key]: !state.tla[action.key] } };
    case "payout":
      if (action.over) {
        return { ...state, poolFrozen: true, poolRows: null, poolNote: "若再發 1.5%，合計 3.1%。超過 2.5%，本筆凍結，沒有人收到錢。" };
      }
      return { ...state, poolFrozen: false, poolRows: PAYOUT_OK, poolNote: "已發放 0.7%。合計 2.3%，安全閥通過。" };
    case "invite":
      return {
        ...state,
        voucher: true,
        split: true,
        duo: false,
        phone: "parent",
        desk: "csm",
        role: "csm",
        waOpened: false,
        toast: "沙盤券已送到家長 WhatsApp。左屏點開即可看見。",
      };
    case "wa-open":
      if (state.linkSpent) return { ...state, toast: "這條一次性連結已經用過，不能再轉傳打開。" };
      return { ...state, waOpened: true, linkSpent: state.linkArmed ? true : state.linkSpent, timeoutLocked: false };
    case "arm-link":
      return { ...state, linkArmed: true, linkSpent: false, toast: "已變成一次性連結。打開一次後就不能再轉傳。" };
    case "timeout":
      return { ...state, timeoutLocked: true, unlocked: false, waOpened: false, pin: "", toast: "連結已逾時上鎖。分數沒有留在這部手機。" };
    case "mentor":
      if (!state.promoted) return { ...state, toast: "晉升 KOC Leader 之後，才可以帶教新人領 +10。" };
      if (state.mentorClaimed) return { ...state, toast: "這次帶教獎勵已經入帳。" };
      return { ...state, mentorClaimed: true, eduToken: state.eduToken + 10, toast: "帶教新人 +10 EduToken。這筆不進入學生的 StarCoins。" };
    case "coteach":
      if (!state.promoted) return { ...state, toast: "要先通過 LDC 審核，才能接 Co-Teaching 副講。" };
      return { ...state, coTeach: true, toast: "已接上常規班 Co-Teaching 副講。" };
    case "subject": {
      const next = switchSubject(state, action.subject, { mode: "manual" });
      const switched = next === state ? state : {
        ...next,
        hotkeys: [],
        studentCard: null,
        ebookOpen: false,
        ebookShown: 0,
        ebookBreak: null,
        ebookRun: 0,
        ebookTab: "rhombus" as const,
        kocEbook: false,
        toast: action.subject === "Phy"
          ? "已切換物理科。左右屏同步為光的折射與靜電學，不顯示 MA。"
          : "已切換數學科。今日激活 SM02 一元二次方程與 JM29 四邊形 e-Book。",
      };
      if (switched.parentBrief && switched !== state) {
        return { ...switched, parentBrief: parentBriefFor(switched.subject, switched.examCode, switched.hotkeys, switched.focusId) };
      }
      return switched;
    }
    case "draw-review": {
      if (action.status === "done" && state.drawReview !== "pending") return state;
      if (action.status === "pending" && state.drawReview === "done") return state;
      const labTrace = reviewCopy(action.status);
      return { ...state, drawReview: action.status, labTrace, toast: labTrace };
    }
    case "ebook-nav": {
      const max = JM29_LINES.length;
      const shown =
        action.dir === "next" ? Math.min(max, state.ebookShown + 1)
        : action.dir === "prev" ? Math.max(0, state.ebookShown - 1)
        : action.dir === "all" ? max
        : 0;
      return {
        ...state,
        ebookOpen: true,
        ebookShown: shown,
        ebookBreak: action.dir === "reset" ? null : state.ebookBreak,
        ...(!state.ebookOpen ? { split: true, phone: "student" as const, highlight: "student-ebook" } : {}),
      };
    }
    case "ebook-break":
      return {
        ...state,
        ebookOpen: true,
        ebookBreak: action.line,
        ebookShown: Math.max(state.ebookShown, action.line),
        toast: `已把第 ${action.line} 行標成這位同學的 LQ 失分斷點。`,
      };
    case "ebook-sync":
      return {
        ...state,
        kocEbook: true,
        split: true,
        highlight: "mask",
        toast: "KOC 助教 iPad 已載入 JM29c Q5 (0/12 步 + 定理理由標籤)。",
      };
    case "dispatch-card":
      return {
        ...state,
        studentCard: action.card,
        split: true,
        phone: "student",
        studentTab: "quest",
        phonePulse: state.phonePulse + 1,
        highlight: "student-card",
        toast: `🔔 已切換至破關艙，並載入：${action.card.title}`,
      };
    case "koc-alert":
      return {
        ...state,
        kocAlert: true,
        toast: "已將 4 位 <50% 微支線學生標記為 KOC 座位表高優紅點。",
      };
    case "parent-brief": {
      const brief = parentBriefFor(state.subject, state.examCode, state.hotkeys, state.focusId);
      return {
        ...state,
        split: true,
        phone: "parent",
        waOpened: true,
        unlocked: true,
        parentBrief: brief,
        toast: brief.ink ? "家長手機已打開筆跡快照戰報。" : "家長手機已打開 LQ 步驟提分戰報。",
      };
    }
    case "csm-handoff": {
      const name = SEATS.find((seat) => seat.id === state.focusId)?.name ?? "陳*軒";
      const title = `高危跟進 [臨場調校] · ${name} · 連續紅燈`;
      if (state.tickets.some((ticket) => ticket.title === title)) {
        return { ...state, toast: "這張 CSM 工單已經在名單上。" };
      }
      return {
        ...state,
        tickets: [...state.tickets, { id: `hazard-${state.tickets.length + 1}`, title, tier: "priority", owner: "csm" }],
        toast: `已把 ${name} 轉交 CSM 臨場調校工單。`,
      };
    }
    default:
      return state;
  }
}

interface DemoValue extends State {
  top2: string[];
  heroScore: number;
  heroLight: Light;
  dispatch: (action: Action) => void;
  setRole: (role: Role) => void;
  setSplit: (split: boolean) => void;
  runAct: (act: Act) => void;
  setPhase: (phase: Phase) => void;
  dismissCallout: () => void;
  topicScore: (id: string) => number | null;
  exempt: boolean;
}

const DemoContext = createContext<DemoValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(() => dispatch({ type: "patch", patch: { toast: null } }), 3200);
    return () => window.clearTimeout(timer);
  }, [state.toast]);

  useEffect(() => {
    if (state.flash !== "locked") return;
    if (state.flashLeft <= 0) {
      dispatch({ type: "flash-unlock" });
      return;
    }
    const timer = window.setTimeout(() => dispatch({ type: "patch", patch: { flashLeft: state.flashLeft - 1 } }), 1000);
    return () => window.clearTimeout(timer);
  }, [state.flash, state.flashLeft]);

  useEffect(() => {
    if (!state.highlight) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const node = document.getElementById(state.highlight);
    node?.scrollIntoView({ behavior, block: "center" });
  }, [state.highlight, state.role, state.split, state.phase, state.unlocked, state.phone, state.desk, state.duo, state.focusId, state.waOpened]);

  useEffect(() => {
    if (!state.autoTour) return;
    const timer = window.setTimeout(() => dispatch({ type: "tour-tick" }), 1000);
    return () => window.clearTimeout(timer);
  }, [state.autoTour, state.tourLeft, state.act]);

  useEffect(() => {
    if (!state.stepRunning) return;
    if (state.stepSeconds <= 0) {
      dispatch({ type: "patch", patch: { stepRunning: false } });
      return;
    }
    const timer = window.setTimeout(() => dispatch({ type: "patch", patch: { stepSeconds: state.stepSeconds - 1 } }), 1000);
    return () => window.clearTimeout(timer);
  }, [state.stepRunning, state.stepSeconds]);

  const top2 = useMemo(() => {
    const owned = new Set(packOf(state.subject).topics.map((topic) => topic.code));
    const inSubject = state.cart.filter((code) => owned.has(code));
    const hot = activeTopics(state.subject)
      .map((topic) => topic.code)
      .filter((code) => inSubject.includes(code));
    return (hot.length ? hot : inSubject).slice(0, 2);
  }, [state.cart, state.subject]);

  const heroScore = useMemo(() => {
    if (state.phase === "decay") return 76;
    if (state.phase === "preexam") return state.freshness === "locked" || state.twinCorrect ? 91 : 84;
    if (state.phase === "h48") return state.twinCorrect ? 91 : 84;
    return 84;
  }, [state.phase, state.twinCorrect, state.freshness]);

  const topicScore = useCallback(
    (id: string) => {
      if (id === "phy-refr") return heroScore;
      return TOPICS.find((t) => t.id === id)?.score ?? null;
    },
    [heroScore],
  );

  const value: DemoValue = {
    ...state,
    top2,
    heroScore,
    heroLight: lightOf(heroScore),
    dispatch,
    exempt: state.twinCorrect && heroScore >= 85 && state.phase !== "decay",
    setRole: (role) =>
      dispatch({
        type: "patch",
        patch: {
          role,
          entered: true,
          highlight: null,
          duo: false,
          autoTour: false,
          phone: role === "parent" ? "parent" : "student",
          desk: role === "ldc" ? "ldc" : role === "csm" ? "csm" : "koc",
        },
      }),
    setSplit: (split) => dispatch({ type: "patch", patch: { split } }),
    runAct: (act) => dispatch({ type: "act", act }),
    setPhase: (phase) => dispatch({ type: "phase", phase }),
    dismissCallout: () => dispatch({ type: "patch", patch: { callout: null } }),
    topicScore,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo 必須在 DemoProvider 內使用");
  return ctx;
}

export { ACTS };
