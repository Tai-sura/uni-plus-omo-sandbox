"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ControlBar } from "./ControlBar";
import { DeskFrame, PhoneFrame } from "./Frames";
import { CsmView } from "./CsmView";
import { KocView } from "./KocView";
import { LdcView } from "./LdcView";
import { ParentView } from "./ParentView";
import { StudentView } from "./StudentView";
import { useDemo, type Desk, type Role } from "@/lib/demo-context";

const ROLE_COPY: { id: Role; title: string; text: string }[] = [
  { id: "student", title: "我是學生", text: "看雷達、破關、領幣，不用先看後台。" },
  { id: "parent", title: "我是家長", text: "從 WhatsApp 氣泡進入戰報。" },
  { id: "koc", title: "我是 KOC", text: "座位紅點、母卷遮罩、晉升儀表板。" },
  { id: "ldc", title: "我是 LDC", text: "分流、60 秒批改、金木火審核。" },
  { id: "csm", title: "我是 CSM", text: "工單溢出、臨場調校、獎金池。" },
];

export function Sandbox() {
  const demo = useDemo();
  if (!demo.entered) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
        <p className="text-xs tracking-[0.18em] text-[#e4c07a]">UNI+ 2.0 · V13.0</p>
        <h1 className="mt-2 text-3xl font-bold">你今天以哪個身份進來？</h1>
        <p className="mt-2 text-sm leading-6 text-[#c5d0de]">選好之後可以隨時展開控制台。五幕巡遊會替你把閉環走完。</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ROLE_COPY.map((item) => (
            <button
              key={item.id}
              onClick={() => demo.dispatch({ type: "enter", role: item.id })}
              className="rounded-2xl border border-white/10 bg-[#102033] px-4 py-4 text-left hover:border-[#e4c07a]"
            >
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-sm text-[#c5d0de]">{item.text}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ControlBar />
      <main className="mx-auto max-w-[1440px] px-3 py-3">
        <AnimatePresence>
          {demo.callout ? (
            <motion.aside
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 rounded-2xl border border-[#e4c07a]/40 bg-[#241c10] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#e4c07a]">{demo.callout.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#f3e6c8]">{demo.callout.body}</p>
                </div>
                <button className="text-xs text-[#e4c07a]" onClick={demo.dismissCallout}>
                  關閉
                </button>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>

        {demo.duo && demo.split ? (
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <DeskFrame label="左屏 · KOC 上傳台">
              <KocView />
            </DeskFrame>
            <DeskFrame label="右屏 · LDC 審核台">
              <LdcView />
            </DeskFrame>
          </div>
        ) : demo.split ? (
          <div className="grid items-start gap-4 lg:grid-cols-[400px_minmax(0,1fr)]">
            <div>
              <Switcher
                options={[
                  ["student", "學生手機"],
                  ["parent", "家長手機"],
                ]}
                value={demo.phone}
                onChange={(phone) => demo.dispatch({ type: "patch", patch: { phone } })}
              />
              <PhoneFrame label={demo.phone === "parent" ? "左屏 · 家長手機" : "左屏 · 學生手機"}>
                {demo.phone === "parent" ? <ParentView /> : <StudentView />}
              </PhoneFrame>
            </div>
            <div>
              <Switcher
                options={[
                  ["koc", "KOC"],
                  ["ldc", "LDC"],
                  ["csm", "CSM"],
                ]}
                value={demo.desk}
                onChange={(desk) => demo.dispatch({ type: "patch", patch: { desk } })}
              />
              <DeskFrame label={deskLabel(demo.desk)}>
                <DeskBody desk={demo.desk} />
              </DeskFrame>
            </div>
          </div>
        ) : (
          <Single role={demo.role} />
        )}
      </main>
      {demo.toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[min(560px,calc(100%-24px))] -translate-x-1/2 rounded-2xl bg-[#f4efe4] px-4 py-3 text-sm leading-6 text-[#1c1408] shadow-2xl">
          {demo.toast}
        </div>
      ) : null}
    </div>
  );
}

function Single({ role }: { role: Role }) {
  if (role === "student" || role === "parent") {
    return (
      <PhoneFrame label={role === "parent" ? "家長手機 · WhatsApp H5" : "學生手機"}>
        {role === "parent" ? <ParentView /> : <StudentView />}
      </PhoneFrame>
    );
  }
  return (
    <DeskFrame label={role === "ldc" ? "LDC iPad · 分流與批改台" : role === "csm" ? "CSM 指揮台" : "KOC iPad · 座位圖與晉升台"}>
      {role === "ldc" ? <LdcView /> : role === "csm" ? <CsmView /> : <KocView />}
    </DeskFrame>
  );
}

function DeskBody({ desk }: { desk: Desk }) {
  if (desk === "ldc") return <LdcView />;
  if (desk === "csm") return <CsmView />;
  return <KocView />;
}

function deskLabel(desk: Desk) {
  if (desk === "ldc") return "右屏 · LDC 分流";
  if (desk === "csm") return "右屏 · CSM 指揮台";
  return "右屏 · KOC 座位圖";
}

function Switcher<T extends string>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="mb-2 flex gap-1">
      {options.map(([id, label]) => (
        <button key={id} className={`rounded-full px-2.5 py-1 text-[11px] ${value === id ? "bg-[#e4c07a] text-[#1b1406]" : "bg-white/10"}`} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
