"use client";

import { useDemo, type Act, type Phase, type Role } from "@/lib/demo-context";
import { Clapperboard, Gauge, MonitorSmartphone, PanelTop, Timer } from "lucide-react";

const ACTS: { id: Act; label: string }[] = [
  { id: 1, label: "1 定錨" },
  { id: 2, label: "2 冒煙" },
  { id: 3, label: "3 破關" },
  { id: 4, label: "4 戰報" },
  { id: 5, label: "5 飛輪" },
];

const ROLES: { id: Role; label: string }[] = [
  { id: "student", label: "學生" },
  { id: "parent", label: "家長" },
  { id: "ldc", label: "LDC" },
  { id: "koc", label: "KOC" },
  { id: "csm", label: "CSM" },
];

const PHASES: { id: Phase; label: string }[] = [
  { id: "day1", label: "Day 1 · 84%" },
  { id: "h48", label: "+48h 雙胞胎" },
  { id: "decay", label: ">7日 · 76%" },
  { id: "preexam", label: "考前保鮮" },
];

export function ControlBar() {
  const demo = useDemo();
  if (demo.barCollapsed) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111c]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-3 py-2">
          <p className="text-sm font-bold">Uni+ 沙盒</p>
          <p className="text-xs text-[#93a4b8]">{demo.autoTour ? `巡遊中 · 本幕剩餘 ${demo.tourLeft}s` : "控制台已收起"}</p>
          <button className="rounded-lg bg-[#e4c07a] px-3 py-1 text-xs font-bold text-[#1b1406]" onClick={() => demo.dispatch({ type: "patch", patch: { labOpen: !demo.labOpen, entered: true } })}>
            {demo.labOpen ? "返回雙屏" : "🧠 2.3 蘇格拉底應試艙"}
          </button>
          <button className={`rounded-lg px-3 py-1 text-xs font-bold ${demo.commute ? "bg-[#3a1c22] text-[#ffb4ac]" : "bg-white/10"}`} onClick={() => demo.dispatch({ type: "patch", patch: { commute: !demo.commute } })}>
            {demo.commute ? "通勤" : "課堂／居家"}
          </button>
          <button className="ml-auto rounded-lg bg-white/10 px-3 py-1 text-xs font-bold" onClick={() => demo.dispatch({ type: "patch", patch: { barCollapsed: false } })}>
            展開控制台
          </button>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 min-w-[180px]">
            <p className="text-[11px] tracking-[0.18em] text-[#e4c07a]">UNI+ 2.0 · V13.0</p>
            <p className="text-sm font-bold">OMO 互動沙盒</p>
          </div>
          <div className="flex items-center gap-1 text-[#93a4b8]">
            <Clapperboard size={14} />
            <span className="text-xs">五幕劇本</span>
          </div>
          <button
            className="rounded-full bg-white/10 px-3 py-1 text-xs"
            onClick={() => demo.dispatch({ type: demo.autoTour ? "tour-stop" : "tour-start" })}
          >
            {demo.autoTour ? `停止巡遊 ${demo.tourLeft}s` : "自動巡遊"}
          </button>
          <button
            className={`rounded-full px-3 py-1 text-xs font-bold ${demo.labOpen ? "bg-[#e4c07a] text-[#1b1406]" : "bg-[#3a2a12] text-[#e4c07a]"}`}
            onClick={() => demo.dispatch({ type: "patch", patch: { labOpen: !demo.labOpen } })}
          >
            {demo.labOpen ? "返回雙屏" : "🧠 2.3 蘇格拉底應試艙"}
          </button>
          <button className="rounded-full bg-white/10 px-3 py-1 text-xs" onClick={() => demo.dispatch({ type: "patch", patch: { barCollapsed: true } })}>
            <PanelTop size={12} className="mr-1 inline" />
            收起
          </button>
          {ACTS.map((act) => (
            <button
              key={act.id}
              onClick={() => demo.runAct(act.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                demo.act === act.id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/5 text-[#d5deea] hover:bg-white/10"
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[#93a4b8]">
            <MonitorSmartphone size={14} />
          </div>
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                if (role.id === "student" || role.id === "parent") {
                  demo.dispatch({ type: "patch", patch: { labOpen: false, role: role.id, phone: role.id, split: demo.split || demo.desk !== "koc" } });
                  return;
                }
                demo.dispatch({ type: "patch", patch: { labOpen: false, role: role.id, desk: role.id, split: true } });
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                (role.id === "student" || role.id === "parent" ? demo.phone === role.id && !demo.labOpen : demo.desk === role.id && !demo.labOpen) ? "bg-[#1d4e89] text-white" : "bg-white/5 text-[#d5deea]"
              }`}
            >
              {role.id === "student" ? "📱 學生手機" : role.id === "parent" ? "💬 家長 WhatsApp" : role.id === "ldc" ? "🧠 LDC" : role.id === "koc" ? "📋 KOC" : "🛡️ CSM"}
            </button>
          ))}
          <button
            onClick={() => demo.setSplit(!demo.split)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
              demo.split ? "bg-[#e24b3c] text-white" : "bg-white/5 text-[#d5deea]"
            }`}
          >
            <Gauge size={12} className="mr-1 inline" />
            {demo.split ? "雙屏聯動中" : "開啟雙屏聯動"}
          </button>
          {(["Phy", "Maths"] as const).map((item) => (
            <button
              key={item}
              onClick={() => demo.dispatch({ type: "subject", subject: item })}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${demo.subject === item ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/5 text-[#d5deea]"}`}
            >
              {item === "Phy" ? "⚡ Physics 物理科" : "📐 Maths 數學科"}
            </button>
          ))}
          <button className={`rounded-lg px-2.5 py-1 text-xs font-bold ${demo.commute ? "bg-[#3a1c22] text-[#ffb4ac]" : "bg-white/5 text-[#d5deea]"}`} onClick={() => demo.dispatch({ type: "patch", patch: { commute: !demo.commute } })}>
            {demo.commute ? "🚇 通勤" : "🏠 課堂／居家"}
          </button>
          <div className="ml-auto flex flex-wrap items-center gap-1">
            <Timer size={14} className="text-[#93a4b8]" />
            {PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => demo.setPhase(phase.id)}
                className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${
                  demo.phase === phase.id ? "bg-[#143524] text-[#b6f3d2]" : "bg-white/5 text-[#c5d0de]"
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
