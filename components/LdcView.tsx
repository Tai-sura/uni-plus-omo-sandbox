"use client";

import { useEffect } from "react";
import { HERO, ICE, SEATS } from "@/lib/mock-data";
import { useDemo } from "@/lib/demo-context";
import { lightOf } from "@/lib/mastery";
import { Card } from "./ui";

const SCRIPT = "今日課題：二次方程。先睇題目問緊邊個未知數，再決定用因式分解定公式。判別式大於零有兩個實根，等於零有一個重根，小於零無實根。單位同答案要一齊寫，這就是 MA2 代數運算最常漏的一步。";

export function LdcView() {
  const demo = useDemo();
  const seats = demo.classMode === "large" ? SEATS : SEATS.slice(0, 8);
  const combo = demo.hotkeys.includes("2") && demo.hotkeys.includes("3");

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
    <div className="space-y-3">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-[#e4c07a]">LDC 指揮官 · {HERO.ldc}</p>
          <h2 className="text-xl font-bold">課中分流與 60 秒批改</h2>
        </div>
        <p className="text-xs text-[#93a4b8]">督導版稅 {demo.royalty} EduToken</p>
      </header>

      <Card id="heatmap" kicker="課前 Top 2 冒煙" title="缺數據就現場做 3 題破冰">
        {demo.regrouped ? <p className="mb-2 rounded-lg bg-[#3a1c22] px-2 py-1 text-sm">陳*軒錯題數已到 {demo.ansonWrongs}。小班看板把他放進「錯 ≥4 題」。</p> : null}
        <div className="grid gap-2 md:grid-cols-2">
          <Heat label="光的折射" value={demo.iceStep > 0 ? demo.iceHeat.refr : demo.heroScore} />
          <Heat label="靜電學" value={demo.iceStep > 0 ? demo.iceHeat.elec : 45} />
        </div>
        {demo.iceStep < 3 ? (
          <button className="mt-3 rounded-xl bg-[#1d4e89] px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "ice" })}>
            全班作答第 {demo.iceStep + 1} 題：{ICE[demo.iceStep].q}
          </button>
        ) : (
          <p className="mt-2 text-sm text-[#b6f3d2]">3 題都已入帳。上面的熱力是全班結果，不是 toast。</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={`rounded-lg px-3 py-1.5 text-xs ${demo.classMode === "large" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { classMode: "large" } })}>
            20 人大班 · 按掌握度
          </button>
          <button className={`rounded-lg px-3 py-1.5 text-xs ${demo.classMode === "small" ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { classMode: "small" } })}>
            8 人小班 · 按錯題數
          </button>
          <button className="rounded-lg bg-[#1d4e89] px-3 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { batchLogged: true, toast: "舉牌快測已批量錄入。離線結果回寫 8 人，無需逐個點名。" } })}>
            ⚡ 舉牌／手勢一鍵錄入
          </button>
        </div>
        {demo.batchLogged ? <p className="mt-2 text-[11px] text-[#b6f3d2]">快測已入帳。主線繼續，微支線只帶走紅燈與連續錯題。</p> : null}
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {bands(demo.classMode, seats, demo.heroScore, demo.ansonWrongs).map((band) => (
            <div key={band.title} className="rounded-xl bg-black/25 p-2">
              <p className="text-xs font-bold" style={{ color: band.color }}>{band.title}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#d5deea]">{band.names.join("、") || "—"}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card id="hotkey" kicker="60 秒複合熱鍵" title="鍵盤 1 / 2 / 3 = C / R / E">
          <p className="text-[11px] text-[#93a4b8]">學生已完成自評前置。按 2 再按 3，帶出 R+E。</p>
          <div className="mt-2 flex gap-2">
            {(["1", "2", "3"] as const).map((key) => (
              <button key={key} className="num h-12 w-12 rounded-xl bg-white/10 text-lg font-bold" onClick={() => demo.dispatch({ type: "hotkey", key })}>
                {key}
              </button>
            ))}
            <button className="rounded-xl bg-white/10 px-3 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { hotkeys: [] } })}>清空</button>
          </div>
          <p className="num mt-2 text-sm">序列：{demo.hotkeys.join(" → ") || "尚未按鍵"}</p>
          {combo ? (
            <div className="mt-2 rounded-xl bg-[#f4efe4] p-3 text-sm leading-6 text-[#21180f]">
              <p className="font-bold">陳*軒 · 二次方程 LQ · 已自評</p>
              <p>求方程的根，並以 m 表示答案。</p>
              <p className="mt-2 bg-[#e24b3c]/20 px-1">R · 漏轉 SI 單位</p>
              <p className="bg-[#e0a825]/40 px-1">E · MA2 代數運算</p>
              <p className="mt-1 text-[11px]">學生已勾步驟：{demo.lqSteps.filter(Boolean).length}/4。目標 15 秒改完。</p>
            </div>
          ) : null}
        </Card>

        <Card id="tele" kicker="AI 語音提詞器" title="只顯示純中文 name_zh">
          <p className="text-[11px] text-[#93a4b8]">課題名用「二次方程」，不混英文 shorthand。空白鍵暫停。</p>
          <div className="relative mt-2 h-28 overflow-hidden rounded-xl bg-black/40 p-3">
            <div className={demo.recording && !demo.paused ? "tele-run" : "tele-paused"}>
              <p className="text-sm leading-7">{SCRIPT}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg bg-[#e24b3c] px-3 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { recording: !demo.recording, paused: false } })}>
              {demo.recording ? "停止" : "開始錄音"}
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { paused: !demo.paused } })}>
              {demo.paused ? "繼續" : "空白鍵暫停"}
            </button>
          </div>
        </Card>
      </div>

      <Card id="audit" kicker="10 秒五行審核" title="金 · 木 · 火">
        <div className="grid gap-3 md:grid-cols-3">
          <Audit label="⚔️ 金 · 概念準確" value={demo.audit.metal} onChange={(value) => demo.dispatch({ type: "audit", key: "metal", value })} />
          <Audit label="🌲 木 · Flow 順暢" value={demo.audit.wood} onChange={(value) => demo.dispatch({ type: "audit", key: "wood", value })} />
          <Audit label="🔥 火 · 鏡頭張力" value={demo.audit.fire} onChange={(value) => demo.dispatch({ type: "audit", key: "fire", value })} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="rounded-xl bg-[#e4c07a] px-4 py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "pass" })}>
            Pass / Review
          </button>
          {demo.video === "passed" || (demo.audit.metal >= 60 && demo.audit.wood >= 60 && demo.audit.fire >= 60) ? (
            <div className="-rotate-6 rounded-md border-2 border-[#e4c07a] px-3 py-2 text-xs font-black text-[#e4c07a]">
              {HERO.ldc}團隊 × {HERO.koc} 聯合共創
            </div>
          ) : (
            <p className="text-[11px] text-[#93a4b8]">任一軸低於 60 會退回 Review，不蓋章。</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function Heat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span className="num">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full" style={{ width: `${value}%`, background: value < 50 ? "#e24b3c" : value < 85 ? "#e0a825" : "#0e8f5b" }} />
      </div>
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

function bands(mode: "large" | "small", seats: typeof SEATS, hero: number, wrongs: number) {
  const rows = seats.map((seat) => ({
    ...seat,
    mastery: seat.id === "anson" ? hero : seat.mastery,
    wrongs: seat.id === "anson" ? wrongs : seat.wrongs,
  }));
  if (mode === "large") {
    return [
      { title: "≥85% 延伸", color: "#8ee0b2", names: rows.filter((row) => row.mastery >= 85).map((row) => row.name) },
      { title: "50–84% 主線", color: "#e0a825", names: rows.filter((row) => row.mastery >= 50 && row.mastery < 85).map((row) => row.name) },
      { title: "<50% 微支線", color: "#ffb4ac", names: rows.filter((row) => row.mastery < 50).map((row) => row.name) },
    ];
  }
  return [
    { title: "錯 0–1 題", color: "#8ee0b2", names: rows.filter((row) => row.wrongs <= 1).map((row) => row.name) },
    { title: "錯 2–3 題", color: "#e0a825", names: rows.filter((row) => row.wrongs >= 2 && row.wrongs <= 3).map((row) => row.name) },
    { title: "錯 ≥4 題", color: "#ffb4ac", names: rows.filter((row) => row.wrongs >= 4).map((row) => row.name) },
  ];
}

export function seatTone(score: number) {
  return lightOf(score);
}
