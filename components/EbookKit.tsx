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
          📖 展開課堂 e-Book 互動鏡像 (JM29c · Page 1 · Q4 Rhombus)
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
          📲 同步本頁 (JM29c P.1) 9 步解答至 KOC 助教遮罩
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
      {demo.kocEbook ? <p className="mt-1 text-[11px] text-[#b6f3d2]">KOC 助教 iPad 已載入 JM29c Page 1 Q4 (0/9 步 + 定理理由標籤)</p> : null}
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
        {audience === "student" ? "跟住右屏 · " : ""}JM29c · Page 1 · Q4 Rhombus · 3 分 LQ
      </p>
      {audience === "student" ? <p className="text-[10px] text-[#8a5a12]">右屏揭到第幾步、畫到哪一筆，這部手機會同時顯示。</p> : null}
      <p className="mt-1 text-[12px] leading-5">在菱形 ABCD 中，對角線相交於 O。已知 AB = 17 cm 及 AC = 30 cm，求 BO 的長度。</p>
      {demo.ebookTab !== "rhombus" ? (
        <p className="mt-1 text-[11px] text-[#8a5a12]">這個分頁是 e-Book 難度層。逐行揭曉仍鎖定 Rhombus Q4，方便對照 Basic / Standard / Level 2。</p>
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
          💡 零額外拍片成本：LDC 上堂在 e-Book 畫的筆跡 (Save Ink JSON) + 逐行步驟 (0/9)，下課自動打包成 &lt;50% 學生的 15s 筆跡回放急救卡！
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
          {student ? `▸ 揭曉下一步提示 (目前 ${shown}/9)` : "▸ 下一步"}
        </button>
        {student ? null : (
          <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("all")}>» 全部顯示</button>
        )}
        <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("prev")}>◂ 上一步</button>
        <button className="rounded-lg bg-[#21180f] px-2 py-1 text-[11px] font-bold text-white" onClick={() => onNav("reset")}>↺ 重置</button>
        <span className="rounded-lg bg-white/70 px-2 py-1 text-[11px]">當前顯示：{shown} / 9 步</span>
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
  const next = () => setShown((value) => Math.min(9, value + 1));
  return (
    <div>
      <p className="text-[11px] text-[#e4c07a]">📝 LQ 長題目步驟拆解 (1M/1A) · JM29c Page 1 Q4</p>
      <p className="mt-1 text-[12px] leading-5">在菱形 ABCD 中，AB = 17 cm，AC = 30 cm，求 BO。自己揭提示，唔好一次睇晒答案。</p>
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
      {shown >= 2 && shown < 9 ? (
        <button
          className="mt-2 w-full rounded-xl bg-[#e4c07a] px-2 py-2 text-[12px] font-bold text-[#1b1406]"
          onClick={() => {
            setReward(true);
            demo.dispatch({ type: "toast", text: "自主搶回 1M + 1A。呢度見到 AO = ½ AC 之後，自己計埋 BO。" });
          }}
        >
          我識計落去，搶回 1M + 1A
        </button>
      ) : null}
      {reward ? <p className="mt-1 text-[12px] font-bold text-[#b6f3d2]">已獎勵：自主搶回 1M + 1A。你喺 {shown}/9 就停低自己計。</p> : null}
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
      if (step >= 9) window.clearInterval(timer);
    }, 900);
    return () => window.clearInterval(timer);
  }, [runId, frame]);

  const showRed = pen !== "H";
  const showHigh = pen !== "P";
  return (
    <div className="mt-2 rounded-xl bg-white p-2 text-[#21180f]">
      <svg viewBox="0 0 220 250" className="mx-auto h-44 w-full max-w-[240px]">
        {showHigh && tick >= 5 ? <polygon points="110,28 186,122 110,122" fill="#ffe14a" opacity="0.7" /> : null}
        <polygon points="110,28 186,122 110,216 34,122" fill="none" stroke="#243044" strokeWidth="2" />
        {tick >= 2 ? <line x1="110" y1="28" x2="110" y2="216" stroke="#243044" strokeWidth="1.4" /> : null}
        {tick >= 2 ? <line x1="34" y1="122" x2="186" y2="122" stroke="#243044" strokeWidth="1.4" /> : null}
        {showRed && tick >= 6 ? <path d="M110,108 H122 V122" fill="none" stroke="#d10f0f" strokeWidth="2" /> : null}
        <text x="104" y="22" fontSize="11" fill="#243044">A</text>
        <text x="190" y="126" fontSize="11" fill="#243044">B</text>
        <text x="104" y="232" fontSize="11" fill="#243044">C</text>
        <text x="18" y="126" fontSize="11" fill="#243044">D</text>
        <text x="114" y="118" fontSize="11" fill="#243044">O</text>
        {tick >= 1 ? <text x="132" y="78" fontSize="11" fill={showRed ? "#d10f0f" : "#243044"}>17 cm</text> : null}
        {tick >= 4 ? <text x="72" y="84" fontSize="11" fill={showRed ? "#d10f0f" : "#243044"}>15 cm</text> : null}
        {tick >= 9 ? <text x="128" y="146" fontSize="11" fill={showRed ? "#d10f0f" : "#243044"}>8 cm</text> : null}
      </svg>
      <p className="text-center text-[10px] leading-4">
        {tick >= 6 ? "∠AOB = 90°  [property of rhombus]" : tick >= 2 ? "AO = ½ AC  [property of rhombus]" : "菱形 ABCD · 筆跡回放"}
        {tick >= 7 ? " · [Pyth. theorem]" : ""}
      </p>
    </div>
  );
}
