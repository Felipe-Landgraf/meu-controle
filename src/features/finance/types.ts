export const TYPES = ["RECEITA", "DESPESA"] as const;
export type TransactionType = (typeof TYPES)[number];
export const TYPE_LABEL = { RECEITA: "Receita", DESPESA: "Despesa" };

export type Category = { id: string; nome: string; tipo: TransactionType };
export type Transaction = {
  id: string;
  descricao: string;
  valorCentavos: number;
  data: string;
  tipo: TransactionType;
  categoria: Category;
};

export type Filters = { mes: string; tipo: "" | TransactionType; categoria: string; busca: string };
export type CategoryTotal = { id: string; name: string; cents: number; color: string };
export type Dashboard = {
  income: number; expenses: number; balance: number; distribution: CategoryTotal[]; recent: Transaction[];
};
export type TransactionField = "tipo" | "descricao" | "valor" | "categoriaId" | "data";
export type MutationResult =
  | { ok: true }
  | { ok: false; message: string; fields?: Partial<Record<TransactionField, string[]>> };

export const CATEGORY_COLORS: Record<string, string> = {
  Moradia: "#4049d8",
  Alimentação: "#50c1ad",
  Transporte: "#f0a35d",
  Saúde: "#aa8be9",
  Lazer: "#e7819c",
};
