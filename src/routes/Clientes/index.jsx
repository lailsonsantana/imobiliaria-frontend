import { useMemo, useState } from "react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SearchBox from "../../components/SearchBox";
import SectionTitle from "../../components/SectionTitle";
import StatusBadge from "../../components/StatusBadge";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { CLIENTES } from "../../data/mockData";
import { ANALYTICS } from "../../utils/analytics";

function Clientes() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return CLIENTES.filter(
      (client) =>
        client.nome.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        client.cpf.includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div>
      <PageHeader title="Clientes" subtitle={`${CLIENTES.length} clientes cadastrados`} />
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <SearchBox value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou CPF..." />
      </div>
      <div className="content-stack">
        <Card noPadding>
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>Nome</TableHeaderCell><TableHeaderCell>CPF</TableHeaderCell><TableHeaderCell>Estado Civil</TableHeaderCell><TableHeaderCell>Profissão</TableHeaderCell><TableHeaderCell>E-mail</TableHeaderCell><TableHeaderCell>Tel. Res.</TableHeaderCell><TableHeaderCell>Tel. Com.</TableHeaderCell></TableRow></thead>
              <tbody>{filtered.map((client) => (
                <TableRow key={client._id}>
                  <TableCell><span className="text-primary">{client.nome}</span></TableCell>
                  <TableCell mono>{client.cpf}</TableCell>
                  <TableCell><StatusBadge status={client.estado_civil} /></TableCell>
                  <TableCell>{client.profissao}</TableCell>
                  <TableCell><span className="text-accent">{client.email}</span></TableCell>
                  <TableCell mono>{client.telefone[0].residencial}</TableCell>
                  <TableCell mono>{client.telefone[0].comercial}</TableCell>
                </TableRow>
              ))}</tbody>
            </table>
            {filtered.length === 0 && <div className="empty-state">Nenhum cliente encontrado.</div>}
          </div>
        </Card>
        <Card>
          <SectionTitle>Consulta 6 — Ranking de Clientes por Unidades Adquiridas</SectionTitle>
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>#</TableHeaderCell><TableHeaderCell>Cliente</TableHeaderCell><TableHeaderCell>Total</TableHeaderCell><TableHeaderCell>Pagas</TableHeaderCell><TableHeaderCell>Em Pagamento</TableHeaderCell></TableRow></thead>
              <tbody>{ANALYTICS.topClientes.map((client, index) => (
                <TableRow key={client._id}>
                  <TableCell><span className="text-accent">#{index + 1}</span></TableCell>
                  <TableCell><span className="text-primary">{client.nome}</span></TableCell>
                  <TableCell mono><strong className="text-accent">{client.total}</strong></TableCell>
                  <TableCell><StatusBadge status="Liquidado" /> <span className="mono">{client.pagas}</span></TableCell>
                  <TableCell><StatusBadge status="Financiado" /> <span className="mono">{client.emPagamento}</span></TableCell>
                </TableRow>
              ))}</tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Clientes;
