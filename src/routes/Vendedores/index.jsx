import { useMemo, useState } from "react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import ProgressBar from "../../components/ProgressBar";
import SectionTitle from "../../components/SectionTitle";
import TableCell from "../../components/TableCell";
import TableHeaderCell from "../../components/TableHeaderCell";
import TableRow from "../../components/TableRow";
import { VENDAS, VENDEDORES } from "../../data/mockData";
import { ANALYTICS, toDate } from "../../utils/analytics";

function Vendedores() {
  const [from, setFrom] = useState("2023-01-01");
  const [through, setThrough] = useState("2024-12-31");
  const ranking = useMemo(() => {
    const startDate = from ? new Date(`${from}T00:00:00`) : null;
    const endDate = through ? new Date(`${through}T23:59:59`) : null;
    const counts = new Map();
    VENDAS.forEach((sale) => {
      const date = toDate(sale.data_venda);
      if (!date || (startDate && date < startDate) || (endDate && date > endDate)) return;
      counts.set(sale.vendedor_id, (counts.get(sale.vendedor_id) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([id, count]) => ({ ...VENDEDORES.find((seller) => seller._id === id), count }))
      .sort((first, second) => second.count - first.count || first.nome.localeCompare(second.nome));
  }, [from, through]);
  const maxCount = Math.max(...ANALYTICS.vendRanking.map((seller) => seller.count), 1);

  return (
    <div>
      <PageHeader title="Vendedores" subtitle="Performance e rankings" />
      <div className="page-grid page-grid--cards">
        {VENDEDORES.map((seller) => {
          const performance = ANALYTICS.vendRanking.find((item) => item._id === seller._id);
          return (
            <Card key={seller._id} accent="accent">
              <div className="text-primary">{seller.nome.split(" ").slice(0, 2).join(" ")}</div>
              <div className="text-muted" style={{ marginTop: 3 }}>{seller.creci}</div>
              <div style={{ marginTop: 10, color: "var(--color-accent)", fontSize: 26, fontWeight: 700 }}>{performance?.count || 0}</div>
              <div className="text-muted" style={{ marginBottom: 8 }}>vendas</div>
              <ProgressBar percentage={((performance?.count || 0) / maxCount) * 100} />
              <div className="text-positive" style={{ marginTop: 9, fontWeight: 600 }}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(performance?.comissao || 0)}
              </div>
              <div className="text-muted" style={{ marginTop: 3, fontSize: 10 }}>{seller.telefone}</div>
            </Card>
          );
        })}
      </div>
      <Card>
        <SectionTitle>Consulta 3 — Maior Número de Vendas em Período</SectionTitle>
        <div className="toolbar" style={{ marginBottom: 18 }}>
          <label>
            <span className="text-muted" style={{ display: "block", marginBottom: 5 }}>DE</span>
            <input className="date-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label>
            <span className="text-muted" style={{ display: "block", marginBottom: 5 }}>ATÉ</span>
            <input className="date-input" type="date" value={through} onChange={(event) => setThrough(event.target.value)} />
          </label>
        </div>
        {ranking.length === 0 ? (
          <div className="empty-state">Nenhuma venda no período.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><TableRow><TableHeaderCell>Rank</TableHeaderCell><TableHeaderCell>Vendedor</TableHeaderCell><TableHeaderCell>CRECI</TableHeaderCell><TableHeaderCell>CPF</TableHeaderCell><TableHeaderCell>Vendas</TableHeaderCell></TableRow></thead>
              <tbody>{ranking.map((seller, index) => (
                <TableRow key={seller._id} highlighted={index === 0}>
                  <TableCell><span className="text-accent">#{index + 1}{index === 0 ? " ★ Líder" : ""}</span></TableCell>
                  <TableCell><span className="text-primary">{seller.nome}</span></TableCell>
                  <TableCell mono>{seller.creci}</TableCell>
                  <TableCell mono>{seller.cpf}</TableCell>
                  <TableCell mono><strong className="text-accent">{seller.count}</strong></TableCell>
                </TableRow>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Vendedores;
