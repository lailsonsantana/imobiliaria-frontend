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
import { getEmpreendimentos } from '../../services/empreendimentos';
import './style.css';

const STATUS_OPTS = ['Todos', 'Liquidado', 'Financiado', 'Distratado', 'Transferido'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value ?? 0));

const getReferenceId = (reference) => (
  reference && typeof reference === 'object'
    ? reference._id ?? reference.id
    : reference
);

const getEmpreendimentoDescricao = (venda, empreendimentos) => {
  const unidade = venda?.unidade_imobiliaria ?? {};
  const empreendimentoId = getReferenceId(unidade.empreendimento_id ?? unidade.empreendimento);
  const empreendimento = empreendimentos.find((item) =>
    String(item._id ?? item.id) === String(empreendimentoId),
  );

  return empreendimento?.nome
    ?? unidade.empreendimento_nome
    ?? unidade.empreendimento?.nome
    ?? '—';
};

const getUnidadeDescricao = (venda, empreendimentos) => {
  const unidade = venda?.unidade_imobiliaria ?? {};
  const empreendimentoId = getReferenceId(unidade.empreendimento_id ?? unidade.empreendimento);
  const empreendimento = empreendimentos.find((item) =>
    String(item._id ?? item.id) === String(empreendimentoId),
  );
  const unidadeId = getReferenceId(unidade.unidade_imobiliaria_id ?? unidade);
  const unidadesEmpreendimento = empreendimento?.unidade_imobiliaria
    ?? empreendimento?.unidades
    ?? [];
  const unidadeConhecida = unidadesEmpreendimento.find((item) =>
    String(item._id ?? item.id ?? item.unidade_imobiliaria_id) === String(unidadeId),
  );
  const numero = unidade.numero ?? unidadeConhecida?.numero;
  const quadra = unidade.quadra ?? unidadeConhecida?.quadra;
  const tipo = unidade.tipo ?? unidadeConhecida?.tipo;

  if (numero == null) return '—';
  return [`Unidade ${numero}`, quadra && `Quadra ${quadra}`, tipo].filter(Boolean).join(' · ');
};

function Vendas() {
  const [search, setSearch] = useState('');
  const [vendas, setVendas] = useState([]);
  const [empreendimentos, setEmpreendimentos] = useState([]);
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

    async function loadEmpreendimentos() {
      try {
        const data = await getEmpreendimentos();
        setEmpreendimentos(Array.isArray(data) ? data : []);
      } catch {
        setErro((previous) => previous
          ? `${previous} Não foi possível carregar os empreendimentos e unidades.`
          : 'Não foi possível carregar os empreendimentos e unidades.');
        setEmpreendimentos([]);
      }
    }

    loadVendas();
    loadEmpreendimentos();
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
  const mostrarDetalhes = Boolean(v);

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
                    <TableCell>
                      <button
                        className="venda-btn"
                        onClick={() => setSelected((p) => p?._id === vv._id ? null : vv)}
                      >
                        {vv.cliente?.[0]?.nome ?? '—'}
                      </button>
                    </TableCell>
                    <TableCell>{vv.vendedor?.nome ?? '—'}</TableCell>
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

        {mostrarDetalhes && (
          <Card className="venda-detail">
            <div className="venda-detail-header">
              <div>
                <span className="venda-detail-eyebrow">Detalhes da venda</span>
                <h2 className="venda-detail-title">
                  {v.cliente?.map((cliente) => cliente.nome).filter(Boolean).join(' e ') || 'Cliente não informado'}
                </h2>
                <p className="venda-detail-subtitle">
                  {v.vendedor?.nome ?? 'Vendedor não informado'}
                  {v.data_venda ? ` · Venda em ${v.data_venda}` : ''}
                </p>
              </div>
              <div className="venda-detail-actions">
                <StatusBadge status={v.status} />
                <button className="venda-close-btn" onClick={() => setSelected(null)}>Fechar</button>
              </div>
            </div>

            <div className="venda-dl-grid">
              <section className="venda-info-section">
                <SectionTitle>Partes</SectionTitle>
                <dl className="venda-dl">
                  <dt>Vendedor</dt>
                  <dd>{v.vendedor?.nome ?? '—'}</dd>
                  <dt>Clientes</dt>
                  <dd className="venda-clientes">
                    {v.cliente?.length
                      ? v.cliente.map((cliente, index) => (
                        <div className="venda-cliente" key={cliente.cliente_id ?? cliente.nome ?? index}>
                          <span>{cliente.nome ?? 'Cliente não informado'}</span>
                          {cliente.responsavel_financeiro && <span className="resp-tag">resp. financeiro</span>}
                        </div>
                      ))
                      : '—'}
                  </dd>
                </dl>
              </section>

              <section className="venda-info-section">
                <SectionTitle>Financeiro</SectionTitle>
                <dl className="venda-dl">
                  <dt>Valor da venda</dt><dd>{formatCurrency(v.valor_venda)}</dd>
                  <dt>Entrada</dt><dd>{formatCurrency(v.valor_entrada)}</dd>
                  <dt>Parcelas</dt><dd>{v.quantidade_parcelas || '0 (à vista)'}</dd>
                  <dt>Comissão</dt><dd>{formatCurrency(v.comissao_vendedor)}</dd>
                  <dt>Pagamento da entrada</dt><dd>{v.data_pagamento_entrada || '—'}</dd>
                  <dt>Recebimento comissão</dt><dd>{v.comissao_data_recebimento || '—'}</dd>
                </dl>
              </section>

              <section className="venda-info-section">
                <SectionTitle>Imóvel</SectionTitle>
                <dl className="venda-dl">
                  <dt>Empreendimento</dt><dd>{getEmpreendimentoDescricao(v, empreendimentos)}</dd>
                  <dt>Unidade</dt><dd>{getUnidadeDescricao(v, empreendimentos)}</dd>
                  <dt>Valor do imóvel</dt><dd>{formatCurrency(v.unidade_imobiliaria?.valor_total)}</dd>
                </dl>
              </section>
            </div>

            {Array.isArray(v.parcela) && v.parcela.length > 0 && (
              <>
                <SectionTitle>Parcelas</SectionTitle>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
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

          </Card>
        )}
      </div>
    </div>
  );
}

export default Vendas;
