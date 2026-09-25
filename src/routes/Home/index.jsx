import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import RankingRow from "../../components/RankingRow";
import SectionTitle from "../../components/SectionTitle";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { CLIENTES, EMPREENDIMENTOS, VENDAS } from "../../data/mockData";
import { ANALYTICS, formatCurrency } from "../../utils/analytics";

function Home() {
  const { stats, empStats, vendRanking } = ANALYTICS;
  const recentSales = [...VENDAS].reverse().slice(0, 5);
  const maxUnits = Math.max(...empStats.map((item) => item.total), 1);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral · Prosperiam Empreendimentos" />
      <div className="page-grid page-grid--four">
        <StatCard label="Total Unidades" value={stats.total} description={`${stats.vendidas} vendidas`} color="gold" />
        <StatCard label="Taxa de Vendas" value={`${((stats.vendidas / stats.total) * 100).toFixed(1)}%`} description={`${stats.disponiveis} disponíveis`} color="green" />
        <StatCard label="Clientes" value={stats.clientes} description="cadastrados" color="accent" />
        <StatCard label="VGV Total" value={formatCurrency(stats.vgv)} description="valor geral de vendas" color="purple" compact />
      </div>

      <div className="page-grid page-grid--two">
        <Card>
          <SectionTitle>Unidades por Empreendimento</SectionTitle>
          <div className="chart-bars" aria-label="Unidades por empreendimento">
            {empStats.map((item) => (
              <div className="chart-bars__item" key={item._id}>
                <div className="chart-bars__columns">
                  <div className="chart-bars__bar" title={`${item.vendidas} vendidas`} style={{ height: `${(item.vendidas / maxUnits) * 100}%`, background: "var(--color-gold)" }} />
                  <div className="chart-bars__bar" title={`${item.disponiveis} em aberto`} style={{ height: `${(item.disponiveis / maxUnits) * 100}%`, background: "var(--color-border-md)" }} />
                </div>
                <span className="chart-bars__label" title={item.nome}>{item.nome.split(" ").slice(-1)[0]}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span><i style={{ background: "var(--color-gold)" }} />Vendidas</span>
            <span><i style={{ background: "var(--color-border-md)" }} />Em aberto</span>
          </div>
        </Card>
        <Card>
          <SectionTitle>Unidades por Tipo</SectionTitle>
          {["Casa", "Apartamento", "Lote"].map((type) => {
            const count = ANALYTICS.allUnits.filter((unit) => unit.tipo === type).length;
            const percentage = (count / stats.total) * 100;
            return (
              <div className="report-row" key={type}>
                <span className="report-row__name">{type}</span>
                <div className="report-row__bar">
                  <div className="progress-track"><div className="progress-track__bar" style={{ width: `${percentage}%` }} /></div>
                </div>
                <strong>{count}</strong>
              </div>
            );
          })}
        </Card>
      </div>

      <div className="page-grid page-grid--two">
        <Card noPadding>
          <div style={{ padding: "16px 20px 0" }}><SectionTitle>Vendas Recentes</SectionTitle></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>Cliente</TableHeaderCell><TableHeaderCell>Empreendimento</TableHeaderCell><TableHeaderCell>Valor</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell></TableRow></thead>
              <tbody>{recentSales.map((sale) => {
                const empreendimento = EMPREENDIMENTOS.find((item) => item._id === sale.empreendimento_id);
                const customerName = sale.clientes
                  .map((cpf) => CLIENTES.find((client) => client.cpf === cpf)?.nome)
                  .filter(Boolean)
                  .join(", ");
                return (
                  <TableRow key={sale._id}>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{empreendimento?.nome.split(" ").slice(0, 2).join(" ")}</TableCell>
                    <TableCell mono><span className="text-accent">{formatCurrency(sale.valor_venda)}</span></TableCell>
                    <TableCell><StatusBadge status={sale.status} /></TableCell>
                  </TableRow>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
        <Card>
          <SectionTitle>Ranking Vendedores</SectionTitle>
          {vendRanking.map((seller, index) => (
            <RankingRow
              key={seller._id}
              position={index + 1}
              name={seller.nome}
              value={seller.count}
              percentage={(seller.count / Math.max(...vendRanking.map((item) => item.count), 1)) * 100}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

export default Home;
