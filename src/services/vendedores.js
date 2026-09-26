import api from "./index";

export const getVendedores = async () => {
  try {
    const response = await api.get("/vendedor");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    throw error;
  }
};

export const getVendedorById = async (id) => {
  try {
    const response = await api.get(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vendas por id ${id}:`, error);
    throw error;
  }
};

export const createVendedor = async (vendedor) => {
  try {
    const response = await api.post("/vendedor", vendedor);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    throw error;
  }
};

export const updateVendedor = async (id, vendedor) => {
  try {
    const response = await api.put(
      `/vendedor/${id}`,
      vendedor,
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar venda por id ${id}:`, error);
    throw error;
  }
};

export const deleteVendedor = async (id) => {
  try {
    const response = await api.delete(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar venda por id ${id}:`, error);
    throw error;
  }
};

