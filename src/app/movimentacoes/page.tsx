import { List, SearchX } from "lucide-react";
import { monthLabel, today } from "@/lib/calendar";
import { readFilters, type Search } from "@/features/finance/filters";
import { categories, transactions } from "@/features/finance/queries";
import { NewTransaction } from "@/features/finance/transaction-dialog";
import { TransactionFilters } from "@/features/finance/transaction-filters";
import { TransactionTable } from "@/features/finance/transaction-table";

export const metadata = { title: "Movimentações" };
export const dynamic = "force-dynamic";

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const current = today();
  const [search, options] = await Promise.all([searchParams, categories()]);
  const filters = readFilters(search, current, options);
  const entries = await transactions(filters);
  const hasFilters = Boolean(filters.busca || filters.tipo || filters.categoria);

  return <>
    <header className="page-heading">
      <div><h1>Movimentações</h1><p>Registre e gerencie suas receitas e despesas.</p></div>
      <div className="header-actions"><NewTransaction categories={options} today={current} /></div>
    </header>
    <TransactionFilters filters={filters} categories={options} />
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
