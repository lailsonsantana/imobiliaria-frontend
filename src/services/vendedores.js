import api from "./index";

// 1. Função de sanitização (remove máscara de CPF e Telefone)
const sanitizeVendedorData = (data) => {
  const payload = { ...data };
  if (payload.cpf) payload.cpf = payload.cpf.replace(/\D/g, '');
  if (payload.telefone) payload.telefone = payload.telefone.replace(/\D/g, '');
  return payload;
};

export const getVendedores = async () => {
  try {
    const response = await api.get("/vendedor");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendedores:", error);
    throw error;
  }
};

export const getVendedorById = async (id) => {
  try {
    // GET apenas busca pelo ID, não precisa sanitizar nada aqui
    const response = await api.get(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vendedor por id ${id}:`, error);
    throw error;
  }
};

export const createVendedor = async (vendedor) => {
  try {
    // 2. Aplica a sanitização ANTES de enviar (POST)
    const formatado = sanitizeVendedorData(vendedor); 
    const response = await api.post("/vendedor", formatado);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar vendedor:", error);
    throw error;
  }
};

export const updateVendedor = async (id, vendedor) => {
  try {
    // 3. Aplica a sanitização ANTES de enviar (PUT)
    const formatado = sanitizeVendedorData(vendedor);
    const response = await api.put(`/vendedor/${id}`, formatado);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vendedor por id ${id}:`, error);
    throw error;
  }
};

export const deleteVendedor = async (id) => {
  try {
    const response = await api.delete(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar vendedor por id ${id}:`, error);
    throw error;
  }
};