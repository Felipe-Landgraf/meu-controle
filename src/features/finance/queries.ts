import type { Prisma } from "@prisma/client";
import { dateKey, monthRange } from "@/lib/calendar";
import { db } from "@/lib/db";
import { CATEGORY_COLORS, type Filters, type Transaction } from "./types";

const orderBy: Prisma.MovimentacaoOrderByWithRelationInput[] = [
  { data: "desc" }, { criadaEm: "desc" }, { id: "desc" },
];

type Row = Prisma.MovimentacaoGetPayload<{ include: { categoria: true } }>;

function serialize(row: Row): Transaction {
  return {
    id: row.id, descricao: row.descricao, valorCentavos: row.valorCentavos,
    data: dateKey(row.data), tipo: row.tipo, categoria: row.categoria,
  };
}

export function categories() {
  return db.categoria.findMany({ orderBy: { nome: "asc" } });
}

export async function transactions(filters: Filters) {
  const rows = await db.movimentacao.findMany({
    where: {
      data: monthRange(filters.mes),
      tipo: filters.tipo || undefined,
      categoriaId: filters.categoria || undefined,
      descricao: filters.busca ? { contains: filters.busca, mode: "insensitive" } : undefined,
    },
    include: { categoria: true },
    orderBy,
  });
  return rows.map(serialize);
}

export async function dashboard(month: string) {
  const where = { data: monthRange(month) };
  const { groups, recent, names } = await db.$transaction(async (tx) => {
    const groups = await tx.movimentacao.groupBy({ by: ["tipo", "categoriaId"], where, _sum: { valorCentavos: true } });
    const recent = await tx.movimentacao.findMany({ where, orderBy, take: 5, include: { categoria: true } });
    const names = await tx.categoria.findMany({ where: { tipo: "DESPESA" } });
    return { groups, recent, names };
  }, { isolationLevel: "RepeatableRead" });

  const expenseGroups = groups.filter((group) => group.tipo === "DESPESA");
  const byId = new Map(names.map((category) => [category.id, category.nome]));
  const income = groups.filter((group) => group.tipo === "RECEITA")
    .reduce((total, group) => total + (group._sum.valorCentavos ?? 0), 0);
  const distribution = expenseGroups.map((group) => {
    const name = byId.get(group.categoriaId) ?? "Outras";
    return {
      id: group.categoriaId, name, cents: group._sum.valorCentavos ?? 0, color: CATEGORY_COLORS[name] ?? "#63758b",
    };
  }).sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name, "pt-BR"));
  const expenses = distribution.reduce((total, category) => total + category.cents, 0);
  return { income, expenses, balance: income - expenses, distribution, recent: recent.map(serialize) };
}
