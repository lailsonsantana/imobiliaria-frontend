/**
 * Dados de fallback (mock) enquanto a API não está disponível.
 * Espelham a estrutura real do backend MongoDB (imobiliaria).
 */

export const clientes = [
  { _id: 1, nome: "Ana Paula Ferreira", cpf: "123.456.789-01", rg: "1234567", data_nascimento: "12/03/1985", profissao: "Engenheira", estado_civil: "Casado", telefone: [{ residencial: "(11) 98765-4321", comercial: "(11) 3344-5566" }], email: "ana.ferreira@email.com", endereco: [{ logradouro: "Rua das Acácias", numero: "120", complemento: null, bairro: "Alphaville", cidade: "Barueri", estado: "São Paulo", cep: "06453-100" }] },
  { _id: 2, nome: "Bruno Mendes Costa", cpf: "234.567.890-12", rg: "2345678", data_nascimento: "24/07/1978", profissao: "Médico", estado_civil: "Casado", telefone: [{ residencial: "(11) 97654-3210", comercial: "(11) 2233-4455" }], email: "bruno.costa@email.com", endereco: [{ logradouro: "Av. Paulista", numero: "800", complemento: "Ap 52", bairro: "Bela Vista", cidade: "São Paulo", estado: "São Paulo", cep: "01310-100" }] },
  { _id: 3, nome: "Carla Souza Lima", cpf: "345.678.901-23", rg: "3456789", data_nascimento: "05/11/1990", profissao: "Professora", estado_civil: "Solteiro", telefone: [{ residencial: "(11) 96543-2109", comercial: null }], email: "carla.lima@email.com", endereco: [{ logradouro: "Rua das Orquídeas", numero: "45", complemento: null, bairro: "Jardim Flamboyant", cidade: "Campinas", estado: "São Paulo", cep: "13080-050" }] },
  { _id: 4, nome: "Diego Rocha Nunes", cpf: "456.789.012-34", rg: "4567890", data_nascimento: "18/01/1982", profissao: "Advogado", estado_civil: "Divorciado", telefone: [{ residencial: "(11) 95432-1098", comercial: "(11) 5566-7788" }], email: "diego.nunes@email.com", endereco: [{ logradouro: "Rua Goiás", numero: "230", complemento: "Casa 2", bairro: "Setor Bueno", cidade: "Goiânia", estado: "Goiás", cep: "74230-020" }] },
  { _id: 5, nome: "Eliane Martins Pinto", cpf: "567.890.123-45", rg: "5678901", data_nascimento: "30/06/1995", profissao: "Farmacêutica", estado_civil: "Solteiro", telefone: [{ residencial: "(11) 94321-0987", comercial: null }], email: "eliane.pinto@email.com", endereco: [{ logradouro: "Rua Monsenhor Bruno", numero: "310", complemento: null, bairro: "Meireles", cidade: "Fortaleza", estado: "Ceará", cep: "60165-121" }] },
  { _id: 6, nome: "Fábio Alves Santos", cpf: "678.901.234-56", rg: "6789012", data_nascimento: "14/09/1975", profissao: "Contador", estado_civil: "Casado", telefone: [{ residencial: "(11) 93210-9876", comercial: "(11) 6677-8899" }], email: "fabio.santos@email.com", endereco: [{ logradouro: "Rua XV de Novembro", numero: "500", complemento: "Sala 3", bairro: "Centro", cidade: "Curitiba", estado: "Paraná", cep: "80520-060" }] },
  { _id: 7, nome: "Gabriela Cruz Ramos", cpf: "789.012.345-67", rg: "7890123", data_nascimento: "22/04/1988", profissao: "Arquiteta", estado_civil: "Casado", telefone: [{ residencial: "(11) 92109-8765", comercial: null }], email: "gabriela.ramos@email.com", endereco: [{ logradouro: "Alameda Santos", numero: "220", complemento: "Ap 31", bairro: "Jardins", cidade: "São Paulo", estado: "São Paulo", cep: "01419-000" }] },
  { _id: 8, nome: "Henrique Lima Borges", cpf: "890.123.456-78", rg: "8901234", data_nascimento: "03/12/1970", profissao: "Empresário", estado_civil: "Viuvo", telefone: [{ residencial: "(11) 91098-7654", comercial: "(11) 7788-9900" }], email: "henrique.borges@email.com", endereco: [{ logradouro: "Rua Voluntários da Pátria", numero: "88", complemento: null, bairro: "Centro", cidade: "Curitiba", estado: "Paraná", cep: "80020-010" }] },
  { _id: 9, nome: "Isabela Gomes Dias", cpf: "901.234.567-89", rg: "9012345", data_nascimento: "17/08/1993", profissao: "Dentista", estado_civil: "Solteiro", telefone: [{ residencial: "(11) 90987-6543", comercial: null }], email: "isabela.dias@email.com", endereco: [{ logradouro: "Rua Barão de Studart", numero: "150", complemento: null, bairro: "Aldeota", cidade: "Fortaleza", estado: "Ceará", cep: "60120-001" }] },
  { _id: 10, nome: "João Victor Teixeira", cpf: "012.345.678-90", rg: "0123456", data_nascimento: "28/02/1980", profissao: "Arquiteto", estado_civil: "Divorciado", telefone: [{ residencial: "(11) 99876-5432", comercial: "(11) 8899-0011" }], email: "joao.teixeira@email.com", endereco: [{ logradouro: "Rua Padre Vieira", numero: "400", complemento: null, bairro: "Consolação", cidade: "São Paulo", estado: "São Paulo", cep: "01224-000" }] },
];

export const empreendimentos = [
  {
    _id: 1, nome: "Residencial Vista Verde", bairro: "Alphaville", cidade: "Barueri", estado: "SP", cep: "06453-000",
    unidade_imobiliaria: [
      { _id: 1, numero: "1", quadra: "A", valor: 320000, area: 180, tipo: "Casa", status: "Vendido", cliente: [{ cliente_id: "123.456.789-01", nome: "Ana Paula Ferreira" }] },
      { _id: 2, numero: "2", quadra: "A", valor: 310000, area: 175, tipo: "Casa", status: "Vendido", cliente: [{ cliente_id: "234.567.890-12", nome: "Bruno Mendes Costa" }] },
      { _id: 3, numero: "3", quadra: "A", valor: 290000, area: 160, tipo: "Casa", status: "Vendido", cliente: [{ cliente_id: "345.678.901-23", nome: "Carla Souza Lima" }] },
      { _id: 4, numero: "4", quadra: "B", valor: 340000, area: 200, tipo: "Casa", status: "Reservado", cliente: [] },
      { _id: 5, numero: "5", quadra: "B", valor: 280000, area: 155, tipo: "Casa", status: "Em aberto", cliente: [] },
      { _id: 6, numero: "6", quadra: "B", valor: 295000, area: 162, tipo: "Casa", status: "Em aberto", cliente: [] },
      { _id: 7, numero: "7", quadra: "C", valor: 315000, area: 178, tipo: "Casa", status: "Distratado", cliente: [] },
      { _id: 8, numero: "8", quadra: "C", valor: 330000, area: 190, tipo: "Casa", status: "Em aberto", cliente: [] },
    ]
  },
  {
    _id: 2, nome: "Condomínio Solar das Flores", bairro: "Jardim Paulista", cidade: "São Paulo", estado: "SP", cep: "01427-000",
    unidade_imobiliaria: [
      { _id: 9, numero: "101", quadra: "T1", valor: 480000, area: 90, tipo: "Apartamento", status: "Vendido", cliente: [{ cliente_id: "456.789.012-34", nome: "Diego Rocha Nunes" }] },
      { _id: 10, numero: "102", quadra: "T1", valor: 450000, area: 85, tipo: "Apartamento", status: "Vendido", cliente: [{ cliente_id: "567.890.123-45", nome: "Eliane Martins Pinto" }] },
      { _id: 11, numero: "103", quadra: "T1", valor: 460000, area: 87, tipo: "Apartamento", status: "Vendido", cliente: [{ cliente_id: "678.901.234-56", nome: "Fábio Alves Santos" }] },
      { _id: 12, numero: "104", quadra: "T2", valor: 490000, area: 92, tipo: "Apartamento", status: "Vendido", cliente: [] },
      { _id: 13, numero: "105", quadra: "T2", valor: 430000, area: 80, tipo: "Apartamento", status: "Reservado", cliente: [] },
      { _id: 14, numero: "106", quadra: "T2", valor: 440000, area: 82, tipo: "Apartamento", status: "Em aberto", cliente: [] },
      { _id: 15, numero: "107", quadra: "T3", valor: 510000, area: 98, tipo: "Apartamento", status: "Distratado", cliente: [] },
    ]
  },
  {
    _id: 3, nome: "Loteamento Bela Morada", bairro: "Parque Eldorado", cidade: "Campinas", estado: "SP", cep: "13080-000",
    unidade_imobiliaria: [
      { _id: 16, numero: "1", quadra: "Q1", valor: 95000, area: 300, tipo: "Lote", status: "Vendido", cliente: [{ cliente_id: "789.012.345-67", nome: "Gabriela Cruz Ramos" }] },
      { _id: 17, numero: "2", quadra: "Q1", valor: 98000, area: 312, tipo: "Lote", status: "Vendido", cliente: [{ cliente_id: "890.123.456-78", nome: "Henrique Lima Borges" }] },
      { _id: 18, numero: "3", quadra: "Q1", valor: 90000, area: 290, tipo: "Lote", status: "Vendido", cliente: [] },
      { _id: 19, numero: "4", quadra: "Q2", valor: 102000, area: 320, tipo: "Lote", status: "Reservado", cliente: [] },
      { _id: 20, numero: "5", quadra: "Q2", valor: 85000, area: 275, tipo: "Lote", status: "Em aberto", cliente: [] },
      { _id: 21, numero: "6", quadra: "Q2", valor: 88000, area: 280, tipo: "Lote", status: "Em aberto", cliente: [] },
      { _id: 22, numero: "7", quadra: "Q3", valor: 93000, area: 295, tipo: "Lote", status: "Em aberto", cliente: [] },
      { _id: 23, numero: "8", quadra: "Q3", valor: 97000, area: 305, tipo: "Lote", status: "Distratado", cliente: [] },
    ]
  },
  {
    _id: 4, nome: "Parque Residencial Aurora", bairro: "Setor Bueno", cidade: "Goiânia", estado: "GO", cep: "74230-020",
    unidade_imobiliaria: [
      { _id: 24, numero: "1", quadra: "S1", valor: 260000, area: 140, tipo: "Casa", status: "Vendido", cliente: [] },
      { _id: 25, numero: "2", quadra: "S1", valor: 245000, area: 132, tipo: "Casa", status: "Vendido", cliente: [{ cliente_id: "901.234.567-89", nome: "Isabela Gomes Dias" }] },
      { _id: 26, numero: "3", quadra: "S2", valor: 270000, area: 148, tipo: "Casa", status: "Em aberto", cliente: [] },
      { _id: 27, numero: "4", quadra: "S2", valor: 255000, area: 136, tipo: "Casa", status: "Em aberto", cliente: [] },
      { _id: 28, numero: "5", quadra: "S3", valor: 240000, area: 128, tipo: "Casa", status: "Distratado", cliente: [] },
      { _id: 29, numero: "6", quadra: "S3", valor: 265000, area: 142, tipo: "Casa", status: "Reservado", cliente: [] },
    ]
  },
  {
    _id: 5, nome: "Edifício Horizonte Azul", bairro: "Meireles", cidade: "Fortaleza", estado: "CE", cep: "60165-121",
    unidade_imobiliaria: [
      { _id: 30, numero: "201", quadra: "BL1", valor: 380000, area: 75, tipo: "Apartamento", status: "Vendido", cliente: [] },
      { _id: 31, numero: "202", quadra: "BL1", valor: 365000, area: 72, tipo: "Apartamento", status: "Vendido", cliente: [] },
      { _id: 32, numero: "203", quadra: "BL1", valor: 390000, area: 77, tipo: "Apartamento", status: "Vendido", cliente: [] },
      { _id: 33, numero: "204", quadra: "BL2", valor: 400000, area: 80, tipo: "Apartamento", status: "Vendido", cliente: [] },
      { _id: 34, numero: "205", quadra: "BL2", valor: 370000, area: 74, tipo: "Apartamento", status: "Reservado", cliente: [] },
      { _id: 35, numero: "206", quadra: "BL2", valor: 355000, area: 70, tipo: "Apartamento", status: "Em aberto", cliente: [] },
      { _id: 36, numero: "207", quadra: "BL3", valor: 410000, area: 82, tipo: "Apartamento", status: "Em aberto", cliente: [] },
      { _id: 37, numero: "208", quadra: "BL3", valor: 395000, area: 78, tipo: "Apartamento", status: "Em aberto", cliente: [] },
      { _id: 38, numero: "209", quadra: "BL3", valor: 420000, area: 85, tipo: "Apartamento", status: "Distratado", cliente: [] },
    ]
  },
  {
    _id: 6, nome: "Vila das Palmeiras", bairro: "Bom Retiro", cidade: "Curitiba", estado: "PR", cep: "80520-060",
    unidade_imobiliaria: [
      { _id: 39, numero: "1", quadra: "V1", valor: 210000, area: 200, tipo: "Lote", status: "Vendido", cliente: [] },
      { _id: 40, numero: "2", quadra: "V1", valor: 215000, area: 205, tipo: "Lote", status: "Vendido", cliente: [{ cliente_id: "012.345.678-90", nome: "João Victor Teixeira" }] },
      { _id: 41, numero: "3", quadra: "V2", valor: 220000, area: 210, tipo: "Lote", status: "Em aberto", cliente: [] },
      { _id: 42, numero: "4", quadra: "V2", valor: 205000, area: 195, tipo: "Lote", status: "Em aberto", cliente: [] },
      { _id: 43, numero: "5", quadra: "V3", valor: 225000, area: 215, tipo: "Lote", status: "Distratado", cliente: [] },
    ]
  },
];

export const vendedores = [
  { _id: 1, nome: "Marcos Vinicius Pereira", cpf: "111.222.333-44", telefone: "(11) 99111-2233", creci: "CR0001", vendas: [{ venda_id: 1, data_venda: "15/01/2023", valor_venda: 320000, comissao: 3200, data_recebimento_comissao: "15/02/2023" }, { venda_id: 2, data_venda: "10/03/2023", valor_venda: 310000, comissao: 3100, data_recebimento_comissao: "10/04/2023" }] },
  { _id: 2, nome: "Patrícia Lopes Figueira", cpf: "222.333.444-55", telefone: "(11) 99222-3344", creci: "CR0002", vendas: [{ venda_id: 3, data_venda: "25/05/2023", valor_venda: 290000, comissao: 2900, data_recebimento_comissao: "25/06/2023" }, { venda_id: 4, data_venda: "05/07/2023", valor_venda: 480000, comissao: 4800, data_recebimento_comissao: "05/08/2023" }] },
  { _id: 3, nome: "Ricardo Azevedo Melo", cpf: "333.444.555-66", telefone: "(11) 99333-4455", creci: "CR0003", vendas: [{ venda_id: 5, data_venda: "20/08/2023", valor_venda: 450000, comissao: 4500, data_recebimento_comissao: "20/09/2023" }, { venda_id: 6, data_venda: "05/10/2023", valor_venda: 460000, comissao: 4600, data_recebimento_comissao: "05/11/2023" }] },
  { _id: 4, nome: "Simone Barbosa Cunha", cpf: "444.555.666-77", telefone: "(11) 99444-5566", creci: "CR0004", vendas: [{ venda_id: 7, data_venda: "15/01/2024", valor_venda: 95000, comissao: 950, data_recebimento_comissao: "15/02/2024" }, { venda_id: 8, data_venda: "25/02/2024", valor_venda: 98000, comissao: 980, data_recebimento_comissao: "25/03/2024" }] },
  { _id: 5, nome: "Tiago Nascimento Freitas", cpf: "555.666.777-88", telefone: "(11) 99555-6677", creci: "CR0005", vendas: [{ venda_id: 9, data_venda: "10/04/2024", valor_venda: 260000, comissao: 2600, data_recebimento_comissao: "10/05/2024" }, { venda_id: 10, data_venda: "05/06/2024", valor_venda: 210000, comissao: 2100, data_recebimento_comissao: "05/07/2024" }] },
];

export const vendas = [
  { _id: 1, vendedor: { vendedor_id: 1, nome: "Marcos Vinicius Pereira" }, data_venda: "15/01/2023", data_pagamento_entrada: "10/01/2023", quantidade_parcelas: 6, valor_entrada: 32000, valor_venda: 320000, comissao_vendedor: 3200, comissao_data_recebimento: "15/02/2023", status: "Liquidado", unidade_imobiliaria: { empreendimento_id: 1, unidade_imobiliaria_id: 1, valor_total: 320000 }, cliente: [{ cliente_id: "123.456.789-01", nome: "Ana Paula Ferreira", responsavel_financeiro: true }], parcela: [{ _id: 1, data_vencimento: "15/02/2023", data_pagamento: "15/02/2023", valor_parcela: 48000, juros: 0, forma_pagamento: "Boleto" }, { _id: 2, data_vencimento: "15/03/2023", data_pagamento: "15/03/2023", valor_parcela: 48000, juros: 0, forma_pagamento: "Boleto" }] },
  { _id: 2, vendedor: { vendedor_id: 1, nome: "Marcos Vinicius Pereira" }, data_venda: "10/03/2023", data_pagamento_entrada: "05/03/2023", quantidade_parcelas: 10, valor_entrada: 31000, valor_venda: 310000, comissao_vendedor: 3100, comissao_data_recebimento: "10/04/2023", status: "Financiado", unidade_imobiliaria: { empreendimento_id: 1, unidade_imobiliaria_id: 2, valor_total: 310000 }, cliente: [{ cliente_id: "234.567.890-12", nome: "Bruno Mendes Costa", responsavel_financeiro: true }, { cliente_id: "123.456.789-01", nome: "Ana Paula Ferreira", responsavel_financeiro: false }], parcela: [] },
  { _id: 3, vendedor: { vendedor_id: 2, nome: "Patrícia Lopes Figueira" }, data_venda: "25/05/2023", data_pagamento_entrada: "20/05/2023", quantidade_parcelas: 8, valor_entrada: 29000, valor_venda: 290000, comissao_vendedor: 2900, comissao_data_recebimento: "25/06/2023", status: "Distratado", unidade_imobiliaria: { empreendimento_id: 1, unidade_imobiliaria_id: 3, valor_total: 290000 }, cliente: [{ cliente_id: "345.678.901-23", nome: "Carla Souza Lima", responsavel_financeiro: true }], parcela: [] },
  { _id: 4, vendedor: { vendedor_id: 2, nome: "Patrícia Lopes Figueira" }, data_venda: "05/07/2023", data_pagamento_entrada: "01/07/2023", quantidade_parcelas: 0, valor_entrada: 480000, valor_venda: 480000, comissao_vendedor: 4800, comissao_data_recebimento: "05/08/2023", status: "Liquidado", unidade_imobiliaria: { empreendimento_id: 2, unidade_imobiliaria_id: 9, valor_total: 480000 }, cliente: [{ cliente_id: "456.789.012-34", nome: "Diego Rocha Nunes", responsavel_financeiro: true }], parcela: [] },
  { _id: 5, vendedor: { vendedor_id: 3, nome: "Ricardo Azevedo Melo" }, data_venda: "20/08/2023", data_pagamento_entrada: "15/08/2023", quantidade_parcelas: 6, valor_entrada: 45000, valor_venda: 450000, comissao_vendedor: 4500, comissao_data_recebimento: "20/09/2023", status: "Financiado", unidade_imobiliaria: { empreendimento_id: 2, unidade_imobiliaria_id: 10, valor_total: 450000 }, cliente: [{ cliente_id: "567.890.123-45", nome: "Eliane Martins Pinto", responsavel_financeiro: true }], parcela: [] },
  { _id: 6, vendedor: { vendedor_id: 3, nome: "Ricardo Azevedo Melo" }, data_venda: "05/10/2023", data_pagamento_entrada: "01/10/2023", quantidade_parcelas: 10, valor_entrada: 46000, valor_venda: 460000, comissao_vendedor: 4600, comissao_data_recebimento: "05/11/2023", status: "Transferido", unidade_imobiliaria: { empreendimento_id: 2, unidade_imobiliaria_id: 11, valor_total: 460000 }, cliente: [{ cliente_id: "678.901.234-56", nome: "Fábio Alves Santos", responsavel_financeiro: true }], parcela: [] },
  { _id: 7, vendedor: { vendedor_id: 4, nome: "Simone Barbosa Cunha" }, data_venda: "15/01/2024", data_pagamento_entrada: "10/01/2024", quantidade_parcelas: 4, valor_entrada: 19000, valor_venda: 95000, comissao_vendedor: 950, comissao_data_recebimento: "15/02/2024", status: "Liquidado", unidade_imobiliaria: { empreendimento_id: 3, unidade_imobiliaria_id: 16, valor_total: 95000 }, cliente: [{ cliente_id: "789.012.345-67", nome: "Gabriela Cruz Ramos", responsavel_financeiro: true }], parcela: [] },
  { _id: 8, vendedor: { vendedor_id: 4, nome: "Simone Barbosa Cunha" }, data_venda: "25/02/2024", data_pagamento_entrada: "20/02/2024", quantidade_parcelas: 6, valor_entrada: 19600, valor_venda: 98000, comissao_vendedor: 980, comissao_data_recebimento: "25/03/2024", status: "Financiado", unidade_imobiliaria: { empreendimento_id: 3, unidade_imobiliaria_id: 17, valor_total: 98000 }, cliente: [{ cliente_id: "890.123.456-78", nome: "Henrique Lima Borges", responsavel_financeiro: true }], parcela: [] },
  { _id: 9, vendedor: { vendedor_id: 5, nome: "Tiago Nascimento Freitas" }, data_venda: "10/04/2024", data_pagamento_entrada: "05/04/2024", quantidade_parcelas: 8, valor_entrada: 26000, valor_venda: 260000, comissao_vendedor: 2600, comissao_data_recebimento: "10/05/2024", status: "Liquidado", unidade_imobiliaria: { empreendimento_id: 4, unidade_imobiliaria_id: 25, valor_total: 260000 }, cliente: [{ cliente_id: "901.234.567-89", nome: "Isabela Gomes Dias", responsavel_financeiro: true }], parcela: [] },
  { _id: 10, vendedor: { vendedor_id: 5, nome: "Tiago Nascimento Freitas" }, data_venda: "05/06/2024", data_pagamento_entrada: "01/06/2024", quantidade_parcelas: 5, valor_entrada: 21000, valor_venda: 210000, comissao_vendedor: 2100, comissao_data_recebimento: "05/07/2024", status: "Financiado", unidade_imobiliaria: { empreendimento_id: 6, unidade_imobiliaria_id: 40, valor_total: 210000 }, cliente: [{ cliente_id: "012.345.678-90", nome: "João Victor Teixeira", responsavel_financeiro: true }], parcela: [] },
];

/** Todas as unidades imobiliárias (flat list) derivada dos empreendimentos */
export const unidades = empreendimentos.flatMap((emp) =>
  emp.unidade_imobiliaria.map((u) => ({
    ...u,
    empreendimento_id: emp._id,
    empreendimento_nome: emp.nome,
    empreendimento_cidade: emp.cidade,
    empreendimento_estado: emp.estado,
  }))
);

/** Helpers de formatação */
export const fmt = {
  currency: (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v),
  number: (v) =>
    new Intl.NumberFormat("pt-BR").format(v),
};
