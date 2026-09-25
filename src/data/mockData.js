const unit = (id, number, block, price, area, type, status, clients = []) => ({
  _id: id,
  numero: number,
  quadra: block,
  valor: price,
  area,
  tipo: type,
  status,
  cliente: clients,
});

export const CLIENTES = [
  { _id: 1, nome: "Ana Paula Ferreira", cpf: "123.456.789-01", profissao: "Engenheira", estado_civil: "Casado", email: "ana.ferreira@email.com", telefone: [{ residencial: "(11) 98765-4321", comercial: "(11) 3344-5566" }] },
  { _id: 2, nome: "Bruno Mendes Costa", cpf: "234.567.890-12", profissao: "Médico", estado_civil: "Casado", email: "bruno.costa@email.com", telefone: [{ residencial: "(11) 97654-3210", comercial: "(11) 2233-4455" }] },
  { _id: 3, nome: "Carla Souza Lima", cpf: "345.678.901-23", profissao: "Professora", estado_civil: "Solteiro", email: "carla.lima@email.com", telefone: [{ residencial: "(11) 96543-2109", comercial: null }] },
  { _id: 4, nome: "Diego Rocha Nunes", cpf: "456.789.012-34", profissao: "Advogado", estado_civil: "Divorciado", email: "diego.nunes@email.com", telefone: [{ residencial: "(11) 95432-1098", comercial: "(11) 5566-7788" }] },
  { _id: 5, nome: "Eliane Martins Pinto", cpf: "567.890.123-45", profissao: "Farmacêutica", estado_civil: "Solteiro", email: "eliane.pinto@email.com", telefone: [{ residencial: "(11) 94321-0987", comercial: null }] },
  { _id: 6, nome: "Fábio Alves Santos", cpf: "678.901.234-56", profissao: "Contador", estado_civil: "Casado", email: "fabio.santos@email.com", telefone: [{ residencial: "(11) 93210-9876", comercial: "(11) 6677-8899" }] },
  { _id: 7, nome: "Gabriela Cruz Ramos", cpf: "789.012.345-67", profissao: "Arquiteta", estado_civil: "Casado", email: "gabriela.ramos@email.com", telefone: [{ residencial: "(11) 92109-8765", comercial: null }] },
  { _id: 8, nome: "Henrique Lima Borges", cpf: "890.123.456-78", profissao: "Empresário", estado_civil: "Viuvo", email: "henrique.borges@email.com", telefone: [{ residencial: "(11) 91098-7654", comercial: "(11) 7788-9900" }] },
  { _id: 9, nome: "Isabela Gomes Dias", cpf: "901.234.567-89", profissao: "Dentista", estado_civil: "Solteiro", email: "isabela.dias@email.com", telefone: [{ residencial: "(11) 90987-6543", comercial: null }] },
  { _id: 10, nome: "João Victor Teixeira", cpf: "012.345.678-90", profissao: "Arquiteto", estado_civil: "Divorciado", email: "joao.teixeira@email.com", telefone: [{ residencial: "(11) 99876-5432", comercial: "(11) 8899-0011" }] },
];

export const EMPREENDIMENTOS = [
  { _id: 1, nome: "Residencial Vista Verde", bairro: "Alphaville", cidade: "Barueri", estado: "SP", unidade_imobiliaria: [
    unit(1, "1", "A", 320000, 180, "Casa", "Vendido", ["123.456.789-01"]),
    unit(2, "2", "A", 310000, 175, "Casa", "Vendido", ["234.567.890-12", "123.456.789-01"]),
    unit(3, "3", "A", 290000, 160, "Casa", "Distratado", ["345.678.901-23"]),
    unit(4, "4", "B", 340000, 200, "Casa", "Reservado"),
    unit(5, "5", "B", 280000, 155, "Casa", "Em aberto"),
    unit(6, "6", "B", 295000, 162, "Casa", "Em aberto"),
    unit(7, "7", "C", 315000, 178, "Casa", "Distratado"),
    unit(8, "8", "C", 330000, 190, "Casa", "Em aberto"),
  ] },
  { _id: 2, nome: "Condomínio Solar das Flores", bairro: "Jardim Paulista", cidade: "São Paulo", estado: "SP", unidade_imobiliaria: [
    unit(9, "101", "T1", 480000, 90, "Apartamento", "Vendido", ["456.789.012-34"]),
    unit(10, "102", "T1", 450000, 85, "Apartamento", "Vendido", ["567.890.123-45"]),
    unit(11, "103", "T1", 460000, 87, "Apartamento", "Vendido", ["678.901.234-56"]),
    unit(12, "104", "T2", 490000, 92, "Apartamento", "Vendido"),
    unit(13, "105", "T2", 430000, 80, "Apartamento", "Reservado"),
    unit(14, "106", "T2", 440000, 82, "Apartamento", "Em aberto"),
    unit(15, "107", "T3", 510000, 98, "Apartamento", "Distratado"),
  ] },
  { _id: 3, nome: "Loteamento Bela Morada", bairro: "Parque Eldorado", cidade: "Campinas", estado: "SP", unidade_imobiliaria: [
    unit(16, "1", "Q1", 95000, 300, "Lote", "Vendido", ["789.012.345-67"]),
    unit(17, "2", "Q1", 98000, 312, "Lote", "Vendido", ["890.123.456-78"]),
    unit(18, "3", "Q1", 90000, 290, "Lote", "Vendido"),
    unit(19, "4", "Q2", 102000, 320, "Lote", "Reservado"),
    unit(20, "5", "Q2", 85000, 275, "Lote", "Em aberto"),
    unit(21, "6", "Q2", 88000, 280, "Lote", "Em aberto"),
    unit(22, "7", "Q3", 93000, 295, "Lote", "Em aberto"),
    unit(23, "8", "Q3", 97000, 305, "Lote", "Distratado"),
  ] },
  { _id: 4, nome: "Parque Residencial Aurora", bairro: "Setor Bueno", cidade: "Goiânia", estado: "GO", unidade_imobiliaria: [
    unit(24, "1", "S1", 260000, 140, "Casa", "Vendido"),
    unit(25, "2", "S1", 245000, 132, "Casa", "Vendido", ["901.234.567-89"]),
    unit(26, "3", "S2", 270000, 148, "Casa", "Em aberto"),
    unit(27, "4", "S2", 255000, 136, "Casa", "Em aberto"),
    unit(28, "5", "S3", 240000, 128, "Casa", "Distratado"),
    unit(29, "6", "S3", 265000, 142, "Casa", "Reservado"),
  ] },
  { _id: 5, nome: "Edifício Horizonte Azul", bairro: "Meireles", cidade: "Fortaleza", estado: "CE", unidade_imobiliaria: [
    unit(30, "201", "BL1", 380000, 75, "Apartamento", "Vendido"),
    unit(31, "202", "BL1", 365000, 72, "Apartamento", "Vendido"),
    unit(32, "203", "BL1", 390000, 77, "Apartamento", "Vendido"),
    unit(33, "204", "BL2", 400000, 80, "Apartamento", "Vendido"),
    unit(34, "205", "BL2", 370000, 74, "Apartamento", "Reservado"),
    unit(35, "206", "BL2", 355000, 70, "Apartamento", "Em aberto"),
    unit(36, "207", "BL3", 410000, 82, "Apartamento", "Em aberto"),
    unit(37, "208", "BL3", 395000, 78, "Apartamento", "Em aberto"),
    unit(38, "209", "BL3", 420000, 85, "Apartamento", "Distratado"),
  ] },
  { _id: 6, nome: "Vila das Palmeiras", bairro: "Bom Retiro", cidade: "Curitiba", estado: "PR", unidade_imobiliaria: [
    unit(39, "1", "V1", 210000, 200, "Lote", "Vendido"),
    unit(40, "2", "V1", 215000, 205, "Lote", "Vendido", ["012.345.678-90"]),
    unit(41, "3", "V2", 220000, 210, "Lote", "Em aberto"),
    unit(42, "4", "V2", 205000, 195, "Lote", "Em aberto"),
    unit(43, "5", "V3", 225000, 215, "Lote", "Distratado"),
  ] },
];

export const VENDEDORES = [
  { _id: 1, nome: "Marcos Vinicius Pereira", cpf: "111.222.333-44", telefone: "(11) 99111-2233", creci: "CR0001" },
  { _id: 2, nome: "Patrícia Lopes Figueira", cpf: "222.333.444-55", telefone: "(11) 99222-3344", creci: "CR0002" },
  { _id: 3, nome: "Ricardo Azevedo Melo", cpf: "333.444.555-66", telefone: "(11) 99333-4455", creci: "CR0003" },
  { _id: 4, nome: "Simone Barbosa Cunha", cpf: "444.555.666-77", telefone: "(11) 99444-5566", creci: "CR0004" },
  { _id: 5, nome: "Tiago Nascimento Freitas", cpf: "555.666.777-88", telefone: "(11) 99555-6677", creci: "CR0005" },
];

export const VENDAS = [
  { _id: 1, vendedor_id: 1, vendedor: "Marcos Vinicius Pereira", data_venda: "15/01/2023", parcelas: 6, pagas: 3, valor_venda: 320000, comissao: 3200, status: "Liquidado", empreendimento_id: 1, unidade_id: 1, clientes: ["123.456.789-01"] },
  { _id: 2, vendedor_id: 1, vendedor: "Marcos Vinicius Pereira", data_venda: "10/03/2023", parcelas: 10, pagas: 2, valor_venda: 310000, comissao: 3100, status: "Financiado", empreendimento_id: 1, unidade_id: 2, clientes: ["234.567.890-12", "123.456.789-01"] },
  { _id: 3, vendedor_id: 2, vendedor: "Patrícia Lopes Figueira", data_venda: "25/05/2023", parcelas: 8, pagas: 2, valor_venda: 290000, comissao: 2900, status: "Distratado", empreendimento_id: 1, unidade_id: 3, clientes: ["345.678.901-23"] },
  { _id: 4, vendedor_id: 2, vendedor: "Patrícia Lopes Figueira", data_venda: "05/07/2023", parcelas: 0, pagas: 1, valor_venda: 480000, comissao: 4800, status: "Liquidado", empreendimento_id: 2, unidade_id: 9, clientes: ["456.789.012-34"] },
  { _id: 5, vendedor_id: 3, vendedor: "Ricardo Azevedo Melo", data_venda: "20/08/2023", parcelas: 6, pagas: 2, valor_venda: 450000, comissao: 4500, status: "Financiado", empreendimento_id: 2, unidade_id: 10, clientes: ["567.890.123-45"] },
  { _id: 6, vendedor_id: 3, vendedor: "Ricardo Azevedo Melo", data_venda: "05/10/2023", parcelas: 10, pagas: 2, valor_venda: 460000, comissao: 4600, status: "Transferido", empreendimento_id: 2, unidade_id: 11, clientes: ["678.901.234-56"] },
  { _id: 7, vendedor_id: 4, vendedor: "Simone Barbosa Cunha", data_venda: "15/01/2024", parcelas: 4, pagas: 4, valor_venda: 95000, comissao: 950, status: "Liquidado", empreendimento_id: 3, unidade_id: 16, clientes: ["789.012.345-67"] },
  { _id: 8, vendedor_id: 4, vendedor: "Simone Barbosa Cunha", data_venda: "25/02/2024", parcelas: 6, pagas: 2, valor_venda: 98000, comissao: 980, status: "Financiado", empreendimento_id: 3, unidade_id: 17, clientes: ["890.123.456-78"] },
  { _id: 9, vendedor_id: 5, vendedor: "Tiago Nascimento Freitas", data_venda: "10/04/2024", parcelas: 8, pagas: 2, valor_venda: 260000, comissao: 2600, status: "Liquidado", empreendimento_id: 4, unidade_id: 25, clientes: ["901.234.567-89"] },
  { _id: 10, vendedor_id: 5, vendedor: "Tiago Nascimento Freitas", data_venda: "05/06/2024", parcelas: 5, pagas: 0, valor_venda: 210000, comissao: 2100, status: "Financiado", empreendimento_id: 6, unidade_id: 40, clientes: ["012.345.678-90"] },
];
