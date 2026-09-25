import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, MapPin, Users, Award, DollarSign } from 'lucide-react';
import PageHeader   from '../../components/PageHeader';
import StatCard     from '../../components/StatCard';
import Card         from '../../components/Card';
import SectionTitle from '../../components/SectionTitle';
import RankingRow   from '../../components/RankingRow';
import StatusBadge  from '../../components/StatusBadge';
import TableRow     from '../../components/TableRow';
import TableCell    from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { empreendimentos, vendas, vendedores, clientes, fmt } from '../../data/fallback';
import './style.css';

function Home() {
  const stats = useMemo(() => {
    const allUnidades = empreendimentos.flatMap((e) => e.unidade_imobiliaria);
    const vendidas    = allUnidades.filter((u) => u.status === 'Vendido');
    const totalVGV    = vendas.reduce((s, v) => s + v.valor_venda, 0);
    const totalComissao = vendas.reduce((s, v) => s + v.comissao_vendedor, 0);

    return {
      empreendimentos: empreendimentos.length,
      unidades: allUnidades.length,
      vendidas: vendidas.length,
      clientes: clientes.length,
      vendedores: vendedores.length,
      totalVendas: vendas.length,
      totalVGV,
      totalComissao,
    };
  }, []);

  const rankingVendedores = useMemo(() => {
    const map = vendedores.map((v) => ({
      id: v._id,
      nome: v.nome,
      total: v.vendas.reduce((s, vv) => s + vv.valor_venda, 0),
      qtd: v.vendas.length,
    })).sort((a, b) => b.total - a.total);

    const max = map[0]?.total || 1;
    return map.map((v) => ({ ...v, pct: Math.round((v.total / max) * 100) }));
  }, []);

  const recentVendas = useMemo(() => [...vendas].slice(-5).reverse(), []);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da imobiliária Prosperiam"
      />

      {/* KPIs */}
      <div className="stats-grid stats-grid--dashboard">
        <StatCard label="Empreendimentos"  value={stats.empreendimentos} color="accent"  description="Ativos" />
        <StatCard label="Total Unidades"   value={stats.unidades}        color="blue"    description="Cadastradas" />
        <StatCard label="Vendidas"         value={stats.vendidas}         color="green"   description="Unidades vendidas" />
        <StatCard label="Clientes"         value={stats.clientes}         color="purple"  description="Cadastrados" />
        <StatCard label="Vendedores"       value={stats.vendedores}       color="gold"    description="CRECI ativos" />
        <StatCard label="VGV Total"        value={fmt.currency(stats.totalVGV)} color="green" compact description="Volume Geral de Vendas" />
      </div>

      <div className="cards-grid">
        {/* Ranking vendedores */}
        <Card>
          <SectionTitle>Ranking de Vendedores</SectionTitle>
          {rankingVendedores.map((v, i) => (
            <RankingRow
              key={v.id}
              position={i + 1}
              name={v.nome}
              value={fmt.currency(v.total)}
              percentage={v.pct}
            />
          ))}
          <div className="dashboard__link-row">
            <Link to="/vendedores" className="dashboard__link">Ver todos →</Link>
          </div>
        </Card>

        {/* Empreendimentos rápido */}
        <Card>
          <SectionTitle>Empreendimentos Ativos</SectionTitle>
          {empreendimentos.map((e) => {
            const total   = e.unidade_imobiliaria.length;
            const vendidas = e.unidade_imobiliaria.filter((u) => u.status === 'Vendido').length;
            const pct = total ? Math.round((vendidas / total) * 100) : 0;
            return (
              <div key={e._id} className="dashboard__emp-row">
                <div className="dashboard__emp-info">
                  <span className="dashboard__emp-nome">{e.nome}</span>
                  <span className="dashboard__emp-local">{e.cidade} — {e.estado}</span>
                </div>
                <div className="dashboard__emp-pct">{vendidas}/{total} vendidas</div>
              </div>
            );
          })}
          <div className="dashboard__link-row">
            <Link to="/empreendimentos" className="dashboard__link">Ver todos →</Link>
          </div>
        </Card>
      </div>

      {/* Vendas recentes */}
      <Card noPadding>
        <div className="card-header">
          <SectionTitle>Vendas Recentes</SectionTitle>
          <Link to="/vendas" className="dashboard__link">Ver todas →</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Vendedor</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell align="right">Valor</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {recentVendas.map((v) => (
                <TableRow key={v._id}>
                  <TableCell mono>{v._id}</TableCell>
                  <TableCell>{v.cliente[0]?.nome ?? '—'}</TableCell>
                  <TableCell>{v.vendedor.nome}</TableCell>
                  <TableCell mono>{v.data_venda}</TableCell>
                  <TableCell mono align="right">{fmt.currency(v.valor_venda)}</TableCell>
                  <TableCell><StatusBadge status={v.status} /></TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Home;
