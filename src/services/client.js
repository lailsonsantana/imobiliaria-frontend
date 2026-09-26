import api from "./index";

export const CLIENTE_FIELDS = [
  {
    name: "nome",
    label: "Nome Completo",
    type: "text",
    placeholder: "Ex: Fábio Alves Santos",
    required: true,
    fullWidth: true,
  },
  {
    name: "cpf",
    label: "CPF",
    type: "text",
    placeholder: "000.000.000-00",
    required: true,
    helperText: "Formato: XXX.XXX.XXX-XX",
  },
  {
    name: "rg",
    label: "RG",
    type: "text",
    placeholder: "Ex: 6789012",
  },
  {
    name: "data_nascimento",
    label: "Data de Nascimento",
    type: "date",
    placeholder: "DD/MM/AAAA",
  },
  {
    name: "profissao",
    label: "Profissão",
    type: "text",
    placeholder: "Ex: Contador",
  },
  {
    name: "estado_civil",
    label: "Estado Civil",
    type: "select",
    options: ["Solteiro", "Casado", "Divorciado", "Viuvo"],
    defaultValue: "Solteiro",
    required: true,
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    placeholder: "exemplo@email.com",
    required: true,
    fullWidth: true,
  },
  {
    name: "telefone",
    label: "Telefones",
    type: "array",
    itemLabel: "Telefone",
    fullWidth: true,
    minItems: 1,
    fields: [
      {
        name: "residencial",
        label: "Tel. Residencial / Celular",
        type: "tel",
        placeholder: "(11) 98765-4321",
        helperText: "Formato: (XX) XXXXX-XXXX",
      },
      {
        name: "comercial",
        label: "Tel. Comercial",
        type: "tel",
        placeholder: "(11) 3344-5566",
        helperText: "Formato: (XX) XXXXX-XXXX",
      },
    ],
    defaultValue: [
      {
        residencial: "",
        comercial: "",
      },
    ],
  },
  {
    name: "endereco",
    label: "Endereços",
    type: "array",
    itemLabel: "Endereço",
    fullWidth: true,
    minItems: 1,
    fields: [
      {
        name: "logradouro",
        label: "Logradouro",
        type: "text",
        placeholder: "Rua, Avenida...",
        required: true,
      },
      {
        name: "numero",
        label: "Número",
        type: "text",
        placeholder: "123",
        required: true,
      },
      {
        name: "complemento",
        label: "Complemento",
        type: "text",
        placeholder: "Apto, Sala, Bloco... (opcional)",
      },
      {
        name: "bairro",
        label: "Bairro",
        type: "text",
        placeholder: "Bairro",
        required: true,
      },
      {
        name: "cidade",
        label: "Cidade",
        type: "text",
        placeholder: "Cidade",
        required: true,
      },
      {
        name: "estado",
        label: "Estado",
        type: "text",
        placeholder: "Estado (ex: São Paulo, Paraná)",
        required: true,
      },
      {
        name: "cep",
        label: "CEP",
        type: "text",
        placeholder: "00000-000",
        required: true,
        helperText: "Formato: XXXXX-XXX",
      },
    ],
    defaultValue: [
      {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
    ],
  },
];

/**
 * Cliente da API → initialValues do formulário (campos específicos do domínio).
 * Datas, arrays vazios e null em campos ficam no FormButton.
 */
export const clienteToFormValues = (cliente) => {
  if (!cliente) return undefined;
  const { _id, __v, createdAt, updatedAt, ...formFields } = cliente;
  return formFields;
};

/**
 * Normaliza os dados do formulário para o formato exigido pelo backend
 */
const sanitizeClientData = (data) => {
  const payload = { ...data };

  // Converte data de nascimento YYYY-MM-DD para DD/MM/YYYY se necessário
  if (
    payload.data_nascimento &&
    /^\d{4}-\d{2}-\d{2}$/.test(payload.data_nascimento)
  ) {
    const [y, m, d] = payload.data_nascimento.split("-");
    payload.data_nascimento = `${d}/${m}/${y}`;
  }

  // Limpa e formata o array de telefones
  if (Array.isArray(payload.telefone)) {
    payload.telefone = payload.telefone
      .map((tel) => {
        const cleaned = {};
        if (tel.residencial && typeof tel.residencial === "string" && tel.residencial.trim()) {
          cleaned.residencial = tel.residencial.trim();
        }
        if (tel.comercial && typeof tel.comercial === "string" && tel.comercial.trim()) {
          cleaned.comercial = tel.comercial.trim();
        }
        return cleaned;
      })
      .filter((tel) => Object.keys(tel).length > 0);

    // Se nenhum telefone foi preenchido, mantém a estrutura enviada
    if (payload.telefone.length === 0 && data.telefone?.length > 0) {
      payload.telefone = data.telefone;
    }
  }

  // Limpa e formata o array de endereços
  if (Array.isArray(payload.endereco)) {
    payload.endereco = payload.endereco.map((end) => ({
      logradouro: end.logradouro ? String(end.logradouro).trim() : "",
      numero: end.numero ? String(end.numero).trim() : "",
      complemento:
        end.complemento && String(end.complemento).trim()
          ? String(end.complemento).trim()
          : null,
      bairro: end.bairro ? String(end.bairro).trim() : "",
      cidade: end.cidade ? String(end.cidade).trim() : "",
      estado: end.estado ? String(end.estado).trim() : "",
      cep: end.cep ? String(end.cep).trim() : "",
    }));
  }

  return payload;
};

export const getClientes = async () => {
  try {
    const response = await api.get("/client");
    console.log("[Services/client] Clientes encontrados:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Services/client] Erro ao buscar clientes:", error);
    throw error;
  }
};

export const getCliente = async (id) => {
  try {
    const response = await api.get(`/client/${id}`);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao buscar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const getClienteById = getCliente;

export const getClientePorCpf = async (cpf) => {
  try {
    const response = await api.get(`/client/cpf/${cpf}`);
    console.log("[Services/client] Cliente encontrado:", response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao buscar cliente com CPF ${cpf}:`, error);
    throw error;
  }
};

export const getClienteByCpf = getClientePorCpf;

export const criarCliente = async (clienteData) => {
  try {
    const formattedData = sanitizeClientData(clienteData);
    console.log("[Services/client] Criando cliente:", formattedData);
    const response = await api.post("/client", formattedData);
    console.log("[Services/client] Cliente criado:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Services/client] Erro ao criar cliente:", error);
    throw error;
  }
};

export const createCliente = criarCliente;

export const atualizarCliente = async (id, clienteData) => {
  try {
    const formattedData = sanitizeClientData(clienteData);
    console.log("[Services/client] Atualizando cliente:", formattedData);
    const response = await api.put(`/client/${id}`, formattedData);
    console.log("[Services/client] Cliente atualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao atualizar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const updateCliente = atualizarCliente;

export const excluirCliente = async (id) => {
  try {
    console.log("[Services/client] Excluindo cliente com ID:", id);
    const response = await api.delete(`/client/${id}`);
    console.log("[Services/client] Cliente excluido:", response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao excluir cliente com ID ${id}:`, error);
    throw error;
  }
};

export const deleteCliente = excluirCliente;

/**
 * Retorna os top N clientes com mais vendas associadas.
 *
 * @param {Array} clientes - Lista de clientes
 * @param {Array} vendas - Lista de vendas
 * @param {number} limit - Quantidade máxima de clientes a retornar (padrão: 3)
 * @returns {Array} Lista ordenada dos top clientes com contagem e total
 */
export const getTopClientesPorVendas = (clientes = [], vendas = [], limit = 3) => {
  const clientesList = Array.isArray(clientes?.data)
    ? clientes.data
    : Array.isArray(clientes)
    ? clientes
    : [];

  const vendasList = Array.isArray(vendas?.data)
    ? vendas.data
    : Array.isArray(vendas)
    ? vendas
    : [];

  if (clientesList.length === 0) return [];

  const statsMap = new Map();

  clientesList.forEach((cli) => {
    const key = String(cli._id ?? cli.cpf ?? cli.nome);
    statsMap.set(key, {
      cliente: cli,
      nome: cli.nome || "Cliente sem nome",
      cpf: cli.cpf,
      _id: cli._id,
      totalVendas: 0,
      totalValor: 0,
    });
  });

  vendasList.forEach((v) => {
    const valor = Number(v.valor_venda || 0);
    const clientesNaVenda = Array.isArray(v.cliente)
      ? v.cliente
      : v.cliente
      ? [v.cliente]
      : [];

    clientesNaVenda.forEach((cliVenda) => {
      const cliRef =
        typeof cliVenda === "object" && cliVenda !== null
          ? cliVenda.cliente_id || cliVenda.cpf || cliVenda._id || cliVenda.id || cliVenda.nome
          : cliVenda;
      const cliNome =
        typeof cliVenda === "object" && cliVenda !== null ? cliVenda.nome : undefined;

      let matchedKey = null;
      for (const [key, item] of statsMap.entries()) {
        const c = item.cliente;
        if (
          (cliRef && (String(c._id) === String(cliRef) || String(c.cpf) === String(cliRef))) ||
          (cliNome && c.nome && c.nome.toLowerCase() === String(cliNome).toLowerCase())
        ) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        const item = statsMap.get(matchedKey);
        item.totalVendas += 1;
        item.totalValor += valor;
      }
    });
  });

  return Array.from(statsMap.values())
    .filter((item) => item.totalVendas > 0)
    .sort((a, b) => b.totalVendas - a.totalVendas || b.totalValor - a.totalValor)
    .slice(0, limit);
};

/**
 * Retorna a cidade com maior número de clientes cadastrados.
 *
 * @param {Array} clientes - Lista de clientes
 * @returns {{ cidade: string, total: number, percentual: number, ranking: Array }} Dados da cidade destaque
 */
export const getCidadeComMaisClientes = (clientes = []) => {
  const clientesList = Array.isArray(clientes?.data)
    ? clientes.data
    : Array.isArray(clientes)
    ? clientes
    : [];

  if (clientesList.length === 0) {
    return { cidade: "—", total: 0, percentual: 0, ranking: [] };
  }

  const cidadesCount = {};
  let totalComCidade = 0;

  clientesList.forEach((cli) => {
    const enderecos = Array.isArray(cli.endereco)
      ? cli.endereco
      : cli.endereco
      ? [cli.endereco]
      : [];

    const cidade = enderecos.find((e) => e?.cidade && String(e.cidade).trim())?.cidade;
    if (cidade) {
      const nomeCidade = String(cidade).trim();
      cidadesCount[nomeCidade] = (cidadesCount[nomeCidade] || 0) + 1;
      totalComCidade += 1;
    }
  });

  const entries = Object.entries(cidadesCount);
  if (entries.length === 0) {
    return { cidade: "—", total: 0, percentual: 0, ranking: [] };
  }

  entries.sort((a, b) => b[1] - a[1]);
  const [topCidade, count] = entries[0];
  const percentual =
    clientesList.length > 0 ? Math.round((count / clientesList.length) * 100) : 0;

  return {
    cidade: topCidade,
    total: count,
    percentual,
    ranking: entries.map(([cidade, total]) => ({ cidade, total })),
  };
};

/**
 * Calcula todas as estatísticas consolidadas de clientes.
 *
 * @param {Array} clientes - Lista de clientes
 * @param {Array} vendas - Lista de vendas
 * @returns {{ total: number, topClientes: Array, topCidade: object }} Estatísticas consolidadas
 */
export const getClientesStats = (clientes = [], vendas = []) => {
  const clientesList = Array.isArray(clientes?.data)
    ? clientes.data
    : Array.isArray(clientes)
    ? clientes
    : [];

  return {
    total: clientesList.length,
    topClientes: getTopClientesPorVendas(clientesList, vendas, 3),
    topCidade: getCidadeComMaisClientes(clientesList),
  };
};

