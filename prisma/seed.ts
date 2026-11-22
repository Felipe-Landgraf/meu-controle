import { PrismaClient, type Tipo } from "@prisma/client";
import { calendarDate, shiftMonth, today } from "../src/lib/calendar";

const prisma = new PrismaClient();
const categories: Record<string, Tipo> = {
  Salário: "RECEITA", Freelance: "RECEITA", Alimentação: "DESPESA", Moradia: "DESPESA",
  Transporte: "DESPESA", Saúde: "DESPESA", Lazer: "DESPESA",
};
const examples = [
  ["Salário mensal", 580000, "Salário", 3],
  ["Projeto freelance", 145000, "Freelance", 9],
  ["Aluguel do apartamento", 160000, "Moradia", 5],
  ["Supermercado", 58990, "Alimentação", 15],
  ["Combustível", 28400, "Transporte", 13],
  ["Farmácia", 19000, "Saúde", 10],
  ["Jantar com amigos", 12850, "Lazer", 18],
  ["Padaria e café", 7990, "Alimentação", 20],
] as const;

async function seed() {
  const current = today();
  const currentMonth = current.slice(0, 7);
  const currentDay = Number(current.slice(-2));
  await prisma.$transaction(async (tx) => {
    const categoryIds = new Map<string, string>();
    for (const [nome, tipo] of Object.entries(categories)) {
      const category = await tx.categoria.upsert({
        where: { nome_tipo: { nome, tipo } }, update: {}, create: { nome, tipo },
      });
      categoryIds.set(nome, category.id);
    }
    for (const offset of [0, -1]) {
      const month = shiftMonth(currentMonth, offset);
      for (const [index, [descricao, amount, category, plannedDay]] of examples.entries()) {
        const day = offset === 0 ? Math.min(plannedDay, currentDay) : plannedDay;
        const id = "demo-" + month + "-" + index;
        await tx.movimentacao.upsert({
          where: { id }, update: {},
          create: {
            id, descricao, valorCentavos: amount + (offset === -1 && index === 1 ? -25000 : 0),
            data: calendarDate(month + "-" + String(day).padStart(2, "0")),
            tipo: categories[category], categoriaId: categoryIds.get(category)!,
          },
        });
      }
    }
  });
  console.log("Categorias e movimentações de demonstração disponíveis.");
}

seed().catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
