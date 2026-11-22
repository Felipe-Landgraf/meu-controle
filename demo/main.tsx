import { createRoot } from "react-dom/client";
import "@fontsource-variable/manrope";
import "@/app/globals.css";
import favicon from "@/app/icon.svg";
import { AppShell } from "@/components/app-shell";
import { DashboardView } from "@/features/finance/dashboard-view";
import { readFilters } from "@/features/finance/filters";
import { summarize } from "@/features/finance/summary";
import { TransactionsView } from "@/features/finance/transactions-view";
import { today } from "@/lib/calendar";
import { useLocation } from "./navigation";
import { categories, searchTransactions, useTransactions } from "./store";

function Demo() {
  const search = useLocation().searchParams;
  const current = today();
  const allEntries = useTransactions();
  const showingTransactions = search.get("tela") === "movimentacoes";
  const filters = readFilters(showingTransactions ? Object.fromEntries(search) : { mes: search.get("mes") ?? undefined }, current, categories);
  const entries = searchTransactions(allEntries, filters);

  return <AppShell demo>
    <p className="demo-notice"><strong>Demonstração pública.</strong> Dados fictícios e alterações salvas neste navegador.</p>
    {showingTransactions
      ? <TransactionsView filters={filters} options={categories} entries={entries} current={current} demo />
      : <DashboardView month={filters.mes} today={current} options={categories} data={summarize(entries, entries.slice(0, 5))} />}
  </AppShell>;
}

const icon = document.createElement("link");
icon.rel = "icon";
icon.href = favicon;
document.head.append(icon);
createRoot(document.getElementById("root")!).render(<Demo />);
