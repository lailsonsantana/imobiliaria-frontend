import { useState, useMemo } from 'react';
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SearchBox       from '../../components/SearchBox';
import FilterButton    from '../../components/FilterButton';
import StatusBadge     from '../../components/StatusBadge';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { clientes } from '../../data/fallback';
import './style.css';

const ESTADO_CIVIL_OPTS = ['Todos', 'Casado', 'Solteiro', 'Divorciado', 'Viuvo'];

function Clientes() {
  const [search, setSearch]       = useState('');
  const [ecFiltro, setEcFiltro]   = useState('Todos');
  const [selected, setSelected]   = useState(null);

  const stats = useMemo(() => {
    const ec = {};
    clientes.forEach((c) => {
      ec[c.estado_civil] = (ec[c.estado_civil] || 0) + 1;
    });
    return { total: clientes.length, ec };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clientes.filter((c) => {
      const matchQ = c.nome.toLowerCase().includes(q)
        || c.cpf.includes(q)
        || c.email.toLowerCase().includes(q)
        || c.profissao.toLowerCase().includes(q);
      const matchEc = ecFiltro === 'Todos' || c.estado_civil === ecFiltro;
      return matchQ && matchEc;
    });
  }, [search, ecFiltro]);

  const c = selected;

  return (
    <div className="page">
      <PageHeader title="Clientes" subtitle="Cadastro de compradores" />

      <div className="stats-grid">
        <StatCard label="Total Clientes"  value={stats.total}               color="accent" />
        <StatCard label="Casados"         value={stats.ec['Casado'] || 0}   color="blue" />
        <StatCard label="Solteiros"       value={stats.ec['Solteiro'] || 0} color="green" />
        <StatCard label="Divorciados"     value={stats.ec['Divorciado'] || 0} color="red" />
        <StatCard label="Viúvos"          value={stats.ec['Viuvo'] || 0}    color="purple" />
      </div>

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
        />
        {ESTADO_CIVIL_OPTS.map((ec) => (
          <FilterButton key={ec} label={ec} active={ecFiltro === ec} onClick={() => setEcFiltro(ec)} />
        ))}
      </div>

      <div className="cli-layout">
        {/* Tabela */}
        <Card noPadding>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>CPF</TableHeaderCell>
                  <TableHeaderCell>Profissão</TableHeaderCell>
                  <TableHeaderCell>Estado Civil</TableHeaderCell>
                  <TableHeaderCell>Cidade</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cli) => (
                  <TableRow key={cli._id} highlighted={selected?._id === cli._id}>
                    <TableCell mono>{cli._id}</TableCell>
                    <TableCell>
                      <button
                        className="cli-nome-btn"
                        onClick={() => setSelected((prev) => prev?._id === cli._id ? null : cli)}
                      >
                        {cli.nome}
                      </button>
                    </TableCell>
                    <TableCell mono>{cli.cpf}</TableCell>
                    <TableCell>{cli.profissao}</TableCell>
                    <TableCell><StatusBadge status={cli.estado_civil} /></TableCell>
                    <TableCell>{cli.endereco[0]?.cidade}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell>Nenhum cliente encontrado.</TableCell></TableRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Painel de detalhe */}
        {c && (
          <Card className="cli-detail">
            <div className="cli-avatar">{c.nome.charAt(0)}</div>
            <h3 className="cli-detail-nome">{c.nome}</h3>
            <StatusBadge status={c.estado_civil} />

            <dl className="cli-dl">
              <dt>CPF</dt>            <dd>{c.cpf}</dd>
              <dt>RG</dt>             <dd>{c.rg}</dd>
              <dt>Nascimento</dt>     <dd>{c.data_nascimento}</dd>
              <dt>Profissão</dt>      <dd>{c.profissao}</dd>
              <dt>E-mail</dt>         <dd>{c.email}</dd>
              <dt>Tel. Residencial</dt><dd>{c.telefone[0]?.residencial ?? '—'}</dd>
              <dt>Tel. Comercial</dt> <dd>{c.telefone[0]?.comercial ?? '—'}</dd>
              <dt>Endereço</dt>
              <dd>
                {c.endereco[0]?.logradouro}, {c.endereco[0]?.numero}
                {c.endereco[0]?.complemento ? `, ${c.endereco[0].complemento}` : ''}<br />
                {c.endereco[0]?.bairro} — {c.endereco[0]?.cidade}/{c.endereco[0]?.estado}<br />
                CEP {c.endereco[0]?.cep}
              </dd>
            </dl>

            <button className="cli-close-btn" onClick={() => setSelected(null)}>Fechar</button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Clientes;
