"use client";

import { Sandbox } from "@/components/Sandbox";
import { DemoProvider } from "@/lib/demo-context";

export default function HomePage() {
  return (
    <DemoProvider>
      <Sandbox />
    </DemoProvider>
  );
}
