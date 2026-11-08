"use client";

import { useEffect } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { packOf } from "@/lib/curriculum";
import { DIAG, HERO, IS_AXES, QUOTES, SEATS } from "@/lib/mock-data";
import { useDemo } from "@/lib/demo-context";
import { heroTopicCode, seatFocusScore } from "@/lib/student-profile";
import { RefractionInk, RhombusInk } from "./EbookKit";
import { Card, LightPill, ScoreBar } from "./ui";

const VOICE: Record<"Phy" | "Maths", { ldc: string; koc: string }> = {
  Phy: {
    ldc: "家長您好，我是林知行。這一課全班先抓住光密走向光疏會遠離法線。陳軒唔使加做整張卷，只要把折射角和入射角的大小關係說清楚。",
    koc: "陳軒家長，我是 Oscar。他今天把水進空氣聽成靠近法線。我已經用十五秒分步卡跟他拆過。你不用陪讀，只要聽完這三句。",
  },
  Maths: {
    ldc: "家長您好，我是林知行。這一課全班先抓住「相異實根」要寫 Δ 大於零。陳軒唔使加做整張卷，只要把判別式和變號那一步說清楚。",
    koc: "陳軒家長，我是 Oscar。他今天漏看「相異實根」，把條件寫成大於等於零。我已經用十五秒分步卡跟他拆過。你不用陪讀，只要聽完這三句。",
  },
};

const QUOTES_MATHS = [
  "先圈出「相異實根」，再寫 Δ 大於零。",
  "展開括號時，負正得負，唔好漏變號。",
  "答案要寫範圍，唔係寫一個數。",
];

export function ParentView() {
  const demo = useDemo();

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (demo.timeoutLocked && !demo.waOpened) {
    return (
      <div className="flex min-h-[520px] flex-col justify-center">
        <p className="text-sm leading-6">這條連結已逾時。分數沒有留在手機裡。</p>
        <button className="mt-3 rounded-xl bg-[#e4c07a] px-3 py-2 text-sm font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "patch", patch: { timeoutLocked: false, linkSpent: false, linkArmed: false } })}>
          向中心再取一次連結
        </button>
      </div>
    );
  }

  if (!demo.waOpened) {
    return (
      <div id="parent-lock" className="flex min-h-[520px] flex-col justify-end pb-6">
        <p className="mb-3 text-[11px] text-[#93a4b8]">WhatsApp · 薈進教育中心</p>
        <button className="rounded-2xl rounded-bl-sm bg-[#123524] px-4 py-3 text-left" onClick={() => demo.dispatch({ type: "wa-open" })}>
          <p className="text-sm leading-6">陳*軒本週戰報已準備好。連結 30 分鐘內有效，原卷不會下載到這部手機。</p>
          {demo.voucher ? <p className="mt-2 text-sm font-bold text-[#e4c07a]">另有一張課後 15 分鐘沙盤券。</p> : null}
          <p className="mt-2 text-[11px] text-[#8ee0b2]">點開 H5</p>
        </button>
      </div>
    );
  }

  if (!demo.unlocked) {
    return (
      <div id="parent-lock" className="flex min-h-[520px] flex-col justify-center">
        <p className="text-[11px] tracking-[0.16em] text-[#e4c07a]">安全解鎖</p>
        <h2 className="mt-1 text-2xl font-bold">家長戰報</h2>
        <p className="mt-2 text-sm leading-6 text-[#c5d0de]">請輸入爸爸或媽媽手機尾 4 碼。示範碼是 8821。</p>
        <div className="mt-3 space-y-1 text-[11px]">
          <p className="rounded-lg bg-white/5 px-2 py-1">1. 尾 4 碼：正在使用</p>
          <button className="w-full rounded-lg bg-white/5 px-2 py-1 text-left" onClick={() => demo.dispatch({ type: "arm-link" })}>
            2. 一次性連結：{demo.linkArmed ? "已啟用，打開後不能再轉傳" : "點此啟用"}
          </button>
          <p className="rounded-lg bg-white/5 px-2 py-1">3. 原卷不落地：家長只看課題名，姓名顯示為 陳＊軒</p>
          <button className="w-full rounded-lg bg-white/5 px-2 py-1 text-left" onClick={() => demo.dispatch({ type: "timeout" })}>
            4. 逾時上鎖：點此模擬連結失效
          </button>
          <p className="rounded-lg bg-white/5 px-2 py-1">5. 12% 姓名遮罩沿用母卷那一層，戰報本身不出現學號</p>
        </div>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          value={demo.pin}
          onChange={(event) => demo.dispatch({ type: "pin", value: event.target.value })}
          className={`num mt-4 rounded-2xl border bg-black/30 px-4 py-4 text-center text-3xl tracking-[0.4em] outline-none ${demo.pinError ? "border-[#e24b3c]" : "border-white/15"}`}
          placeholder="••••"
        />
        <button className="mt-3 rounded-2xl bg-[#e4c07a] py-3 font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "unlock" })}>
          解鎖本週戰報
        </button>
      </div>
    );
  }

  const focus = SEATS.find((seat) => seat.id === demo.focusId);
  const after = seatFocusScore(demo.subject, demo.focusId, demo.heroScore, demo.examCode);
  const before = demo.focusId === "anson" ? Math.max(30, after - 39) : Math.max(30, after - 18);
  const gap = demo.studentUt == null ? null : demo.predictedLive - demo.studentUt;
  const pack = packOf(demo.subject);
  const heroCode = heroTopicCode(demo.subject, demo.examCode);
  const pointTopic = pack.topics.find((topic) =>
    topic.subtopics.some((sub) => sub.code === demo.examCode),
  );
  const lead = demo.parentBrief?.ink && demo.subject === "Maths"
    ? pack.topics.find((topic) => topic.code === "JM29") ?? pack.topics[0]
    : pointTopic ?? pack.topics.find((topic) => topic.code === heroCode) ?? pack.topics.find((topic) => topic.hot) ?? pack.topics[0];

  return (
    <div className="space-y-3">
      <header>
        <p className="text-[11px] text-[#e4c07a]">
          🎯 第一步：播 15 秒語音，再看
          {demo.parentBrief?.ink
            ? demo.subject === "Maths"
              ? "菱形筆跡快照"
              : "折射筆跡快照"
            : "本週提分報告"}
          。PIN 8821。
        </p>
        <h2 className="text-xl font-bold">{focus?.name ?? "陳*軒"} · {lead.name_zh}</h2>
        <p className="text-[11px] text-[#93a4b8]">這裡只有 StarCoins {demo.coins.anson ?? demo.starCoins}。EduToken 不會出現在家長手機。</p>
        <p className="text-[11px] text-[#93a4b8]">{HERO.school} · {HERO.form}</p>
      </header>

      {demo.parentBrief ? (
        <Card kicker="WhatsApp 戰報卡" title={demo.parentBrief.title}>
          <p className="text-sm leading-6">{demo.parentBrief.body}</p>
          {demo.parentBrief.ink ? (
            <div className="mt-2 rounded-xl bg-[#f4efe4] p-2 text-[#21180f]">
              <p className="text-[12px] font-bold">
                📄 訂正快照預覽（沙盒示意，不是已匯出的 PDF）
              </p>
              {demo.subject === "Maths" ? (
                <>
                  <RhombusInk runId={0} pen="both" frame={12} />
                  <p className="text-center text-[11px]">∠DFE = 34.5° [property of rhombus]</p>
                </>
              ) : (
                <>
                  <RefractionInk />
                  <p className="text-center text-[11px]">折射線遠離法線 · 折射角大於入射角</p>
                </>
              )}
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card id="parent-report" kicker="看得見的提分" title="紅燈走到現在">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#3a1c22] p-2">
            <p className="text-[10px]">兩週前</p>
            <LightPill score={before} />
            <div className="mt-2"><ScoreBar score={before} /></div>
          </div>
          <div className="rounded-xl bg-[#143524] p-2">
            <p className="text-[10px]">本週</p>
            <LightPill score={after} />
            <div className="mt-2"><ScoreBar score={after} /></div>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {demo.subject === "Maths" ? (
            <>
              <li>1 進步：已經識得先圈「相異實根」，再寫 Δ &gt; 0。</li>
              <li>1 重心：展開括號時仍然會漏變號。</li>
              <li>1 行動：不用加卷，聽完下面 3 句即可。</li>
            </>
          ) : (
            <>
              <li>1 進步：折射判斷已離開「背口訣」。</li>
              <li>1 重心：仍然要先講光密還是光疏。</li>
              <li>1 行動：不用加卷，聽完下面 3 句即可。</li>
            </>
          )}
        </ul>
      </Card>

      <Card id="voice" kicker="1+1 雙師" title="名師導航 + 個人點評">
        <div className="grid gap-2">
          <VoiceButton label="林知行 · 20 秒班級導航" active={demo.voice === "ldc"} onClick={() => play(demo, "ldc")} />
          <VoiceButton label="Oscar · 語音稿預覽（本機朗讀，不是親錄音檔）" active={demo.voice === "koc"} onClick={() => play(demo, "koc")} />
        </div>
        <div className="mt-3 space-y-2">
          {(demo.subject === "Maths" ? QUOTES_MATHS : QUOTES).map((quote, index) => (
            <div key={quote} className="rounded-xl bg-[#f4efe4] px-3 py-2 text-sm text-[#1c1408]">
              <span className="num mr-2 text-[#8a5a12]">0{index + 1}</span>
              {quote}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-[#93a4b8]">地鐵靜音也可看。語音用本機中文朗讀，無需登入。</p>
      </Card>

      <Card kicker="考後 15 秒回流" title="家長 1 秒確認校內實分">
        <p className="text-sm">預測分 {demo.predictedLive}{demo.studentUt == null ? " · 等待孩子的 15 秒微表單" : ` · 孩子申報 ${demo.studentUt}`}</p>
        <button
          disabled={demo.studentUt == null}
          className="mt-2 w-full rounded-xl bg-[#1d4e89] py-2 text-sm font-bold disabled:opacity-40"
          onClick={() =>
            demo.dispatch({
              type: "patch",
              patch: {
                utConfirmed: true,
                toast:
                  gap != null && gap >= 15
                    ? `已確認 ${demo.studentUt} 分。低於預測 ${gap} 分，CSM 可做臨場調校。`
                    : `已確認 ${demo.studentUt} 分。`,
              },
            })
          }
        >
          {demo.utConfirmed ? `已確認 UT ${demo.studentUt} 分` : "1 秒確認孩子申報的分數"}
        </button>
        {demo.utConfirmed && gap != null && gap >= 15 ? <p className="mt-2 text-[11px] text-[#ffd58a]">差距 {gap} 分。這不是退步判決，CSM 會把它調成臨場發揮。</p> : null}
        {demo.voucher ? <p className="mt-2 rounded-xl bg-[#2a2416] px-3 py-2 text-sm text-[#e4c07a]">🎟️ 課後 15 分鐘沙盤券已放在這部手機。</p> : null}
      </Card>

      <Card id="cross" kicker="S1–S2 IS 四軸" title="選科潛能，不是多一張推銷海報">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={IS_AXES.map((axis) => ({ axis: axis.name, score: axis.score }))} outerRadius="70%">
              <PolarGrid stroke="#2c4664" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#d5deea", fontSize: 10 }} />
              <Radar dataKey="score" stroke="#8ec8ff" fill="#8ec8ff" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 text-[11px] text-[#c5d0de]">
          {IS_AXES.map((axis) => (
            <button key={axis.code} className="block w-full rounded-lg bg-black/20 px-2 py-1 text-left" onClick={() => demo.dispatch({ type: "patch", patch: { isOpen: demo.isOpen === axis.code ? null : axis.code } })}>
              {axis.code} {axis.name} {axis.score}% → {axis.link}
              {demo.isOpen === axis.code ? <span className="mt-1 block text-[#e4c07a]">中一中二這一軸會直接推算高中{axis.link}，不是另做一張推銷卷。</span> : null}
            </button>
          ))}
        </div>
        {after >= 85 ? (
          <div className="mt-3 rounded-xl border border-[#e4c07a]/40 bg-[#2a2416] p-2">
            <p className="text-sm font-bold text-[#e4c07a]">深綠突破。3 分鐘跨科微診斷已解鎖。</p>
            {demo.diagStep < 3 ? (
              <Diag />
            ) : (
              <div className="mt-2">
                <p className="text-sm">🏅 跨科邏輯思維亮點徽章</p>
                <button
                  className="mt-2 w-full rounded-xl bg-[#e4c07a] py-2 text-sm font-bold text-[#1b1406]"
                  onClick={() => demo.dispatch({ type: "patch", patch: { voucher: true, toast: "已領取下堂課後 15 分鐘沙盤測評券。" } })}
                >
                  {demo.voucher ? "沙盤券已放入課表" : "領取課後 15 分鐘沙盤券"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-[#93a4b8]">
            {demo.subject === "Maths" ? "判別式尚未到深綠。可按時間機器去 +48h 並答對雙胞胎。" : "折射尚未到深綠。可按時間機器去 +48h 並答對雙胞胎。"}
          </p>
        )}
      </Card>
    </div>
  );
}

function play(demo: ReturnType<typeof useDemo>, who: "ldc" | "koc") {
  demo.dispatch({ type: "patch", patch: { voice: who } });
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(VOICE[demo.subject][who]);
  utter.lang = "zh-HK";
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

function VoiceButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-xl px-3 py-2 text-left text-sm ${active ? "bg-[#1d4e89]" : "bg-white/10"}`}>
      ▶ {label}
    </button>
  );
}

function Diag() {
  const demo = useDemo();
  const item = DIAG[demo.diagStep];
  return (
    <div className="mt-2">
      <p className="text-sm leading-6">{item.q}</p>
      <div className="mt-2 grid gap-1">
        {item.options.map((option, index) => (
          <button
            key={option}
            className="rounded-lg bg-black/30 px-2 py-2 text-left text-sm"
            onClick={() => {
              if (index === item.answer) demo.dispatch({ type: "diag" });
              else demo.dispatch({ type: "toast", text: "這題先想「方向有沒有反轉」，再選一次。" });
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
