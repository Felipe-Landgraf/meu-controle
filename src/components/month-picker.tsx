"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { monthLabel, shiftMonth, validMonth } from "@/lib/calendar";

export function MonthPicker({ month }: { month: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const previous = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  function select(value: string) {
    if (!validMonth(value) || value === month) return;
    const url = new URL(window.location.href);
    url.searchParams.set("mes", value);
    router.replace(url.pathname + url.search, { scroll: false });
  }

  return <div className="month-picker" role="group" aria-label="Período do dashboard">
    <button type="button" aria-label="Mês anterior" onClick={() => select(previous)} disabled={!validMonth(previous)}><ChevronLeft size={17} /></button>
    <div className="month-display">
      <CalendarDays size={17} aria-hidden />
      <span aria-live="polite">{monthLabel(month)}</span>
      <input ref={input} aria-label="Escolher mês e ano" type="month" min="1000-01" max="9999-12" value={month}
        onChange={(event) => select(event.target.value)}
        onClick={() => input.current?.showPicker?.()} />
    </div>
    <button type="button" aria-label="Próximo mês" onClick={() => select(next)} disabled={!validMonth(next)}><ChevronRight size={17} /></button>
  </div>;
}
