"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteTransaction, saveTransaction } from "./actions";
import { TYPES, TYPE_LABEL, type Category, type Transaction, type TransactionType } from "./types";
import { moneyInput } from "@/lib/money";

type Props = { categories: Category[]; today: string; entry?: Transaction; className?: string };
type Fields = Partial<Record<"tipo" | "descricao" | "valor" | "categoriaId" | "data", string[]>>;

export function NewTransaction({ categories, today, className }: Props) {
  return <TransactionDialog categories={categories} today={today} className={className}
    trigger={<><Plus size={19} /> Nova movimentação</>} />;
}

export function EditTransaction({ categories, today, entry }: Props & { entry: Transaction }) {
  return <TransactionDialog categories={categories} today={today} entry={entry}
    className="icon-button" trigger={<Pencil size={16} />} />;
}

function TransactionDialog({ categories, today, entry, className, trigger }: Props & { trigger: ReactNode }) {
  const router = useRouter();
  const formId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<TransactionType>(entry?.tipo ?? "DESPESA");
  const [category, setCategory] = useState(entry?.categoria.id ?? "");
  const [fields, setFields] = useState<Fields>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const title = entry ? "Editar movimentação" : "Nova movimentação";

  function open() {
    formRef.current?.reset();
    setType(entry?.tipo ?? "DESPESA");
    setCategory(entry?.categoria.id ?? "");
    setFields({});
    setMessage("");
    dialog.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFields({});
    setMessage("");
    setPending(true);
    try {
      const result = await saveTransaction(entry?.id ?? null, data);
      if (result.ok) {
        dialog.current?.close();
        router.refresh();
      } else {
        setFields(result.fields ?? {});
        setMessage(result.message);
        const firstField = Object.keys(result.fields ?? {})[0];
        if (firstField) {
          const control = formRef.current?.elements.namedItem(firstField);
          if (control instanceof HTMLElement) requestAnimationFrame(() => control.focus());
        }
      }
    } catch {
      setMessage("Não foi possível salvar a movimentação. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  const fieldError = (name: keyof Fields) => fields[name]?.length
    ? <small className="field-error" id={formId + "-" + name}>{fields[name]?.[0]}</small>
    : null;
  const accessibility = (name: keyof Fields) => ({
    "aria-invalid": fields[name]?.length ? true : undefined,
    "aria-describedby": fields[name]?.length ? formId + "-" + name : undefined,
  });
  const headingId = formId + "-title";

  return <>
    <button type="button" className={className ?? "primary-button"} onClick={open}
      aria-label={entry ? "Editar " + entry.descricao : undefined} title={entry ? "Editar movimentação" : undefined}>{trigger}</button>
    <dialog className="modal" ref={dialog} aria-labelledby={headingId}
      onCancel={(event) => { if (pending) event.preventDefault(); }}>
      <div className="modal-header">
        <h2 id={headingId}>{title}</h2>
        <button type="button" className="icon-button" aria-label="Fechar" disabled={pending} onClick={() => dialog.current?.close()}><X size={20} /></button>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="field"><label htmlFor={formId + "-type"}>Tipo</label>
            <span className="select-wrap"><select id={formId + "-type"} name="tipo" required value={type} {...accessibility("tipo")}
              onChange={(event) => { setType(event.target.value as TransactionType); setCategory(""); }}>
              {TYPES.map((option) => <option key={option} value={option}>{TYPE_LABEL[option]}</option>)}
            </select><ChevronDown size={15} aria-hidden /></span>
            {fieldError("tipo")}
          </div>
          <div className="field"><label htmlFor={formId + "-date"}>Data</label>
            <input id={formId + "-date"} type="date" name="data" required defaultValue={entry?.data ?? today} {...accessibility("data")} />
            {fieldError("data")}
          </div>
          <div className="field col-span-full"><label htmlFor={formId + "-description"}>Descrição</label>
            <input id={formId + "-description"} name="descricao" maxLength={120} defaultValue={entry?.descricao} required
              placeholder="Ex.: Supermercado" {...accessibility("descricao")} />
            {fieldError("descricao")}
          </div>
          <div className="field"><label htmlFor={formId + "-amount"}>Valor (R$)</label>
            <input id={formId + "-amount"} name="valor" inputMode="decimal" maxLength={30} required defaultValue={entry ? moneyInput(entry.valorCentavos) : ""}
              placeholder="0,00" {...accessibility("valor")} />
            {fieldError("valor")}
          </div>
          <div className="field"><label htmlFor={formId + "-category"}>Categoria</label>
            <span className="select-wrap"><select id={formId + "-category"} name="categoriaId" value={category} required {...accessibility("categoriaId")}
              onChange={(event) => setCategory(event.target.value)}>
              <option value="">Selecione</option>
              {categories.filter((item) => item.tipo === type).map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select><ChevronDown size={15} aria-hidden /></span>
            {fieldError("categoriaId")}
          </div>
        </div>
        {message && <p className="form-error" role="alert">{message}</p>}
        <div className="modal-actions">
          <button type="button" className="secondary-button" disabled={pending} onClick={() => dialog.current?.close()}>Cancelar</button>
          <button type="submit" className="primary-button" disabled={pending}>{pending ? "Salvando…" : "Salvar movimentação"}</button>
        </div>
      </form>
    </dialog>
  </>;
}

export function DeleteTransaction({ entry }: { entry: Transaction }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function remove() {
    setPending(true);
    setMessage("");
    try {
      const result = await deleteTransaction(entry.id);
      if (result.ok) {
        dialog.current?.close();
        router.refresh();
      } else setMessage(result.message);
    } catch {
      setMessage("Não foi possível excluir a movimentação. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return <>
    <button className="icon-button delete-icon" type="button" aria-label={"Excluir " + entry.descricao} title="Excluir movimentação"
      onClick={() => { setMessage(""); dialog.current?.showModal(); }}><Trash2 size={16} /></button>
    <dialog ref={dialog} className="modal confirm-modal" aria-labelledby={"delete-" + entry.id}
      onCancel={(event) => { if (pending) event.preventDefault(); }}>
      <h2 id={"delete-" + entry.id}>Excluir movimentação?</h2>
      <p>Confirme a exclusão de <strong>{entry.descricao}</strong>.</p>
      {message && <p className="form-error" role="alert">{message}</p>}
      <div className="modal-actions">
        <button className="secondary-button" disabled={pending} onClick={() => dialog.current?.close()}>Cancelar</button>
        <button className="danger-button" disabled={pending} onClick={remove}>{pending ? "Excluindo…" : "Excluir movimentação"}</button>
      </div>
    </dialog>
  </>;
}
