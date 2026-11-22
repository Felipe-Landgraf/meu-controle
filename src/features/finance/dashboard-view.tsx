import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChartNoAxesColumn, CircleDollarSign, List, Wallet } from "lucide-react";
import { MonthPicker } from "@/components/month-picker";
import { brl } from "@/lib/money";
import { monthlyFiltersHref } from "./filters";
import type { Category, Dashboard } from "./types";
import { ExpenseDonut, MonthlyBars } from "./charts";
import { NewTransaction } from "./transaction-dialog";
import { TransactionTable } from "./transaction-table";

export function DashboardView({ month, today, options, data }: {
  month: string; today: string; options: Category[]; data: Dashboard;
}) {
  const metrics = [
    { label: "Saldo do mês", amount: data.balance, Icon: Wallet, style: "balance", note: "Receitas menos despesas" },
    { label: "Receitas", amount: data.income, Icon: ArrowDownLeft, style: "income", note: "Total de entradas no mês" },
    { label: "Despesas", amount: data.expenses, Icon: ArrowUpRight, style: "expense", note: "Total de saídas no mês" },
  ];

  return <>
    <header className="page-heading">
      <div><h1>Visão geral</h1><p>Acompanhe suas finanças mês a mês.</p></div>
      <div className="header-actions"><MonthPicker month={month} /><NewTransaction categories={options} today={today} /></div>
    </header>
    <section aria-label="Resumo do mês" className="metric-grid">
      {metrics.map(({ Icon, amount, label, style, note }) =>
        <article key={label} className={"metric-card " + style}>
          <div className="metric-heading"><span className="metric-icon"><Icon size={19} strokeWidth={1.9} /></span><h2>{label}</h2></div>
          <strong className="metric-value">{brl(amount)}</strong><p>{note}</p>
        </article>,
      )}
    </section>
    {data.recent.length === 0 ? <section className="panel empty-state">
      <span className="empty-icon"><CircleDollarSign size={28} /></span>
      <h2>Nenhuma movimentação neste mês</h2>
      <p>Cadastre a primeira receita ou despesa para começar a acompanhar seu saldo.</p>
      <NewTransaction categories={options} today={today} className="primary-button empty-button" />
    </section> : <>
      <section className="chart-grid" aria-label="Gráficos do mês">
        <article className="panel chart-panel">
          <div className="panel-heading"><div><h2>Receitas e despesas</h2><p>Comparativo de entradas e saídas</p></div><span className="panel-icon"><ChartNoAxesColumn size={19} /></span></div>
          <MonthlyBars income={data.income} expenses={data.expenses} />
        </article>
        <article className="panel chart-panel">
          <div className="panel-heading"><div><h2>Despesas por categoria</h2><p>Veja para onde foi seu dinheiro</p></div><span className="panel-icon donut-icon" aria-hidden>◔</span></div>
          {data.expenses > 0 ? <ExpenseDonut distribution={data.distribution} expenses={data.expenses} />
            : <p className="chart-empty">Nenhuma despesa registrada neste mês.</p>}
        </article>
      </section>
      <section className="panel recent-panel" aria-labelledby="recent-title">
        <div className="panel-heading">
          <div className="recent-heading"><span className="panel-icon"><List size={19} /></span><div><h2 id="recent-title">Movimentações recentes</h2><p>Últimos registros do mês selecionado</p></div></div>
          <Link className="text-link" href={monthlyFiltersHref(month)}>Ver todas <ArrowRight size={15} aria-hidden /></Link>
        </div>
        <TransactionTable entries={data.recent} />
      </section>
    </>}
  </>;
}
