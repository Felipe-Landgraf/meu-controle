import { z } from "zod";
import { validDate } from "@/lib/calendar";
import { parseCents } from "@/lib/money";
import { TYPES } from "./types";

export const transactionSchema = z.object({
  tipo: z.enum(TYPES, { error: "Escolha receita ou despesa." }),
  descricao: z.string().trim().min(1, "Informe uma descrição.").max(120, "Use até 120 caracteres."),
  valor: z.string().max(30, "Informe um valor válido.").transform((value, context) => {
    const cents = parseCents(value);
    if (cents !== null) return cents;
    context.addIssue({ code: "custom", message: "Informe um valor maior que zero, de até R$ 21.474.836,47 e com até duas casas decimais." });
    return z.NEVER;
  }),
  categoriaId: z.string().trim().min(1, "Selecione uma categoria.").max(100, "Categoria inválida."),
  data: z.string().refine(validDate, "Informe uma data válida."),
});
