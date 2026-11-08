"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { ELEMENTS, HERO, SEATS, TLA, seatProfile } from "@/lib/mock-data";
import { LIGHT_META, lightOf } from "@/lib/mastery";
import { useDemo } from "@/lib/demo-context";
import { Card, LightPill, ScoreBar } from "./ui";

export function KocView() {
  const demo = useDemo();
  const paperRef = useRef<HTMLDivElement>(null);
  const videos = demo.video === "none" ? 11 : 12;

  const dragMask = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const box = paperRef.current?.getBoundingClientRect();
    if (!box) return;
    const update = (ev: PointerEvent) => {
      const next = Math.round(((ev.clientY - box.top) / box.height) * 100);
      demo.dispatch({ type: "patch", patch: { mask: Math.min(30, Math.max(6, next)) } });
    };
    const stop = () => {
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", update);
    window.addEventListener("pointerup", stop);
    event.preventDefault();
  };

  return (
    <div className="space-y-3">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] text-[#e4c07a]">KOC 伴學 · {HERO.koc}</p>
          <h2 className="text-xl font-bold">座位圖、母卷與晉升</h2>
        </div>
        <div className="text-right text-xs">
          <p>EduToken <span className="num text-[#e4c07a]">{demo.eduToken}</span></p>
          <p className="text-[#93a4b8]">本週工單 5/5</p>
        </div>
      </header>

      <Card id="seat-anson" kicker="X 軸白話指令" title="紅點只告訴你：先安撫，再拆題">
        <div className="grid grid-cols-4 gap-2 md:grid-cols-5">
          {SEATS.map((seat) => {
            const score = seat.id === "anson" ? demo.heroScore : seat.mastery;
            const missed = (seat.id === "anson" && demo.ansonMissed) || (demo.kocAlert && score < 50);
            const bonus = demo.bonusSeats.includes(seat.id);
            const meta = LIGHT_META[lightOf(score)];
            return (
              <button
                key={seat.id}
                onClick={() => demo.dispatch({ type: "focus", id: seat.id })}
                className={`rounded-xl px-1 py-2 text-center ${missed ? "breathe" : ""}`}
                style={{
                  background: missed ? "#e24b3c" : meta.bg,
                  color: missed ? "#fff" : meta.fg,
                  boxShadow: demo.focusId === seat.id ? "inset 0 0 0 2px #fff" : undefined,
                }}
              >
                <p className="text-[11px] font-bold">{seat.name}</p>
                <p className="num text-[10px]">{score}%{bonus ? " +5" : ""}</p>
              </button>
            );
          })}
        </div>
        <SeatDossier />
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card id="mask" kicker="考後母卷" title="頂部 12% 預警遮罩">
          <div ref={paperRef} className="relative h-64 overflow-hidden rounded-xl bg-[#f4efe4] text-[#21180f]">
            <div className="absolute inset-x-0 top-0 z-10 bg-white/55 backdrop-blur-sm" style={{ height: `${demo.mask}%` }}>
              <button className="absolute inset-x-0 bottom-0 h-3 cursor-ns-resize bg-[#1d4e89]" onPointerDown={dragMask} />
            </div>
            <div className="p-4 text-sm leading-6">
              <p className="font-bold">聖保羅書院　中三物理　統一測驗</p>
              <p>姓名：陳大軒　　班別：3C　　學號：18</p>
              <p className="mt-3">1. 光由水進入空氣，折射角與入射角何者較大？試繪畫法線。</p>
              <p>2. 解釋為何不會在這個角度發生全反射。</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[#93a4b8]">拖動藍條。現時遮罩 {demo.mask}%。建議帶是 10–16%。</p>
          <button className="mt-2 rounded-xl bg-[#e4c07a] px-3 py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "mask-accept" })}>
            {demo.maskAccepted ? "已採納 +15 / +5 / +3" : "1 秒採納"}
          </button>
          {demo.maskAccepted ? <p className="mt-1 text-[11px] text-[#b6f3d2]">陳*軒 +15。李*晴、黃*諾座位已標 +5。KOC +3 EduToken。</p> : null}
        </Card>

        <Card kicker="Care Alerts" title="做完才申報變異教法">
          <TicketBoard />
          <div className="mt-3 rounded-xl bg-black/25 p-2 text-[11px] leading-5">
            <p>StarCoins 是學生的學習幣，EduToken 是導師的教研幣。兩邊不能兌換。</p>
            <p>陳*軒 StarCoins {demo.coins.anson ?? demo.starCoins} · 你的 EduToken {demo.eduToken}</p>
          </div>
          <button
            disabled={!demo.twinCorrect}
            className="mt-3 w-full rounded-xl bg-[#1d4e89] py-2 text-sm disabled:opacity-40"
            onClick={() => demo.dispatch({ type: "patch", patch: { variant: true, toast: "已申報變異教法：用水杯當光密介質，不另開講義。" } })}
          >
            {demo.variant ? "變異教法已申報" : "💡 48h 答對後申報變異教法"}
          </button>
          {!demo.twinCorrect ? <p className="mt-1 text-[11px] text-[#93a4b8]">學生尚未通過雙胞胎，按鈕先鎖上。</p> : null}
        </Card>
      </div>

      <Card id="leader" kicker="三維度造血" title={demo.promoted ? "🌟 已是 KOC Leader" : "🌟 再 1 條錄影即可晉升"}>
        <div className="grid gap-3 md:grid-cols-3">
          <Meter label="教材貢獻" value={78} />
          <Meter label="伴學時數" value={84} />
          <Meter label={`Topic 錄影 ${videos}/12`} value={(videos / 12) * 100} />
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
          <div className="rounded-xl bg-black/25 p-3">
            <p className="text-[11px] text-[#93a4b8]">當月現金分紅池</p>
            <p className="num text-2xl">HK$ 3,280</p>
          </div>
          <div className="rounded-xl bg-black/25 p-3">
            <p className="text-[11px] text-[#93a4b8]">生涯榮譽總帳</p>
            <p className="num text-2xl">{demo.promoted ? "1,500" : "1,420"} / 1,500</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6">
          {demo.promoted
            ? "時薪 +20%。可任常規班 Co-Teaching 副講、主理校本 UT 加操堂，帶教新人 +10 幣。"
            : "再完成 1 條 Level 2 Topic 教學錄影，並由 LDC Pass，即晉升 KOC Leader。"}
        </p>
        <div className="mt-3 grid gap-2">
          {TLA.map((item) => (
            <button key={item.id} className={`rounded-xl px-3 py-2 text-left text-sm ${demo.tla[item.id] ? "bg-[#143524]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "tla", key: item.id })}>
              {item.label} · {item.time} · {item.text}
            </button>
          ))}
        </div>
        <button className="mt-2 rounded-xl bg-[#143524] px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "upload" })}>
          {demo.video === "none" ? "三段齊全後送審" : demo.video === "uploaded" ? "已送到右屏審核" : "審核已通過"}
        </button>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "coteach" })}>{demo.coTeach ? "已接副講" : "接 Co-Teaching"}</button>
          <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "book-ut" })}>{demo.utClass ? "UT 加操已排" : "開設 UT 加操"}</button>
          <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "mentor" })}>{demo.mentorClaimed ? "帶教 +10 已入帳" : "帶教新人 +10"}</button>
        </div>
      </Card>
    </div>
  );
}

function SeatDossier() {
  const demo = useDemo();
  const seat = SEATS.find((item) => item.id === demo.focusId) ?? SEATS[0];
  const profile = seatProfile(seat.id);
  const score = seat.id === "anson" ? demo.heroScore : seat.mastery;
  const wrongs = seat.id === "anson" ? demo.ansonWrongs : seat.wrongs;
  const coins = demo.coins[seat.id] ?? 0;
  const tickets = demo.tickets.filter((ticket) => ticket.title.includes(seat.name));
  const topics = seat.id === "anson"
    ? [
        { name: "光的折射", score: demo.heroScore },
        { name: "光的反射", score: 90 },
        { name: "靜電學", score: 45 },
        { name: "透鏡成像", score: null },
      ]
    : profile.topics;
  const band = wrongs >= 4 ? "錯 ≥4 題" : wrongs >= 2 ? "錯 2–3 題" : "錯 0–1 題";

  return (
    <div id="focus-profile" className="mt-3 rounded-xl bg-black/25 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] tracking-[0.14em] text-[#e4c07a]">這位同學</p>
          <p className="text-sm font-bold">{seat.name} {seat.en}</p>
          <p className="text-[11px] text-[#93a4b8]">{HERO.school} · {HERO.form} · {band}</p>
        </div>
        <LightPill score={score} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-white/10 px-2 py-1">錯題 {wrongs}</span>
        <span className="rounded-full bg-white/10 px-2 py-1">StarCoins {coins}</span>
        {demo.bonusSeats.includes(seat.id) ? <span className="rounded-full bg-[#143524] px-2 py-1 text-[#b6f3d2]">同堂 +5</span> : null}
        {seat.id === "anson" && demo.ansonMissed ? <span className="rounded-full bg-[#5a221c] px-2 py-1">剛才選錯 A</span> : null}
      </div>
      <p className="mt-2 text-sm leading-6">{profile.blurb}</p>
      <p className="mt-1 text-[12px] text-[#e4c07a]">{profile.ticket}</p>
      <div className="mt-2 space-y-2">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span>{topic.name}</span>
              <LightPill score={topic.score} compact />
            </div>
            <ScoreBar score={topic.score} />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-white/5 p-2">
        <p className="text-[10px] text-[#93a4b8]">掛在這位同學的工單</p>
        {tickets.length ? tickets.map((ticket) => (
          <p key={ticket.id} className="mt-1 text-[12px] leading-5">{ticket.title}</p>
        )) : <p className="mt-1 text-[12px] leading-5">目前沒有掛名工單，照座位燈色跟節奏。</p>}
      </div>
      {seat.id === "anson" && demo.instructionOpen ? (
        <div className="mt-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {ELEMENTS.map((item) => (
              <button key={item.id} className={`rounded-full px-2 py-1 text-[11px] ${demo.element === item.id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { element: item.id } })}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-sm font-bold leading-6 text-[#b6f3d2]">{ELEMENTS.find((item) => item.id === demo.element)?.line}</p>
          {demo.speedQueue ? <p className="mt-2 text-[12px] text-[#ffd58a]">明日首題工單：陳*軒 · 光的折射。</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function TicketBoard() {
  const demo = useDemo();
  const columns = [
    ["jason", "Jason"],
    ["chloe", "Chloe"],
    ["csm", "CSM"],
  ] as const;
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {columns.map(([owner, label]) => (
        <div key={owner} className="rounded-xl bg-black/20 p-2">
          <p className="text-[11px] text-[#e4c07a]">{label}</p>
          {demo.tickets.filter((ticket) => ticket.owner === owner).map((ticket) => (
            <p key={ticket.id} className="mt-1 text-[11px] leading-5">{ticket.title}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span>{label}</span>
        <span className="num">{Math.round(value)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#e4c07a]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
