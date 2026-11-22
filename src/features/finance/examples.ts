import { shiftMonth } from "@/lib/calendar";
import type { Category, Transaction } from "./types";

export const exampleCategories: Category[] = [
  { id: "salario", nome: "Salário", tipo: "RECEITA" },
  { id: "freelance", nome: "Freelance", tipo: "RECEITA" },
  { id: "alimentacao", nome: "Alimentação", tipo: "DESPESA" },
  { id: "moradia", nome: "Moradia", tipo: "DESPESA" },
  { id: "transporte", nome: "Transporte", tipo: "DESPESA" },
  { id: "saude", nome: "Saúde", tipo: "DESPESA" },
  { id: "lazer", nome: "Lazer", tipo: "DESPESA" },
];

const examples = [
  ["Salário mensal", 580000, "salario", 3],
  ["Projeto freelance", 145000, "freelance", 9],
  ["Aluguel do apartamento", 160000, "moradia", 5],
  ["Supermercado", 58990, "alimentacao", 15],
  ["Combustível", 28400, "transporte", 13],
  ["Farmácia", 19000, "saude", 10],
  ["Jantar com amigos", 12850, "lazer", 18],
  ["Padaria e café", 7990, "alimentacao", 20],
] as const;

const categoriesById = new Map(exampleCategories.map((category) => [category.id, category]));

export function exampleTransactions(current: string): Transaction[] {
  const currentMonth = current.slice(0, 7);
  const currentDay = Number(current.slice(-2));
  return [0, -1].flatMap((offset) => {
    const month = shiftMonth(currentMonth, offset);
    return examples.map(([descricao, amount, category, plannedDay], index) => {
      const day = offset === 0 ? Math.min(plannedDay, currentDay) : plannedDay;
      const categoria = categoriesById.get(category)!;
      return {
        id: "demo-" + month + "-" + index,
        descricao,
        valorCentavos: amount + (offset === -1 && index === 1 ? -25000 : 0),
        data: month + "-" + String(day).padStart(2, "0"),
        tipo: categoria.tipo,
        categoria,
      };
    });
  });
}
