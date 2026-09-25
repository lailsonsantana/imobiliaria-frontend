import api from "./index";

export const getEmpreendimentos = async () => {
  try {
    const response = await api.get("/empreendimentos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empreendimentos:", error);
    throw error;
  }
};

export const getEmpreendimentoById = async (id) => {
  try {
    const response = await api.get(`/empreendimentos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar empreendimento com ID ${id}:`, error);
    throw error;
  }
};

export const createEmpreendimento = async (empreendimentoData) => {
  try {
    const response = await api.post("/empreendimentos", empreendimentoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar empreendimento:", error);
    throw error;
  }
};

export const updateEmpreendimento = async (id, empreendimentoData) => {
  try {
    const response = await api.put(
      `/empreendimentos/${id}`,
      empreendimentoData,
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar empreendimento com ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmpreendimento = async (id) => {
  try {
    const response = await api.delete(`/empreendimentos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar empreendimento com ID ${id}:`, error);
    throw error;
  }
};
