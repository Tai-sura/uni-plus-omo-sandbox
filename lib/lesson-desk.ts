/**
 * KOC 本堂進度。三格只記學校範圍、概念和練習。
 * 學期建議與本堂分開；補課和分組寫回同一格。不改掌握度燈色。
 */
import { leadExam, packOf, type SubjectKey } from "./curriculum";

export type TeachMode = "concept" | "exercise" | "both";
export type LessonKind = "class" | "extra";

export interface LessonGroup {
  tutor: string;
  topicCode: string;
  mode: TeachMode;
  students: string[];
}

export interface LessonRecord {
  id: string;
  subject: SubjectKey;
  kind: LessonKind;
  groups: LessonGroup[];
  lines: string[];
}

export interface CellMark {
  concept: boolean;
  exercise: boolean;
}

export interface LessonDesk {
  suggestion: Record<SubjectKey, string>;
  cells: Record<string, CellMark>;
  records: LessonRecord[];
}

/** 這一科刻意留在學校課題表以外，用來示範「教了但不在範圍」。 */
const OFF_LIST: Record<SubjectKey, string[]> = {
  Maths: ["SM03.1"],
  Phy: ["SPEM01.1"],
};

export const LESSON_TUTOR = "Oscar 黃朗";
export const LESSON_TUTOR_B = "Chloe 李晴";

export function freshDesk(): LessonDesk {
  return {
    suggestion: { Maths: leadExam("Maths").code, Phy: leadExam("Phy").code },
    cells: {},
    records: [],
  };
}

export function offListCode(subject: SubjectKey) {
  return OFF_LIST[subject][0];
}

function subtopicName(subject: SubjectKey, code: string) {
  for (const topic of packOf(subject).topics) {
    const sub = topic.subtopics.find((item) => item.code === code);
    if (sub) return sub.name;
  }
  return null;
}

export function topicLabel(subject: SubjectKey, code: string) {
  const name = subtopicName(subject, code);
  return name ? `${code} ${name}` : code;
}

export function onSchoolList(subject: SubjectKey, code: string) {
  return subtopicName(subject, code) != null && !OFF_LIST[subject].includes(code);
}

export function cellKey(subject: SubjectKey, studentId: string, topicCode: string) {
  return `${subject}|${studentId}|${topicCode}`;
}

export function cellOf(desk: LessonDesk, subject: SubjectKey, studentId: string, topicCode: string): CellMark {
  return desk.cells[cellKey(subject, studentId, topicCode)] ?? { concept: false, exercise: false };
}

/** 教過，而且這題不在學校課題表。未教的空格不算。 */
export function offListTaught(desk: LessonDesk, subject: SubjectKey, studentId: string, topicCode: string) {
  const cell = cellOf(desk, subject, studentId, topicCode);
  if (!cell.concept && !cell.exercise) return false;
  return !onSchoolList(subject, topicCode);
}

export function modeLabel(mode: TeachMode) {
  if (mode === "concept") return "概念";
  if (mode === "exercise") return "練習";
  return "概念 + 練習";
}

export function lessonLine(subject: SubjectKey, group: LessonGroup, kind: LessonKind) {
  const head = kind === "extra" ? "補課：" : "";
  return `[${group.tutor}] ${head}${topicLabel(subject, group.topicCode)}（${modeLabel(group.mode)}）· 模擬，尚未送出公司表`;
}

export function saveLesson(
  desk: LessonDesk,
  input: { subject: SubjectKey; kind: LessonKind; groups: LessonGroup[] },
): { desk: LessonDesk; lines: string[]; error?: string } {
  if (!input.groups.length || input.groups.some((group) => !group.topicCode || group.students.length === 0)) {
    return { desk, lines: [], error: "請先選課題和學生。分組的每一行都要有人。" };
  }
  const cells = { ...desk.cells };
  for (const group of input.groups) {
    for (const studentId of group.students) {
      const key = cellKey(input.subject, studentId, group.topicCode);
      const prev = cells[key] ?? { concept: false, exercise: false };
      cells[key] = {
        concept: prev.concept || group.mode !== "exercise",
        exercise: prev.exercise || group.mode !== "concept",
      };
    }
  }
  const lines = input.groups.map((group) => lessonLine(input.subject, group, input.kind));
  const record: LessonRecord = {
    id: `L${desk.records.length + 1}`,
    subject: input.subject,
    kind: input.kind,
    groups: input.groups.map((group) => ({ ...group, students: [...group.students] })),
    lines,
  };
  return {
    desk: {
      suggestion: desk.suggestion,
      cells,
      records: [...desk.records, record],
    },
    lines,
  };
}

export function subjectTopics(subject: SubjectKey) {
  return packOf(subject).topics.flatMap((topic) => topic.subtopics.map((sub) => ({ code: sub.code, name: sub.name })));
}

export function taughtRows(desk: LessonDesk, subject: SubjectKey) {
  const rows: { studentId: string; topicCode: string; cell: CellMark; offList: boolean }[] = [];
  for (const [key, cell] of Object.entries(desk.cells)) {
    if (!cell.concept && !cell.exercise) continue;
    const [rowSubject, studentId, topicCode] = key.split("|");
    if (rowSubject !== subject || !studentId || !topicCode) continue;
    rows.push({ studentId, topicCode, cell, offList: !onSchoolList(subject, topicCode) });
  }
  return rows;
}
