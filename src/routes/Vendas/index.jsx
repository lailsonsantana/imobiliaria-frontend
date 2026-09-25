import { useState } from "react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SectionTitle from "../../components/SectionTitle";
import StatusBadge from "../../components/StatusBadge";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { CLIENTES, EMPREENDIMENTOS, VENDAS } from "../../data/mockData";
import { ANALYTICS, formatCurrency } from "../../utils/analytics";

const tabs = ["Todos", "Financiado", "Liquidado", "Distratado", "Transferido"];

function Vendas() {
  const [activeTab, setActiveTab] = useState("Todos");
  const filtered = VENDAS.filter((sale) => activeTab === "Todos" || sale.status === activeTab);
  const showDistratos = activeTab === "Todos" || activeTab === "Distratado";

  return (
    <div>
      <PageHeader title="Vendas" subtitle={`${VENDAS.length} contratos`} />
      <div className="tab-row" role="tablist" aria-label="Filtrar vendas por status">
        {tabs.map((tab) => (
          <button
            className={`tab-button ${activeTab === tab ? "tab-button--active" : ""}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="content-stack">
        <Card noPadding>
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>ID</TableHeaderCell><TableHeaderCell>Cliente(s)</TableHeaderCell><TableHeaderCell>Empreendimento</TableHeaderCell><TableHeaderCell>Vendedor</TableHeaderCell><TableHeaderCell>Valor</TableHeaderCell><TableHeaderCell>Parcelas</TableHeaderCell><TableHeaderCell>Pagas</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Data</TableHeaderCell></TableRow></thead>
              <tbody>{filtered.map((sale) => {
                const empreendimento = EMPREENDIMENTOS.find((item) => item._id === sale.empreendimento_id);
                const names = sale.clientes.map((cpf) => CLIENTES.find((client) => client.cpf === cpf)?.nome).filter(Boolean);
                return (
                  <TableRow key={sale._id}>
                    <TableCell mono>#{sale._id}</TableCell>
                    <TableCell><span className="text-primary">{names.join(", ")}</span></TableCell>
                    <TableCell>{empreendimento?.nome.split(" ").slice(0, 2).join(" ")}</TableCell>
                    <TableCell>{sale.vendedor.split(" ")[0]}</TableCell>
                    <TableCell mono><strong className="text-accent">{formatCurrency(sale.valor_venda)}</strong></TableCell>
                    <TableCell mono>{sale.parcelas > 0 ? `${sale.parcelas}x` : "À vista"}</TableCell>
                    <TableCell mono>{sale.parcelas > 0 ? `${sale.pagas}/${sale.parcelas}` : "—"}</TableCell>
                    <TableCell><StatusBadge status={sale.status} /></TableCell>
                    <TableCell mono>{sale.data_venda}</TableCell>
                  </TableRow>
                );
              })}</tbody>
            </table>
            {filtered.length === 0 && <div className="empty-state">Nenhuma venda nesse status.</div>}
          </div>
        </Card>
        {showDistratos && (
          <Card>
            <SectionTitle>Consulta 4 — Clientes Distratados · Parcelas em Aberto</SectionTitle>
            {ANALYTICS.distratados.length === 0 ? (
              <div className="empty-state">Nenhum distrato.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><TableRow><TableHeaderCell>Nome</TableHeaderCell><TableHeaderCell>Profissão</TableHeaderCell><TableHeaderCell>E. Civil</TableHeaderCell><TableHeaderCell>E-mail</TableHeaderCell><TableHeaderCell>Telefone</TableHeaderCell><TableHeaderCell>Parcelas Rest.</TableHeaderCell><TableHeaderCell>Valor em Aberto</TableHeaderCell></TableRow></thead>
                  <tbody>{ANALYTICS.distratados.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell><strong className="text-negative">{sale.clienteInfo?.nome}</strong></TableCell>
                      <TableCell>{sale.clienteInfo?.profissao}</TableCell>
                      <TableCell><StatusBadge status={sale.clienteInfo?.estado_civil} /></TableCell>
                      <TableCell><span className="text-accent">{sale.clienteInfo?.email}</span></TableCell>
                      <TableCell mono>{sale.clienteInfo?.telefone[0].residencial}</TableCell>
                      <TableCell mono>{sale.restantes}</TableCell>
                      <TableCell mono>{formatCurrency(sale.valorAberto)}</TableCell>
                    </TableRow>
                  ))}</tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default Vendas;
