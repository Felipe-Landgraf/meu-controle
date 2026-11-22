import { categories, updateTransactions } from "./store";
import type { MutationResult } from "@/features/finance/types";
import { transactionSchema } from "@/features/finance/validation";

export async function saveTransaction(id: string | null, form: FormData): Promise<MutationResult> {
  const parsed = transactionSchema.safeParse(form);
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const { tipo, descricao, valor, categoriaId, data } = parsed.data;
  const categoria = categories.find((category) => category.id === categoriaId && category.tipo === tipo);
  if (!categoria) {
    return {
      ok: false, message: "Confira os campos destacados.",
      fields: { categoriaId: ["Escolha uma categoria compatível com o tipo da movimentação."] },
    };
  }
  const entry = { tipo, descricao, valorCentavos: valor, data, categoria };
  try {
    const saved = updateTransactions((entries) => {
      if (id === null) return [...entries, { ...entry, id: crypto.randomUUID(), created: Date.now() }];
      if (!entries.some((item) => item.id === id)) return null;
      return entries.map((item) => item.id === id ? { ...item, ...entry } : item);
    });
    return saved ? { ok: true } : { ok: false, message: "A movimentação não foi encontrada." };
  } catch {
    return { ok: false, message: "Não foi possível salvar. Confira se o navegador permite armazenar dados deste site." };
  }
}

export async function deleteTransaction(id: string): Promise<MutationResult> {
  try {
    const removed = updateTransactions((entries) =>
      entries.some((entry) => entry.id === id) ? entries.filter((entry) => entry.id !== id) : null,
    );
    return removed ? { ok: true } : { ok: false, message: "A movimentação já foi excluída." };
  } catch {
    return { ok: false, message: "Não foi possível excluir. Confira se o navegador permite armazenar dados deste site." };
  }
}
