import { useState, useMemo } from 'react';
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SectionTitle    from '../../components/SectionTitle';
import SearchBox       from '../../components/SearchBox';
import FilterButton    from '../../components/FilterButton';
import StatusBadge     from '../../components/StatusBadge';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { vendas, empreendimentos, fmt } from '../../data/fallback';
import './style.css';

const STATUS_OPTS = ['Todos', 'Liquidado', 'Financiado', 'Distratado', 'Transferido'];

function Vendas() {
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('Todos');
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const s = {};
    vendas.forEach((v) => { s[v.status] = (s[v.status] || 0) + 1; });
    return {
      total: vendas.length,
      totalVGV: vendas.reduce((acc, v) => acc + v.valor_venda, 0),
      totalComissao: vendas.reduce((acc, v) => acc + v.comissao_vendedor, 0),
      byStatus: s,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vendas.filter((v) => {
      const matchQ = v.cliente[0]?.nome.toLowerCase().includes(q)
        || v.vendedor.nome.toLowerCase().includes(q)
        || String(v._id).includes(q);
      const matchS = status === 'Todos' || v.status === status;
      return matchQ && matchS;
    });
  }, [search, status]);

  const v = selected;

  const empNome = (id) => empreendimentos.find((e) => e._id === id)?.nome ?? `Emp. ${id}`;

  return (
    <div className="page">
      <PageHeader title="Vendas" subtitle="Controle de vendas e contratos" />

      <div className="stats-grid">
        <StatCard label="Total Vendas"    value={stats.total}                          color="accent" />
        <StatCard label="VGV Total"       value={fmt.currency(stats.totalVGV)}         color="green"  compact />
        <StatCard label="Total Comissões" value={fmt.currency(stats.totalComissao)}    color="gold"   compact />
        <StatCard label="Liquidadas"      value={stats.byStatus['Liquidado'] || 0}     color="green" />
        <StatCard label="Financiadas"     value={stats.byStatus['Financiado'] || 0}    color="blue" />
        <StatCard label="Distratadas"     value={stats.byStatus['Distratado'] || 0}    color="red" />
      </div>

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar venda, cliente, vendedor..."
        />
        {STATUS_OPTS.map((s) => (
          <FilterButton key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>

      <div className="vendas-layout">
        <Card noPadding>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>Vendedor</TableHeaderCell>
                  <TableHeaderCell>Data Venda</TableHeaderCell>
                  <TableHeaderCell align="right">Valor</TableHeaderCell>
                  <TableHeaderCell align="right">Entrada</TableHeaderCell>
                  <TableHeaderCell>Parcelas</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vv) => (
                  <TableRow key={vv._id} highlighted={selected?._id === vv._id}>
                    <TableCell mono>{vv._id}</TableCell>
                    <TableCell>
                      <button
                        className="venda-btn"
                        onClick={() => setSelected((p) => p?._id === vv._id ? null : vv)}
                      >
                        {vv.cliente[0]?.nome ?? '—'}
                      </button>
                    </TableCell>
                    <TableCell>{vv.vendedor.nome}</TableCell>
                    <TableCell mono>{vv.data_venda}</TableCell>
                    <TableCell mono align="right">{fmt.currency(vv.valor_venda)}</TableCell>
                    <TableCell mono align="right">{fmt.currency(vv.valor_entrada)}</TableCell>
                    <TableCell mono>{vv.quantidade_parcelas || '—'}</TableCell>
                    <TableCell><StatusBadge status={vv.status} /></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell>Nenhuma venda encontrada.</TableCell></TableRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {v && (
          <Card className="venda-detail">
            <div className="venda-detail-title">
              Venda #{v._id} — <StatusBadge status={v.status} />
            </div>

            <div className="venda-dl-grid">
              <dl className="venda-dl">
                <SectionTitle>Partes</SectionTitle>
                <dt>Vendedor</dt>  <dd>{v.vendedor.nome}</dd>
                <dt>Clientes</dt>
                <dd>
                  {v.cliente.map((c) => (
                    <div key={c.cliente_id}>
                      {c.nome}
                      {c.responsavel_financeiro && <span className="resp-tag">resp. financeiro</span>}
                    </div>
                  ))}
                </dd>
              </dl>

              <dl className="venda-dl">
                <SectionTitle>Financeiro</SectionTitle>
                <dt>Valor Total</dt>    <dd>{fmt.currency(v.valor_venda)}</dd>
                <dt>Entrada</dt>        <dd>{fmt.currency(v.valor_entrada)}</dd>
                <dt>Parcelas</dt>       <dd>{v.quantidade_parcelas || '0 (à vista)'}</dd>
                <dt>Comissão</dt>       <dd>{fmt.currency(v.comissao_vendedor)}</dd>
                <dt>Data Venda</dt>     <dd>{v.data_venda}</dd>
                <dt>Data Entrada</dt>   <dd>{v.data_pagamento_entrada}</dd>
                <dt>Rec. Comissão</dt>  <dd>{v.comissao_data_recebimento}</dd>
              </dl>

              <dl className="venda-dl">
                <SectionTitle>Unidade</SectionTitle>
                <dt>Empreendimento</dt> <dd>{empNome(v.unidade_imobiliaria.empreendimento_id)}</dd>
                <dt>Unidade ID</dt>     <dd>#{v.unidade_imobiliaria.unidade_imobiliaria_id}</dd>
                <dt>Valor Total</dt>    <dd>{fmt.currency(v.unidade_imobiliaria.valor_total)}</dd>
              </dl>
            </div>

            {v.parcela.length > 0 && (
              <>
                <SectionTitle>Parcelas</SectionTitle>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <TableHeaderCell>#</TableHeaderCell>
                        <TableHeaderCell>Vencimento</TableHeaderCell>
                        <TableHeaderCell>Pagamento</TableHeaderCell>
                        <TableHeaderCell align="right">Valor</TableHeaderCell>
                        <TableHeaderCell align="right">Juros</TableHeaderCell>
                        <TableHeaderCell>Forma</TableHeaderCell>
                      </tr>
                    </thead>
                    <tbody>
                      {v.parcela.map((p) => (
                        <TableRow key={p._id}>
                          <TableCell mono>{p._id}</TableCell>
                          <TableCell mono>{p.data_vencimento}</TableCell>
                          <TableCell mono>{p.data_pagamento}</TableCell>
                          <TableCell mono align="right">{fmt.currency(p.valor_parcela)}</TableCell>
                          <TableCell mono align="right">{fmt.currency(p.juros)}</TableCell>
                          <TableCell>{p.forma_pagamento}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <button className="venda-close-btn" onClick={() => setSelected(null)}>Fechar</button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Vendas;
