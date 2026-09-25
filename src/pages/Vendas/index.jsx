import { useState, useMemo, useEffect } from 'react';
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
import { getVendas } from '../../services/vendas';
import './style.css';

const STATUS_OPTS = ['Todos', 'Liquidado', 'Financiado', 'Distratado', 'Transferido'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value ?? 0));

const getEmpreendimentoDescricao = (venda) => {
  const unidade = venda?.unidade_imobiliaria ?? {};

  if (unidade.empreendimento_nome) return unidade.empreendimento_nome;
  if (unidade.empreendimento_id) return `Empreendimento #${unidade.empreendimento_id}`;
  return '—';
};

function Vendas() {
  const [search, setSearch] = useState('');
  const [vendas, setVendas] = useState([]);
  const [status, setStatus] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [erro, setErro] = useState('');

   useEffect(() => {
    async function loadVendas() {
      try {
        const data = await getVendas();
        setVendas(Array.isArray(data) ? data : []);
      } catch {
        setErro('Não foi possível carregar as vendas.');
        setVendas([]);
      }
    }

    loadVendas();
  }, []);

  
  const stats = useMemo(() => {
    const byStatus = {};

    vendas.forEach((v) => {
      byStatus[v.status] = (byStatus[v.status] || 0) + 1;
    });

    return {
      total: vendas.length,
      totalVGV: vendas.reduce((acc, v) => acc + Number(v.valor_venda || 0), 0),
      totalComissao: vendas.reduce((acc, v) => acc + Number(v.comissao_vendedor || 0), 0),
      byStatus,
    };
  }, [vendas]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vendas.filter((v) => {
      const clienteNome = v.cliente?.[0]?.nome ?? '';
      const vendedorNome = v.vendedor?.nome ?? '';
      const matchQ = clienteNome.toLowerCase().includes(q)
        || vendedorNome.toLowerCase().includes(q)
        || String(v._id ?? '').includes(q);
      const matchS = status === 'Todos' || v.status === status;
      return matchQ && matchS;
    });
  }, [vendas, search, status]);

  const v = selected;

  return (
    <div className="page">
      <PageHeader title="Vendas" subtitle="Controle de vendas e contratos" />

      {erro && (
        <div className="vendas-error">{erro}</div>
      )}

      <div className="stats-grid">
        <StatCard label="Total Vendas"    value={stats.total}                          color="accent" />
        <StatCard label="VGV Total"       value={formatCurrency(stats.totalVGV)}       color="green"  compact />
        <StatCard label="Total Comissões" value={formatCurrency(stats.totalComissao)} color="gold"   compact />
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
                    <TableCell mono align="right">{formatCurrency(vv.valor_venda)}</TableCell>
                    <TableCell mono align="right">{formatCurrency(vv.valor_entrada)}</TableCell>
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
                <dt>Valor Total</dt>    <dd>{formatCurrency(v.valor_venda)}</dd>
                <dt>Entrada</dt>        <dd>{formatCurrency(v.valor_entrada)}</dd>
                <dt>Parcelas</dt>       <dd>{v.quantidade_parcelas || '0 (à vista)'}</dd>
                <dt>Comissão</dt>       <dd>{formatCurrency(v.comissao_vendedor)}</dd>
                <dt>Data Venda</dt>     <dd>{v.data_venda}</dd>
                <dt>Data Entrada</dt>   <dd>{v.data_pagamento_entrada}</dd>
                <dt>Rec. Comissão</dt>  <dd>{v.comissao_data_recebimento}</dd>
              </dl>

              <dl className="venda-dl">
                <SectionTitle>Unidade</SectionTitle>
                <dt>Empreendimento</dt> <dd>{getEmpreendimentoDescricao(v)}</dd>
                <dt>Unidade ID</dt>     <dd>#{v.unidade_imobiliaria?.unidade_imobiliaria_id ?? '—'}</dd>
                <dt>Valor Total</dt>    <dd>{formatCurrency(v.unidade_imobiliaria?.valor_total)}</dd>
              </dl>
            </div>

            {Array.isArray(v.parcela) && v.parcela.length > 0 && (
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
                          <TableCell mono align="right">{formatCurrency(p.valor_parcela)}</TableCell>
                          <TableCell mono align="right">{formatCurrency(p.juros)}</TableCell>
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
