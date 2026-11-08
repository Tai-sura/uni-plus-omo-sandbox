"use client";

import { useEffect, useState } from "react";
import { EBOOK_URL, EBOOK_TABS, JM29_LINES, ebookHits, type EbookTab } from "@/lib/curriculum";
import { useDemo } from "@/lib/demo-context";

export function EbookConsole() {
  const demo = useDemo();
  return (
    <div id="ebook-console" className="rounded-xl bg-black/25 p-2">
      <p className="text-[11px] font-bold text-[#e4c07a]">📖 科組真實 e-Book 授課控制台 (JM29c Quadrilaterals)</p>
      <div className="mt-1 flex flex-wrap gap-1">
        <button
          className="rounded-lg bg-[#1d4e89] px-2 py-1.5 text-left text-[11px] font-bold"
          onClick={() =>
            demo.dispatch({
              type: "patch",
              patch: {
                ebookOpen: !demo.ebookOpen,
                smokeCode: "JM29",
                examCode: "JM29.2",
                ebookTab: "rhombus",
                hotkeys: [],
                split: true,
                phone: "student",
                highlight: "student-ebook",
              },
            })
          }
        >
          📖 展開課堂 e-Book 互動鏡像 (JM29c · Page 2 · Q5 Rhombus)
        </button>
        <a
          className="rounded-lg bg-white/10 px-2 py-1.5 text-[11px] font-bold"
          href={EBOOK_URL}
          target="_blank"
          rel="noreferrer"
        >
          🔗 新分頁開啟真實 JM29c e-Book
        </a>
        <button className="rounded-lg bg-[#143524] px-2 py-1.5 text-[11px]" onClick={() => demo.dispatch({ type: "ebook-sync" })}>
          📲 同步本頁 (JM29c Q5) 12 步解答至 KOC 助教遮罩
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {EBOOK_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${demo.ebookTab === tab.id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`}
            onClick={() => openTab(demo, tab.id, tab.code)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <button className={`rounded-full px-2 py-1 text-[10px] ${demo.ebookPen === "P" ? "bg-[#e24b3c]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { ebookPen: "P" } })}>P 紅筆</button>
        <button className={`rounded-full px-2 py-1 text-[10px] ${demo.ebookPen === "H" ? "bg-[#e0a825] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { ebookPen: "H" } })}>H 螢光筆</button>
        <button className="rounded-full bg-white/10 px-2 py-1 text-[10px]" onClick={() => demo.dispatch({ type: "patch", patch: { ebookRun: demo.ebookRun + 1, ebookOpen: true, smokeCode: "JM29", examCode: "JM29.2", ebookTab: "rhombus", split: true, phone: "student", highlight: "student-ebook" } })}>
          ✍️ Replay this page&apos;s ink
        </button>
        <button
          className="rounded-full bg-white/10 px-2 py-1 text-[10px]"
          onClick={() => {
            demo.dispatch({ type: "patch", patch: { smokeCode: "JM29", examCode: "JM29.2", ebookTab: "rhombus", ebookOpen: true } });
            demo.dispatch({ type: "parent-brief" });
          }}
        >
          📥 Export PDF with ink
        </button>
      </div>
      {demo.kocEbook ? <p className="mt-1 text-[11px] text-[#b6f3d2]">KOC 助教 iPad 已載入 JM29c Q5 (0/12 步 + 定理理由標籤)</p> : null}
      {demo.ebookOpen ? <EbookStage audience="ldc" /> : null}
    </div>
  );
}

export function StudentEbookMirror() {
  const demo = useDemo();
  const live = demo.subject === "Maths" && (demo.ebookOpen || demo.smokeCode === "JM29" || Boolean(demo.examCode?.startsWith("JM29")));
  if (!live) return null;
  return <EbookStage audience="student" />;
}

export function EbookStage({ audience }: { audience: "ldc" | "student" }) {
  const demo = useDemo();
  return (
    <div id={audience === "student" ? "student-ebook" : undefined} className="rounded-xl bg-[#f4efe4] p-2 text-[#21180f]">
      <p className="text-[11px] font-bold">
        {audience === "student" ? "跟住右屏 · " : ""}JM29c · Q5 Rhombus · 3 分 LQ
      </p>
      {audience === "student" ? <p className="text-[10px] text-[#8a5a12]">右屏揭到第幾步、畫到哪一筆，這部手機會同時顯示。</p> : null}
      <p className="mt-1 text-[12px] leading-5">In the figure, CDEF is a rhombus. AFC and BCD are straight lines. If AB = AC and ∠BAC = 42°, find ∠DFE.</p>
      {demo.ebookTab !== "rhombus" ? (
        <p className="mt-1 text-[11px] text-[#8a5a12]">這個分頁是 e-Book 難度層。逐行揭曉仍鎖定 Rhombus Q5，方便對照 Basic / Standard / Level 2。</p>
      ) : null}
      <EbookRevealer
        shown={demo.ebookShown}
        breakLine={demo.ebookBreak}
        hits={ebookHits(demo.hotkeys)}
        student={audience === "student"}
        onNav={(dir) => demo.dispatch({ type: "ebook-nav", dir })}
        onBreak={audience === "student" ? undefined : (line) => demo.dispatch({ type: "ebook-break", line })}
      />
      <button className="mt-2 rounded-lg bg-[#1d4e89] px-2 py-1.5 text-[11px] font-bold text-white" onClick={() => demo.dispatch({ type: "patch", patch: { ebookRun: demo.ebookRun + 1, ebookOpen: true, split: true, phone: "student", highlight: "student-ebook" } })}>
        ✍️ 重播老師 e-Book 手寫拆題筆跡 (Replay Ink · 15s)
      </button>
      <RhombusInk runId={demo.ebookRun} pen={demo.ebookPen} />
      {audience === "ldc" ? (
        <p className="mt-1 rounded-lg bg-[#fff6d8] px-2 py-1 text-[10px] leading-4 text-[#5c4310]">
          💡 零額外拍片成本：LDC 上堂在 e-Book 畫的筆跡 (Save Ink JSON) + 逐行步驟 (0/12)，下課自動打包成 &lt;50% 學生的 15s 筆跡回放急救卡！
        </p>
      ) : null}
    </div>
  );
}

function openTab(demo: ReturnType<typeof useDemo>, tab: EbookTab, code: string) {
  demo.dispatch({
    type: "patch",
    patch: { ebookTab: tab, ebookOpen: true, smokeCode: "JM29", examCode: code, hotkeys: [], split: true, phone: "student", highlight: "student-ebook" },
  });
}

export function EbookRevealer({
  shown,
  breakLine,
  hits,
  onNav,
  onBreak,
  student = false,
}: {
  shown: number;
  breakLine: number | null;
  hits: number[];
  onNav: (dir: "next" | "all" | "prev" | "reset") => void;
  onBreak?: (line: number) => void;
  student?: boolean;
}) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("next")}>
          {student ? `▸ 揭曉下一步提示 (目前 ${shown}/${JM29_LINES.length})` : "▸ 下一步"}
        </button>
        {student ? null : (
          <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("all")}>» 全部顯示</button>
        )}
        <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("prev")}>◂ 上一步</button>
        <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("reset")}>↺ 重置</button>
        <span className="rounded-lg bg-white/70 px-2 py-1 text-[11px]">當前顯示：{shown} / {JM29_LINES.length} 步</span>
      </div>
      <div className="mt-2 space-y-1">
        {JM29_LINES.slice(0, shown).map((line, index) => {
          const lineNo = index + 1;
          const marked = breakLine === lineNo || hits.includes(lineNo);
          return (
            <button
              key={line.expr + lineNo}
              className={`flex w-full items-start justify-between gap-2 rounded px-1 py-1 text-left text-[12px] leading-5 ${marked ? "bg-[#e24b3c]/25" : "bg-white/60"}`}
              onClick={() => onBreak?.(lineNo)}
            >
              <span className="whitespace-pre-wrap">
                {lineNo}. {line.expr}
                {line.reason ? <span className="ml-1 inline-block rounded bg-[#d5d5d5] px-1.5 py-0.5 text-[10px] font-semibold text-[#444]">{line.reason}</span> : null}
                {line.mark ? <span className="ml-1 text-[10px] font-bold text-[#8a5a12]">{line.mark}</span> : null}
              </span>
              <span className="max-w-[46%] text-right text-[10px] text-[#5c5346]">{line.note}</span>
            </button>
          );
        })}
        {shown === 0 ? <p className="text-[11px] text-[#5c5346]">尚未揭曉。按 ▸ 逐行看算式，右側灰色膠囊是定理理由。</p> : null}
      </div>
    </div>
  );
}

export function StudentEbookCard() {
  const demo = useDemo();
  const [shown, setShown] = useState(0);
  const [reward, setReward] = useState(false);
  const [runId, setRunId] = useState(0);
  const next = () => setShown((value) => Math.min(JM29_LINES.length, value + 1));
  return (
    <div>
      <p className="text-[11px] text-[#e4c07a]">📝 LQ 長題目步驟拆解 (1M/1A) · JM29c Q5</p>
      <p className="mt-1 text-[12px] leading-5">CDEF 是菱形，AB = AC，∠BAC = 42°，求 ∠DFE。自己揭提示，唔好一次睇晒答案。</p>
      <EbookRevealer
        shown={shown}
        breakLine={null}
        hits={[]}
        student
        onNav={(dir) => {
          if (dir === "next") next();
          if (dir === "prev") setShown((value) => Math.max(0, value - 1));
          if (dir === "reset") {
            setShown(0);
            setReward(false);
          }
        }}
      />
      {shown >= 8 && shown < JM29_LINES.length ? (
        <button
          className="mt-2 w-full rounded-xl bg-[#e4c07a] px-2 py-2 text-[12px] font-bold text-[#1b1406]"
          onClick={() => {
            setReward(true);
            demo.dispatch({ type: "toast", text: "自主搶回 1A。見到 ∠DFC = ∠DFE 之後，自己計埋 34.5°。" });
          }}
        >
          我識計落去，搶回 1A
        </button>
      ) : null}
      {reward ? <p className="mt-1 text-[12px] font-bold text-[#b6f3d2]">已獎勵：自主搶回 1A。你喺 {shown}/{JM29_LINES.length} 就停低自己計。</p> : null}
      <button className="mt-2 rounded-lg bg-white/10 px-2 py-1.5 text-[11px]" onClick={() => setRunId((value) => value + 1)}>
        ✍️ 重播老師 e-Book 手寫拆題筆跡 (Replay Ink · 15s)
      </button>
      <RhombusInk runId={runId} pen="both" />
    </div>
  );
}

export function RhombusInk({ runId, pen, frame }: { runId: number; pen: "P" | "H" | "both"; frame?: number }) {
  const [tick, setTick] = useState(frame ?? 0);
  useEffect(() => {
    if (frame != null) {
      setTick(frame);
      return;
    }
    if (!runId) return;
    setTick(0);
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setTick(step);
      if (step >= JM29_LINES.length) window.clearInterval(timer);
    }, 900);
    return () => window.clearInterval(timer);
  }, [runId, frame]);

  const showRed = pen !== "H";
  const showHigh = pen !== "P";
  return (
    <div className="mt-2 rounded-xl bg-white p-2 text-[#21180f]">
      <svg viewBox="0 0 250 190" className="mx-auto h-48 w-full max-w-[280px]">
        {showHigh && tick >= 8 ? <polygon points="132,158 210,158 194,92 116,92" fill="#ffe14a" opacity="0.75" /> : null}
        {showHigh && tick >= 3 && tick < 8 ? <polygon points="100,16 24,158 132,158" fill="#c9e4ff" opacity="0.55" /> : null}
        <polygon points="100,16 24,158 132,158" fill="none" stroke="#243044" strokeWidth="1.8" />
        <line x1="132" y1="158" x2="210" y2="158" stroke="#243044" strokeWidth="1.8" />
        <polyline points="132,158 116,92 194,92 210,158" fill="none" stroke="#243044" strokeWidth="1.8" />
        <line x1="116" y1="92" x2="210" y2="158" stroke="#243044" strokeWidth="1.4" />
        <path d="M100,34 L92,30 L96,40" fill="none" stroke="#243044" strokeWidth="1.2" />
        {showRed && tick >= 2 ? <g stroke="#d10f0f" strokeWidth="1.6">
          <line x1="62" y1="78" x2="70" y2="86" />
          <line x1="66" y1="74" x2="74" y2="82" />
          <line x1="112" y1="78" x2="120" y2="70" />
          <line x1="116" y1="82" x2="124" y2="74" />
        </g> : null}
        {showRed && tick >= 7 ? <text x="136" y="150" fontSize="11" fill="#d10f0f">69°</text> : null}
        {showRed && tick >= 8 ? <path d="M124,104 L132,108 L128,116" fill="none" stroke="#d10f0f" strokeWidth="1.5" /> : null}
        {showRed && tick >= 9 ? <g stroke="#d10f0f" strokeWidth="1.4">
          <line x1="150" y1="88" x2="162" y2="88" />
          <line x1="70" y1="154" x2="82" y2="154" />
        </g> : null}
        {showRed && tick >= 12 ? <text x="128" y="84" fontSize="11" fill="#d10f0f">34.5°</text> : null}
        <text x="94" y="12" fontSize="11" fill="#243044">A</text>
        <text x="10" y="168" fontSize="11" fill="#243044">B</text>
        <text x="124" y="176" fontSize="11" fill="#243044">C</text>
        <text x="206" y="176" fontSize="11" fill="#243044">D</text>
        <text x="104" y="88" fontSize="11" fill="#243044">F</text>
        <text x="196" y="88" fontSize="11" fill="#243044">E</text>
        <text x="78" y="36" fontSize="11" fill={showRed && tick >= 5 ? "#d10f0f" : "#243044"}>42°</text>
      </svg>
      <p className="text-center text-[10px] leading-4">
        {tick >= 12
          ? "∠DFE = 34.5°"
          : tick >= 8
            ? "∠DFC = ∠DFE  [property of rhombus]"
            : tick >= 7
              ? "∠ACB = 69°  [∠ sum of △]"
              : tick >= 3
                ? "∠ABC = ∠ACB  [base ∠s, isos. △]"
                : "Q5 · CDEF rhombus · 筆跡回放"}
      </p>
    </div>
  );
}
