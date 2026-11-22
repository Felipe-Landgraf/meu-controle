import { List, SearchX } from "lucide-react";
import { monthLabel } from "@/lib/calendar";
import { NewTransaction } from "./transaction-dialog";
import { TransactionFilters } from "./transaction-filters";
import { TransactionTable } from "./transaction-table";
import type { Category, Filters, Transaction } from "./types";

export function TransactionsView({ filters, entries, options, current, demo = false }: {
  filters: Filters; entries: Transaction[]; options: Category[]; current: string; demo?: boolean;
}) {
  const hasFilters = Boolean(filters.busca || filters.tipo || filters.categoria);

  return <>
    <header className="page-heading">
      <div><h1>Movimentações</h1><p>Registre e gerencie suas receitas e despesas.</p></div>
      <div className="header-actions"><NewTransaction categories={options} today={current} /></div>
    </header>
    <TransactionFilters filters={filters} categories={options} demo={demo} />
    <section className="panel recent-panel" aria-labelledby="transactions-title">
      <div className="panel-heading">
        <div className="recent-heading"><span className="panel-icon"><List size={19} /></span><div>
          <h2 id="transactions-title">Registros do mês</h2>
          <p>{monthLabel(filters.mes)} · {entries.length} {entries.length === 1 ? "movimentação" : "movimentações"}</p>
        </div></div>
      </div>
      {entries.length ? <TransactionTable entries={entries} categoryOptions={options} today={current} />
        : <div className="empty-state">
          <span className="empty-icon"><SearchX size={26} /></span>
          <h3>{hasFilters ? "Nenhum resultado encontrado" : "Nenhuma movimentação neste mês"}</h3>
          <p>{hasFilters ? "Ajuste os filtros ou busque por outra descrição." : "Adicione uma receita ou despesa para começar."}</p>
          {!hasFilters && <NewTransaction categories={options} today={current} className="primary-button empty-button" />}
        </div>}
    </section>
  </>;
}
