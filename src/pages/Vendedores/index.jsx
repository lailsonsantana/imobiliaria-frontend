import { useState, useMemo } from 'react';
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SectionTitle    from '../../components/SectionTitle';
import SearchBox       from '../../components/SearchBox';
import RankingRow      from '../../components/RankingRow';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { vendedores, fmt } from '../../data/fallback';
import './style.css';

function Vendedores() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const ranking = useMemo(() => {
    const list = vendedores.map((v) => ({
      ...v,
      totalVendas: v.vendas.length,
      totalValor: v.vendas.reduce((s, vv) => s + vv.valor_venda, 0),
      totalComissao: v.vendas.reduce((s, vv) => s + vv.comissao, 0),
    })).sort((a, b) => b.totalValor - a.totalValor);
    const max = list[0]?.totalValor || 1;
    return list.map((v) => ({ ...v, pct: Math.round((v.totalValor / max) * 100) }));
  }, []);

  const stats = useMemo(() => ({
    total: vendedores.length,
    totalVendas: vendedores.reduce((s, v) => s + v.vendas.length, 0),
    totalVGV: vendedores.reduce((s, v) => s + v.vendas.reduce((ss, vv) => ss + vv.valor_venda, 0), 0),
    totalComissao: vendedores.reduce((s, v) => s + v.vendas.reduce((ss, vv) => ss + vv.comissao, 0), 0),
  }), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ranking.filter((v) =>
      v.nome.toLowerCase().includes(q) || v.cpf.includes(q) || v.creci.toLowerCase().includes(q)
    );
  }, [search, ranking]);

  const v = selected;

  return (
    <div className="page">
      <PageHeader title="Vendedores" subtitle="Desempenho e cadastro dos corretores" />

      <div className="stats-grid">
        <StatCard label="Vendedores"     value={stats.total}                         color="accent" />
        <StatCard label="Total de Vendas" value={stats.totalVendas}                  color="blue" />
        <StatCard label="VGV Total"      value={fmt.currency(stats.totalVGV)}         color="green" compact />
        <StatCard label="Total Comissões" value={fmt.currency(stats.totalComissao)}   color="gold" compact />
      </div>

      <div className="cards-grid">
        {/* Ranking */}
        <Card>
          <SectionTitle>Ranking por Volume de Vendas</SectionTitle>
          {filtered.map((v, i) => (
            <RankingRow
              key={v._id}
              position={i + 1}
              name={v.nome}
              value={fmt.currency(v.totalValor)}
              percentage={v.pct}
            />
          ))}
        </Card>

        {/* Tabela + detalhe */}
        <div className="vend-right">
          <div className="toolbar">
            <SearchBox
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar vendedor..."
            />
          </div>

          <Card noPadding>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>CRECI</TableHeaderCell>
                    <TableHeaderCell align="right">Vendas</TableHeaderCell>
                    <TableHeaderCell align="right">VGV</TableHeaderCell>
                    <TableHeaderCell align="right">Comissão</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((vv) => (
                    <TableRow key={vv._id} highlighted={selected?._id === vv._id}>
                      <TableCell>
                        <button
                          className="vend-nome-btn"
                          onClick={() => setSelected((p) => p?._id === vv._id ? null : vv)}
                        >
                          {vv.nome}
                        </button>
                      </TableCell>
                      <TableCell mono>{vv.creci}</TableCell>
                      <TableCell mono align="right">{vv.totalVendas}</TableCell>
                      <TableCell mono align="right">{fmt.currency(vv.totalValor)}</TableCell>
                      <TableCell mono align="right">{fmt.currency(vv.totalComissao)}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {v && (
            <Card className="vend-detail">
              <div className="vend-detail-header">
                <div className="vend-avatar">{v.nome.charAt(0)}</div>
                <div>
                  <div className="vend-detail-nome">{v.nome}</div>
                  <div className="vend-detail-sub">CRECI {v.creci} · {v.cpf}</div>
                  <div className="vend-detail-sub">{v.telefone}</div>
                </div>
              </div>
              <SectionTitle>Histórico de Vendas</SectionTitle>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <TableHeaderCell>#</TableHeaderCell>
                      <TableHeaderCell>Data</TableHeaderCell>
                      <TableHeaderCell align="right">Valor</TableHeaderCell>
                      <TableHeaderCell align="right">Comissão</TableHeaderCell>
                      <TableHeaderCell>Rec. Comissão</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {v.vendas.map((vv) => (
                      <TableRow key={vv.venda_id}>
                        <TableCell mono>{vv.venda_id}</TableCell>
                        <TableCell mono>{vv.data_venda}</TableCell>
                        <TableCell mono align="right">{fmt.currency(vv.valor_venda)}</TableCell>
                        <TableCell mono align="right">{fmt.currency(vv.comissao)}</TableCell>
                        <TableCell mono>{vv.data_recebimento_comissao}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="vend-close-btn" onClick={() => setSelected(null)}>Fechar</button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vendedores;
