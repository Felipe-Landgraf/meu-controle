import { CATEGORY_COLORS, type CategoryTotal, type Dashboard, type Transaction } from "./types";

type Amount = Pick<Transaction, "tipo" | "valorCentavos" | "categoria">;

export function summarize(entries: Amount[], recent: Transaction[]): Dashboard {
  let income = 0;
  let expenses = 0;
  const categories = new Map<string, CategoryTotal>();
  for (const { tipo, valorCentavos, categoria: { id, nome } } of entries) {
    if (tipo === "RECEITA") {
      income += valorCentavos;
      continue;
    }
    expenses += valorCentavos;
    const total = categories.get(id);
    if (total) total.cents += valorCentavos;
    else categories.set(id, { id, name: nome, cents: valorCentavos, color: CATEGORY_COLORS[nome] ?? "#63758b" });
  }
  const distribution = [...categories.values()].sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name, "pt-BR"));
  return { income, expenses, balance: income - expenses, distribution, recent };
}
