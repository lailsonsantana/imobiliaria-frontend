import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import ProgressBar from "../../components/ProgressBar";
import SectionTitle from "../../components/SectionTitle";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { ANALYTICS } from "../../utils/analytics";

function Empreendimentos() {
  const { empStats } = ANALYTICS;
  const totalUnits = empStats.reduce((total, item) => total + item.total, 0);
  const soldUnits = empStats.reduce((total, item) => total + item.vendidas, 0);
  const sorted = [...empStats].sort((first, second) => first.percentual - second.percentual);

  return (
    <div>
      <PageHeader title="Empreendimentos" subtitle="Consultas 1 e 2" />
      <div className="page-grid page-grid--three">
        <StatCard label="Empreendimentos" value={empStats.length} />
        <StatCard label="Total Unidades" value={totalUnits} color="blue" />
        <StatCard label="Média de Vendas" value={`${((soldUnits / totalUnits) * 100).toFixed(1)}%`} color="green" />
      </div>
      <div className="content-stack">
        <Card noPadding>
          <div style={{ padding: "16px 20px 0" }}><SectionTitle>Consulta 1 — Total por Empreendimento</SectionTitle></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>#</TableHeaderCell><TableHeaderCell>Empreendimento</TableHeaderCell><TableHeaderCell>Cidade</TableHeaderCell><TableHeaderCell>Total</TableHeaderCell><TableHeaderCell>Vendidas</TableHeaderCell><TableHeaderCell>Disponíveis</TableHeaderCell><TableHeaderCell>Reservadas</TableHeaderCell><TableHeaderCell>Distratadas</TableHeaderCell><TableHeaderCell>% Vendido</TableHeaderCell></TableRow></thead>
              <tbody>{empStats.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell mono>{index + 1}</TableCell>
                  <TableCell><span className="text-primary">{item.nome}</span></TableCell>
                  <TableCell>{item.cidade}</TableCell>
                  <TableCell mono>{item.total}</TableCell>
                  <TableCell><StatusBadge status="Vendido" /> <span className="mono">{item.vendidas}</span></TableCell>
                  <TableCell><StatusBadge status="Em aberto" /> <span className="mono">{item.disponiveis}</span></TableCell>
                  <TableCell mono>{item.reservadas}</TableCell>
                  <TableCell mono>{item.distratadas}</TableCell>
                  <TableCell><div style={{ minWidth: 110 }}><ProgressBar percentage={item.percentual} /></div><span className="mono">{item.percentual.toFixed(1)}%</span></TableCell>
                </TableRow>
              ))}</tbody>
            </table>
          </div>
        </Card>
        <Card>
          <SectionTitle>Consulta 2 — Top 10 com Menor % de Vendas</SectionTitle>
          {sorted.slice(0, 10).map((item, index) => (
            <div className="report-row" key={item._id}>
              <span className="mono text-accent">#{index + 1}</span>
              <span className="report-row__name">{item.nome}</span>
              <span className="text-muted">Disp: <strong className="text-positive">{item.disponiveis}</strong></span>
              <span className="text-muted">Vend: <strong>{item.vendidas}</strong></span>
              <div className="report-row__bar"><ProgressBar percentage={item.percentual} /></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default Empreendimentos;
