import { PACKS, type SubjectKey } from "./curriculum";
import { SEATS } from "./mock-data";

/**
 * One source of truth for "what score does this seat have right now".
 *
 * KOC seat map, KOC dossier, the student phone, LDC bands and the parent
 * report all read from here so clicking a seat can never show 47% on one
 * screen and 52–86% on the other.
 *
 * The headline number is the mastery of the topic currently being taught
 * (the hero topic). For Anson in Physics that number is phase-driven
 * (84 → 91 → 76); every other seat uses its seat mastery.
 */

export interface FocusTopic {
  code: string;
  name: string;
  score: number;
  hero: boolean;
}

function clamp(value: number, lo = 5, hi = 97) {
  return Math.min(hi, Math.max(lo, Math.round(value)));
}

export function heroTopicCode(subject: SubjectKey, examCode?: string | null) {
  if (subject === "Maths") return examCode?.startsWith("JM29") ? "JM29" : "SM02";
  return "JPWM07";
}

function seatOf(seatId: string) {
  return SEATS.find((seat) => seat.id === seatId) ?? SEATS[0];
}

function heroTopicOf(subject: SubjectKey, examCode?: string | null) {
  const pack = PACKS[subject];
  return pack.topics.find((topic) => topic.code === heroTopicCode(subject, examCode)) ?? pack.topics[0];
}

/** Headline mastery for one seat, in the subject currently on screen. */
export function seatFocusScore(
  subject: SubjectKey,
  seatId: string,
  heroScore: number,
  examCode?: string | null,
) {
  const seat = seatOf(seatId);
  if (seat.id !== "anson") return clamp(seat.mastery);
  const hero = heroTopicOf(subject, examCode);
  if (subject === "Phy" && hero.code === "JPWM07") return clamp(heroScore);
  return clamp(hero.personal ?? hero.classScore ?? seat.mastery);
}

/** Per-topic mastery for one seat; the hero topic always equals the headline. */
export function seatFocusTopics(
  subject: SubjectKey,
  seatId: string,
  heroScore: number,
  examCode?: string | null,
): FocusTopic[] {
  const seat = seatOf(seatId);
  const pack = PACKS[subject];
  const hero = heroTopicOf(subject, examCode);
  const headline = seatFocusScore(subject, seatId, heroScore, examCode);
  const heroPersonal = hero.personal ?? hero.classScore ?? headline;

  return pack.topics.map((topic) => {
    const curated = topic.personal ?? topic.classScore ?? 60;
    const isHero = topic.code === hero.code;
    if (seat.id === "anson") {
      const score = isHero ? headline : curated;
      return { code: topic.code, name: topic.name_zh, score: clamp(score), hero: isHero };
    }
    // Other seats share Anson's class-level shape, shifted to their own level.
    const score = isHero ? headline : headline + (curated - heroPersonal) * 0.55;
    return { code: topic.code, name: topic.name_zh, score: clamp(score), hero: isHero };
  });
}

/** Exam-point mastery (one subtopic) for one seat — never above its topic. */
export function seatPointScore(
  subject: SubjectKey,
  seatId: string,
  heroScore: number,
  examCode?: string | null,
) {
  const pack = PACKS[subject];
  const topic = heroTopicOf(subject, examCode);
  const point =
    topic.subtopics.find((sub) => sub.code === examCode) ??
    topic.subtopics[0];
  const headline = seatFocusScore(subject, seatId, heroScore, examCode);
  const seat = seatOf(seatId);
  if (seat.id === "anson" && point.score != null) return clamp(point.score);
  const ratio = point.score != null && topic.personal ? point.score / topic.personal : 0.8;
  return clamp(headline * Math.min(1, ratio));
}

/** Chapter axis for the radar: average of that chapter's per-topic scores. */
export function seatChapterScore(
  subject: SubjectKey,
  seatId: string,
  heroScore: number,
  examCode: string | null | undefined,
  chapterCode: string,
) {
  const pack = PACKS[subject];
  const topics = seatFocusTopics(subject, seatId, heroScore, examCode).filter((topic) => {
    const found = pack.topics.find((item) => item.code === topic.code);
    return found?.chapter === chapterCode;
  });
  if (topics.length) {
    return clamp(topics.reduce((sum, topic) => sum + topic.score, 0) / topics.length);
  }
  const chapter = pack.chapters.find((item) => item.code === chapterCode);
  const headline = seatFocusScore(subject, seatId, heroScore, examCode);
  return clamp(headline + ((chapter?.score ?? 70) - 70) * 0.4);
}

export function focusTopic(subject: SubjectKey, seatId: string, heroScore: number, examCode?: string | null) {
  return seatFocusTopics(subject, seatId, heroScore, examCode).find((topic) => topic.hero)!;
}
