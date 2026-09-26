import { useState, useMemo, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import SearchBox from '../../components/SearchBox';
import FilterButton from '../../components/FilterButton';
import StatusBadge from '../../components/StatusBadge';
import TableRow from '../../components/TableRow';
import TableCell from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { fmt } from '../../data/fallback';
import { getUnidadesImobiliarias } from '../../services/unidades';
import './style.css';

const STATUS_OPTS = ['Todos', 'Vendido', 'Reservado', 'Em aberto', 'Distratado'];
const TIPO_OPTS = ['Todos', 'casa', 'Apartamento', 'Lote'];

function Unidades() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const [tipo, setTipo] = useState('Todos');
  const [empFiltro, setEmpFiltro] = useState('Todos');
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    getUnidadesImobiliarias()
      .then(setUnidades)
      .catch((error) => console.error('Erro ao carregar unidades:', error));
  }, []);

  // nomes distintos de empreendimento, derivados direto das unidades já populadas
  const empOpts = useMemo(() => {
    const nomes = new Set(
      unidades
        .map((u) => u.empreendimento_id?.nome)
        .filter(Boolean) // descarta referência órfã (empreendimento deletado)
    );
    return ['Todos', ...nomes];
  }, [unidades]);

  const stats = useMemo(() => ({
    total: unidades.length,
    vendidas: unidades.filter((u) => u.status === 'Vendido').length,
    reservadas: unidades.filter((u) => u.status === 'Reservado').length,
    abertas: unidades.filter((u) => u.status === 'Em aberto').length,
    distratadas: unidades.filter((u) => u.status === 'Distratado').length,
  }), [unidades]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return unidades.filter((u) => {
      const nomeEmp = u.empreendimento_id?.nome ?? '';
      const matchQ = nomeEmp.toLowerCase().includes(q)
        || u.numero.toLowerCase().includes(q)
        || u.quadra.toLowerCase().includes(q);
      const matchS = status === 'Todos' || u.status === status;
      const matchT = tipo === 'Todos' || u.tipo === tipo;
      const matchE = empFiltro === 'Todos' || nomeEmp === empFiltro;
      return matchQ && matchS && matchT && matchE;
    });
  }, [search, status, tipo, empFiltro, unidades]);

  return (
    <div className="page">
      <PageHeader title="Unidades Imobiliárias" subtitle="Todas as unidades cadastradas nos empreendimentos" />

      <div className="stats-grid">
        <StatCard label="Total" value={stats.total} color="accent" />
        <StatCard label="Vendidas" value={stats.vendidas} color="green" />
        <StatCard label="Reservadas" value={stats.reservadas} color="blue" />
        <StatCard label="Em Aberto" value={stats.abertas} color="gold" />
        <StatCard label="Distratadas" value={stats.distratadas} color="red" />
      </div>

      <div className="toolbar" style={{ flexWrap: 'wrap' }}>
        <SearchBox value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar unidade..." />
        {STATUS_OPTS.map((s) => (
          <FilterButton key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>

      <div className="toolbar" style={{ marginBottom: 20 }}>
        {TIPO_OPTS.map((t) => (
          <FilterButton key={t} label={t} active={tipo === t} onClick={() => setTipo(t)} />
        ))}
        <select className="unid-select" value={empFiltro} onChange={(e) => setEmpFiltro(e.target.value)}>
          {empOpts.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <Card noPadding>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>Empreendimento</TableHeaderCell>
                <TableHeaderCell>Nº</TableHeaderCell>
                <TableHeaderCell>Quadra</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
                <TableHeaderCell align="right">Área m²</TableHeaderCell>
                <TableHeaderCell align="right">Valor</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.empreendimento_id?.nome ?? '—'}</TableCell>
                  <TableCell mono>{u.numero}</TableCell>
                  <TableCell>{u.quadra}</TableCell>
                  <TableCell>{u.tipo}</TableCell>
                  <TableCell mono align="right">{u.area}</TableCell>
                  <TableCell mono align="right">{fmt.currency(u.valor)}</TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell>Nenhuma unidade encontrada.</TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
        <div className="unid-count">
          {filtered.length} de {unidades.length} unidades exibidas
        </div>
      </Card>
    </div>
  );
}

export default Unidades;