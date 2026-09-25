import api from "./index";

export const getUnidadesImobiliarias = async () => {
  try {
    const response = await api.get("/unidades");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar unidades imobiliárias:", error);
    throw error;
  }
};

export const getUnidadesImobiliarisById = async (id) => {
  try {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar unidade com ID ${id}:`, error);
    throw error;
  }
};

export const createUnidadesImobiliaris = async (unidadeData) => {
  try {
    const response = await api.post("/unidades", unidadeData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar unidade:", error);
    throw error;
  }
};

export const updateUnidadesImobiliaris = async (id, unidadeData) => {
  try {
    const response = await api.put(
      `/unidades/${id}`,
      unidadeData,
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar unidade com ID ${id}:`, error);
    throw error;
  }
};

export const deleteUnidadesImobiliaris = async (id) => {
  try {
    const response = await api.delete(`/unidades/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar unidade com ID ${id}:`, error);
    throw error;
  }
};
