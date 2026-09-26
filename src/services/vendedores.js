import api from "./index";

// 1. Limpeza dos dados
const sanitizeVendedorData = (data) => {
  const payload = { ...data };
  if (payload.cpf) payload.cpf = payload.cpf.replace(/\D/g, '');
  if (payload.telefone) payload.telefone = payload.telefone.replace(/\D/g, '');
  
  // Opcional, mas recomendado: forçar o CRECI a ficar em maiúsculas (ex: cr123 -> CR123)
  if (payload.creci) payload.creci = payload.creci.trim().toUpperCase();
  
  return payload;
};

// 2. NOVA FUNÇÃO: Validação estrita do Frontend
const validarRegrasFrontend = (data) => {
  if (!data.creci) return; // Se por algum motivo não houver CRECI, ignora
  
  // A Expressão Regular (Regex) diz: Começa com "CR" (maiúsculo ou minúsculo) 
  // seguido de, no mínimo, 1 número e, no máximo, 6 números.
  const creciRegex = /^CR\d{1,6}$/i; 
  
  if (!creciRegex.test(data.creci.trim())) {
    // A mensagem de erro agora também avisa sobre o limite de números
    throw new Error("CRECI inválido. Deve começar por 'CR' seguido de 1 a 6 números no máximo (Ex: CR12345).");
  }
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
    const response = await api.get(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vendedor por id ${id}:`, error);
    throw error;
  }
};

export const createVendedor = async (vendedor) => {
  try {
    validarRegrasFrontend(vendedor); // Bloqueia antes mesmo de tentar formatar!
    
    const formatado = sanitizeVendedorData(vendedor);
    const response = await api.post("/vendedor", formatado);
    return response.data;
  } catch (error) {
    console.error("Erro do backend ao CRIAR:", error.response?.data || error.message);
    throw error; // Repassa o erro para o FormButton exibir
  }
};

export const updateVendedor = async (id, vendedor) => {
  try {
    validarRegrasFrontend(vendedor); // Bloqueia edições inválidas!
    
    const formatado = sanitizeVendedorData(vendedor);
    
    // Mantenha o verbo que funcionou para si no último teste (patch ou put)
    const response = await api.patch(`/vendedor/${id}`, formatado); 
    return response.data;
  } catch (error) {
    console.error(`Erro do backend ao ATUALIZAR id ${id}:`, error.response?.data || error.message);
    throw error; // Repassa o erro para o FormButton exibir
  }
};

export const deleteVendedor = async (id) => {
  try {
    const response = await api.delete(`/vendedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro do backend ao DELETAR id ${id}:`, error.response?.data || error.message);
    throw error;
  }
};