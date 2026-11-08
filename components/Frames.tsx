"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDemo } from "@/lib/demo-context";

export function PhoneFrame({ label, children }: { label: string; children: ReactNode }) {
  const demo = useDemo();
  const scroller = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [demo.focusId, demo.studentTab]);
  useEffect(() => {
    if (!demo.phonePulse) return;
    setGlow(true);
    const timer = window.setTimeout(() => setGlow(false), 1500);
    return () => window.clearTimeout(timer);
  }, [demo.phonePulse]);
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <p className="mb-2 text-center text-[11px] tracking-wide text-[#e4c07a]">{label}</p>
      <div className={`rounded-[2rem] border bg-[#05080d] p-2 ${glow ? "phone-pulse border-[#e4c07a]" : "border-[#2a3f58]"}`}>
        <div className="relative h-[min(760px,calc(100vh-168px))] overflow-hidden rounded-[1.45rem] bg-[#0b1726]">
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div ref={scroller} className="scroll-thin h-full overflow-y-auto px-3 pb-4 pt-9">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function DeskFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] tracking-wide text-[#e4c07a]">{label}</p>
      <div className="scroll-thin h-[min(760px,calc(100vh-168px))] overflow-y-auto rounded-[1.4rem] border border-[#2a3f58] bg-[#0b1726] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
        {children}
      </div>
    </div>
  );
}
