import { useState, useMemo, useEffect, use } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import SectionTitle from '../../components/SectionTitle';
import SearchBox from '../../components/SearchBox';
import FilterButton from '../../components/FilterButton';
import StatusBadge from '../../components/StatusBadge';
import TableRow from '../../components/TableRow';
import TableCell from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import FormButton from '../../components/FormButton';
import { empreendimentos, fmt } from '../../data/fallback';
import './style.css';

import { createEmpreendimento, getEmpreendimentos, EMPREENDIMENTOS_FIELDS } from '../../services/empreendimentos';
import { getUnidadesImobiliarias } from '../../services/unidades';


const TIPOS = ['Todos', 'casa', 'Apartamento', 'Lote'];

function Empreendimentos() {
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [selected, setSelected] = useState(null);

  const [empreendimentosData, setEmpreendimentosData] = useState([]);

  const carregarEmpreendimentos = () => {
    getEmpreendimentos().then((data) => {
      setEmpreendimentosData(data);
    }).catch((error) => {
      console.error('Erro ao carregar empreendimentos:', error);
    });
  }


  useEffect(() => {
    carregarEmpreendimentos();
  },[])

  const stats = useMemo(() => {
    const all = empreendimentosData.flatMap((e) => e.unidade_imobiliaria);
    return {
      total: empreendimentosData.length,
      unidades: all.length,
      vendidas: all.filter((u) => u.status === 'Vendido').length,
      abertas: all.filter((u) => u.status === 'Em aberto').length,
    };
  }, [empreendimentosData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return empreendimentosData.filter((e) => {
      const matchSearch = e.nome.toLowerCase().includes(q)
        || e.cidade.toLowerCase().includes(q)
        || e.estado.toLowerCase().includes(q);
      const matchTipo = tipoFiltro === 'Todos'
        || e.unidade_imobiliaria.some((u) => u.tipo === tipoFiltro);
      return matchSearch && matchTipo;
    });
  }, [search, tipoFiltro, empreendimentosData]);

  const emp = selected ?? filtered[0];

  return (
    <div className="page">
      <PageHeader title="Empreendimentos" subtitle="Cadastro e status dos empreendimentos" />

      <div className="stats-grid">
        <StatCard label="Empreendimentos" value={stats.total} color="accent" />
        <StatCard label="Total Unidades" value={stats.unidades} color="blue" />
        <StatCard label="Vendidas" value={stats.vendidas} color="green" />
        <StatCard label="Em Aberto" value={stats.abertas} color="gold" />
      </div>

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empreendimento..."
        />
        {TIPOS.map((t) => (
          <FilterButton
            key={t}
            label={t}
            active={tipoFiltro === t}
            onClick={() => setTipoFiltro(t)}
          />
        ))}
        <FormButton
          name="Novo Empreendimento"
          entries={EMPREENDIMENTOS_FIELDS}
          serviceFn={createEmpreendimento}
          onSuccess={(data) => {
            carregarEmpreendimentos();
          }}
        />
      </div>

      <div className="emp-layout">
        {/* Lista */}
        <Card noPadding className="emp-list-card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Cidade</TableHeaderCell>
                  <TableHeaderCell>UF</TableHeaderCell>
                  <TableHeaderCell align="right">Unid.</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <TableRow
                    key={e._id}
                    highlighted={emp?._id === e._id}
                  >
                    <TableCell>
                      <button
                        className="emp-nome-btn"
                        onClick={() => setSelected(e)}
                      >
                        {e.nome}
                      </button>
                    </TableCell>
                    <TableCell>{e.cidade}</TableCell>
                    <TableCell>{e.estado}</TableCell>
                    <TableCell mono align="right">{e.unidade_imobiliaria.length}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <tr><TableCell colSpan={4}>Nenhum resultado.</TableCell></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detalhe */}
        {emp && (
          <Card className="emp-detail-card">
            <SectionTitle>Unidades — {emp.nome}</SectionTitle>
            <p className="emp-detail-local">
              {emp.bairro}, {emp.cidade} — {emp.estado} · CEP {emp.cep}
            </p>

            <div className="emp-unit-stats">
              {['Vendido', 'Reservado', 'Em aberto', 'Distratado'].map((s) => {
                const cnt = emp.unidade_imobiliaria.filter((u) => u.status === s).length;
                return (
                  <div key={s} className="emp-unit-stat">
                    <StatusBadge status={s} />
                    <span className="emp-unit-stat-cnt">{cnt}</span>
                  </div>
                );
              })}
            </div>

            <div className="table-wrapper" style={{ marginTop: 14 }}>
              <table>
                <thead>
                  <tr>
                    <TableHeaderCell>Nº</TableHeaderCell>
                    <TableHeaderCell>Quadra</TableHeaderCell>
                    <TableHeaderCell>Tipo</TableHeaderCell>
                    <TableHeaderCell align="right">Área m²</TableHeaderCell>
                    <TableHeaderCell align="right">Valor</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {emp.unidade_imobiliaria.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell mono>{u.numero}</TableCell>
                      <TableCell>{u.quadra}</TableCell>
                      <TableCell>{u.tipo}</TableCell>
                      <TableCell mono align="right">{u.area}</TableCell>
                      <TableCell mono align="right">{fmt.currency(u.valor)}</TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Empreendimentos;
