import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { displayDate } from "@/lib/calendar";
import { brl } from "@/lib/money";
import { TYPE_LABEL, type Category, type Transaction } from "./types";
import { DeleteTransaction, EditTransaction } from "./transaction-dialog";

export function TransactionTable({ entries, categoryOptions, today }: {
  entries: Transaction[];
  categoryOptions?: Category[];
  today?: string;
}) {
  return <table className="transactions-table">
    <thead><tr>
      <th scope="col">Descrição</th><th scope="col">Data</th><th scope="col">Categoria</th>
      <th scope="col">Tipo</th><th scope="col" className="amount">Valor</th>
      {categoryOptions && <th scope="col" className="actions-heading">Ações</th>}
    </tr></thead>
    <tbody>
      {entries.map((item) => {
        const income = item.tipo === "RECEITA";
        const Icon = income ? ArrowDownLeft : ArrowUpRight;
        return <tr key={item.id}>
          <th scope="row" className="transaction-description"><span className={income ? "transaction-icon income" : "transaction-icon expense"}><Icon size={17} aria-hidden /></span><span>{item.descricao}</span></th>
          <td className="transaction-date"><time dateTime={item.data}>{displayDate(item.data)}</time></td>
          <td className="transaction-category">{item.categoria.nome}</td>
          <td className="transaction-type"><span className={income ? "type-label income" : "type-label expense"}>{TYPE_LABEL[item.tipo]}</span></td>
          <td className={income ? "amount income-amount" : "amount"}>{income ? "+" : "−"}{brl(item.valorCentavos)}</td>
          {categoryOptions && today && <td className="transaction-actions">
            <EditTransaction entry={item} today={today} categories={categoryOptions} />
            <DeleteTransaction entry={item} />
          </td>}
        </tr>;
      })}
    </tbody>
  </table>;
}
