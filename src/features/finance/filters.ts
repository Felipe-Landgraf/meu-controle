import { validMonth } from "@/lib/calendar";
import type { Category, Filters } from "./types";

export type Search = Record<string, string | string[] | undefined>;

export function selectedMonth(search: Search, today: string) {
  return validMonth(search.mes) ? search.mes : today.slice(0, 7);
}

export function readFilters(search: Search, today: string, categories: Category[]): Filters {
  return {
    mes: selectedMonth(search, today),
    tipo: search.tipo === "RECEITA" || search.tipo === "DESPESA" ? search.tipo : "",
    categoria: categories.find((category) => category.id === search.categoria)?.id ?? "",
    busca: typeof search.busca === "string" ? search.busca.trim().slice(0, 120) : "",
  };
}

export function monthlyFiltersHref(month: string) {
  return "/movimentacoes?mes=" + encodeURIComponent(month);
}
