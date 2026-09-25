import api from "./index";

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