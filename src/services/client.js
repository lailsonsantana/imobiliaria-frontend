import api from "./index";

export const getClientes = async () => {
  try {
    const response = await api.get("/client");
    console.log('[Services/client] Clientes encontrados:', response.data);
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
    console.log('[Services/client] Cliente encontrado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao buscar cliente com CPF ${cpf}:`, error);
    throw error;
  }
};

export const getClienteByCpf = getClientePorCpf;

export const criarCliente = async (clienteData) => {
  try {
    console.log('[Services/client] Criando cliente:', clienteData);
    const response = await api.post("/client", clienteData);
    console.log('[Services/client] Cliente criado:', response.data);
    return response.data;
  } catch (error) {
    console.error("[Services/client] Erro ao criar cliente:", error);
    throw error;
  }
};

export const createCliente = criarCliente;

export const atualizarCliente = async (id, clienteData) => {
  try {
    console.log('[Services/client] Atualizando cliente:', clienteData);
    const response = await api.put(`/client/${id}`, clienteData);
    console.log('[Services/client] Cliente atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao atualizar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const updateCliente = atualizarCliente;

export const excluirCliente = async (id) => {
  try {
    console.log('[Services/client] Excluindo cliente com ID:', id);
    const response = await api.delete(`/client/${id}`);
    console.log('[Services/client] Cliente excluido:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[Services/client] Erro ao excluir cliente com ID ${id}:`, error);
    throw error;
  }
};

export const deleteCliente = excluirCliente;
