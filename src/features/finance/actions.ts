"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calendarDate } from "@/lib/calendar";
import { db } from "@/lib/db";
import { transactionSchema } from "./validation";
import type { MutationResult } from "./types";

export async function saveTransaction(id: string | null, form: FormData): Promise<MutationResult> {
  const parsed = transactionSchema.safeParse(form);
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }

  const { tipo, descricao, valor, categoriaId, data } = parsed.data;
  try {
    const category = await db.categoria.findUnique({ where: { id: categoriaId } });
    if (!category || category.tipo !== tipo) {
      return {
        ok: false, message: "Confira os campos destacados.",
        fields: { categoriaId: ["Escolha uma categoria compatível com o tipo da movimentação."] },
      };
    }

    const record = { tipo, descricao, valorCentavos: valor, categoriaId, data: calendarDate(data) };
    if (id === null) await db.movimentacao.create({ data: record });
    else await db.movimentacao.update({ where: { id }, data: record });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, message: "A movimentação não foi encontrada. Recarregue a página." };
    }
    console.error("Falha ao salvar movimentação", error);
    return { ok: false, message: "Não foi possível salvar a movimentação. Tente novamente." };
  }

  revalidatePath("/");
  revalidatePath("/movimentacoes");
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<MutationResult> {
  try {
    await db.movimentacao.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, message: "A movimentação já foi excluída. Recarregue a página." };
    }
    console.error("Falha ao excluir movimentação", error);
    return { ok: false, message: "Não foi possível excluir a movimentação. Tente novamente." };
  }

  revalidatePath("/");
  revalidatePath("/movimentacoes");
  return { ok: true };
}
