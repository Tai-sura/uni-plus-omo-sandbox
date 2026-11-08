"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useDemo } from "@/lib/demo-context";
import { CAPSULES, LQ_STEPS, MA_MAP, QUESTIONS, TOPICS, seatProfile, type Subject } from "@/lib/mock-data";
import { calcMastery, LIGHT_META, type HintLevel } from "@/lib/mastery";
import { Card, LightPill, ScoreBar } from "./ui";

export function StudentView() {
  const demo = useDemo();
  const [subject, setSubject] = useState<Subject>("Phy");
  const formula = calcMastery(demo.mInit, demo.hint, demo.m48);

  const radar = useMemo(() => {
    return TOPICS.filter((topic) => topic.subject === subject)
      .filter((topic) => demo.showHiddenAxes || topic.radar_visibility)
      .filter((topic) => {
        const score = demo.topicScore(topic.id);
        if (score != null) return true;
        if (demo.includeUntested) return true;
        return demo.showHiddenAxes && !topic.radar_visibility;
      })
      .map((topic) => ({
        axis: topic.shorthand,
        score: demo.topicScore(topic.id) ?? 0,
      }));
  }, [subject, demo]);

  const optics = ["phy-refl", "phy-refr", "phy-lens"].map((id) => demo.topicScore(id));
  const opticsAvg = average(optics, demo.includeUntested);

  return (
    <div className="space-y-3">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] text-[#e4c07a]">聖保羅書院 · 中三</p>
          <h2 className="text-lg font-bold">陳*軒 Anson</h2>
          <button className="mt-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]" onClick={() => demo.dispatch({ type: "patch", patch: { emi: !demo.emi } })}>
            {demo.emi ? "EMI 英文卷" : "中文卷"}
          </button>
          <p className="text-[10px] text-[#93a4b8]">SPC-S3-2026-VERIFIED</p>
        </div>
        <div className="rounded-xl bg-white/5 px-2 py-1 text-right">
          <p className="text-[10px] text-[#93a4b8]">StarCoins</p>
          <p className="num text-lg font-bold text-[#e4c07a]">{demo.starCoins}</p>
        </div>
      </header>

      <div id="hero-score" className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e2433] p-3">
        <Burst token={demo.burst} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#93a4b8]">Level 2 · SPOP03 · Refract</p>
            <p className="font-bold">光的折射</p>
          </div>
          <LightPill score={demo.heroScore} />
        </div>
        <div className="mt-2">
          <ScoreBar score={demo.heroScore} />
        </div>
        <p className="mt-2 text-[11px] text-[#e4c07a]">本題計分權重 {demo.eyeWeight}% · 已寫入 Hint h{demo.hint}</p>
        <p className="mt-2 text-[11px] leading-5 text-[#c5d0de]">
          {demo.phase === "day1" && "Day 1 初練已封頂 84% 淺綠。原始分先不寫進深綠，等 48 小時雙胞胎。"}
          {demo.phase === "h48" && !demo.twinCorrect && "雙胞胎題已送到同一 Level 3：SPOP03.2 折射角與法線。答對才可衝破 85%。"}
          {demo.phase === "h48" && demo.twinCorrect && "已鎖定 91% 深綠。日常練習豁免，課堂只做保鮮。"}
          {demo.phase === "decay" && "逾期超過 7 日，由深綠衰減至 76% 淺綠。不是歸零，只是失去豁免。"}
          {demo.phase === "preexam" && "考前 14–8 日。先做 30 秒保鮮，再經雙重確認才寫回雷達。"}
        </p>
        {demo.twinCorrect && demo.phase !== "decay" ? (
          <div className="mt-2 inline-block -rotate-6 rounded-md border-2 border-[#8ee0b2] px-2 py-1 text-xs font-black tracking-widest text-[#8ee0b2]">
            平時免做
          </div>
        ) : null}
        {demo.twinWrong >= 2 ? <p className="mt-2 text-[11px] text-[#ffb4ac]">已排入次日極速複習佇列</p> : null}
      </div>

      {demo.phase === "h48" && !demo.twinCorrect ? (
        <Card id="twin" kicker="Level 3 雙胞胎" title="SPOP03.2 · 同一知識點，換一個情境">
          <p className="text-sm leading-6">光線由玻璃斜向射入空氣。下列哪句正確？</p>
          <div className="mt-2 grid gap-2">
            <button className="rounded-xl bg-[#e24b3c] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "twin", ok: false })}>
              折射角小於入射角
            </button>
            <button className="rounded-xl bg-[#143524] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "twin", ok: true })}>
              折射角大於入射角
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
              <p className="text-sm leading-6">光由光密進入光疏，折射線會怎樣？</p>
              <div className="mt-2 grid gap-2">
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "fresh", ok: false })}>
                  靠近法線
                </button>
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "fresh", ok: true })}>
                  遠離法線
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

      <Card id="radar" kicker="Level 1–3 雷達" title="手機軸用 shorthand，避免破版">
        <div className="mb-2 flex flex-wrap gap-1">
          {(["Phy", "Maths", "Chem"] as Subject[]).map((item) => (
            <button
              key={item}
              onClick={() => setSubject(item)}
              className={`rounded-full px-2 py-1 text-[11px] ${subject === item ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`}
            >
              {item === "Phy" ? "物理" : item === "Maths" ? "數學" : "化學"}
            </button>
          ))}
        </div>
        <div className="h-52">
          {radar.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="68%">
                <PolarGrid stroke="#2c4664" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#d5deea", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#e4c07a" fill="#e4c07a" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#93a4b8]">這個科目可見軸少於 3。打開「包含未測」或「隱藏軸」即可看見差異。</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            className={`rounded-xl px-2 py-2 ${demo.includeUntested ? "bg-[#e24b3c]" : "bg-[#143524]"}`}
            onClick={() => demo.dispatch({ type: "patch", patch: { includeUntested: !demo.includeUntested } })}
          >
            {demo.includeUntested ? "包含灰色未測（當 0 分）" : "排除灰色未測"}
          </button>
          <button
            className={`rounded-xl px-2 py-2 ${demo.showHiddenAxes ? "bg-[#1d4e89]" : "bg-white/10"}`}
            onClick={() => demo.dispatch({ type: "patch", patch: { showHiddenAxes: !demo.showHiddenAxes } })}
          >
            {demo.showHiddenAxes ? "已顯示 radar_visibility 隱藏軸" : "隱藏軸維持關閉"}
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-[#c5d0de]">
          光學章平均（反射 90、折射 {demo.heroScore}、透鏡未測）：
          <b className="num text-white"> {opticsAvg}%</b>
          {demo.includeUntested ? "。未教的透鏡被當 0 分，章級燈號被拉低。" : "。未測透鏡不入分母，已學課題不會被冤枉。"}
        </p>
      </Card>

      <Card kicker="Level 2 Topic" title="五色進度只計算這一層">
        <div className="space-y-2">
          {TOPICS.filter((topic) => topic.subject === "Phy" || topic.subject === "Maths").slice(0, 8).map((topic) => {
            const score = demo.topicScore(topic.id);
            const active = demo.top2.includes(topic.id);
            return (
              <div key={topic.id} className="rounded-xl bg-black/20 p-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-[#93a4b8]">
                      {topic.topic_code} · {topic.shorthand}
                      {topic.skill_dimension ? ` · ${topic.skill_dimension}→${topic.cre}` : ""}
                    </p>
                    <p className="text-sm font-semibold">
                      {topic.name_zh}
                      <span className="ml-1 text-[11px] font-normal text-[#93a4b8]">{topic.name_en}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {active ? <span className="text-[10px] text-[#ffb15a]">Top 2</span> : null}
                    <LightPill score={score} compact />
                  </div>
                </div>
                <ScoreBar score={score} />
              </div>
            );
          })}
        </div>
      </Card>

      {demo.focusId !== "anson" ? <FocusCard /> : null}
      <Card id="topic-cart" kicker="Topic Cart" title={`已選 ${demo.cart.length}/5 · 今日真的派這兩科`}>
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((topic) => {
            const on = demo.cart.includes(topic.id);
            const hot = demo.top2.includes(topic.id);
            return (
              <button
                key={topic.id}
                onClick={() => demo.dispatch({ type: "cart", id: topic.id })}
                className={`rounded-full px-2 py-1 text-[11px] ${hot ? "bg-[#e24b3c] text-white" : on ? "bg-[#1d4e89]" : "bg-white/10"}`}
              >
                {hot ? "🔥 " : ""}
                {topic.name_zh}
              </button>
            );
          })}
        </div>
        <SprintBoard />
      </Card>

      <Card id="socratic" kicker="受約束蘇格拉底" title={`${TOPICS.find((topic) => topic.id === demo.top2[0])?.name_zh ?? "光的折射"} · 先題眼，再 15 秒分步卡`}>
        <p className="text-sm leading-6">{demo.emi ? topicByTop(demo.top2[0]).stemEn : topicByTop(demo.top2[0]).stem}</p>
        {demo.qStage !== "ask" ? <p className="mt-1 text-[11px] text-[#e4c07a]">題眼：{topicByTop(demo.top2[0]).eye}</p> : null}
        {demo.qStage === "ask" ? (
          <div className="mt-2 grid gap-2">
            <button className="rounded-xl bg-[#3a1c22] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "miss" })}>
              A. {topicByTop(demo.top2[0]).wrong}
            </button>
            <button className="rounded-xl bg-[#143524] px-3 py-2 text-left text-sm" onClick={() => demo.dispatch({ type: "correct-answer" })}>
              B. {topicByTop(demo.top2[0]).right}
            </button>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {demo.ansonMissed ? <p className="text-[11px] text-[#ffb4ac]">已選 A。右屏座位應該正在閃紅。</p> : <p className="text-[11px] text-[#b6f3d2]">已答對，紅點熄滅。</p>}
            <p className="text-[11px] text-[#93a4b8]">點中真正決定方向的題眼。</p>
            <div className="grid grid-cols-3 gap-1">
              <button className="rounded-lg bg-[#143524] px-1 py-2 text-[11px]" onClick={() => demo.dispatch({ type: "eye", kind: "hit" })}>水</button>
              <button className="rounded-lg bg-white/10 px-1 py-2 text-[11px]" onClick={() => demo.dispatch({ type: "eye", kind: "miss" })}>空氣</button>
              <button className="rounded-lg bg-white/10 px-1 py-2 text-[11px]" onClick={() => demo.dispatch({ type: "eye", kind: "miss" })}>折射角</button>
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
                {demo.stepPage === 0 ? <p className="text-sm leading-6">水比空氣光密。走向光疏介質時，光線遠離法線。</p> : null}
                {demo.stepPage === 1 ? <p className="text-sm leading-6">給分點：寫出「離法線」及「折射角大於入射角」。漏寫斜向，扣步驟分。</p> : null}
                {demo.stepPage === 2 ? (
                  <div>
                    <div className="relative h-28 overflow-hidden rounded-lg bg-[#081018]">
                      <Diagram opacity={1} color="#7d8da1" />
                      <div style={{ opacity: demo.overlay / 100 }}>
                        <Diagram opacity={1} color="#e4c07a" />
                      </div>
                    </div>
                    <label className="mt-2 block text-[11px] text-[#93a4b8]">
                      透明圖層比對 {demo.overlay}%
                      <input
                        className="mt-1 w-full"
                        type="range"
                        min={0}
                        max={100}
                        value={demo.overlay}
                        onChange={(event) => demo.dispatch({ type: "patch", patch: { overlay: Number(event.target.value) } })}
                      />
                    </label>
                    <div className="mt-1 space-y-1 text-[11px]">
                      {["法線沒有畫成虛線", "箭頭方向畫反"].map((label, index) => (
                        <label key={label} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={demo.deduct[index]}
                            onChange={() => {
                              const deduct: [boolean, boolean] = [...demo.deduct];
                              deduct[index] = !deduct[index];
                              demo.dispatch({ type: "patch", patch: { deduct } });
                            }}
                          />
                          必扣分：{label}
                        </label>
                      ))}
                    </div>
                    <button className="mt-2 rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => demo.dispatch({ type: "patch", patch: { photo: true, toast: "已模擬拍照。原圖留在本地，只上傳比對結果。" } })}>
                      {demo.photo ? "已拍攝作圖" : "可選拍照"}
                    </button>
                  </div>
                ) : null}
                <p className="mt-2 text-[10px] text-[#e4c07a]">林知行團隊獨創研發</p>
                <button className="mt-2 w-full rounded-xl bg-[#1d4e89] py-2 text-sm font-bold" onClick={() => demo.dispatch({ type: "submit-steps" })}>
                  提交並解鎖膠囊
                </button>
              </div>
            ) : null}
            {demo.capsules ? (
              <div className="space-y-1">
                {CAPSULES.map((item) => (
                  <details key={item.q} className="rounded-lg bg-black/25 p-2 text-sm">
                    <summary className="cursor-pointer">💊 {item.q}</summary>
                    <p className="mt-1 text-[12px] leading-5 text-[#d5deea]">{item.a}</p>
                  </details>
                ))}
                <button className="text-[11px] text-[#e4c07a]" onClick={() => demo.dispatch({ type: "note" })}>
                  1 秒存入 Fast Notes
                </button>
                <div className="flex flex-wrap gap-1">
                  {demo.notes.map((note) => (
                    <span key={note} className="rounded-full bg-[#143524] px-2 py-1 text-[10px]">{note}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Card>

      <Card id="flash" kicker="Fast Notes 閃卡" title="挖空三選一">
        <div className={`rounded-xl p-3 transition ${demo.flash === "flipped" ? "bg-[#143524]" : "bg-black/30"}`}>
          <p className="text-sm leading-6">
            光由光密介質進入光疏介質時，折射角會 {demo.flash === "flipped" ? "大於" : "____"} 入射角。
          </p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[
            ["大於", true],
            ["小於", false],
            ["等於", false],
          ].map(([label, ok]) => (
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

      <Card id="lq" kicker="LQ 誠信自評" title="未滿 50% 步驟分，不能領幣">
        <p className="text-[11px] text-[#93a4b8]">SM02.2 二次方程 · 滿分 10 · 門檻 5</p>
        <div className="mt-2 space-y-1">
          {LQ_STEPS.map((step, index) => (
            <label key={step.label} className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-2 py-1.5 text-sm">
              <span>
                <input className="mr-2" type="checkbox" checked={demo.lqSteps[index]} onChange={() => demo.dispatch({ type: "lq", index })} />
                {step.label}
              </span>
              <span className="num text-[#e4c07a]">{step.marks}</span>
            </label>
          ))}
        </div>
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
        <div className="mt-2 flex flex-wrap gap-1">
          {MA_MAP.map((item) => (
            <span key={item.id} className="rounded-full bg-white/10 px-2 py-1 text-[10px]">
              {item.note}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function topicByTop(id: string | undefined) {
  return QUESTIONS[id ?? "phy-refr"] ?? QUESTIONS["phy-refr"];
}

function FocusCard() {
  const demo = useDemo();
  const profile = seatProfile(demo.focusId);
  return (
    <Card id="focus-profile" kicker="這位同學" title={profile.ticket}>
      <p className="text-sm leading-6">{profile.blurb}</p>
      <div className="mt-2 space-y-1">
        {profile.topics.map((topic) => (
          <div key={topic.name} className="flex items-center justify-between text-sm">
            <span>{topic.name}</span>
            <LightPill score={topic.score} compact />
          </div>
        ))}
      </div>
      <button className="mt-2 text-[11px] text-[#e4c07a]" onClick={() => demo.dispatch({ type: "focus", id: "anson" })}>
        回到陳*軒主線
      </button>
    </Card>
  );
}

function SprintBoard() {
  const demo = useDemo();
  const names = demo.top2.map((id) => TOPICS.find((topic) => topic.id === id)?.name_zh ?? "課題");
  const slots = demo.exempt
    ? [demo.speedQueue ? "明日首題" : `${names[0] ?? "課題"} 保鮮`, "免", "免", "免", "免"]
    : [demo.speedQueue ? "明日首題" : `${names[0] ?? "課題"} 新`, `${names[0] ?? "課題"} 新`, `${names[1] ?? names[0] ?? "課題"} 新`, "舊", "舊"];
  return (
    <div className="mt-3">
      <p className="text-[11px] text-[#93a4b8]">
        {demo.exempt ? "已深綠。日常 5 題收成 1 題保鮮，其餘豁免。" : `今日派發：${names.join("、")}。舊題最多 2。`}
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

function average(values: Array<number | null>, includeUntested: boolean) {
  const used = includeUntested ? values.map((value) => value ?? 0) : values.filter((value): value is number => value != null);
  if (!used.length) return 0;
  return Math.round(used.reduce((sum, value) => sum + value, 0) / used.length);
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

function Diagram({ color }: { opacity: number; color: string }) {
  return (
    <svg viewBox="0 0 200 110" className="absolute inset-0 h-full w-full">
      <line x1="100" y1="8" x2="100" y2="102" stroke={color} strokeDasharray="3 3" />
      <line x1="16" y1="56" x2="184" y2="56" stroke={color} />
      <line x1="28" y1="96" x2="100" y2="56" stroke={color} strokeWidth="2" />
      <line x1="100" y1="56" x2="168" y2="20" stroke={color} strokeWidth="2" />
    </svg>
  );
}
