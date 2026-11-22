import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { TYPES, TYPE_LABEL, type Category, type Filters } from "./types";

export function TransactionFilters({ filters, categories }: { filters: Filters; categories: Category[] }) {
  const key = JSON.stringify(filters);
  return <form key={key} action="/movimentacoes" method="get" className="panel filter-panel" aria-label="Filtros de movimentações">
    <div className="filter-title"><SlidersHorizontal size={17} /><h2>Filtros</h2></div>
    <div className="filter-grid">
      <div className="field search-field"><label htmlFor="filter-description">Descrição</label>
        <span className="search-wrap"><Search size={17} aria-hidden /><input id="filter-description" name="busca" maxLength={120}
          placeholder="Buscar movimentação" defaultValue={filters.busca} /></span>
      </div>
      <div className="field month-field"><label htmlFor="filter-month">Mês</label>
        <input id="filter-month" name="mes" type="month" required min="1000-01" max="9999-12" defaultValue={filters.mes} />
      </div>
      <div className="field"><label htmlFor="filter-type">Tipo</label>
        <span className="select-wrap"><select id="filter-type" name="tipo" defaultValue={filters.tipo}>
          <option value="">Todos</option>
          {TYPES.map((type) => <option key={type} value={type}>{TYPE_LABEL[type]}</option>)}
        </select><ChevronDown size={15} aria-hidden /></span>
      </div>
      <div className="field"><label htmlFor="filter-category">Categoria</label>
        <span className="select-wrap"><select id="filter-category" name="categoria" defaultValue={filters.categoria}>
          <option value="">Todas</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.nome}</option>)}
        </select><ChevronDown size={15} aria-hidden /></span>
      </div>
    </div>
    <div className="filter-actions">
      <Link href="/movimentacoes" className="secondary-button">Limpar filtros</Link>
      <button className="primary-button" type="submit">Aplicar filtros</button>
    </div>
  </form>;
}
