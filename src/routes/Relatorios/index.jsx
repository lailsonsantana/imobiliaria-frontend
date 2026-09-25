import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import ProgressBar from "../../components/ProgressBar";
import SectionTitle from "../../components/SectionTitle";
import StatusBadge from "../../components/StatusBadge";
import { VENDEDORES } from "../../data/mockData";
import { ANALYTICS, formatCurrency } from "../../utils/analytics";

function Relatorios() {
  const { empStats, vendRanking, distratados, quitadas, topClientes, unitStatusCounts } = ANALYTICS;
  const leader = vendRanking[0];

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="6 consultas analíticas" />
      <div className="content-stack">
        <Card>
          <SectionTitle>Consulta 1 — Status por Empreendimento (resumo)</SectionTitle>
          <div className="inline-metrics">
            {unitStatusCounts.map(({ status, count }) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge status={status} />
                <strong style={{ fontSize: 22 }}>{count}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Consulta 2 — Top 10 menor % de vendas</SectionTitle>
          {[...empStats].sort((first, second) => first.percentual - second.percentual).slice(0, 10).map((item, index) => (
            <div className="report-row" key={item._id}>
              <span className="mono text-accent">#{index + 1}</span>
              <span className="report-row__name">{item.nome}</span>
              <span className="text-muted">Disp: <strong className="text-positive">{item.disponiveis}</strong></span>
              <span className="text-muted">Vend: <strong>{item.vendidas}</strong></span>
              <div className="report-row__bar"><ProgressBar percentage={item.percentual} /></div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Consulta 3 — Vendedor Líder (todo período)</SectionTitle>
          {leader && (
            <div className="inline-metrics">
              <div style={{ display: "grid", width: 48, height: 48, placeItems: "center", borderRadius: "50%", background: "var(--color-accent-bg)", color: "var(--color-accent)", fontSize: 20, fontWeight: 700 }}>
                {leader.nome.charAt(0)}
              </div>
              <div>
                <strong className="text-primary">{leader.nome}</strong>
                <div className="text-muted" style={{ marginTop: 3 }}>
                  CRECI: {VENDEDORES.find((seller) => seller._id === leader._id)?.creci}
                  {" · "}CPF: {VENDEDORES.find((seller) => seller._id === leader._id)?.cpf}
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <strong className="text-accent" style={{ fontSize: 30 }}>{leader.count}</strong>
                <div className="text-muted">vendas realizadas</div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Consulta 4 — Distratados · Parcelas em Aberto</SectionTitle>
          {distratados.length === 0 ? <div className="empty-state">Nenhum distrato.</div> : distratados.map((sale) => (
            <div className="report-row" key={sale._id}>
              <div className="report-row__name">
                <strong className="text-negative">{sale.clienteInfo?.nome}</strong>
                <span className="text-muted" style={{ marginLeft: 10 }}>{sale.clienteInfo?.profissao}</span>
                <div className="text-accent" style={{ marginTop: 3 }}>{sale.clienteInfo?.email}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="text-negative">{sale.restantes} parcelas em aberto</div>
                <strong className="text-negative">{formatCurrency(sale.valorAberto)}</strong>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Consulta 5 — Unidades com Pagamentos Quitados</SectionTitle>
          <div className="inline-metrics">
            <div><div className="text-muted">TOTAL</div><strong className="text-accent" style={{ fontSize: 26 }}>{quitadas.total}</strong></div>
            <div><div className="text-muted">QUITADAS</div><strong className="text-positive" style={{ fontSize: 26 }}>{quitadas.quitadas}</strong></div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="text-muted" style={{ marginBottom: 8 }}>Percentual quitado · {quitadas.percentual.toFixed(1)}%</div>
              <ProgressBar percentage={quitadas.percentual} color="var(--color-green)" />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Consulta 6 — Top 10 Clientes por Unidades</SectionTitle>
          {topClientes.map((client, index) => (
            <div className="report-row" key={client._id}>
              <span className="mono text-accent">#{index + 1}</span>
              <span className="report-row__name">{client.nome}</span>
              <span className="text-muted">Total: <strong className="text-accent">{client.total}</strong></span>
              <span className="text-muted">Pagas: <strong className="text-positive">{client.pagas}</strong></span>
              <span className="text-muted">Em pag.: <strong style={{ color: "var(--color-purple)" }}>{client.emPagamento}</strong></span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default Relatorios;
