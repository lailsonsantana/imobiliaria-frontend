import api from "./index";

export const VENDA_FIELDS = [
  // ----- Vendedor -----
  {
    name: "vendedor_id",
    label: "Vendedor",
    type: "select",
    options: [], // preencher com a lista de vendedores cadastrados
    placeholder: "Selecione o vendedor",
    required: true,
    fullWidth: true,
  },

  // ----- Unidade Imobiliária -----
  {
    name: "empreendimento_id",
    label: "Empreendimento",
    type: "select",
    options: [], // preencher com a lista de empreendimentos
    placeholder: "Selecione o empreendimento",
    required: true,
  },
  {
    name: "unidade_imobiliaria_id",
    label: "Unidade Imobiliária",
    type: "select",
    options: [], // preencher com as unidades do empreendimento selecionado
    placeholder: "Selecione a unidade",
    required: true,
  },
  // ----- Dados gerais da venda -----
  {
    name: "data_venda",
    label: "Data da Venda",
    type: "date",
    required: true,
  },
  {
    name: "valor_venda",
    label: "Valor da Venda",
    type: "number",
    placeholder: "0,00",
    min: 0,
    step: 0.01,
    required: true,
  },
  {
    name: "valor_entrada",
    label: "Valor de Entrada",
    type: "number",
    placeholder: "0,00",
    min: 0,
    step: 0.01,
    required: true,
  },
  {
    name: "data_pagamento_entrada",
    label: "Data de Pagamento da Entrada",
    type: "date",
  },
  {
    name: "quantidade_parcelas",
    label: "Quantidade de Parcelas",
    type: "number",
    min: 1,
    step: 1,
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Liquidado", "Transferido", "Financiado", "Distratado"],
    defaultValue: "Liquidado",
    required: true,
  },

  // ----- Comissão -----
  {
    name: "comissao_vendedor",
    label: "Comissão do Vendedor",
    type: "number",
    placeholder: "0,00",
    min: 0,
    step: 0.01,
  },
  {
    name: "comissao_data_recebimento",
    label: "Data de Recebimento da Comissão",
    type: "date",
  },

  // ----- Clientes (array) -----
  {
    name: "cliente",
    label: "Clientes",
    type: "array",
    itemLabel: "Cliente",
    fullWidth: true,
    minItems: 1,
    fields: [
      {
        name: "cliente_id",
        label: "Cliente cadastrado",
        type: "select",
        options: [],
        placeholder: "Selecione um cliente",
        required: true,
      },
      {
        name: "responsavel_financeiro",
        label: "Responsável Financeiro",
        type: "checkbox",
        defaultValue: false,
      },
    ],
  },

  // ----- Parcelas (array) -----
  {
    name: "parcela",
    label: "Parcelas",
    type: "array",
    itemLabel: "Parcela",
    fullWidth: true,
    minItems: 0,
    fields: [
      {
        name: "data_vencimento",
        label: "Data de Vencimento",
        type: "date",
        required: true,
      },
      {
        name: "data_pagamento",
        label: "Data de Pagamento",
        type: "date",
      },
      {
        name: "valor_parcela",
        label: "Valor da Parcela",
        type: "number",
        placeholder: "0,00",
        min: 0,
        step: 0.01,
        required: true,
      },
      {
        name: "juros",
        label: "Juros",
        type: "number",
        placeholder: "0,00",
        min: 0,
        step: 0.01,
        defaultValue: 0,
      },
      {
        name: "forma_pagamento",
        label: "Forma de Pagamento",
        type: "select",
        options: ["Boleto", "Transferencia", "Pix", "Cartao", "Dinheiro"],
        defaultValue: "Boleto",
      },
    ],
  },
];

const getReferenceId = (reference) => (
  reference && typeof reference === "object"
    ? reference._id ?? reference.id
    : reference
);

const getUnitLabel = (unidade) => (
  [
    unidade.numero != null && `Unidade ${unidade.numero}`,
    unidade.quadra && `Quadra ${unidade.quadra}`,
    unidade.tipo,
  ].filter(Boolean).join(" · ") || `Unidade ${getReferenceId(unidade)}`
);

export const buildVendaFields = ({
  vendedores = [],
  empreendimentos = [],
  unidades = [],
  clientes = [],
} = {}) => VENDA_FIELDS.map((field) => {
  if (field.name === "vendedor_id") {
    return {
      ...field,
      options: vendedores.map((vendedor) => ({
        label: vendedor.nome,
        value: getReferenceId(vendedor),
      })),
    };
  }

  if (field.name === "empreendimento_id") {
    return {
      ...field,
      options: empreendimentos.map((empreendimento) => ({
        label: empreendimento.nome,
        value: getReferenceId(empreendimento),
      })),
    };
  }

  if (field.name === "unidade_imobiliaria_id") {
    return {
      ...field,
      options: unidades.map((unidade) => {
        const empreendimento = empreendimentos.find((item) => (
          String(getReferenceId(item))
            === String(getReferenceId(unidade.empreendimento_id ?? unidade.empreendimento))
        ));
        const descricao = getUnitLabel(unidade);

        return {
          label: empreendimento
            ? `${empreendimento.nome} — ${descricao}`
            : descricao,
          value: getReferenceId(unidade),
        };
      }),
    };
  }

  if (field.name === "cliente") {
    return {
      ...field,
      fields: field.fields.map((subField) => (
        subField.name === "cliente_id"
          ? {
            ...subField,
            options: clientes
              .filter((cliente) => cliente.cpf && cliente.nome)
              .map((cliente) => ({
                label: `${cliente.nome} — ${cliente.cpf}`,
                value: cliente.cpf,
              })),
          }
          : subField
      )),
    };
  }

  return field;
});

const formatVendaDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export const buildVendaPayload = (
  formData,
  { vendedores = [], unidades = [], clientes = [] } = {},
) => {
  const {
    vendedor_id,
    empreendimento_id,
    unidade_imobiliaria_id,
    valor_total,
    data_venda,
    data_pagamento_entrada,
    comissao_data_recebimento,
    parcela,
    ...venda
  } = formData;
  const vendedor = vendedores.find(
    (item) => String(getReferenceId(item)) === String(vendedor_id),
  );
  const unidade = unidades.find(
    (item) => String(getReferenceId(item)) === String(unidade_imobiliaria_id),
  );
  const empreendimentoDaUnidade = unidade
    && getReferenceId(unidade.empreendimento_id ?? unidade.empreendimento);

  if (
    empreendimentoDaUnidade
    && String(empreendimentoDaUnidade) !== String(empreendimento_id)
  ) {
    throw new Error("A unidade selecionada não pertence ao empreendimento escolhido.");
  }

  return {
    ...venda,
    vendedor: {
      vendedor_id,
      nome: vendedor?.nome,
    },
    unidade_imobiliaria: {
      empreendimento_id,
      unidade_imobiliaria_id,
      valor_total: unidade?.valor_total ?? unidade?.valor ?? valor_total,
    },
    data_venda: formatVendaDate(data_venda),
    data_pagamento_entrada: formatVendaDate(data_pagamento_entrada),
    comissao_data_recebimento: formatVendaDate(comissao_data_recebimento),
    cliente: Array.isArray(venda.cliente)
      ? venda.cliente.map((item) => {
        const cliente = clientes.find(
          (record) => String(record.cpf) === String(item.cliente_id),
        );
        return {
          ...item,
          nome: cliente?.nome ?? item.nome ?? "",
        };
      })
      : venda.cliente,
    parcela: Array.isArray(parcela)
      ? parcela.map((item) => ({
        ...item,
        data_vencimento: formatVendaDate(item.data_vencimento),
        data_pagamento: formatVendaDate(item.data_pagamento),
      }))
      : parcela,
  };
};

export const getVendas = async () => {
  try {
    const response = await api.get("/venda");
    console.log("Vendas :" , response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    throw error;
  }
};

export const getVendaById = async (id) => {
  try {
    const response = await api.get(`/venda/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vendas por id ${id}:`, error);
    throw error;
  }
};

export const createVenda = async (vendas) => {
  try {
    const response = await api.post("/venda", vendas);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    throw error;
  }
};

export const updateVenda = async (id, vendas) => {
  try {
    const response = await api.put(
      `/venda/${id}`,
      vendas,
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar venda por id ${id}:`, error);
    throw error;
  }
};

export const deleteVenda = async (id) => {
  try {
    const response = await api.delete(`/venda/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar venda por id ${id}:`, error);
    throw error;
  }
};