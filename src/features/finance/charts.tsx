"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { brl } from "@/lib/money";
import type { CategoryTotal } from "./types";

const tickFormat = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const tooltipStyle = { border: "1px solid #e5e8f3", borderRadius: 12, fontSize: 13 };

export function MonthlyBars({ income, expenses }: { income: number; expenses: number }) {
  const data = [
    { name: "Receitas", cents: income, fill: "#5157e5" },
    { name: "Despesas", cents: expenses, fill: "#67cbb9" },
  ];
  return <div className="bar-visual" role="img" aria-label={"Receitas: " + brl(income) + ". Despesas: " + brl(expenses) + "."}>
    <ResponsiveContainer width="100%" height={217} initialDimension={{ width: 420, height: 217 }}>
      <BarChart data={data} margin={{ top: 8, left: 4, right: 12, bottom: 1 }} accessibilityLayer={false}>
        <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={12} tick={{ fill: "#59637b", fontSize: 13, fontWeight: 700 }} />
        <YAxis width={69} axisLine={false} tickLine={false} tickMargin={8} tickCount={5}
          tick={{ fill: "#69758b", fontSize: 12 }} tickFormatter={(value: number) => "R$ " + tickFormat.format(value / 100)} />
        <Tooltip cursor={{ fill: "#f2f4fc" }} contentStyle={tooltipStyle}
          formatter={(value) => [brl(Number(value)), "Total"]} />
        <Bar dataKey="cents" radius={[9, 9, 2, 2]} maxBarSize={78} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}

export function ExpenseDonut({ distribution, expenses }: { distribution: CategoryTotal[]; expenses: number }) {
  const data = distribution.map((item) => ({ ...item, fill: item.color }));
  return <div className="donut-layout">
    <div className="donut-visual" aria-hidden="true">
      <ResponsiveContainer width="100%" height={180} initialDimension={{ width: 180, height: 180 }}>
        <PieChart accessibilityLayer={false}>
          <Pie data={data} dataKey="cents" nameKey="name" innerRadius={57} outerRadius={80}
            stroke="none" paddingAngle={data.length > 1 ? 4 : 0} cornerRadius={4} isAnimationActive={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => brl(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-value"><small>Total</small><strong>{brl(expenses)}</strong></div>
    </div>
    <ul className="chart-legend" aria-label="Despesas por categoria">
      {distribution.map((item) => <li key={item.id}>
        <span className="legend-dot" style={{ background: item.color }} aria-hidden />
        <span>{item.name}</span><strong>{brl(item.cents)}</strong>
      </li>)}
    </ul>
  </div>;
}
