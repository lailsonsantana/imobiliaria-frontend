import { useState, useMemo, useEffect } from 'react';
import { getVendedores } from '../../services/vendedores';
import { getVendas } from '../../services/vendas'; 
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SectionTitle    from '../../components/SectionTitle';
import SearchBox       from '../../components/SearchBox';
import RankingRow      from '../../components/RankingRow';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import './style.css';

// Formatador nativo para substituir o 'fmt' do fallback, e formatar a moeda
const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value ?? 0));

function Vendedores() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  
  const [vendedores, setVendedores] = useState([]);
  const [vendas, setVendas] = useState([]); 

  useEffect(() => {
    // Busca Vendedores e Vendas reais da API
    Promise.all([getVendedores(), getVendas()])
      .then(([dadosVendedores, dadosVendas]) => {
        setVendedores(Array.isArray(dadosVendedores) ? dadosVendedores : []);
        setVendas(Array.isArray(dadosVendas) ? dadosVendas : []);
      })
      .catch((erro) => console.error("Falha ao carregar API:", erro));
  }, []);

  const ranking = useMemo(() => {
    const list = vendedores.map((v) => {
      
      // Cruza os dados: encontra as vendas reais que pertencem a este vendedor
      const vendasDoVendedor = vendas.filter(venda => 
        String(venda.vendedor_id) === String(v._id) || 
        String(venda.vendedor?.vendedor_id) === String(v._id) ||
        String(venda.vendedor?._id) === String(v._id)
      ).map(vv => ({
        ...vv,
        venda_id: vv._id,
        comissao: Number(vv.comissao_vendedor || 0),
        data_recebimento_comissao: vv.comissao_data_recebimento || '—',
        valor_venda: Number(vv.valor_venda || 0)
      }));

      return {
        ...v,
        vendas: vendasDoVendedor,
        totalVendas: vendasDoVendedor.length,
        totalValor: vendasDoVendedor.reduce((s, vv) => s + vv.valor_venda, 0),
        totalComissao: vendasDoVendedor.reduce((s, vv) => s + vv.comissao, 0),
      };
    }).sort((a, b) => b.totalValor - a.totalValor);
    
    const max = list[0]?.totalValor || 1;
    return list.map((v) => ({ ...v, pct: Math.round((v.totalValor / max) * 100) }));
  }, [vendedores, vendas]);

  const stats = useMemo(() => ({
    total: ranking.length,
    totalVendas: ranking.reduce((s, v) => s + v.totalVendas, 0),
    totalVGV: ranking.reduce((s, v) => s + v.totalValor, 0),
    totalComissao: ranking.reduce((s, v) => s + v.totalComissao, 0),
  }), [ranking]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ranking.filter((v) =>
      v.nome?.toLowerCase().includes(q) || v.cpf?.includes(q) || v.creci?.toLowerCase().includes(q)
    );
  }, [search, ranking]);

  const v = selected;

  return (
    <div className="page">
      <PageHeader title="Vendedores" subtitle="Desempenho e cadastro dos corretores" />

      <div className="stats-grid">
        <StatCard label="Vendedores"     value={stats.total}                         color="accent" />
        <StatCard label="Total de Vendas" value={stats.totalVendas}                  color="blue" />
        <StatCard label="VGV Total"      value={formatCurrency(stats.totalVGV)}      color="green" compact />
        <StatCard label="Total Comissões" value={formatCurrency(stats.totalComissao)} color="gold" compact />
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
              value={formatCurrency(v.totalValor)}
              percentage={v.pct}
            />
          ))}
          {filtered.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-sm)', padding: '10px 0' }}>
              Nenhum vendedor encontrado.
            </p>
          )}
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
                      <TableCell mono align="right">{formatCurrency(vv.totalValor)}</TableCell>
                      <TableCell mono align="right">{formatCurrency(vv.totalComissao)}</TableCell>
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
                    {v.vendas?.map((vv) => (
                      <TableRow key={vv.venda_id}>
                        <TableCell mono>{vv.venda_id}</TableCell>
                        <TableCell mono>{vv.data_venda}</TableCell>
                        <TableCell mono align="right">{formatCurrency(vv.valor_venda)}</TableCell>
                        <TableCell mono align="right">{formatCurrency(vv.comissao)}</TableCell>
                        <TableCell mono>{vv.data_recebimento_comissao}</TableCell>
                      </TableRow>
                    ))}
                    {(!v.vendas || v.vendas.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5}>Nenhuma venda registrada para este vendedor.</TableCell>
                      </TableRow>
                    )}
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