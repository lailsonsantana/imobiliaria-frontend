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
  {
    name: "valor_total",
    label: "Valor Total da Unidade",
    type: "number",
    placeholder: "0,00",
    min: 0,
    step: 0.01,
    required: true,
    helperText: "Valor total cadastrado da unidade imobiliária",
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
    options: ["Em andamento", "Liquidado", "Cancelado", "Inadimplente"],
    defaultValue: "Em andamento",
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
        label: "CPF do Cliente",
        type: "text",
        placeholder: "000.000.000-00",
        required: true,
        helperText: "Formato: XXX.XXX.XXX-XX",
      },
      {
        name: "nome",
        label: "Nome Completo",
        type: "text",
        placeholder: "Ex: Ana Paula Ferreira",
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

export const getVendas = async () => {
  try {
    console.log("chamei" )
    const response = await api.get("/venda");
    console.log("Vendas ------" , response.data)
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
      `/vendas/${id}`,
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