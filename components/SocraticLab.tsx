"use client";

import { useEffect, useState } from "react";
import { JM29_LINES, lqPaper } from "@/lib/curriculum";
import { useDemo } from "@/lib/demo-context";
import { RefractionInk, RhombusInk } from "./EbookKit";

type Rhythm = "spiral" | "fresh" | "sprint";
type Paper = "mc" | "lq";

const BAND = { mc: { min: 60, max: 90 }, lq: { min: 180, max: 240 } } as const;

export function SocraticLab() {
  const demo = useDemo();
  const maths = demo.subject === "Maths";
  const [rhythm, setRhythm] = useState<Rhythm>("spiral");
  const [paper, setPaper] = useState<Paper>("lq");
  const [left, setLeft] = useState<number>(BAND.lq.max);
  const [running, setRunning] = useState(false);
  const [eye, setEye] = useState<"idle" | "hit" | "narrow" | "retry">("idle");
  const [second, setSecond] = useState(0);
  const [shot, setShot] = useState<"none" | "photo" | "skip">("none");
  const [spot, setSpot] = useState(false);
  const [overlay, setOverlay] = useState(demo.overlay);
  const [checks, setChecks] = useState<[boolean, boolean]>([false, false]);
  const [asking, setAsking] = useState(true);
  const [pill, setPill] = useState<"why" | "speed" | "mark" | null>(null);

  const cap = BAND[paper].max;
  const floor = BAND[paper].min;
  const stopped = left <= 0;
  const code = maths ? "JM29.2" : "JPWM07.2";
  const sheet = lqPaper(demo.subject, code);
  const hitLabel = maths ? "兩個相異實根" : "水";
  const choices = maths
    ? [
        ["一元二次方程", false],
        ["兩個相異實根", true],
        ["實數 k", false],
      ]
    : [
        ["水", true],
        ["空氣", false],
        ["入射角", false],
      ];

  useEffect(() => {
    if (!running || left <= 0) return;
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, left]);

  useEffect(() => {
    setEye("idle");
    setPill(null);
    setSpot(false);
    setShot("none");
    setChecks([false, false]);
  }, [demo.subject]);

  const write = (trace: string, extra?: { weight?: number; hint?: 0 | 1 | 2 | 3; note?: string; alert?: boolean }) => {
    const notes = extra?.note && !demo.notes.includes(extra.note) ? [...demo.notes, extra.note] : demo.notes;
    demo.dispatch({
      type: "patch",
      patch: {
        labTrace: trace,
        eyeWeight: extra?.weight ?? demo.eyeWeight,
        hint: extra?.hint ?? demo.hint,
        notes,
        capsules: extra?.note ? true : demo.capsules,
        kocAlert: extra?.alert ?? demo.kocAlert,
        toast: trace,
      },
    });
  };

  const switchPaper = (next: Paper) => {
    setPaper(next);
    setLeft(BAND[next].max);
    setRunning(false);
  };

  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const hot = rhythm === "sprint";

  return (
    <main className={`mx-auto grid max-w-[1100px] gap-3 px-3 py-3 lg:grid-cols-2 ${hot ? "rounded-3xl bg-[#2a120c]" : ""}`}>
      <header>
        <p className="text-[11px] tracking-[0.16em] text-[#e4c07a]">藍圖 2.3 · 五條平衡鐵律</p>
        <h1 className="text-2xl font-bold">🧠 蘇格拉底應試艙</h1>
        <p className="mt-1 text-sm leading-6 text-[#c5d0de]">免打字、有止損、隨考期減負。物理科只標 C / R / E，不出現 MA。</p>
        <p className="mt-1 text-[11px] text-[#93a4b8]">
          現在科目：{maths ? "數學" : "物理"} · 診斷對齊 {maths ? "R→MA3，C→MA1，E→MA2 / MA5" : "只顯示 C / R / E"}
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[#102033] p-3 lg:col-span-2">
        <p className="text-[11px] font-bold text-[#e4c07a]">艙位 1 · 鐵律 5 三段式時鐘 ＋ 鐵律 1 止損區間</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            [
              ["spiral", "🌀 常規螺旋 >14 日"],
              ["fresh", "🛡️ 考前 14–8 日保鮮"],
              ["sprint", "⚡ 考前 ≤7 日極速"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={`rounded-full px-2 py-1 text-[11px] font-bold ${rhythm === id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => setRhythm(id)}>
              {label}
            </button>
          ))}
        </div>
        <RhythmBoard rhythm={rhythm} maths={maths} notes={demo.notes} />
        <p className="mt-1 text-[11px] text-[#93a4b8]">這三段時鐘只在艙內。不改控制台的 Day 1、+48h 雙胞胎和衰減分數。</p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <button className={`rounded-lg px-2 py-1 text-[11px] font-bold ${paper === "mc" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => switchPaper("mc")}>⚡ MC 單步 · 止損鎖定 60–90 秒</button>
          <button className={`rounded-lg px-2 py-1 text-[11px] font-bold ${paper === "lq" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => switchPaper("lq")}>📝 LQ 長題目 70% · 止損鎖定 180–240 秒</button>
          <p className={`num text-3xl font-black ${stopped ? "text-[#ffb4ac]" : "text-white"}`}>{clock}</p>
          <button className="rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => { setLeft(cap); setRunning(true); }}>由上沿開始</button>
          <button className="rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => { setLeft(0); setRunning(false); write(`${paper === "mc" ? "MC 60–90" : "LQ 180–240"} 秒止損上沿已到。系統停止追問。`); }}>快轉到止損</button>
        </div>
        {stopped ? <p className="mt-1 text-[12px] text-[#ffb4ac]">已到止損上沿。不再無限追問。</p> : <p className="mt-1 text-[11px] text-[#93a4b8]">對外鎖定 {floor}–{cap} 秒。倒數由上沿 {cap} 秒開始，MC 與 LQ 各用自己的區間。</p>}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#102033] p-3">
        <p className="text-[11px] font-bold text-[#e4c07a]">SOC2 · 鐵律 2 首擊題眼 · 修復 [R 審題]{maths ? " · MA3 圖文轉化" : ""}</p>
        <p className="mt-1 text-sm leading-6">{maths ? "方程 x² − (k−2)x + (k+1) = 0 有兩個相異實根，求 k 的範圍。" : "光線由水斜向射入空氣時，折射角與入射角的關係是？"}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(eye === "narrow" || eye === "retry" ? choices.filter((item) => item[1] || item[0] !== (maths ? "實數 k" : "入射角")) : choices).map(([label, ok]) => (
            <button
              key={String(label)}
              className="rounded-full bg-white/10 px-3 py-2 text-sm"
              onClick={() => {
                if (ok && eye !== "narrow") {
                  setEye("hit");
                  write(`首擊命中「${hitLabel}」。R 審題權重保留 80%。`, { weight: 80, hint: 1 });
                } else if (ok) {
                  setEye("retry");
                  write("二次二選一命中。權重改為 65%。", { weight: 65, hint: 2 });
                } else {
                  setEye("narrow");
                }
              }}
            >
              {label}{ok ? " 🔥" : ""}
            </button>
          ))}
        </div>
        {eye === "hit" ? <p className="mt-2 text-sm text-[#b6f3d2]">🎯 首擊命中 R-審題題眼。保留 80% 權重，已解鎖下一步列式。</p> : null}
        {eye === "narrow" ? <p className="mt-2 text-sm text-[#ffd58a]">💡 {maths ? "點解「實數 k」唔係決定不等式符號嘅關鍵？再對比剩低兩個字眼。" : "點解「入射角」唔係判斷遠近法線嘅關鍵？先睇光線由水入空氣。"} 命中後權重 65%。</p> : null}
        {eye === "retry" ? <p className="mt-2 text-sm text-[#b6f3d2]">二次對比命中。權重 65%。</p> : null}
        {eye !== "idle" ? <button className="mt-2 rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => setEye("idle")}>↺ 重試點題眼</button> : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#102033] p-3">
        <p className="text-[11px] font-bold text-[#e4c07a]">SOC3 · 鐵律 3 上半 · 15 秒左 Why × 右 How · 左欄修 [C]{maths ? " / MA1" : ""}，右欄修 [E]{maths ? " / MA2·MA5" : ""}</p>
        <p className="text-[10px] text-[#93a4b8]">🏆 林知行團隊 × Adrian 何希 · 掛載 {code}</p>
        <div className="mt-2 flex gap-1">
          {[0, 5, 10, 15].map((mark) => (
            <button key={mark} className={`rounded-full px-2 py-1 text-[11px] ${second === mark ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => {
              setSecond(mark);
              if (!maths) return;
              const shown = mark === 0 ? 0 : mark === 5 ? 7 : mark === 10 ? 8 : 12;
              demo.dispatch({
                type: "patch",
                patch: {
                  ebookShown: shown,
                  ebookOpen: true,
                  ebookBreak: mark === 10 ? 8 : mark === 15 ? 12 : null,
                  smokeCode: "JM29",
                  examCode: "JM29.2",
                  split: true,
                  phone: "student",
                  highlight: "student-ebook",
                  kocEbook: true,
                },
              });
            }}>{mark}s</button>
          ))}
        </div>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-xl bg-[#f4efe4] p-2 text-[#21180f]">
            <p className="text-[11px] font-bold">🧠 概念 Why</p>
            {maths ? (
              <>
                <p className="text-[12px] leading-5">
                  In the figure, <span className="rounded border border-dashed border-[#1f8a4c] px-1">CDEF is a rhombus</span>. If <span className="rounded border border-dashed border-[#2f6fed] px-1">AB = AC</span> and <span className="rounded border border-dashed border-[#d4537e] px-1">∠BAC = 42°</span>, find ∠DFE.
                </p>
                <RhombusInk runId={0} pen="both" frame={second >= 15 ? 12 : second >= 10 ? 8 : second >= 5 ? 7 : 0} />
              </>
            ) : <RefractionInk />}
            {second >= 10 ? <p className="text-[11px]">{maths ? "菱形對角線平分 ∠EFC，所以 ∠DFC = ∠DFE。" : "水比空氣光密。由水入空氣會遠離法線，折射角大於入射角。"}</p> : null}
          </div>
          <div className="rounded-xl bg-black/30 p-2">
            <p className="text-[11px] font-bold text-[#e4c07a]">🎯 應試 How · {code}</p>
            {maths ? (
              <div className="mt-1 space-y-1">
                {JM29_LINES.slice(0, second === 0 ? 0 : second === 5 ? 7 : second === 10 ? 8 : 12).map((line, index) => (
                  <p key={line.expr} className={`text-[12px] leading-5 ${line.expr.includes("34.5") || line.reason === "property of rhombus" ? "underline" : ""}`}>
                    {index + 1}. {line.expr}{line.reason ? <span className="ml-1 italic text-[#9ec1ff]">{line.reason}</span> : null}
                  </p>
                ))}
                {second === 0 ? <p className="text-[12px]">尚未揭行。5 秒到 ∠ACB = 69°，10 秒到 property of rhombus，15 秒到 34.5°。左右屏 e-Book 同步這一步。</p> : null}
              </div>
            ) : (
              <div className="mt-1 space-y-1">
                <p className="text-[12px] leading-5">{sheet.stem}</p>
                {sheet.steps.slice(0, second === 0 ? 1 : second === 5 ? 2 : 3).map((step) => (
                  <p key={step.title} className="text-[12px] leading-5"><b>{step.mark}</b> {step.title}</p>
                ))}
              </div>
            )}
            {second >= 15 && maths ? <p className="mt-1 text-[11px] text-[#e4c07a]">對應 e-Book 12/12。CASIO：69 ÷ 2 = 34.5，再寫 °。</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#102033] p-3">
        <p className="text-[11px] font-bold text-[#e4c07a]">SOC4 · 鐵律 3 下半 · 作圖防偽 · 修復 [E]{maths ? " · MA5 幾何處理" : ""}</p>
        <p className="text-[11px]">🏠 {demo.commute ? "通勤模式：紙筆作圖題已過濾" : "課堂／居家：作圖題開啟"}</p>
        <div className="mt-1 flex gap-1">
          <button className={`rounded-full px-2 py-1 text-[11px] ${!demo.commute ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { commute: false } })}>課堂／居家</button>
          <button className={`rounded-full px-2 py-1 text-[11px] ${demo.commute ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { commute: true } })}>通勤</button>
        </div>
        {demo.commute ? <p className="mt-2 text-sm">通勤不派紙筆作圖。改做 Fast Notes。學生手機的作圖頁會同時收起。</p> : (
          <>
            <div className="mt-2 flex flex-wrap gap-1">
              <button className="rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => setShot("photo")}>📷 拍照留檔（可選）</button>
              <button className="rounded-lg bg-white/10 px-2 py-1 text-[11px]" onClick={() => setShot("skip")}>⏭️ 我已在講義畫好</button>
            </div>
            {shot !== "none" ? <p className="mt-1 text-[11px]">{shot === "photo" ? "已留本地檔，不強制上傳原圖。" : "跳過上傳，直接對答案。"} 再點圖上的紅色熱區。</p> : null}
            {shot !== "none" && !spot ? (
              maths
                ? <RhombusInk runId={0} pen="both" frame={8} hotspot onHotspot={() => setSpot(true)} />
                : <RefractionInk hotspot onHotspot={() => setSpot(true)} />
            ) : null}
            {spot ? (
              <>
                <label className="mt-2 block text-[11px]">透明標準圖層 {overlay}%
                  <input className="mt-1 w-full" type="range" min={0} max={100} value={overlay} onChange={(event) => { const value = Number(event.target.value); setOverlay(value); demo.dispatch({ type: "patch", patch: { overlay: value } }); }} />
                </label>
                <div className="relative mt-2 h-24 overflow-hidden rounded-xl bg-[#081018]">
                  <p className="p-3 text-sm text-[#7d8da1]">{maths ? "學生手繪菱形（底圖）" : "學生手繪光線（底圖）"}</p>
                  <p className="absolute inset-0 p-3 text-sm font-bold text-[#e24b3c]" style={{ opacity: overlay / 100 }}>{maths ? "標準層：直角符號 + 平分角 34.5°" : "標準層：法線虛線 + 遠離法線箭頭"}</p>
                </div>
                {["已標示方向箭頭或直角符號 (1M)", "虛實線及角度比例正確 (1A)"].map((label, index) => (
                  <label key={label} className="mt-1 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={checks[index]} onChange={() => {
                      const next: [boolean, boolean] = [...checks];
                      next[index] = !next[index];
                      setChecks(next);
                      if (next.every(Boolean)) write("作圖 2 點 Checklist 完成。KOC iPad 收到 1 秒覆核。", { alert: true });
                    }} />
                    {label}
                  </label>
                ))}
              </>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#102033] p-3">
        <p className="text-[11px] font-bold text-[#e4c07a]">SOC5 · 鐵律 4 免打字三維膠囊 · 作答後不倒扣</p>
        <div className="mt-1 flex gap-1">
          <button className={`rounded-full px-2 py-1 text-[11px] ${asking ? "bg-[#e24b3c]" : "bg-white/10"}`} onClick={() => { setAsking(true); setPill(null); }}>🔒 作答中 · 只開 Hint 1–3</button>
          <button className={`rounded-full px-2 py-1 text-[11px] ${!asking ? "bg-[#143524]" : "bg-white/10"}`} onClick={() => setAsking(false)}>🔓 已提交 · 免費解鎖</button>
        </div>
        {asking ? <p className="mt-2 text-sm">作答中不開放三維膠囊，避免用提示換分數。Hint 權重仍按 h1=80%、h2=65%。</p> : (
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {(
              [
                ["why", "💡 原理消化", maths ? "點解菱形對角線會平分內角？因為四邊相等，對角線平分 ∠EFC，所以 ∠DFC = ∠DFE。" : "點解由水入空氣會遠離法線？水比空氣光密，走向光疏介質。"],
                ["speed", "⚡ 解難突破", maths ? "MC 可代入 k=0 看判別式符號，先排除再算範圍。" : "先判斷水比空氣光密。若選項寫靠近法線，直接排除。"],
                ["mark", "🎯 Marking 捉咩字", maths ? "LQ 必寫 property of rhombus，答案 ∠DFE = 34.5°。" : "LQ 必寫「遠離法線，折射角大於入射角」。"],
              ] as const
            ).map(([id, title, body]) => (
              <div key={id} className="rounded-xl bg-black/30 p-2 text-left">
                <button className="text-sm font-bold" onClick={() => setPill(id)}>{title}</button>
                {pill === id ? <p className="mt-1 text-[12px] leading-5">{body}</p> : null}
                {pill === id ? (
                  <button
                    className="mt-2 rounded-lg bg-[#e4c07a] px-2 py-1 text-[11px] font-bold text-[#1b1406]"
                    onClick={() => {
                      const note = `${code} · ${title}`;
                      write(`已存入 ${code} Fast Notes。考前 ≤7 日可重溫。`, { note });
                    }}
                  >
                    ➕ 1 秒存入 {code}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {demo.notes.length ? <p className="mt-2 text-[11px] text-[#b6f3d2]">閃卡盒：{demo.notes.join(" ｜ ")}</p> : null}
      </section>

      <section className="rounded-2xl border border-[#e4c07a]/40 bg-[#241c10] p-3 lg:col-span-2">
        <p className="text-[11px] font-bold text-[#e4c07a]">SOC6–SOC7 · 診斷閉環與雙向傳送門</p>
        <p className="mt-1 text-sm leading-6">點題眼寫 R，左欄 Why 寫 C，右欄 How、作圖拉桿和 Marking 膠囊寫 E。{maths ? "數學另標 MA。" : "物理不標 MA。"} 寫回文字會出現在 LDC 錨點，閃卡出現在學生手機的 Fast Notes。</p>
        {demo.labTrace ? <p className="mt-1 text-[12px] text-[#b6f3d2]">最近一次寫回：{demo.labTrace}</p> : null}
        <button className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "patch", patch: { labOpen: false, split: true, phone: "student", desk: "ldc" } })}>
          返回左屏學生手機 ＋ 右屏 LDC
        </button>
      </section>
    </main>
  );
}

function RhythmBoard({ rhythm, maths, notes }: { rhythm: Rhythm; maths: boolean; notes: string[] }) {
  if (rhythm === "fresh") {
    return (
      <div className="mt-2 rounded-xl bg-black/30 p-2 text-sm leading-6">
        保鮮抽查：{maths ? "JM20 畢氏定理，上次練習 2026-10-12（至 2026-11-08 已 27 日），雷達 82% 淺綠。" : "JPWM06 光的反射，上次練習 2026-10-05（至 2026-11-08 已 34 日），雷達 88% 深綠。"} 超過 21 日未碰，派 1 題 30 秒。建議 UT 2026-11-18，距今 10 日。
      </div>
    );
  }
  if (rhythm === "sprint") {
    const hot = maths ? ["SM02 一元二次方程 52%", "JM29 四邊形 44%", "SM03 函數 61%"] : ["JPWM07 光的折射 69%", "SPEM01 靜電學 57%", "SPEM02 電路 64%"];
    return (
      <div className="mt-2 rounded-xl bg-[#3a1c22] p-2 text-sm leading-6">
        深綠和新課題已隱藏。只留紅／黃燈：{hot.join("、")}。建議 UT 2026-11-12，距今 4 日。閃卡：{notes.length ? notes.join("、") : "尚未存入"}。
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-xl bg-[#143524] p-2 text-sm leading-6">
      常規螺旋：三層引導開着，48 小時雙胞胎照排。建議 UT 2026-11-30，距今 22 日。🌲 深綠課題免做，例如 {maths ? "JM12 因式分解 86%" : "JPWM06 光的反射，上次 2026-10-05"}。
    </div>
  );
}

