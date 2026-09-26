import { useState, useEffect, useMemo } from 'react';
import PageHeader      from '../../components/PageHeader';
import StatCard        from '../../components/StatCard';
import Card            from '../../components/Card';
import SectionTitle    from '../../components/SectionTitle';
import RankingRow      from '../../components/RankingRow';
import StatusBadge     from '../../components/StatusBadge';
import TableRow        from '../../components/TableRow';
import TableCell       from '../../components/TableCell';
import TableHeaderCell from '../../components/TableHeaderCell';
import { getVendas } from '../../services/vendas';
import { getVendedores } from '../../services/vendedores';
import { getEmpreendimentos } from '../../services/empreendimentos';
import { getClientes } from '../../services/client';
import './style.css';

const fmt = {
  currency: (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val ?? 0)),
};

function Relatorios() {
  const [vendas, setVendas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vendasRes, vendedoresRes, empRes, clientesRes] = await Promise.all([
          getVendas().catch((err) => {
            console.error('[Relatorios] Erro ao buscar vendas:', err);
            return [];
          }),
          getVendedores().catch((err) => {
            console.error('[Relatorios] Erro ao buscar vendedores:', err);
            return [];
          }),
          getEmpreendimentos().catch((err) => {
            console.error('[Relatorios] Erro ao buscar empreendimentos:', err);
            return [];
          }),
          getClientes().catch((err) => {
            console.error('[Relatorios] Erro ao buscar clientes:', err);
            return [];
          }),
        ]);

        const extractArray = (res) =>
          Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

        setVendas(extractArray(vendasRes));
        setVendedores(extractArray(vendedoresRes));
        setEmpreendimentos(extractArray(empRes));
        setClientes(extractArray(clientesRes));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /** Todas as unidades consolidadas dos empreendimentos */
  const allUnidades = useMemo(() => {
    return empreendimentos.flatMap((e) =>
      Array.isArray(e.unidade_imobiliaria)
        ? e.unidade_imobiliaria
        : Array.isArray(e.unidades)
        ? e.unidades
        : []
    );
  }, [empreendimentos]);

  /** Consulta 1 — Vendedores com total de vendas e comissões */
  const rankVendedores = useMemo(() => {
    return vendedores
      .map((v) => {
        const vendasDoVendedor =
          Array.isArray(v.vendas) && v.vendas.length > 0 && v.vendas[0]?.valor_venda !== undefined
            ? v.vendas
            : vendas.filter((venda) =>
                String(venda.vendedor_id) === String(v._id) ||
                String(venda.vendedor?.vendedor_id) === String(v._id) ||
                String(venda.vendedor?._id) === String(v._id) ||
                (venda.vendedor?.nome &&
                  v.nome &&
                  venda.vendedor.nome.toLowerCase() === v.nome.toLowerCase())
              );

        return {
          ...v,
          totalVendas: vendasDoVendedor.length,
          totalValor: vendasDoVendedor.reduce(
            (s, vv) => s + Number(vv.valor_venda || 0),
            0
          ),
          totalComissao: vendasDoVendedor.reduce(
            (s, vv) => s + Number(vv.comissao || vv.comissao_vendedor || 0),
            0
          ),
        };
      })
      .sort((a, b) => b.totalValor - a.totalValor);
  }, [vendedores, vendas]);

  /** Consulta 2 — Empreendimentos: unidades por status */
  const empStatus = useMemo(() =>
    empreendimentos.map((e) => {
      const u = Array.isArray(e.unidade_imobiliaria)
        ? e.unidade_imobiliaria
        : Array.isArray(e.unidades)
        ? e.unidades
        : [];
      return {
        nome: e.nome,
        cidade: e.cidade,
        total: u.length,
        vendidas: u.filter((x) => x.status === 'Vendido').length,
        reservadas: u.filter((x) => x.status === 'Reservado').length,
        abertas: u.filter((x) => x.status === 'Em aberto' || x.status === 'Disponível').length,
        distratadas: u.filter((x) => x.status === 'Distratado').length,
        vgv: u
          .filter((x) => x.status === 'Vendido')
          .reduce((s, x) => s + Number(x.valor || x.valor_total || 0), 0),
      };
    }), [empreendimentos]
  );

  /** Consulta 3 — Clientes com mais de uma unidade comprada */
  const clientesMultiplos = useMemo(() => {
    const map = {};

    empreendimentos.forEach((e) => {
      const uList = Array.isArray(e.unidade_imobiliaria)
        ? e.unidade_imobiliaria
        : Array.isArray(e.unidades)
        ? e.unidades
        : [];

      uList.forEach((u) => {
        const cliList = Array.isArray(u.cliente)
          ? u.cliente
          : u.cliente
          ? [u.cliente]
          : [];

        cliList.forEach((c) => {
          const id = c.cliente_id || c.cpf || c._id || c.nome;
          if (!id) return;
          if (!map[id]) {
            map[id] = {
              nome: c.nome || 'Cliente',
              cpf: c.cpf || c.cliente_id || id,
              unidades: 0,
            };
          }
          map[id].unidades += 1;
        });
      });
    });

    if (Object.keys(map).length === 0) {
      vendas.forEach((v) => {
        const cliList = Array.isArray(v.cliente)
          ? v.cliente
          : v.cliente
          ? [v.cliente]
          : [];

        cliList.forEach((c) => {
          const id = c.cliente_id || c.cpf || c._id || c.nome;
          if (!id) return;
          if (!map[id]) {
            map[id] = {
              nome: c.nome || 'Cliente',
              cpf: c.cpf || c.cliente_id || id,
              unidades: 0,
            };
          }
          map[id].unidades += 1;
        });
      });
    }

    clientes.forEach((cli) => {
      const id = cli._id || cli.cpf;
      if (map[id]) {
        if (!map[id].nome || map[id].nome === 'Cliente') map[id].nome = cli.nome;
        if (!map[id].cpf) map[id].cpf = cli.cpf;
      }
    });

    return Object.entries(map)
      .map(([cpf, d]) => ({ cpf: d.cpf || cpf, ...d }))
      .filter((c) => c.unidades > 0)
      .sort((a, b) => b.unidades - a.unidades);
  }, [empreendimentos, vendas, clientes]);

  /** Consulta 4 — Vendas por status com VGV */
  const vendasPorStatus = useMemo(() => {
    const map = {};
    vendas.forEach((v) => {
      const st = v.status || 'Outro';
      if (!map[st]) map[st] = { status: st, qtd: 0, vgv: 0 };
      map[st].qtd += 1;
      map[st].vgv += Number(v.valor_venda || 0);
    });
    return Object.values(map).sort((a, b) => b.vgv - a.vgv);
  }, [vendas]);

  /** Consulta 5 — Tipo de unidade mais vendida */
  const tipoVendas = useMemo(() => {
    const map = {};
    empreendimentos.forEach((e) => {
      const uList = Array.isArray(e.unidade_imobiliaria)
        ? e.unidade_imobiliaria
        : Array.isArray(e.unidades)
        ? e.unidades
        : [];

      uList.forEach((u) => {
        const t = u.tipo || 'Outro';
        if (!map[t]) map[t] = { tipo: t, total: 0, vendidas: 0 };
        map[t].total += 1;
        if (u.status === 'Vendido') map[t].vendidas += 1;
      });
    });
    return Object.values(map).sort((a, b) => b.vendidas - a.vendidas);
  }, [empreendimentos]);

  // Stats gerais
  const totalVGV = vendas.reduce((s, v) => s + Number(v.valor_venda || 0), 0);
  const totalComissao = vendas.reduce(
    (s, v) => s + Number(v.comissao_vendedor || 0),
    0
  );
  const taxaVenda = allUnidades.length
    ? Math.round(
        (allUnidades.filter((u) => u.status === 'Vendido').length /
          allUnidades.length) *
          100
      )
    : 0;

  return (
    <div className="page">
      <PageHeader title="Relatórios" subtitle="Análises consolidadas da imobiliária" />

      <div className="stats-grid">
        <StatCard label="VGV Total"      value={fmt.currency(totalVGV)}     color="green"  compact />
        <StatCard label="Total Comissões" value={fmt.currency(totalComissao)} color="gold"  compact />
        <StatCard label="Taxa de Venda"  value={`${taxaVenda}%`}            color="accent" />
        <StatCard label="Clientes"       value={clientes.length}             color="blue" />
        <StatCard label="Vendedores"     value={vendedores.length}           color="purple" />
      </div>

      {/* Consulta 1 */}
      <Card className="rel-card">
        <SectionTitle>Consulta 1 — Ranking de Vendedores por VGV</SectionTitle>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>Vendedor</TableHeaderCell>
                <TableHeaderCell>CRECI</TableHeaderCell>
                <TableHeaderCell align="right">Qtd. Vendas</TableHeaderCell>
                <TableHeaderCell align="right">VGV</TableHeaderCell>
                <TableHeaderCell align="right">Comissão Total</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {rankVendedores.map((v, i) => (
                <TableRow key={v._id || i} highlighted={i === 0}>
                  <TableCell mono>{i + 1}º</TableCell>
                  <TableCell>{v.nome}</TableCell>
                  <TableCell mono>{v.creci || '—'}</TableCell>
                  <TableCell mono align="right">{v.totalVendas}</TableCell>
                  <TableCell mono align="right">{fmt.currency(v.totalValor)}</TableCell>
                  <TableCell mono align="right">{fmt.currency(v.totalComissao)}</TableCell>
                </TableRow>
              ))}
              {rankVendedores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>Nenhum vendedor encontrado.</TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Consulta 2 */}
      <Card className="rel-card">
        <SectionTitle>Consulta 2 — Empreendimentos: Unidades por Status e VGV</SectionTitle>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <TableHeaderCell>Empreendimento</TableHeaderCell>
                <TableHeaderCell>Cidade</TableHeaderCell>
                <TableHeaderCell align="right">Total</TableHeaderCell>
                <TableHeaderCell align="right">Vendidas</TableHeaderCell>
                <TableHeaderCell align="right">Reservadas</TableHeaderCell>
                <TableHeaderCell align="right">Abertas</TableHeaderCell>
                <TableHeaderCell align="right">Distratadas</TableHeaderCell>
                <TableHeaderCell align="right">VGV</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {empStatus.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.nome}</TableCell>
                  <TableCell>{e.cidade}</TableCell>
                  <TableCell mono align="right">{e.total}</TableCell>
                  <TableCell mono align="right">{e.vendidas}</TableCell>
                  <TableCell mono align="right">{e.reservadas}</TableCell>
                  <TableCell mono align="right">{e.abertas}</TableCell>
                  <TableCell mono align="right">{e.distratadas}</TableCell>
                  <TableCell mono align="right">{fmt.currency(e.vgv)}</TableCell>
                </TableRow>
              ))}
              {empStatus.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>Nenhum empreendimento encontrado.</TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="cards-grid">
        {/* Consulta 3 */}
        <Card>
          <SectionTitle>Consulta 3 — Clientes por Qtd. de Unidades</SectionTitle>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>CPF</TableHeaderCell>
                  <TableHeaderCell align="right">Unidades</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {clientesMultiplos.map((c) => (
                  <TableRow key={c.cpf} highlighted={c.unidades > 1}>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell mono>{c.cpf}</TableCell>
                    <TableCell mono align="right">{c.unidades}</TableCell>
                  </TableRow>
                ))}
                {clientesMultiplos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhum cliente com unidades encontradas.</TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Consulta 4 */}
        <Card>
          <SectionTitle>Consulta 4 — Vendas por Status</SectionTitle>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right">Qtd.</TableHeaderCell>
                  <TableHeaderCell align="right">VGV</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {vendasPorStatus.map((s) => (
                  <TableRow key={s.status}>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell mono align="right">{s.qtd}</TableCell>
                    <TableCell mono align="right">{fmt.currency(s.vgv)}</TableCell>
                  </TableRow>
                ))}
                {vendasPorStatus.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhuma venda registrada.</TableCell>
                  </TableRow>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Consulta 5 */}
      <Card>
        <SectionTitle>Consulta 5 — Tipo de Unidade Mais Vendida</SectionTitle>
        <div className="rel-tipo-grid">
          {tipoVendas.map((t) => {
            const pct = t.total ? Math.round((t.vendidas / t.total) * 100) : 0;
            return (
              <div key={t.tipo} className="rel-tipo-card">
                <div className="rel-tipo-label">{t.tipo}</div>
                <div className="rel-tipo-value">{t.vendidas}</div>
                <div className="rel-tipo-sub">de {t.total} unidades</div>
                <div className="rel-tipo-bar">
                  <div
                    className="rel-tipo-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="rel-tipo-pct">{pct}% vendido</div>
              </div>
            );
          })}
          {tipoVendas.length === 0 && (
            <div style={{ color: 'var(--color-text-sm)', padding: '12px 0' }}>
              Nenhuma unidade encontrada.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Relatorios;
