import { useMemo, useSyncExternalStore } from "react";
import { calendarDate, monthRange, today } from "@/lib/calendar";
import { exampleCategories, exampleTransactions } from "@/features/finance/examples";
import type { Filters, Transaction } from "@/features/finance/types";

type Entry = Transaction & { created: number };
const key = "felipe-landgraf/meu-controle-demo/v1";
const change = "meu-controle:transactions";
const initial = JSON.stringify(exampleTransactions(today()).map((entry, created) => ({ ...entry, created })));

export const categories = [...exampleCategories].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

function snapshot() {
  try { return localStorage.getItem(key) ?? initial; }
  catch { return initial; }
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) callback();
  };
  window.addEventListener(change, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(change, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function parse(value: string): Entry[] {
  try {
    const entries: unknown = JSON.parse(value);
    if (Array.isArray(entries)) return entries as Entry[];
  } catch { /* A demo can recover its sample data after an invalid cache. */ }
  return JSON.parse(initial) as Entry[];
}

export function useTransactions() {
  const value = useSyncExternalStore(subscribe, snapshot);
  return useMemo(() => parse(value), [value]);
}

export function updateTransactions(mutate: (entries: Entry[]) => Entry[] | null) {
  const entries = mutate(parse(snapshot()));
  if (!entries) return false;
  localStorage.setItem(key, JSON.stringify(entries));
  window.dispatchEvent(new Event(change));
  return true;
}

export function searchTransactions(entries: Entry[], filters: Filters) {
  const { gte, lt } = monthRange(filters.mes);
  const search = filters.busca.toLocaleLowerCase("pt-BR");
  return entries.filter((entry) => {
    const date = calendarDate(entry.data);
    return date >= gte && date < lt &&
      (!filters.tipo || entry.tipo === filters.tipo) &&
      (!filters.categoria || entry.categoria.id === filters.categoria) &&
      (!search || entry.descricao.toLocaleLowerCase("pt-BR").includes(search));
  }).sort((a, b) => b.data.localeCompare(a.data) || b.created - a.created || b.id.localeCompare(a.id));
}
