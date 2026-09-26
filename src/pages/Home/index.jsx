import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader   from '../../components/PageHeader';
import StatCard     from '../../components/StatCard';
import Card         from '../../components/Card';
import SectionTitle from '../../components/SectionTitle';
import RankingRow   from '../../components/RankingRow';
import StatusBadge  from '../../components/StatusBadge';
import TableRow     from '../../components/TableRow';
import TableCell    from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { fmt } from '../../data/fallback';
import { getEmpreendimentos } from '../../services/empreendimentos';
import { getVendas } from '../../services/vendas';
import { getVendedores } from '../../services/vendedores';
import { getClientes } from '../../services/client';
import './style.css';

function Home() {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getEmpreendimentos().then(setEmpreendimentos).catch((e) => console.error('Erro ao carregar empreendimentos:', e));
    getVendas().then(setVendas).catch((e) => console.error('Erro ao carregar vendas:', e));
    getVendedores().then(setVendedores).catch((e) => console.error('Erro ao carregar vendedores:', e));
    getClientes().then(setClientes).catch((e) => console.error('Erro ao carregar clientes:', e));
  }, []);

  const stats = useMemo(() => {
    const allUnidades = empreendimentos.flatMap((e) => e.unidade_imobiliaria ?? []);
    const vendidas = allUnidades.filter((u) => u.status === 'Vendido');
    const totalVGV = vendas.reduce((s, v) => s + v.valor_venda, 0);
    const totalComissao = vendas.reduce((s, v) => s + (v.comissao_vendedor ?? 0), 0);
    console.log('CLIENTES', clientes)
    const clientesDashoboard = clientes.count

    return {
      empreendimentos: empreendimentos.length,
      unidades: allUnidades.length,
      vendidas: vendidas.length,
      clientes: clientesDashoboard,
      vendedores: vendedores.length,
      totalVendas: vendas.length,
      totalVGV,
      totalComissao,
    };
  }, [empreendimentos, vendas, clientes, vendedores]);

  const rankingVendedores = useMemo(() => {
    const map = vendedores.map((v) => {
      const vendasDoVendedor = vendas.filter((venda) => venda.vendedor.vendedor_id === v._id);
      return {
        id: v._id,
        nome: v.nome,
        total: vendasDoVendedor.reduce((s, vv) => s + vv.valor_venda, 0),
        qtd: vendasDoVendedor.length,
      };
    }).sort((a, b) => b.total - a.total);

    const max = map[0]?.total || 1;
    return map.map((v) => ({ ...v, pct: Math.round((v.total / max) * 100) }));
  }, [vendedores, vendas]);

  const recentVendas = useMemo(() => [...vendas].slice(-5).reverse(), [vendas]);

  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Visão geral da imobiliária Prosperiam" />

      <div className="stats-grid stats-grid--dashboard">
        <StatCard label="Empreendimentos" value={stats.empreendimentos} color="accent" description="Ativos" />
        <StatCard label="Total Unidades"  value={stats.unidades}        color="blue"   description="Cadastradas" />
        <StatCard label="Vendidas"        value={stats.vendidas}        color="green"  description="Unidades vendidas" />
        <StatCard label="Clientes"        value={stats.clientes}        color="purple" description="Cadastrados" />
        <StatCard label="Vendedores"      value={stats.vendedores}      color="gold"   description="CRECI ativos" />
        <StatCard label="VGV Total"       value={fmt.currency(stats.totalVGV)} color="green" compact description="Volume Geral de Vendas" />
      </div>

      <div className="cards-grid">
        <Card>
          <SectionTitle>Ranking de Vendedores</SectionTitle>
          {rankingVendedores.map((v, i) => (
            <RankingRow key={v.id} position={i + 1} name={v.nome} value={fmt.currency(v.total)} percentage={v.pct} />
          ))}
          <div className="dashboard__link-row">
            <Link to="/vendedores" className="dashboard__link">Ver todos →</Link>
          </div>
        </Card>

        <Card>
          <SectionTitle>Empreendimentos Ativos</SectionTitle>
          {empreendimentos.map((e) => {
            const unidadesEmp = e.unidade_imobiliaria ?? [];
            const total = unidadesEmp.length;
            const vendidasEmp = unidadesEmp.filter((u) => u.status === 'Vendido').length;
            return (
              <div key={e._id} className="dashboard__emp-row">
                <div className="dashboard__emp-info">
                  <span className="dashboard__emp-nome">{e.nome}</span>
                  <span className="dashboard__emp-local">{e.cidade} — {e.estado}</span>
                </div>
                <div className="dashboard__emp-pct">{vendidasEmp}/{total} vendidas</div>
              </div>
            );
          })}
          <div className="dashboard__link-row">
            <Link to="/empreendimentos" className="dashboard__link">Ver todos →</Link>
          </div>
        </Card>
      </div>

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
              {recentVendas.length === 0 && (
                <tr><TableCell colSpan={6}>Nenhuma venda registrada.</TableCell></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Home;