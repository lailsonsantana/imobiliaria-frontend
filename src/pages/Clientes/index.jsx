import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import SearchBox from '../../components/SearchBox';
import FilterButton from '../../components/FilterButton';
import StatusBadge from '../../components/StatusBadge';
import TableRow from '../../components/TableRow';
import TableCell from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { Pencil, Trash } from 'lucide-react';
import FormButton from '../../components/FormButton';
import CallbackButton from '../../components/CallbackButton';
import {
  getClientes,
  createCliente,
  updateCliente,
  excluirCliente,
  CLIENTE_FIELDS,
  clienteToFormValues,
  getClientesStats,
} from '../../services/client';
import { getVendas } from '../../services/vendas';
// import { clientes } from '../../data/fallback';
import './style.css';

const ESTADO_CIVIL_OPTS = ['Todos', 'Casado', 'Solteiro', 'Divorciado', 'Viuvo'];

function Clientes() {
  const [search, setSearch] = useState('');
  const [ecFiltro, setEcFiltro] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [vendas, setVendas] = useState([]);

  const carregarClientes = () => {
    getClientes()
      .then((body) => {
        setClientes(Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []);
      })
      .catch((error) => {
        console.error('[Clientes] Erro ao buscar clientes:', error);
      });
  };

  const carregarVendas = () => {
    getVendas()
      .then((body) => {
        setVendas(Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []);
      })
      .catch((error) => {
        console.error('[Clientes] Erro ao buscar vendas:', error);
      });
  };

  useEffect(() => {
    carregarClientes();
    carregarVendas();
  }, []);

  const stats = useMemo(() => {
    return getClientesStats(clientes, vendas);
  }, [clientes, vendas]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clientes.filter((c) => {
      const matchQ =
        c.nome?.toLowerCase().includes(q) ||
        c.cpf?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.profissao?.toLowerCase().includes(q);
      const matchEc = ecFiltro === 'Todos' || c.estado_civil === ecFiltro;
      return matchQ && matchEc;
    });
  }, [search, ecFiltro, clientes]);

  const c = selected;

  return (
    <div className="page">
      <PageHeader title="Clientes" subtitle="Cadastro de compradores" />

      <div className="stats-grid">
        <StatCard
          label="Total Clientes"
          value={stats.total}
          color="accent"
          description="Cadastrados no sistema"
        />

        <Card accent="gold" className="stat-card">
          <div className="stat-card__label">Top 3 Clientes em Vendas</div>
          {stats.topClientes && stats.topClientes.length > 0 ? (
            <div className="cli-top-list">
              {stats.topClientes.map((item, idx) => (
                <div key={item.cpf || item.nome || idx} className="cli-top-item">
                  <span className="cli-top-badge">#{idx + 1}</span>
                  <span className="cli-top-name" title={item.nome}>
                    {item.nome}
                  </span>
                  <span className="cli-top-count">
                    {item.totalVendas} {item.totalVendas === 1 ? 'venda' : 'vendas'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="cli-top-empty">Nenhuma venda associada</div>
          )}
        </Card>

        <StatCard
          label="Cidade com Mais Clientes"
          value={stats.topCidade?.cidade || '—'}
          description={
            stats.topCidade?.total
              ? `${stats.topCidade.total} cliente${stats.topCidade.total > 1 ? 's' : ''} (${stats.topCidade.percentual}% do total)`
              : 'Sem endereços informados'
          }
          color="green"
          compact
        />
      </div>

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
        />
        {ESTADO_CIVIL_OPTS.map((ec) => (
          <FilterButton
            key={ec}
            label={ec}
            active={ecFiltro === ec}
            onClick={() => setEcFiltro(ec)}
          />
        ))}
        <FormButton
          name="Novo Cliente"
          entries={CLIENTE_FIELDS}
          serviceFn={createCliente}
          onSuccess={(data) => {
            console.log('Sucesso!', data);
            carregarClientes();
          }}
        />
      </div>

      <div className="cli-layout">
        {/* Tabela */}
        <Card noPadding>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>CPF</TableHeaderCell>
                  <TableHeaderCell>Profissão</TableHeaderCell>
                  <TableHeaderCell>Estado Civil</TableHeaderCell>
                  <TableHeaderCell>Cidade</TableHeaderCell>
                  <TableHeaderCell>Editar</TableHeaderCell>
                  <TableHeaderCell>Excluir</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cli) => (
                  <TableRow key={cli._id} highlighted={selected?._id === cli._id}>
                    <TableCell>
                      <button
                        className="cli-nome-btn"
                        onClick={() =>
                          setSelected((prev) => (prev?._id === cli._id ? null : cli))
                        }
                      >
                        {cli.nome}
                      </button>
                    </TableCell>
                    <TableCell mono>{cli.cpf}</TableCell>
                    <TableCell>{cli.profissao}</TableCell>
                    <TableCell>
                      <StatusBadge status={cli.estado_civil} />
                    </TableCell>
                    <TableCell>{cli.endereco?.[0]?.cidade}</TableCell>
                    <TableCell>
                      <FormButton
                        entries={CLIENTE_FIELDS}
                        icon={Pencil}
                        iconOnly
                        variant="outline"
                        className="cli-edit-btn"
                        aria-label={`Editar cliente ${cli.nome}`}
                        modalTitle="Editar Cliente"
                        modalSubtitle={cli.nome}
                        submitText="Atualizar"
                        initialValues={clienteToFormValues(cli)}
                        serviceFn={(formData) => updateCliente(cli._id, formData)}
                        onSuccess={() => carregarClientes()}
                      />
                    </TableCell>
                    <TableCell>
                      <CallbackButton
                        label="Excluir"
                        icon={Trash}
                        iconOnly
                        variant="outline"
                        className="cli-delete-btn"
                        aria-label={`Excluir cliente ${cli.nome}`}
                        modalTitle="Excluir Cliente"
                        modalSubtitle={cli.nome}
                        submitText="Excluir"
                        serviceFn={excluirCliente}
                        params={cli._id}
                        onSuccess={() => carregarClientes()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell>Nenhum cliente encontrado.</TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Painel de detalhe */}
        {c && (
          <Card className="cli-detail">
            <div className="cli-avatar">{c.nome?.charAt(0)}</div>
            <h3 className="cli-detail-nome">{c.nome}</h3>
            <StatusBadge status={c.estado_civil} />

            <dl className="cli-dl">
              <dt>CPF</dt> <dd>{c.cpf}</dd>
              <dt>RG</dt> <dd>{c.rg}</dd>
              <dt>Nascimento</dt> <dd>{c.data_nascimento}</dd>
              <dt>Profissão</dt> <dd>{c.profissao}</dd>
              <dt>E-mail</dt> <dd>{c.email}</dd>
              <dt>Tel. Residencial</dt>
              <dd>{c.telefone?.[0]?.residencial ?? '—'}</dd>
              <dt>Tel. Comercial</dt>
              <dd>{c.telefone?.[0]?.comercial ?? '—'}</dd>
              <dt>Endereço</dt>
              <dd>
                {c.endereco?.[0]?.logradouro}, {c.endereco?.[0]?.numero}
                {c.endereco?.[0]?.complemento ? `, ${c.endereco[0].complemento}` : ''}
                <br />
                {c.endereco?.[0]?.bairro} — {c.endereco?.[0]?.cidade}/{c.endereco?.[0]?.estado}
                <br />
                CEP {c.endereco?.[0]?.cep}
              </dd>
            </dl>

            <button className="cli-close-btn" onClick={() => setSelected(null)}>
              Fechar
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Clientes;
