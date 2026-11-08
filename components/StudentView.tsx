"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useDemo } from "@/lib/demo-context";
import { CAPSULES, MA_MAP, QUESTIONS, SEATS, seatProfile } from "@/lib/mock-data";
import { RefractionInk, RhombusInk, StudentEbookCard, StudentEbookMirror } from "./EbookKit";
import { findSubtopic, lqPaper, packOf } from "@/lib/curriculum";
import { heroTopicCode, seatChapterScore, seatFocusScore, seatFocusTopics, seatPointScore } from "@/lib/student-profile";
import { noteLabel, topicNames, visibleNotes } from "@/lib/learning-context";
import { calcMastery, LIGHT_META, type HintLevel } from "@/lib/mastery";
import { Card, LightPill, ScoreBar } from "./ui";

export function StudentView() {
  const demo = useDemo();
  const pack = packOf(demo.subject);
  const focus = SEATS.find((seat) => seat.id === demo.focusId) ?? SEATS[0];
  const hereNotes = visibleNotes(demo.notes, { studentId: focus.id, subject: demo.subject, subtopicId: demo.examCode });
  const library = visibleNotes(demo.notes, { studentId: focus.id });
  const personal = seatFocusScore(demo.subject, focus.id, demo.heroScore, demo.examCode);
  const personalTopics = seatFocusTopics(demo.subject, focus.id, demo.heroScore, demo.examCode);
  const heroCode = heroTopicCode(demo.subject, demo.examCode);
  const lead = pack.topics.find((topic) => topic.code === heroCode) ?? pack.topics.find((topic) => topic.hot) ?? pack.topics[0];
  const formula = calcMastery(demo.mInit, demo.hint, demo.m48);

  const radar = useMemo(() => {
    return pack.chapters
      .filter((chapter) => chapter.score != null || demo.includeUntested)
      .map((chapter) => ({
        axis: chapter.code,
        klass: chapter.score ?? 0,
        mine: seatChapterScore(demo.subject, focus.id, demo.heroScore, demo.examCode, chapter.code),
      }));
  }, [pack, demo.includeUntested, demo.subject, demo.heroScore, demo.examCode, focus.id]);

  const tab = demo.studentTab;
  const utLabel = demo.phase === "preexam" ? "距校內 UT 10 日 · 保鮮" : demo.phase === "decay" ? "距校內 UT 22 日 · 已衰減" : "距校內 UT 22 日 · 常規";
  const peers = [
    ["anson", "陳*軒", "主線"],
    ["s10", "鄭*博", "微支線"],
    ["s4", "張*澄", "急救"],
  ] as const;

  return (
    <div className="flex min-h-full flex-col">
    <div className="space-y-3">
      <header>
        <p className="text-[11px] text-[#e4c07a]">🎯 先看雷達凹角，再按黃金按鈕進入破關艙。</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {peers.map(([id, name, kind]) => {
            const seat = SEATS.find((item) => item.id === id)!;
            const score = seatFocusScore(demo.subject, seat.id, demo.heroScore, demo.examCode);
            return (
              <button key={id} className={`rounded-full px-2 py-1 text-[10px] ${demo.focusId === id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "focus", id })}>
                {name} {kind} {score}%
              </button>
            );
          })}
          {peers.some(([id]) => id === focus.id) ? null : (
            <button className="rounded-full bg-[#e4c07a] px-2 py-1 text-[10px] font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "focus", id: focus.id })}>
              {focus.name} 座位 {personal}%
            </button>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold">{focus.name} · {focus.en}</h2>
            <p className="text-[11px] text-[#93a4b8]">⏳ {utLabel} · 錯 {focus.id === "anson" ? demo.ansonWrongs : focus.wrongs} 題</p>
            <p className="text-[11px]">
              🎯 個人掌握度 {personal}% · {lead.code} {lead.name_zh}
              {focus.id === "anson" ? ` · 🪙 StarCoins ${demo.starCoins}` : " · 其他課題為示範估算"}
            </p>
          </div>
          <LightPill score={personal} />
        </div>
      </header>

      <div className={tab === "quest" ? "space-y-3" : "hidden"}>
      <StudentEbookMirror />
      <StudentLqBoard />

      <div id="hero-score" className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e2433] p-3">
        <Burst token={demo.burst} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#93a4b8]">Level 2 · {lead.code} · {lead.shorthand}</p>
            <p className="font-bold">{lead.name_zh}</p>
          </div>
          <LightPill score={personal} />
        </div>
        <div className="mt-2">
          <ScoreBar score={personal} />
        </div>
        <p className="mt-2 text-[11px] text-[#e4c07a]">長題目步驟分佔校內卷 70% · MC 概念快測 30%</p>
        <p className="mt-2 text-[11px] leading-5 text-[#c5d0de]">
          {demo.phase === "day1" && focus.id === "anson" && demo.subject === "Phy" && `Day 1 初練已封頂 ${personal}% 淺綠。原始分先不寫進深綠，等 48 小時雙胞胎。`}
          {demo.phase === "day1" && focus.id === "anson" && demo.subject === "Maths" && `Day 1 先補 ${lead.code} ${lead.name_zh}，個人 ${personal}%。LQ 步驟分只認 1M / 1M / 1A。`}
          {demo.phase === "day1" && focus.id !== "anson" && `${focus.name} 的 ${lead.code} 個人掌握度是 ${personal}%，右屏座位圖同一個數字。`}
          {demo.phase !== "day1" && demo.subject === "Maths" && `${lead.code} ${lead.name_zh} 個人 ${personal}%。`}
          {demo.phase === "h48" && demo.subject === "Phy" && !demo.twinCorrect && `雙胞胎題已送到同一 Level 3：${lead.subtopics[1]?.code ?? lead.subtopics[0].code}。答對才可衝破 85%。`}
          {demo.phase === "h48" && demo.subject === "Phy" && demo.twinCorrect && "已鎖定 91% 深綠。日常練習豁免，課堂只做保鮮。"}
          {demo.phase === "decay" && demo.subject === "Phy" && "逾期超過 7 日，由深綠衰減至 76% 淺綠。不是歸零，只是失去豁免。"}
          {demo.phase === "preexam" && demo.subject === "Phy" && "考前 14–8 日。先做 30 秒保鮮，再經雙重確認才寫回雷達。"}
        </p>
        {demo.twinCorrect && demo.phase !== "decay" ? (
          <div className="mt-2 inline-block -rotate-6 rounded-md border-2 border-[#8ee0b2] px-2 py-1 text-xs font-black tracking-widest text-[#8ee0b2]">
            平時免做
          </div>
        ) : null}
        {demo.twinWrong >= 2 ? <p className="mt-2 text-[11px] text-[#ffb4ac]">已排入次日極速複習佇列</p> : null}
      </div>

      {demo.phase === "h48" && !demo.twinCorrect ? (
        <Card id="twin" kicker="Level 3 雙胞胎" title={`${lead.subtopics[1]?.code ?? lead.code} · 同一知識點，換一個情境`}>
          <p className="text-sm leading-6">
            {demo.subject === "Maths"
              ? "原題問「兩個相異實根」。雙胞胎改成：方程有實根。判別式條件應怎樣寫？"
              : "原題是水入空氣。雙胞胎改成：光線由玻璃斜向射入空氣。下列哪句正確？"}
          </p>
          <div className="mt-2 grid gap-2">
            <button className="rounded-xl bg-[#e24b3c] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "twin", ok: false })}>
              {demo.subject === "Maths" ? "Δ > 0（仍用嚴格大於）" : "折射角小於入射角"}
            </button>
            <button className="rounded-xl bg-[#143524] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "twin", ok: true })}>
              {demo.subject === "Maths" ? "Δ ≥ 0（有實根可為重根）" : "折射角大於入射角"}
            </button>
          </div>
        </Card>
      ) : null}

      {demo.phase === "preexam" ? (
        <Card id="freshness" kicker="30 秒保鮮抽查" title="雙重確認緩衝">
          {demo.freshness === "locked" ? (
            <p className="text-sm text-[#b6f3d2]">已鎖定。單題結果不會直接改寫整題雷達。</p>
          ) : (
            <>
              <p className="text-sm leading-6">
                {demo.subject === "Maths" ? "方程有兩個相異實根時，判別式要怎樣？" : "光由光密進入光疏，折射線會怎樣？"}
              </p>
              <div className="mt-2 grid gap-2">
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "fresh", ok: false })}>
                  {demo.subject === "Maths" ? "Δ ≥ 0" : "靠近法線"}
                </button>
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "fresh", ok: true })}>
                  {demo.subject === "Maths" ? "Δ > 0" : "遠離法線"}
                </button>
              </div>
              {demo.freshness === "buffer" ? (
                <button className="mt-2 w-full rounded-xl bg-[#e4c07a] py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "fresh-confirm" })}>
                  第二重確認：這個判斷不是蒙中
                </button>
              ) : null}
            </>
          )}
        </Card>
      ) : null}

      {demo.studentCard ? <DispatchCard /> : null}
      </div>

      <div className={tab === "radar" ? "space-y-3" : "hidden"}>
      {demo.focusId !== "anson" ? <FocusCard /> : null}

      <Card id="radar" kicker="Level 1 Chapter" title="章節雷達只作宏觀，不進購物車">
        <div className="mb-2 flex flex-wrap gap-1">
          {(["Phy", "Maths"] as const).map((item) => (
            <button
              key={item}
              onClick={() => demo.dispatch({ type: "subject", subject: item })}
              className={`rounded-full px-2 py-1 text-[11px] ${demo.subject === item ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`}
            >
              {item === "Phy" ? "⚡ Physics 物理科" : "📐 Maths 數學科"}
            </button>
          ))}
        </div>
        <div className="h-52">
          {tab === "radar" && radar.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="68%">
                <PolarGrid stroke="#2c4664" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#d5deea", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="klass" stroke="#93a4b8" fill="transparent" strokeDasharray="4 3" />
                <Radar dataKey="mine" stroke="#e4c07a" fill="#e4c07a" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          ) : radar.length >= 3 ? (
            <div className="h-full w-full" />
          ) : (
            <p className="text-sm text-[#93a4b8]">可見章節少於 3。打開「包含未測」即可看見未測章。</p>
          )}
        </div>
        <button
          className={`rounded-xl px-2 py-2 text-[11px] ${demo.includeUntested ? "bg-[#e24b3c]" : "bg-[#143524]"}`}
          onClick={() => demo.dispatch({ type: "patch", patch: { includeUntested: !demo.includeUntested } })}
        >
          {demo.includeUntested ? "包含灰色未測（當 0 分）" : "排除灰色未測"}
        </button>
        <p className="mt-2 text-[11px] leading-5 text-[#c5d0de]">
          校內 UT 基準 M_exam（未測章不入分母）：
          <b className="num text-white"> {pack.mExam}%</b>
        </p>
        <button className="mt-3 w-full rounded-xl bg-[#e4c07a] py-3 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "patch", patch: { studentTab: "quest" } })}>
          ⚔️ 立即進入破關艙
        </button>
        <p className="mt-2 text-[11px] leading-5">
          今日補凹角：{focus.name} {lead.code} 個人 {personal}%。{demo.subject === "Maths" ? "先補 LQ 最弱的 1M 步驟分。" : "先補 JPWM07.2 水入空氣。"}
          {focus.id === "anson" ? "完成破關可領 StarCoins。" : ""}
        </p>
      </Card>

      <Card kicker={demo.levelView === "chapter" ? "Level 1 Chapter" : "Level 2 Topic"} title="進度條可在章節與課題之間切換">
        <div className="mb-2 flex gap-1">
          <button className={`rounded-full px-2 py-1 text-[11px] ${demo.levelView === "chapter" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { levelView: "chapter" } })}>
            Level 1 Chapter 範疇總覽
          </button>
          <button className={`rounded-full px-2 py-1 text-[11px] ${demo.levelView === "topic" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { levelView: "topic" } })}>
            Level 2 Topic 課題進度
          </button>
        </div>
        <div className="space-y-2">
          {demo.levelView === "chapter"
            ? pack.chapters.map((chapter) => {
                const mine = seatChapterScore(demo.subject, focus.id, demo.heroScore, demo.examCode, chapter.code);
                return (
                  <div key={chapter.code} className="rounded-xl bg-black/20 p-2">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-[#93a4b8]">{chapter.code} · {chapter.name_en}</p>
                        <p className="text-sm font-semibold">{chapter.name_zh}</p>
                      </div>
                      <LightPill score={mine} compact />
                    </div>
                    <ScoreBar score={mine} />
                    <p className="mt-1 text-[10px] text-[#93a4b8]">個人 {mine}% · 班級 {chapter.score ?? "—"}%</p>
                  </div>
                );
              })
            : pack.topics.map((topic) => {
                const mine = personalTopics.find((item) => item.code === topic.code)?.score ?? topic.classScore ?? 0;
                return (
                  <div key={topic.code} className="rounded-xl bg-black/20 p-2">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-[#93a4b8]">{topic.code} · {topic.shorthand}</p>
                        <p className="text-sm font-semibold">
                          {topic.name_zh}
                          <span className="ml-1 text-[11px] font-normal text-[#93a4b8]">{topic.name_en}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {topic.hot ? <span className="text-[10px] text-[#ffb15a]">🔥 Top 2</span> : null}
                        <LightPill score={mine} compact />
                      </div>
                    </div>
                    <ScoreBar score={mine} />
                    <p className="mt-1 text-[10px] text-[#93a4b8]">
                      個人 {mine}% · 班級 {topic.classScore}%
                    </p>
                  </div>
                );
              })}
        </div>
      </Card>
      </div>

      <div className={tab === "cart" ? "space-y-3" : "hidden"}>
      <Card id="topic-cart" kicker="Topic Cart" title={`已選 ${pack.topics.filter((topic) => demo.cart.includes(topic.code)).length}/5 · 只收 Level 2`}>
        <div className="flex flex-wrap gap-1.5">
          {pack.topics.map((topic) => {
            const on = demo.cart.includes(topic.code);
            const hot = topic.hot && on;
            return (
              <button
                key={topic.code}
                onClick={() => demo.dispatch({ type: "cart", id: topic.code })}
                className={`rounded-full px-2 py-1 text-[11px] ${hot ? "bg-[#e24b3c] text-white" : on ? "bg-[#1d4e89]" : "bg-white/10"}`}
              >
                {hot ? "🔥 " : ""}
                {topic.code} {topic.name_zh}
              </button>
            );
          })}
        </div>
        <SprintBoard />
      </Card>
      </div>

      <div className={tab === "quest" ? "space-y-3" : "hidden"}>
      <p className="text-[11px] text-[#e4c07a]">Step 1 點題眼 → Step 2 LQ / e-Book 12 行 → Step 3 提交後解鎖膠囊</p>
      <Card id="socratic" kicker="受約束蘇格拉底 · 概念快測" title={`${lead.name_zh} · 先題眼，再 15 秒分步卡`}>
        <button className="mb-2 rounded-lg bg-[#e4c07a] px-2 py-1.5 text-[11px] font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "patch", patch: { labOpen: true } })}>
          🔍 放大進入「2.3 蘇格拉底應試互動艙」
        </button>
        {hereNotes.length ? <p className="mb-2 text-[11px] leading-5 text-[#b6f3d2]">Fast Notes：{hereNotes.map((note) => note.text).join(" ｜ ")}</p> : null}
        <p className="text-sm leading-6">{demo.emi ? topicByTop(demo.top2[0], demo.subject).stemEn : topicByTop(demo.top2[0], demo.subject).stem}</p>
        {demo.qStage !== "ask" ? <p className="mt-1 text-[11px] text-[#e4c07a]">題眼：{topicByTop(demo.top2[0], demo.subject).eye}</p> : null}
        {demo.qStage === "ask" ? (
          <div className="mt-2 grid gap-2">
            <button className="rounded-xl bg-[#3a1c22] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "miss" })}>
              A. {topicByTop(demo.top2[0], demo.subject).wrong}
            </button>
            <button className="rounded-xl bg-[#143524] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "correct-answer" })}>
              B. {topicByTop(demo.top2[0], demo.subject).right}
            </button>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {demo.ansonMissed ? <p className="text-[11px] text-[#ffb4ac]">已選 A。錯題數 {demo.ansonWrongs}。燈色仍跟掌握度，不會因這一題改色。</p> : <p className="text-[11px] text-[#b6f3d2]">已答對，錯題數沒有上升。</p>}
            <p className="text-[11px] text-[#93a4b8]">點中真正決定方向的題眼。</p>
            <div className="grid grid-cols-3 gap-1">
              {(demo.subject === "Maths"
                ? [["兩個相異實根", "hit"], ["一元二次方程", "miss"], ["實數 k", "miss"]]
                : [["水", "hit"], ["空氣", "miss"], ["入射角", "miss"]]
              ).map(([label, kind]) => (
                <button key={label} className={`min-h-11 rounded-lg px-2 py-2 text-[11px] ${demo.eye === "hit" && kind === "hit" ? "bg-[#143524]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "eye", kind: kind as "hit" | "miss" })}>
                  {label}
                </button>
              ))}
            </div>
            {demo.eye !== "none" ? (
              <div className="rounded-xl bg-black/25 p-2">
                <p className="mb-2 text-[11px] text-[#e4c07a]">{demo.stepRunning ? `15 秒分步卡 · 剩餘 ${demo.stepSeconds}s` : "15 秒分步卡已播完"}</p>
                <div className="mb-2 flex gap-1">
                  {["概念 Why", "Marking How", "作圖比對"].map((label, index) => (
                    <button
                      key={label}
                      className={`rounded-full px-2 py-1 text-[10px] ${demo.stepPage === index ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`}
                      onClick={() => demo.dispatch({ type: "patch", patch: { stepPage: index } })}
                    >
                      {index + 1}. {label}
                    </button>
                  ))}
                </div>
                {demo.stepPage === 0 ? (
                  <p className="text-sm leading-6">
                    {demo.subject === "Maths"
                      ? "相異實根要寫 Δ > 0。先圈出題目的條件，再列判別式，這步是第一個 1M。"
                      : "水比空氣光密。走向光疏介質時，光線遠離法線。"}
                  </p>
                ) : null}
                {demo.stepPage === 1 ? (
                  <p className="text-sm leading-6">
                    {demo.subject === "Maths"
                      ? "給分點：展開 −4(k+1) 時負正得負。漏變號就停在第二個 1M，拿不到最後 1A。"
                      : "給分點：寫出「離法線」及「折射角大於入射角」。漏寫斜向，扣步驟分。"}
                  </p>
                ) : null}
                {demo.stepPage === 2 ? (
                  demo.commute ? <p className="text-sm">通勤模式已收起紙筆作圖。改做下面的 Fast Notes。</p> : <DrawHotspot />
                ) : null}
                <p className="mt-2 text-[10px] text-[#e4c07a]">林知行團隊獨創研發</p>
                <button className="mt-2 w-full rounded-xl bg-[#1d4e89] py-2 text-sm font-bold" onClick={() => demo.dispatch({ type: "submit-steps" })}>
                  提交並解鎖膠囊
                </button>
              </div>
            ) : null}
            {demo.capsules ? (
              <div className="space-y-1">
                {(demo.subject === "Maths"
                  ? [
                      ["點解 Δ 要大於 0？", "相異實根是兩個不同實根，所以寫 Δ > 0，不是 ≥ 0。"],
                      ["MC 可以怎樣秒殺？", "代入 k=0 看判別式符號，先排除再算範圍。"],
                      ["菱形 LQ 要寫什麼？", "必寫 property of rhombus。Q5 的 ∠DFC = ∠DFE，答案 34.5°。"],
                    ]
                  : CAPSULES.map((item) => [item.q, item.a])
                ).map(([q, a]) => (
                  <details key={q} className="rounded-lg bg-black/25 p-2 text-sm">
                    <summary className="cursor-pointer">💊 {q}</summary>
                    <p className="mt-1 text-[12px] leading-5 text-[#d5deea]">{a}</p>
                  </details>
                ))}
                <button className="text-[11px] text-[#e4c07a]" onClick={() => demo.dispatch({ type: "note" })}>
                  1 秒存入 Fast Notes
                </button>
                <div className="flex flex-wrap gap-1">
                  {hereNotes.map((note) => (
                    <span key={`${note.subtopicId}-${note.text}`} className="rounded-full bg-[#143524] px-2 py-1 text-[10px]">{note.text}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Card>
      </div>

      <div className={tab === "notes" ? "space-y-3" : "hidden"}>
      {library.length ? (
        <p className="text-[11px] leading-5 text-[#93a4b8]">這位學生的閃卡庫：{library.map((note) => noteLabel(note)).join(" ｜ ")}</p>
      ) : null}
      <Card id="flash" kicker="Fast Notes 閃卡" title={demo.subject === "Maths" ? "SM02.2 挖空" : "JPWM07.2 挖空"}>
        <div className={`rounded-xl p-3 transition ${demo.flash === "flipped" ? "bg-[#143524]" : "bg-black/30"}`}>
          <p className="text-sm leading-6">
            {demo.subject === "Maths"
              ? <>兩個相異實根要寫 Δ {demo.flash === "flipped" ? ">" : "____"} 0。</>
              : <>光線由水斜向射入空氣時，折射角會 {demo.flash === "flipped" ? "大於" : "____"} 入射角。</>}
          </p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {(demo.subject === "Maths"
            ? [[" > ", true], [" ≥ ", false], [" < ", false]]
            : [["大於", true], ["小於", false], ["等於", false]]
          ).map(([label, ok]) => (
            <button
              key={String(label)}
              disabled={demo.flash === "locked"}
              className="rounded-lg bg-white/10 py-2 text-sm disabled:opacity-40"
              onClick={() => demo.dispatch({ type: "flash", ok: Boolean(ok) })}
            >
              {label}
            </button>
          ))}
        </div>
        {demo.flash === "locked" ? <p className="mt-1 text-[11px] text-[#ffb4ac]">鎖定 {demo.flashLeft} 秒</p> : null}
      </Card>

      <Card id="lq" kicker="LQ 誠信自評" title="未過一半步驟分，不能領幣">
        <LqSelfCheck />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-white/10 py-2 text-xs" onClick={() => demo.dispatch({ type: "claim", mode: "blank" })}>
            交白卷勾全錯
          </button>
          <button className="rounded-xl bg-[#e4c07a] py-2 text-xs font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "claim", mode: "fair" })}>
            {demo.lqClaimed ? "已領 +2" : "提交自評 +2"}
          </button>
        </div>
      </Card>

      <Card id="ut-form" kicker="考後 A 軌" title="15 秒微表單">
        <p className="text-sm">把校內 UT 實分交出去。家長只做 1 秒確認。</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-white/10 py-2 text-sm" onClick={() => demo.dispatch({ type: "ut-submit", score: 62 })}>
            申報 62 分
          </button>
          <button className="rounded-xl bg-white/10 py-2 text-sm" onClick={() => demo.dispatch({ type: "ut-submit", score: 80 })}>
            申報 80 分
          </button>
        </div>
        {demo.studentUt != null ? <p className="mt-2 text-[11px] text-[#b6f3d2]">已送出 {demo.studentUt} 分。</p> : null}
      </Card>

      <Card id="formula" kicker="平滑公式實驗室" title="0.6/0.4 與 0.45/0.55 取較大值">
        <div className="mb-2 flex flex-wrap gap-1">
          <Preset label="滿分生" onClick={() => demo.dispatch({ type: "patch", patch: { mInit: 100, hint: 0, m48: 100 } })} />
          <Preset label="紅燈 49" onClick={() => demo.dispatch({ type: "patch", patch: { mInit: 49, hint: 0, m48: 100 } })} />
          <Preset label="Hint 1" onClick={() => demo.dispatch({ type: "patch", patch: { mInit: 90, hint: 1, m48: 90 } })} />
        </div>
        <Slider label="初練分 M init" value={demo.mInit} onChange={(mInit) => demo.dispatch({ type: "patch", patch: { mInit } })} />
        <label className="mt-2 block text-[11px] text-[#93a4b8]">
          提示層級 h{demo.hint} · 權重 {Math.round([100, 80, 65, 50][demo.hint])}%
          <input
            className="mt-1 w-full"
            type="range"
            min={0}
            max={3}
            step={1}
            value={demo.hint}
            onChange={(event) => demo.dispatch({ type: "patch", patch: { hint: Number(event.target.value) as HintLevel } })}
          />
        </label>
        <Slider label="48h 重練分" value={demo.m48} onChange={(m48) => demo.dispatch({ type: "patch", patch: { m48 } })} />
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <Stat label="未封頂原始分" value={formula.raw} />
          <Stat label="Day 1 封頂" value={formula.day1} />
          <Stat label="0.6 / 0.4" value={formula.blendA} />
          <Stat label="0.45 / 0.55" value={formula.blendB} />
          <Stat label="天真直接取重練" value={formula.naive} />
          <Stat label="平滑結果" value={formula.smooth} />
        </div>
        <p className="mt-2 text-[11px] leading-5 text-[#c5d0de]">
          結果 <LightPill score={formula.smooth} compact />。
          {formula.guarded
            ? " 硬閘已啟動：紅燈初練不能一步跳進深綠。"
            : " 取較大混合值，重練一次不會把高分倒掛拉低；紅燈 49 即使重練 100，也到不了 85。"}
        </p>
        {demo.subject === "Maths" ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {MA_MAP.map((item) => (
              <span key={item.id} className="rounded-full bg-white/10 px-2 py-1 text-[10px]">
                {item.note}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-[#93a4b8]">物理科只顯示 C / R / E，這裡不出現 MA1–MA6。</p>
        )}
      </Card>
      </div>
      <nav className="sticky bottom-0 z-20 mt-3 grid grid-cols-4 gap-1 border-t border-white/10 bg-[#07111c]/95 py-2">
        {(
          [
            ["radar", "🕸️ 雷達"],
            ["quest", "⚔️ 破關"],
            ["cart", "🛒 選課"],
            ["notes", `⚡ 閃卡${library.length ? ` ${library.length}` : ""}`],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={`rounded-lg px-1 py-2 text-[10px] font-bold ${tab === id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { studentTab: id } })}>
            {label}
          </button>
        ))}
      </nav>
    </div>
    </div>
  );
}

function topicByTop(id: string | undefined, subject: "Maths" | "Phy") {
  const own = subject === "Maths" ? QUESTIONS["math-quad"] : QUESTIONS["phy-refr"];
  if (!id) return own;
  const otherSubject = subject === "Maths"
    ? id.startsWith("JP") || id.startsWith("SP") || id.startsWith("phy")
    : id.startsWith("SM") || id.startsWith("JM") || id.startsWith("math");
  if (otherSubject) return own;
  if (QUESTIONS[id]) return QUESTIONS[id];
  if (subject === "Maths") return QUESTIONS["math-quad"];
  return own;
}

function StudentLqBoard() {
  const demo = useDemo();
  const ebookLive = demo.subject === "Maths" && (demo.ebookOpen || demo.smokeCode === "JM29" || Boolean(demo.examCode?.startsWith("JM29")));
  if (ebookLive) return null;
  const point = findSubtopic(demo.subject, demo.examCode);
  const paper = lqPaper(demo.subject, demo.examCode);
  const seat = SEATS.find((item) => item.id === demo.focusId) ?? SEATS[0];
  const mine = seatPointScore(demo.subject, seat.id, demo.heroScore, demo.examCode);
  return (
    <div id="student-lq" className="rounded-2xl border border-[#e4c07a]/50 bg-[#1a1408] p-3">
      <p className="text-[10px] font-bold text-[#e4c07a]">📝 LQ 長題目 · 佔校內卷 70% · 1M / 1M / 1A</p>
      <p className="mt-1 text-sm font-bold">{point.code} {point.name} · 個人 {mine}%</p>
      <p className="mt-1 text-[12px] leading-5">{paper.stem}</p>
      <div className="mt-2 space-y-1">
        {paper.steps.map((step) => (
          <div
            key={step.title}
            className={`rounded-lg px-2 py-1.5 text-[12px] leading-5 ${
              step.status === "got" ? "bg-[#143524]" : step.status === "break" ? "bg-[#3a3014]" : "bg-[#3a1c22]"
            }`}
          >
            <p>
              <b className="text-[#e4c07a]">{step.mark}</b> {step.title}
            </p>
            <p className="text-[11px] text-[#c5d0de]">{step.self}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-4 text-[#93a4b8]">MC 概念快測佔其餘 30%。這張卡就是右屏正在批改的同一條長題目。</p>
    </div>
  );
}

function LqSelfCheck() {
  const demo = useDemo();
  const paper = lqPaper(demo.subject, demo.examCode);
  return (
    <>
      <p className="text-[11px] text-[#93a4b8]">{paper.code} · 滿分 {paper.total} 分 · 勾到至少 2 步才可領幣</p>
      <div className="mt-2 space-y-1">
        {paper.steps.map((step, index) => (
          <label key={step.title} className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-2 py-1.5 text-sm">
            <span>
              <input className="mr-2" type="checkbox" checked={demo.lqSteps[index]} onChange={() => demo.dispatch({ type: "lq", index })} />
              {step.mark} {step.title}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}

function FocusCard() {
  const demo = useDemo();
  const profile = seatProfile(demo.focusId);
  const seat = SEATS.find((item) => item.id === demo.focusId) ?? SEATS[0];
  const topics = seatFocusTopics(demo.subject, seat.id, demo.heroScore, demo.examCode);
  return (
    <Card id="focus-profile" kicker={demo.subject === "Maths" ? "數學科個人頁" : "物理科個人頁"} title={`${seat.name} · ${seat.en}`}>
      <p className="text-sm leading-6">{profile.blurb}</p>
      <div className="mt-2 space-y-1">
        {topics.map((topic) => (
          <div key={topic.code} className="flex items-center justify-between text-sm">
            <span>{topic.code} {topic.name}</span>
            <LightPill score={topic.score} compact />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-[#93a4b8]">同一個數字同步在 KOC 座位圖與資優卡，點座位不會改動陳*軒主線。</p>
      <button className="mt-2 text-[11px] text-[#e4c07a]" onClick={() => demo.dispatch({ type: "focus", id: "anson" })}>
        回到陳*軒主線
      </button>
    </Card>
  );
}

function DispatchCard() {
  const demo = useDemo();
  const card = demo.studentCard;
  const [open, setOpen] = useState<number | null>(0);
  if (!card) return null;
  return (
    <Card id="student-card" kicker="LDC 剛派到這部手機" title={card.title}>
      <p className="text-sm leading-6">{card.body}</p>
      {card.kind === "ebook" ? <StudentEbookCard /> : null}
      {card.steps ? (
        <div className="mt-2 space-y-1">
          {card.steps.map((step, index) => (
            <button key={step} className="w-full rounded-xl bg-black/25 px-2 py-2 text-left text-[12px] leading-5" onClick={() => setOpen(open === index ? null : index)}>
              💡 {open === index ? step : step.split("：")[0]}
            </button>
          ))}
        </div>
      ) : null}
      {card.phases ? (
        <div className="mt-2 space-y-2">
          {card.phases.map((phase) => (
            <div key={phase.title} className="rounded-xl bg-black/25 p-2">
              <p className="text-[12px] font-bold text-[#e4c07a]">{phase.title}</p>
              <p className="mt-1 text-[12px] leading-5">{phase.body}</p>
            </div>
          ))}
        </div>
      ) : null}
      <button className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-[11px]" onClick={() => demo.dispatch({ type: "patch", patch: { studentCard: null } })}>
        我已看完
      </button>
    </Card>
  );
}

function SprintBoard() {
  const demo = useDemo();
  const names = topicNames(demo.subject, demo.top2);
  const slots = names.length === 0
    ? ["空", "空", "空", "空", "空"]
    : demo.exempt
      ? [demo.speedQueue ? "明日首題" : `${names[0]} 保鮮`, "免", "免", "免", "免"]
      : [demo.speedQueue ? "明日首題" : `${names[0]} 新`, `${names[0]} 新`, `${names[1] ?? names[0]} 新`, "舊", "舊"];
  return (
    <div className="mt-3">
      <p className="text-[11px] text-[#93a4b8]">
        {names.length === 0
          ? "這一科的購物車是空的。"
          : demo.exempt
            ? "已深綠。日常 5 題收成 1 題保鮮，其餘豁免。"
            : `今日派發：${names.join("、")}。舊題最多 2。`}
        {demo.speedQueue ? " 明早第一格是折射。" : ""}
      </p>
      <div className="mt-1 grid grid-cols-5 gap-1">
        {slots.map((label, index) => (
          <div key={label + index} className={`rounded-lg px-1 py-2 text-center text-[10px] ${label === "舊" ? "bg-[#3a3320]" : label === "免" ? "bg-white/5 text-[#93a4b8]" : "bg-[#143524]"}`}>
            {label}
          </div>
        ))}
      </div>
      <button className="mt-2 text-[11px] text-[#ffb4ac] underline" onClick={() => demo.dispatch({ type: "sprint-old" })}>
        再塞 1 題舊題（應被擋住）
      </button>
    </div>
  );
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="rounded-full bg-white/10 px-2 py-1 text-[11px]" onClick={onClick}>
      {label}
    </button>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="mt-2 block text-[11px] text-[#93a4b8]">
      {label} <span className="num text-white">{value}</span>
      <input className="mt-1 w-full" type="range" min={0} max={100} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const meta = LIGHT_META[value >= 85 ? "deep" : value >= 70 ? "light" : value >= 50 ? "yellow" : "red"];
  return (
    <div className="rounded-lg bg-black/25 p-2">
      <p>{label}</p>
      <p className="num text-base font-bold" style={{ color: meta.bg }}>
        {value}
      </p>
    </div>
  );
}

function Burst({ token }: { token: number }) {
  if (!token) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 14 }).map((_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        return (
          <motion.span
            key={`${token}-${index}`}
            className="absolute left-1/2 top-8 h-2 w-2 rounded-full bg-[#8ee0b2]"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * 110, y: Math.sin(angle) * 48, opacity: 0 }}
            transition={{ duration: 0.75 }}
          />
        );
      })}
    </div>
  );
}

function DrawHotspot() {
  const demo = useDemo();
  const [spot, setSpot] = useState(false);
  const maths = demo.subject === "Maths";
  return (
    <div>
      {maths
        ? <RhombusInk runId={0} pen="both" frame={spot ? 12 : 8} hotspot={!spot} onHotspot={() => setSpot(true)} />
        : <RefractionInk hotspot={!spot} onHotspot={() => setSpot(true)} />}
      {spot ? (
        <>
          <label className="mt-2 block text-[11px] text-[#93a4b8]">
            透明圖層比對 {demo.overlay}%
            <input className="mt-1 w-full" type="range" min={0} max={100} value={demo.overlay} onChange={(event) => demo.dispatch({ type: "patch", patch: { overlay: Number(event.target.value) } })} />
          </label>
          <p className="text-[11px] text-[#e4c07a]" style={{ opacity: Math.max(0.35, demo.overlay / 100) }}>
            {maths ? "標準層：F 點 ∠DFC = ∠DFE，34.5°" : "標準層：法線虛線，折射線遠離法線"}
          </p>
        </>
      ) : <p className="text-[11px] text-[#93a4b8]">先點圖上紅色熱區，才解鎖標準圖層。</p>}
    </div>
  );
}
