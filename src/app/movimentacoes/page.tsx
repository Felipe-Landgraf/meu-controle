import { today } from "@/lib/calendar";
import { readFilters, type Search } from "@/features/finance/filters";
import { categories, transactions } from "@/features/finance/queries";
import { TransactionsView } from "@/features/finance/transactions-view";

export const metadata = { title: "Movimentações" };
export const dynamic = "force-dynamic";

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const current = today();
  const [search, options] = await Promise.all([searchParams, categories()]);
  const filters = readFilters(search, current, options);
  const entries = await transactions(filters);
  return <TransactionsView filters={filters} entries={entries} options={options} current={current} />;
}
