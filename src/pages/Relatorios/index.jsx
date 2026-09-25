import { useMemo } from 'react';
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SectionTitle    from '../../components/SectionTitle';
import RankingRow      from '../../components/RankingRow';
import StatusBadge     from '../../components/StatusBadge';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { vendas, vendedores, empreendimentos, unidades, clientes, fmt } from '../../data/fallback';
import './style.css';

function Relatorios() {
  /** Consulta 1 — Vendedores com total de vendas e comissões */
  const rankVendedores = useMemo(() => {
    return vendedores
      .map((v) => ({
        ...v,
        totalVendas: v.vendas.length,
        totalValor: v.vendas.reduce((s, vv) => s + vv.valor_venda, 0),
        totalComissao: v.vendas.reduce((s, vv) => s + vv.comissao, 0),
      }))
      .sort((a, b) => b.totalValor - a.totalValor);
  }, []);

  /** Consulta 2 — Empreendimentos: unidades por status */
  const empStatus = useMemo(() =>
    empreendimentos.map((e) => {
      const u = e.unidade_imobiliaria;
      return {
        nome: e.nome,
        cidade: e.cidade,
        total: u.length,
        vendidas: u.filter((x) => x.status === 'Vendido').length,
        reservadas: u.filter((x) => x.status === 'Reservado').length,
        abertas: u.filter((x) => x.status === 'Em aberto').length,
        distratadas: u.filter((x) => x.status === 'Distratado').length,
        vgv: u.filter((x) => x.status === 'Vendido').reduce((s, x) => s + x.valor, 0),
      };
    }), []
  );

  /** Consulta 3 — Clientes com mais de uma unidade comprada */
  const clientesMultiplos = useMemo(() => {
    const map = {};
    empreendimentos.forEach((e) => {
      e.unidade_imobiliaria.forEach((u) => {
        u.cliente.forEach((c) => {
          if (!map[c.cliente_id]) map[c.cliente_id] = { nome: c.nome, unidades: 0 };
          map[c.cliente_id].unidades += 1;
        });
      });
    });
    return Object.entries(map)
      .map(([cpf, d]) => ({ cpf, ...d }))
      .filter((c) => c.unidades > 0)
      .sort((a, b) => b.unidades - a.unidades);
  }, []);

  /** Consulta 4 — Vendas por status com VGV */
  const vendasPorStatus = useMemo(() => {
    const map = {};
    vendas.forEach((v) => {
      if (!map[v.status]) map[v.status] = { status: v.status, qtd: 0, vgv: 0 };
      map[v.status].qtd += 1;
      map[v.status].vgv += v.valor_venda;
    });
    return Object.values(map).sort((a, b) => b.vgv - a.vgv);
  }, []);

  /** Consulta 5 — Tipo de unidade mais vendida */
  const tipoVendas = useMemo(() => {
    const map = {};
    empreendimentos.forEach((e) => {
      e.unidade_imobiliaria.forEach((u) => {
        const t = u.tipo;
        if (!map[t]) map[t] = { tipo: t, total: 0, vendidas: 0 };
        map[t].total += 1;
        if (u.status === 'Vendido') map[t].vendidas += 1;
      });
    });
    return Object.values(map).sort((a, b) => b.vendidas - a.vendidas);
  }, []);

  const maxTipo = tipoVendas[0]?.vendidas || 1;

  // Stats gerais
  const totalVGV = vendas.reduce((s, v) => s + v.valor_venda, 0);
  const totalComissao = vendas.reduce((s, v) => s + v.comissao_vendedor, 0);
  const taxaVenda = unidades.length
    ? Math.round((unidades.filter((u) => u.status === 'Vendido').length / unidades.length) * 100)
    : 0;

  return (
    <div className="page">
      <PageHeader title="Relatórios" subtitle="Análises consolidadas da imobiliária" />

      <div className="stats-grid">
        <StatCard label="VGV Total"      value={fmt.currency(totalVGV)}     color="green"  compact />
        <StatCard label="Total Comissões" value={fmt.currency(totalComissao)} color="gold"  compact />
        <StatCard label="Taxa de Venda"  value={`${taxaVenda}%`}            color="accent" />
        <StatCard label="Clientes"       value={clientes.length}             color="blue" />
        <StatCard label="Vendedores"     value={vendedores.length}           color="purple" />
      </div>

      {/* Consulta 1 */}
      <Card className="rel-card">
        <SectionTitle>Consulta 1 — Ranking de Vendedores por VGV</SectionTitle>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>Vendedor</TableHeaderCell>
                <TableHeaderCell>CRECI</TableHeaderCell>
                <TableHeaderCell align="right">Qtd. Vendas</TableHeaderCell>
                <TableHeaderCell align="right">VGV</TableHeaderCell>
                <TableHeaderCell align="right">Comissão Total</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {rankVendedores.map((v, i) => (
                <TableRow key={v._id} highlighted={i === 0}>
                  <TableCell mono>{i + 1}º</TableCell>
                  <TableCell>{v.nome}</TableCell>
                  <TableCell mono>{v.creci}</TableCell>
                  <TableCell mono align="right">{v.totalVendas}</TableCell>
                  <TableCell mono align="right">{fmt.currency(v.totalValor)}</TableCell>
                  <TableCell mono align="right">{fmt.currency(v.totalComissao)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Consulta 2 */}
      <Card className="rel-card">
        <SectionTitle>Consulta 2 — Empreendimentos: Unidades por Status e VGV</SectionTitle>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>Empreendimento</TableHeaderCell>
                <TableHeaderCell>Cidade</TableHeaderCell>
                <TableHeaderCell align="right">Total</TableHeaderCell>
                <TableHeaderCell align="right">Vendidas</TableHeaderCell>
                <TableHeaderCell align="right">Reservadas</TableHeaderCell>
                <TableHeaderCell align="right">Abertas</TableHeaderCell>
                <TableHeaderCell align="right">Distratadas</TableHeaderCell>
                <TableHeaderCell align="right">VGV</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {empStatus.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.nome}</TableCell>
                  <TableCell>{e.cidade}</TableCell>
                  <TableCell mono align="right">{e.total}</TableCell>
                  <TableCell mono align="right">{e.vendidas}</TableCell>
                  <TableCell mono align="right">{e.reservadas}</TableCell>
                  <TableCell mono align="right">{e.abertas}</TableCell>
                  <TableCell mono align="right">{e.distratadas}</TableCell>
                  <TableCell mono align="right">{fmt.currency(e.vgv)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="cards-grid">
        {/* Consulta 3 */}
        <Card>
          <SectionTitle>Consulta 3 — Clientes por Qtd. de Unidades</SectionTitle>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>CPF</TableHeaderCell>
                  <TableHeaderCell align="right">Unidades</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {clientesMultiplos.map((c) => (
                  <TableRow key={c.cpf} highlighted={c.unidades > 1}>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell mono>{c.cpf}</TableCell>
                    <TableCell mono align="right">{c.unidades}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Consulta 4 */}
        <Card>
          <SectionTitle>Consulta 4 — Vendas por Status</SectionTitle>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right">Qtd.</TableHeaderCell>
                  <TableHeaderCell align="right">VGV</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {vendasPorStatus.map((s) => (
                  <TableRow key={s.status}>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell mono align="right">{s.qtd}</TableCell>
                    <TableCell mono align="right">{fmt.currency(s.vgv)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Consulta 5 */}
      <Card>
        <SectionTitle>Consulta 5 — Tipo de Unidade Mais Vendida</SectionTitle>
        <div className="rel-tipo-grid">
          {tipoVendas.map((t) => (
            <div key={t.tipo} className="rel-tipo-card">
              <div className="rel-tipo-label">{t.tipo}</div>
              <div className="rel-tipo-value">{t.vendidas}</div>
              <div className="rel-tipo-sub">de {t.total} unidades</div>
              <div className="rel-tipo-bar">
                <div
                  className="rel-tipo-bar-fill"
                  style={{ width: `${Math.round((t.vendidas / maxTipo) * 100)}%` }}
                />
              </div>
              <div className="rel-tipo-pct">
                {t.total ? Math.round((t.vendidas / t.total) * 100) : 0}% vendido
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Relatorios;
