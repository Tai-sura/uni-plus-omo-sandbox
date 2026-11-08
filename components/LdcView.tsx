"use client";

import { useEffect } from "react";
import { HERO, SEATS } from "@/lib/mock-data";
import { ebookHits, ebookRescueCard, findSubtopic, isEbookPoint, lqPaper, lqStepsCard, lqTwinCard, packOf, teleScript } from "@/lib/curriculum";
import { useDemo } from "@/lib/demo-context";
import { lightOf } from "@/lib/mastery";
import { EbookConsole, EbookRevealer } from "./EbookKit";
import { Card, LightPill } from "./ui";

export function LdcView() {
  const demo = useDemo();
  const pack = packOf(demo.subject);
  const focus = SEATS.find((seat) => seat.id === demo.focusId) ?? SEATS[0];
  const smoke = pack.topics.find((topic) => topic.code === demo.smokeCode) ?? pack.topics.find((topic) => topic.code === findSubtopic(demo.subject, demo.examCode).topic) ?? pack.topics[0];
  const examPoint = findSubtopic(demo.subject, demo.examCode);
  const paper = lqPaper(demo.subject, examPoint.code);
  const seats = demo.classMode === "large" ? SEATS : SEATS.slice(0, 8);
  const combo = demo.hotkeys.includes("2") && demo.hotkeys.includes("3");
  const ebook = demo.subject === "Maths" && (demo.smokeCode === "JM29" || isEbookPoint(demo.examCode));
  const script = teleScript(demo.subject, demo.hotkeys, focus.name, examPoint.code);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "1" || event.key === "2" || event.key === "3") {
        demo.dispatch({ type: "hotkey", key: event.key });
      }
      if (event.code === "Space" && demo.recording) {
        event.preventDefault();
        demo.dispatch({ type: "patch", patch: { paused: !demo.paused } });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [demo]);

  return (
    <div className="space-y-2">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] text-[#e4c07a]">LDC 課堂大腦 · {HERO.ldc}</p>
          <h2 className="text-lg font-bold">{pack.label}</h2>
        </div>
        <p className="text-xs text-[#93a4b8]">督導版稅 {demo.royalty.toFixed(1)} EduToken</p>
      </header>

      <Card dense kicker="LDC 全局課綱錨點" title="本堂激活課題與校內基準">
        <p className="text-sm leading-5">
          今日激活：{pack.topics.filter((topic) => topic.hot).map((topic) => `${topic.code} ${topic.name_zh}`).join(" 與 ")}
        </p>
        <p className="text-[11px] text-[#93a4b8]">當前批改考點：{examPoint.code} {examPoint.name}（{examPoint.score}%）</p>
        <p className="mt-1 text-sm">全班校內 UT 預測基準分 M_exam = {pack.mExam}%（已排除 ⚪ 未測課題）</p>
        <p className="mt-1 inline-block rounded-full bg-[#1d4e89] px-2 py-1 text-[11px]">⚖️ 測考真實權重：📝 LQ 長題目步驟分 (70%) + ⚡ MC 概念快測 (30%)</p>
        {demo.subject === "Maths" ? <p className="mt-1 text-[11px] text-[#e4c07a]">一鍵切換演示課題：SM02 代數 LQ，或 JM29 四邊形幾何 e-Book。</p> : null}
        {demo.subject === "Maths" ? <div className="mt-2"><EbookConsole /></div> : null}
      </Card>

      <Card dense id="heatmap" kicker="課前 Top 2 冒煙" title="點 Level 3 列，切換下方批改考點">
        {demo.regrouped ? <p className="mb-2 rounded-lg bg-[#3a1c22] px-2 py-1 text-sm">陳*軒錯題數已到 {demo.ansonWrongs}。小班看板把他放進「錯 ≥4 題」。</p> : null}
        <div className="grid gap-2 md:grid-cols-2">
          {pack.topics.filter((topic) => topic.hot).map((topic) => (
            <button key={topic.code} className="rounded-xl bg-black/20 p-2 text-left" onClick={() => {
              const weakest = [...topic.subtopics].sort((a, b) => (a.score ?? 100) - (b.score ?? 100))[0];
              demo.dispatch({ type: "patch", patch: { smokeCode: topic.code, examCode: weakest.code, hotkeys: [], ebookShown: topic.code === "JM29" ? demo.ebookShown : 0, ebookBreak: topic.code === "JM29" ? demo.ebookBreak : null, ebookOpen: topic.code === "JM29", ebookTab: topic.code === "JM29" ? "rhombus" : demo.ebookTab, ...(topic.code === "JM29" ? { split: true, phone: "student" as const, highlight: "student-ebook" } : {}) } });
            }}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{topic.code} {topic.name_zh}</span>
                <LightPill score={topic.classScore} compact />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full" style={{ width: `${topic.classScore ?? 0}%`, background: (topic.classScore ?? 0) < 50 ? "#e24b3c" : (topic.classScore ?? 0) < 70 ? "#e0a825" : "#0e8f5b" }} />
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 rounded-xl bg-black/25 p-2">
          <p className="text-sm font-bold">{smoke.code} {smoke.name_zh}</p>
          <div className="mt-1 space-y-1">
            {smoke.subtopics.map((sub) => (
              <button
                key={sub.code}
                className={`flex w-full items-start justify-between gap-2 rounded-lg px-1 py-1 text-left text-[11px] ${demo.examCode === sub.code ? "bg-[#1d4e89]" : ""}`}
                onClick={() => demo.dispatch({ type: "patch", patch: { examCode: sub.code, smokeCode: smoke.code } })}
              >
                <span>{sub.code} {sub.name}<br /><span className="text-[#e4c07a]">{sub.cre}</span>{demo.subject === "Maths" && sub.ma ? ` · ${sub.ma}` : ""}</span>
                <LightPill score={sub.score} compact />
              </button>
            ))}
          </div>
        </div>
        <button
          className="mt-3 rounded-xl bg-[#1d4e89] px-3 py-2 text-sm"
          onClick={() => {
            demo.dispatch({ type: "ice" });
            demo.dispatch({ type: "dispatch-card", card: { kind: "ice", title: pack.iceTitle, body: pack.iceBody } });
          }}
        >
          ⚡ 全班派發第 1 題破冰
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={`rounded-lg px-3 py-1.5 text-xs ${demo.classMode === "large" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { classMode: "large" } })}>
            20 人大班 · 按掌握度
          </button>
          <button className={`rounded-lg px-3 py-1.5 text-xs ${demo.classMode === "small" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { classMode: "small" } })}>
            8 人小班 · 按錯題數
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {bands(demo.classMode, seats, demo.heroScore, demo.ansonWrongs, ebook).map((band) => (
            <div key={band.title} className="rounded-xl bg-black/25 p-2">
              <p className="text-xs font-bold" style={{ color: band.color }}>{band.title}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {band.rows.map((row) => (
                  <button key={row.id} className="rounded-full bg-white/10 px-2 py-1 text-[11px]" onClick={() => demo.dispatch({ type: "focus", id: row.id })}>
                    {row.name}
                  </button>
                ))}
              </div>
              {demo.classMode === "large" && band.action ? (
                <button
                  className="mt-2 w-full rounded-lg bg-[#1d4e89] px-2 py-2 text-left text-[11px]"
                  onClick={() => {
                    if (ebook && band.action!.kind === "challenge") {
                      demo.dispatch({ type: "patch", patch: { ebookTab: "level2", examCode: "JM29.4", smokeCode: "JM29", ebookOpen: true, split: true, phone: "student", highlight: "student-ebook" } });
                    }
                    demo.dispatch({
                      type: "dispatch-card",
                      card: band.action!.kind === "steps"
                        ? ebook ? ebookRescueCard() : lqStepsCard(demo.subject, demo.examCode)
                        : band.action!.kind === "twin"
                          ? lqTwinCard(demo.subject, ebook ? "JM29.2" : demo.examCode)
                          : ebook && band.action!.kind === "challenge"
                            ? { kind: "challenge", title: "🌲 e-Book Level 2 進階綜合證明", body: "已跳到 JM29c 頂部 Level 2。鎖定 JM29.4 正方形與進階證明，不重做菱形基礎。" }
                            : band.action!,
                    });
                  }}
                >
                  {band.action.title}
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <button className="mt-3 rounded-xl bg-[#e24b3c] px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "koc-alert" })}>
          📲 一鍵派駐 KOC 巡堂急救（&lt;50% 名單）
        </button>
      </Card>

      <div className="grid gap-2 xl:grid-cols-2">
        <Card dense id="hotkey" kicker="60 秒複合熱鍵 · 📝 LQ 長題目步驟拆解 (1M/1A)" title="1 · C　2 · R　3 · E">
          <p className="text-[11px] leading-5 text-[#93a4b8]">
            當前批改學生：{focus.name} ｜ 考點：{examPoint.code} {examPoint.name} ({examPoint.score}%) ｜ 學生自評：🟡 識一半
          </p>
          <div className="mt-2 rounded-xl bg-[#f4efe4] p-2 text-[12px] leading-5 text-[#21180f]">
            <p className="font-bold">📄 實體講義手寫長題目 (LQ) · Marking Scheme 步驟斷點</p>
            <p className="mt-1">{paper.stem}</p>
            {isEbookPoint(examPoint.code) ? (
              <EbookRevealer
                shown={demo.ebookShown}
                breakLine={demo.ebookBreak}
                hits={ebookHits(demo.hotkeys)}
                onNav={(dir) => demo.dispatch({ type: "ebook-nav", dir })}
                onBreak={(line) => demo.dispatch({ type: "ebook-break", line })}
              />
            ) : (
              <div className="mt-2 space-y-1">
                {paper.steps.map((step, index) => (
                  <p key={step.title} className={step.status === "break" ? "rounded bg-[#e24b3c]/20 px-1" : step.status === "got" ? "rounded bg-[#143524]/15 px-1" : "rounded bg-black/5 px-1"}>
                    Step {index + 1} [{step.mark} {step.status === "got" ? "✅ 已得分" : step.status === "break" ? "❌ 斷點失分" : "⚪ 連帶失分"}]：{step.title}（{step.self}）
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {(["1", "2", "3"] as const).map((key) => (
              <button key={key} className="rounded-xl bg-white/10 px-2 py-2 text-left text-[11px] font-bold" onClick={() => demo.dispatch({ type: "hotkey", key })}>
                {paper.keys[key].label}
              </button>
            ))}
            <button className="rounded-xl bg-white/10 px-3 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { hotkeys: [] } })}>清空</button>
          </div>
          <p className="num mt-1 text-sm">序列：{demo.hotkeys.join(" → ") || "尚未按鍵"}</p>
          {demo.hotkeys.length ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {demo.hotkeys.map((key) => (
                <span key={key + paper.code} className="rounded-full bg-[#e24b3c] px-2 py-1 text-[11px]">{paper.keys[key as "1" | "2" | "3"]?.detail}</span>
              ))}
              {demo.subject === "Maths"
                ? demo.hotkeys.map((key) => {
                    const ma = paper.keys[key as "1" | "2" | "3"]?.ma;
                    return ma ? <span key={ma} className="rounded-full bg-white/10 px-2 py-1 text-[10px]">輔助能力標示：{ma}</span> : null;
                  })
                : null}
            </div>
          ) : null}
          {combo || demo.studentCard?.kind === "twin" ? (
            <div className="mt-2 rounded-xl bg-black/25 p-2 text-[11px] leading-5 text-[#b6f3d2]">
              <p>{isEbookPoint(examPoint.code) ? "🧬 長題目防棄考雙階段：明晚 20:00 只補菱形 Step 6 的 1M（90 秒）。+7 日才交 JM29.2 完整 3 分手寫 LQ，目標 2M + 1A。" : `🧬 長題目防棄考雙階段：明晚 20:00 只補 Step 2 的 1M（90 秒）。+7 日才交 ${examPoint.code} 完整 3 分手寫 LQ，目標 2M + 1A。`}</p>
            </div>
          ) : null}
        </Card>

        <Card dense id="tele" kicker="🎙️ AI 雙週戰報語音提詞器 (15s 個人化講稿)" title={focus.name}>
          <p className="text-[11px] text-[#e4c07a]">已自動帶入：純中文課題名 + LQ 步驟 + C/R/E</p>
          <div className="relative mt-1 rounded-xl bg-black/40 p-2">
            <div className={demo.recording && !demo.paused ? "tele-run" : ""}>
              <p className="text-sm leading-6">{script}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <button className="rounded-lg bg-[#e24b3c] px-2 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { recording: !demo.recording, paused: false } })}>
              {demo.recording ? "停止" : "開始錄音"}
            </button>
            <button className="rounded-lg bg-white/10 px-2 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { paused: !demo.paused } })}>
              {demo.paused ? "繼續" : "空白鍵暫停"}
            </button>
            <button className="rounded-lg bg-[#1d4e89] px-2 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "parent-brief" })}>
              📲 一鍵推送至左屏「家長手機」預覽 LQ 提分戰報
            </button>
          </div>
        </Card>
      </div>

      <Card dense id="audit" kicker="10 秒五行審核" title="金 · 木 · 火">
        <p className="mb-2 text-[11px] text-[#93a4b8]">審核對象：KOC 助教 陳*希（15s 分步卡共創品質）</p>
        <div className="grid gap-3 md:grid-cols-3">
          <Audit label="⚔️ 金 · 概念準確" value={demo.audit.metal} onChange={(value) => demo.dispatch({ type: "audit", key: "metal", value })} />
          <Audit label="🌲 木 · Flow 順暢" value={demo.audit.wood} onChange={(value) => demo.dispatch({ type: "audit", key: "wood", value })} />
          <Audit label="🔥 火 · 鏡頭張力" value={demo.audit.fire} onChange={(value) => demo.dispatch({ type: "audit", key: "fire", value })} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="rounded-xl bg-[#e4c07a] px-4 py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "brain-pass" })}>
            ✅ Pass / 核准發放版稅
          </button>
          <button className="rounded-xl bg-[#e24b3c] px-4 py-2 text-sm" onClick={() => demo.dispatch({ type: "csm-handoff" })}>
            ⚠️ 連續紅燈・一鍵轉交 CSM 臨場調校工單
          </button>
        </div>
      </Card>
    </div>
  );
}

function Audit({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="text-xs">
      {label} <span className="num">{value}</span>
      <input className="mt-1 w-full" type="range" min={0} max={100} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function bands(mode: "large" | "small", seats: typeof SEATS, hero: number, wrongs: number, ebook = false) {
  const rows = seats.map((seat) => ({
    ...seat,
    mastery: seat.id === "anson" ? hero : seat.mastery,
    wrongs: seat.id === "anson" ? wrongs : seat.wrongs,
  }));
  if (mode === "large") {
    return [
      {
        title: "≥85% 延伸",
        color: "#8ee0b2",
        rows: rows.filter((row) => row.mastery >= 85),
        action: ebook
          ? { kind: "challenge" as const, title: "🌲 一鍵跳轉派發 e-Book 頂部「Level 2」進階綜合證明題", body: "已跳到 JM29c 頂部 Level 2。" }
          : { kind: "challenge" as const, title: "🌲 免做基礎・派發 DSE 5** 挑戰題", body: "這題跳過基礎，直接做 5** 挑戰。做完才回到主線。" },
      },
      {
        title: "50–84% 主線",
        color: "#e0a825",
        rows: rows.filter((row) => row.mastery >= 50 && row.mastery < 85),
        action: ebook
          ? { kind: "twin" as const, title: "🟡 派發 48h 雙胞胎：e-Book 同小節 (Rhombus) 90s 關鍵步驟微切片", body: "只補菱形斷點。" }
          : { kind: "twin" as const, title: "🟡 派發 48h 雙胞胎變種題 (鎖定 Level 3 同小節)", body: "同一小節、換一個數字。48 小時內答對，才更新掌握度。" },
      },
      {
        title: "<50% 微支線",
        color: "#ffb4ac",
        rows: rows.filter((row) => row.mastery < 50),
        action: ebook
          ? { kind: "steps" as const, title: "🔴 強制推送 e-Book「▸ 0/9 逐行提示器」+「✍️ Replay Ink 筆跡回放卡」", body: "逐行揭曉，不一次顯示 9 步。" }
          : { kind: "steps" as const, title: "🔴 強制推送 15s 雙軌分步卡 + Fast Notes", body: "先看 15 秒分步，再看 Fast Notes。做完才回到班上的主線題。" },
      },
    ];
  }
  return [
    { title: "錯 0–1 題", color: "#8ee0b2", rows: rows.filter((row) => row.wrongs <= 1), action: null },
    { title: "錯 2–3 題", color: "#e0a825", rows: rows.filter((row) => row.wrongs >= 2 && row.wrongs <= 3), action: null },
    { title: "錯 ≥4 題", color: "#ffb4ac", rows: rows.filter((row) => row.wrongs >= 4), action: null },
  ];
}

export function seatTone(score: number) {
  return lightOf(score);
}
