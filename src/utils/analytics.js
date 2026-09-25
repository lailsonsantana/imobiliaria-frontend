import { CLIENTES, EMPREENDIMENTOS, VENDAS } from "../data/mockData";

export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const toDate = (value) => {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const allUnits = EMPREENDIMENTOS.flatMap((empreendimento) =>
  empreendimento.unidade_imobiliaria.map((unidade) => ({
    ...unidade,
    emp_id: empreendimento._id,
    emp_nome: empreendimento.nome,
    emp_cidade: empreendimento.cidade,
  })),
);

export const ANALYTICS = (() => {
  const empStats = EMPREENDIMENTOS.map((empreendimento) => {
    const units = empreendimento.unidade_imobiliaria;
    const vendidas = units.filter((unit) => unit.status === "Vendido").length;
    return {
      ...empreendimento,
      total: units.length,
      vendidas,
      disponiveis: units.filter((unit) => unit.status === "Em aberto").length,
      reservadas: units.filter((unit) => unit.status === "Reservado").length,
      distratadas: units.filter((unit) => unit.status === "Distratado").length,
      percentual: units.length ? (vendidas / units.length) * 100 : 0,
    };
  });

  const sellerCounts = new Map();
  VENDAS.forEach((sale) => {
    const seller = sellerCounts.get(sale.vendedor_id) || {
      _id: sale.vendedor_id,
      nome: sale.vendedor,
      count: 0,
      comissao: 0,
    };
    seller.count += 1;
    seller.comissao += sale.comissao;
    sellerCounts.set(sale.vendedor_id, seller);
  });
  const vendRanking = [...sellerCounts.values()].sort(
    (first, second) => second.count - first.count || first.nome.localeCompare(second.nome),
  );

  const clientCounts = new Map();
  VENDAS.forEach((sale) => {
    sale.clientes.forEach((cpf) => {
      const client = CLIENTES.find((item) => item.cpf === cpf);
      if (!client) return;
      const summary = clientCounts.get(cpf) || {
        _id: cpf,
        nome: client.nome,
        total: 0,
        pagas: 0,
        emPagamento: 0,
      };
      summary.total += 1;
      if (sale.status === "Liquidado") summary.pagas += 1;
      if (sale.status === "Financiado") summary.emPagamento += 1;
      clientCounts.set(cpf, summary);
    });
  });
  const topClientes = [...clientCounts.values()]
    .sort((first, second) => second.total - first.total || first.nome.localeCompare(second.nome))
    .slice(0, 10);

  const distratados = VENDAS.filter((sale) => sale.status === "Distratado").map((sale) => {
    const clienteInfo = CLIENTES.find((client) => client.cpf === sale.clientes[0]);
    return {
      ...sale,
      clienteInfo,
      restantes: 0,
      valorAberto: 0,
    };
  });
  const total = VENDAS.length;
  const quitadas = VENDAS.filter(
    (sale) => sale.status === "Liquidado" || (sale.parcelas > 0 && sale.pagas >= sale.parcelas),
  ).length;

  return {
    allUnits,
    empStats,
    stats: {
      total: allUnits.length,
      vendidas: allUnits.filter((unit) => unit.status === "Vendido").length,
      disponiveis: allUnits.filter((unit) => unit.status === "Em aberto").length,
      clientes: CLIENTES.length,
      vgv: VENDAS.reduce((sum, sale) => sum + sale.valor_venda, 0),
    },
    vendRanking,
    distratados,
    quitadas: {
      total,
      quitadas,
      percentual: total ? (quitadas / total) * 100 : 0,
    },
    topClientes,
    unitStatusCounts: ["Vendido", "Em aberto", "Reservado", "Distratado"].map((status) => ({
      status,
      count: allUnits.filter((unit) => unit.status === status).length,
    })),
  };
})();

export { allUnits };
