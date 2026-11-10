"use client";

import { useState } from "react";
import type { SubjectKey } from "@/lib/curriculum";
import { SEATS } from "@/lib/mock-data";
import {
  LESSON_TUTOR,
  LESSON_TUTOR_B,
  cellOf,
  modeLabel,
  offListCode,
  onSchoolList,
  subjectTopics,
  taughtRows,
  topicLabel,
  type LessonKind,
  type TeachMode,
} from "@/lib/lesson-desk";
import { useDemo } from "@/lib/demo-context";
import { Card } from "./ui";

const ROSTER = SEATS.slice(0, 8);
const MODES: TeachMode[] = ["concept", "exercise", "both"];

export function LessonDeskCard() {
  const demo = useDemo();
  return <LessonDraft key={demo.subject} subject={demo.subject} />;
}

function LessonDraft({ subject }: { subject: SubjectKey }) {
  const demo = useDemo();
  const suggestion = demo.lessonDesk.suggestion[subject];
  const outside = offListCode(subject);
  const [kind, setKind] = useState<LessonKind>("class");
  const [split, setSplit] = useState(false);
  const [topicA, setTopicA] = useState(suggestion);
  const [modeA, setModeA] = useState<TeachMode>("both");
  const [studentsA, setStudentsA] = useState(["anson", "s3", "s6"]);
  const [topicB, setTopicB] = useState(outside);
  const [modeB, setModeB] = useState<TeachMode>("both");
  const [studentsB, setStudentsB] = useState(["s4", "s8"]);

  const topics = subjectTopics(subject);
  const latest = [...demo.lessonDesk.records].reverse().find((record) => record.subject === subject);
  const rows = taughtRows(demo.lessonDesk, subject);
  const topicCodes = [...new Set(rows.map((row) => row.topicCode))];

  const save = () => {
    demo.dispatch({
      type: "lesson-save",
      kind,
      groups: [
        { tutor: LESSON_TUTOR, topicCode: topicA, mode: modeA, students: studentsA },
        ...(split ? [{ tutor: LESSON_TUTOR_B, topicCode: topicB, mode: modeB, students: studentsB }] : []),
      ],
    });
  };

  const copyLine = async (line: string) => {
    try {
      await navigator.clipboard.writeText(line);
    } catch {
      /* 沙盒沒有剪貼簿權限時，仍然只顯示模擬提示。 */
    }
    demo.dispatch({ type: "toast", text: "已複製課堂句。這是模擬，尚未送出公司表或團隊表。" });
  };

  return (
    <Card id="lesson-desk" kicker="本堂進度" title="學校範圍、概念、練習分開記">
      <p className="text-[12px] leading-5 text-[#c5d0de]">
        學期建議：{topicLabel(subject, suggestion)}。Save 只寫本堂或補課，不改這句，也不改掌握度燈色。
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Toggle on={kind === "class"} label="正課" click={() => setKind("class")} />
        <Toggle on={kind === "extra"} label="補課" click={() => setKind("extra")} />
        <Toggle on={!split} label="不分組" click={() => setSplit(false)} />
        <Toggle on={split} label="一堂分組" click={() => setSplit(true)} />
      </div>

      <GroupEditor
        subject={subject}
        title={LESSON_TUTOR}
        topics={topics}
        topic={topicA}
        mode={modeA}
        students={studentsA}
        onTopic={setTopicA}
        onMode={setModeA}
        onStudents={setStudentsA}
      />
      {split ? (
        <GroupEditor
          subject={subject}
          title={LESSON_TUTOR_B}
          topics={topics}
          topic={topicB}
          mode={modeB}
          students={studentsB}
          onTopic={setTopicB}
          onMode={setModeB}
          onStudents={setStudentsB}
        />
      ) : null}

      <button className="mt-2 min-h-11 rounded-xl bg-[#e4c07a] px-3 py-2 text-sm font-bold text-[#1b1406]" onClick={save}>
        儲存本堂（模擬）
      </button>

      {latest ? (
        <div className="mt-3 space-y-2">
          {latest.lines.map((line) => (
            <div key={line} className="flex flex-wrap items-center gap-2 rounded-xl bg-black/25 p-2">
              <p className="min-w-0 flex-1 text-[12px] leading-5">{line}</p>
              <button className="min-h-11 rounded-lg bg-white/10 px-2 text-xs" onClick={() => copyLine(line)}>複製這句</button>
            </div>
          ))}
          <p className="text-[11px] text-[#93a4b8]">模擬紀錄。沒有送出公司表、團隊表或 EP。</p>
        </div>
      ) : (
        <p className="mt-2 text-[12px] text-[#93a4b8]">這一科還沒有本堂紀錄。儲存後才出現三格。</p>
      )}

      {topicCodes.length ? (
        <div className="mt-3 space-y-2">
          {topicCodes.map((code) => {
            const people = rows.filter((row) => row.topicCode === code);
            const school = onSchoolList(subject, code);
            return (
              <div key={code} className="rounded-xl bg-black/25 p-2">
                <p className="text-[12px] font-bold">{topicLabel(subject, code)}</p>
                <p className="text-[11px] text-[#93a4b8]">{school ? "學校有這題" : "不在學校課題表"}</p>
                <div className="mt-1 space-y-1">
                  {people.map((row) => {
                    const seat = SEATS.find((item) => item.id === row.studentId);
                    const mark = cellOf(demo.lessonDesk, subject, row.studentId, code);
                    return (
                      <div key={row.studentId} className="flex flex-wrap items-center gap-2 text-[12px]">
                        <span className="w-16">{seat?.name ?? row.studentId}</span>
                        <Cell on={school} label="學校" />
                        <Cell on={mark.concept} label="概念" />
                        <Cell on={mark.exercise} label="練習" />
                        {row.offList ? <span className="rounded-full border border-[#e4c07a] px-2 py-0.5 text-[10px] text-[#e4c07a]">不在學校課題表</span> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}

function GroupEditor({
  subject,
  title,
  topics,
  topic,
  mode,
  students,
  onTopic,
  onMode,
  onStudents,
}: {
  subject: SubjectKey;
  title: string;
  topics: { code: string; name: string }[];
  topic: string;
  mode: TeachMode;
  students: string[];
  onTopic: (code: string) => void;
  onMode: (mode: TeachMode) => void;
  onStudents: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    onStudents(students.includes(id) ? students.filter((item) => item !== id) : [...students, id]);
  };
  return (
    <div className="mt-2 rounded-xl bg-black/20 p-2">
      <p className="text-[12px] font-bold">{title}</p>
      <label className="mt-1 block text-[11px] text-[#93a4b8]">
        本堂課題
        <select className="mt-1 min-h-11 w-full rounded-lg bg-[#0c1726] px-2 text-sm text-white" value={topic} onChange={(event) => onTopic(event.target.value)}>
          {topics.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code} {item.name}{onSchoolList(subject, item.code) ? "" : " · 不在學校課題表"}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {MODES.map((item) => (
          <Toggle key={item} on={mode === item} label={modeLabel(item)} click={() => onMode(item)} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {ROSTER.map((seat) => (
          <button key={seat.id} className={`min-h-11 rounded-lg px-2 text-xs ${students.includes(seat.id) ? "bg-[#1d4e89]" : "bg-white/10"}`} onClick={() => toggle(seat.id)}>
            {seat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, label, click }: { on: boolean; label: string; click: () => void }) {
  return (
    <button className={`min-h-11 rounded-lg px-3 text-xs ${on ? "bg-[#1d4e89]" : "bg-white/10"}`} onClick={click}>
      {label}
    </button>
  );
}

function Cell({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] ${on ? "bg-[#1d4e89] text-white" : "bg-white/10 text-[#93a4b8]"}`}>
      {label}{on ? " · 有" : " · 無"}
    </span>
  );
}
