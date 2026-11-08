"use client";

import { HERO } from "@/lib/mock-data";
import { useDemo } from "@/lib/demo-context";
import { Card } from "./ui";

const SCRIPT = `陳*軒家長您好。光的折射這兩週的判斷已穩定很多，本週會繼續用 15 秒分步卡鞏固「遠離法線」，暫時不用加卷。校內分數若與預測有差距，我們會當成臨場調校，而不是退步。您只要在戰報按 1 秒確認即可。`;

export function CsmView() {
  const demo = useDemo();
  const gap = demo.studentUt == null ? 0 : demo.predictedLive - demo.studentUt;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SCRIPT);
      demo.dispatch({ type: "patch", patch: { copied: true, toast: "已複製 WhatsApp 話術。先講進度，再講做法。" } });
    } catch {
      demo.dispatch({ type: "patch", patch: { copied: true, toast: SCRIPT } });
    }
  };

  return (
    <div className="space-y-3">
      <header>
        <p className="text-[11px] text-[#e4c07a]">CSM · {HERO.csm}</p>
        <h2 className="text-xl font-bold">防雪崩、先知名單、獎金安全閥</h2>
        <p className="text-[11px] text-[#c5d0de]">🎯 第一步：看 Oscar 是否已滿 5 單，再把溢出工單交給 Chloe。</p>
      </header>

      <Card id="care" kicker="Care Alerts" title="重點工單溢出路由">
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm">Oscar 本週已滿 5/5。新的「攻堅支援 [重點]」不再堆給他。</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="rounded-lg bg-[#3a1c22] px-2 py-2">① 攻堅支援 [重點] · 陳*軒 · 折射紅點後 48h</p>
              <p className="rounded-lg bg-white/5 px-2 py-2">② 暖心作息 [重點] · 何*言 · 仍留在原 KOC</p>
              <p className="rounded-lg bg-white/5 px-2 py-2">③ 正向突破 [轉化] · 李*晴 · 轉 CSM 邀約即可</p>
            </div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {(["jason", "chloe", "csm"] as const).map((owner) => (
                <div key={owner} className="rounded-lg bg-black/20 p-2 text-[11px]">
                  <p className="text-[#e4c07a]">{owner === "jason" ? "Oscar" : owner === "chloe" ? "Chloe" : "CSM"}</p>
                  {demo.tickets.filter((ticket) => ticket.owner === owner).map((ticket) => (
                    <p key={ticket.id} className="mt-1">{ticket.title}</p>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-xl bg-[#e4c07a] px-3 py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "overflow" })}>
                {demo.overflow ? "重點單已在 Chloe" : "執行重點工單溢出"}
              </button>
              <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "silence" })}>
                {demo.silence || demo.phase === "preexam" ? "靜默保護中" : "開啟考前 10 日靜默"}
              </button>
              <button className="rounded-xl bg-white/10 px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "new-ticket" })}>
                嘗試新增工單
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-[#10281f] p-3 text-sm leading-6">
            <p className="text-[11px] text-[#b6f3d2]">報憂轉專業</p>
            <p>{SCRIPT}</p>
            <button className="mt-2 rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={copy}>
              {demo.copied ? "已複製" : "一鍵複製到 WhatsApp"}
            </button>
          </div>
        </div>
      </Card>

      <Card kicker="先知名單" title="徽章、沙盤、臨場調校">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] text-[#93a4b8]">
              <tr>
                <th className="py-1">學生</th>
                <th>信號</th>
                <th>下一步</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <td className="py-2">李*晴</td>
                <td>🏅 跨科徽章</td>
                <td>
                  <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "toast", text: "已為李*晴預留下堂課後 15 分鐘沙盤。" })}>
                    邀約沙盤
                  </button>
                </td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2">陳*軒</td>
                <td>
                  {demo.badge ? "🏅 剛點亮徽章" : "折射追蹤中"}
                  {demo.utConfirmed && gap >= 15 ? ` · 實分低 ${gap}` : ""}
                  {demo.utAdjusted ? " · 已臨場調校" : ""}
                </td>
                <td className="space-x-1">
                  <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "invite" })}>
                    沙盤券送到家長
                  </button>
                  <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "ut-adjust" })}>
                    臨場調校
                  </button>
                  <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={() => demo.dispatch({ type: "book-ut" })}>
                    UT 加操
                  </button>
                </td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2">張*澄</td>
                <td>{demo.silence || demo.phase === "preexam" ? "考前 10 日靜默中" : "尚未進入靜默"}</td>
                <td className="text-xs text-[#93a4b8]">{demo.silence || demo.phase === "preexam" ? "新工單會被擋下" : "可新增工單"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {!demo.studentUt ? <p className="mt-2 text-[11px] text-[#93a4b8]">學生尚未提交 15 秒微表單。</p> : null}
        {demo.utClass ? <p className="mt-2 text-[11px] text-[#b6f3d2]">UT 加操堂已寫進 KOC Leader 的日程。</p> : null}
      </Card>

      <Card id="bonus" kicker="財務安全閥" title="動態獎金池上限 2.5%">
        <div className="relative h-4 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-full bg-[#3aaa6a]" style={{ width: "64%" }} />
          <div className="absolute inset-y-0 left-[64%] w-px bg-[#e4c07a]" />
        </div>
        <p className="mt-2 text-sm">已預留 1.6%。本週跨科轉化若發 0.7%，合計 2.3%，仍在閥內。</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="rounded-xl bg-[#143524] px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "payout", over: false })}>
            發放 0.7%
          </button>
          <button className="rounded-xl bg-[#3a1c22] px-3 py-2 text-sm" onClick={() => demo.dispatch({ type: "payout", over: true })}>
            試發超標 1.5%
          </button>
        </div>
        {demo.poolRows ? (
          <ul className="mt-2 space-y-1 text-sm">
            {demo.poolRows.map((row) => (
              <li key={row.name}>{row.name} · {row.pct}%</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-2 text-sm text-[#e4c07a]">{demo.poolNote}</p>
      </Card>
    </div>
  );
}
