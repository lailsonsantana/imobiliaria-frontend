import api from "./index";

export const UNIDADES_FIELDS = [
    {
      name: "empreendimento_id",
      label: "Empreendimento",
      type: "select",
      options: [],
      required: true,
      placeholder: "Selecione um empreendimento",
    },
  { name: "numero", label: "Número", type: "text" },
  { name: "quadra", label: "Quadra", type: "text" },
  {
    name: "tipo",
    label: "Tipo",
    type: "select",
    default:"casa",
    options: ["casa", "Apartamento", "Lote"],
  },
  { name: "area", label: "Área (m²)", type: "number" },
  { name: "valor", label: "Valor (R$)", type: "number" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Vendido", "Reservado", "Em aberto", "Distratado"],
    defaultValue: "Vendido",
  },
];

export const unidadesToFormValues = (unidade) => {
  return {
    numero: unidade.numero,
    quadra: unidade.quadra,
    tipo: unidade.tipo,
    area: unidade.area,
    valor: unidade.valor,
    status: unidade.status,
  };
};

export const buildUnidadesFields = (
  empreendimentos = [],
  { omitFields = [] } = {},
) =>
  UNIDADES_FIELDS.filter((field) => !omitFields.includes(field.name)).map(
    (field) =>
      field.name === "empreendimento_id"
        ? {
            ...field,
            options: empreendimentos.map((e) => ({
              label: e.nome,
              value: e._id,
            })),
          }
        : field,
  );
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
    const response = await api.patch(`/unidades/${id}`, unidadeData);
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
