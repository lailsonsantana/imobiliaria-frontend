import { useState } from "react";
import Card from "../../components/Card";
import FilterButton from "../../components/FilterButton";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { allUnits, formatCurrency } from "../../utils/analytics";

const statuses = ["Todos os status", "Vendido", "Em aberto", "Reservado", "Distratado"];
const types = ["Todos os tipos", "Lote", "Apartamento", "Casa"];

function Unidades() {
  const [status, setStatus] = useState(statuses[0]);
  const [type, setType] = useState(types[0]);
  const filtered = allUnits.filter(
    (unit) =>
      (status === statuses[0] || unit.status === status) &&
      (type === types[0] || unit.tipo === type),
  );

  return (
    <div>
      <PageHeader title="Unidades Imobiliárias" subtitle={`${filtered.length} unidades`} />
      <div className="filter-row" aria-label="Filtros de unidades">
        {statuses.map((item) => (
          <FilterButton key={item} label={item} active={status === item} onClick={() => setStatus(item)} />
        ))}
        <span className="filter-divider" />
        {types.map((item) => (
          <FilterButton key={item} label={item} active={type === item} onClick={() => setType(item)} />
        ))}
      </div>
      <Card noPadding>
        <div className="table-wrap">
          <table className="data-table">
            <thead><TableRow><TableHeaderCell>Empreendimento</TableHeaderCell><TableHeaderCell>Cidade</TableHeaderCell><TableHeaderCell>Nº</TableHeaderCell><TableHeaderCell>Quadra</TableHeaderCell><TableHeaderCell>Área m²</TableHeaderCell><TableHeaderCell>Tipo</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Valor</TableHeaderCell></TableRow></thead>
            <tbody>{filtered.map((unit) => (
              <TableRow key={unit._id}>
                <TableCell><span className="text-primary">{unit.emp_nome}</span></TableCell>
                <TableCell>{unit.emp_cidade}</TableCell>
                <TableCell mono>{unit.numero}</TableCell>
                <TableCell mono>{unit.quadra}</TableCell>
                <TableCell mono>{unit.area.toLocaleString("pt-BR")}</TableCell>
                <TableCell><StatusBadge status={unit.tipo} /></TableCell>
                <TableCell><StatusBadge status={unit.status} /></TableCell>
                <TableCell mono><span className="text-accent">{formatCurrency(unit.valor)}</span></TableCell>
              </TableRow>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state">Nenhuma unidade encontrada para esses filtros.</div>}
        </div>
      </Card>
    </div>
  );
}

export default Unidades;
