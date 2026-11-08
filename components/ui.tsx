"use client";

import { LIGHT_META, lightOf, type Light } from "@/lib/mastery";
import { useDemo } from "@/lib/demo-context";
import type { ReactNode } from "react";

export function Card({
  id,
  title,
  kicker,
  children,
  className = "",
  dense = false,
}: {
  id?: string;
  title?: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  const { highlight } = useDemo();
  const hot = Boolean(id && highlight === id);
  return (
    <section
      id={id}
      className={`rounded-2xl border border-white/10 bg-[#102033]/95 ${dense ? "p-2" : "p-3"} ${hot ? "hot-card" : ""} ${className}`}
    >
      {kicker || title ? (
        <header className={dense ? "mb-1" : "mb-2"}>
          {kicker ? <p className="text-[10px] tracking-[0.16em] text-[#e4c07a] uppercase">{kicker}</p> : null}
          {title ? <h3 className="text-sm font-bold text-white">{title}</h3> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function LightPill({ score, compact = false }: { score: number | null; compact?: boolean }) {
  const light: Light = lightOf(score);
  const meta = LIGHT_META[light];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ background: meta.bg, color: meta.fg }}
    >
      <span>{meta.mark}</span>
      <span className="num">{score == null ? "—" : `${Math.round(score)}%`}</span>
      {compact ? null : <span>{meta.label}</span>}
    </span>
  );
}

export function ScoreBar({ score }: { score: number | null }) {
  const light = lightOf(score);
  const meta = LIGHT_META[light];
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score ?? 0}%`, background: meta.bg }}
      />
    </div>
  );
}
