import { PrismaClient } from "@prisma/client";
import { exampleCategories, exampleTransactions } from "../src/features/finance/examples";
import { calendarDate, today } from "../src/lib/calendar";

const prisma = new PrismaClient();

async function seed() {
  const examples = exampleTransactions(today());
  await prisma.$transaction(async (tx) => {
    const categoryIds = new Map<string, string>();
    for (const { id, nome, tipo } of exampleCategories) {
      const category = await tx.categoria.upsert({
        where: { nome_tipo: { nome, tipo } }, update: {}, create: { nome, tipo },
      });
      categoryIds.set(id, category.id);
    }
    for (const { id, descricao, valorCentavos, data, tipo, categoria } of examples) {
      await tx.movimentacao.upsert({
        where: { id }, update: {},
        create: {
          id, descricao, valorCentavos, data: calendarDate(data),
          tipo, categoriaId: categoryIds.get(categoria.id)!,
        },
      });
    }
  });
  console.log("Categorias e movimentações de demonstração disponíveis.");
}

seed().catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
