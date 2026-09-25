import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { LayoutDashboard, Building2, MapPin, Users, Award, FileText, TrendingUp, Database, Search } from "lucide-react";

// ══════════════════════════════════════════════════════════════
// COLLECTIONS — migração SQL → MongoDB (4 arquivos reais)
// ══════════════════════════════════════════════════════════════

const CLIENTES = [
  { _id:1,  nome:"Ana Paula Ferreira",    cpf:"123.456.789-01", rg:"1234567",  data_nascimento:"12/03/1985", profissao:"Engenheira",   estado_civil:"Casado",    email:"ana.ferreira@email.com",    telefone:[{residencial:"(11) 98765-4321",comercial:"(11) 3344-5566"}],  endereco:[{logradouro:"Rua das Acácias",     numero:"120",complemento:null,      bairro:"Alphaville",       cidade:"Barueri",   estado:"São Paulo",cep:"06453-100"}]},
  { _id:2,  nome:"Bruno Mendes Costa",    cpf:"234.567.890-12", rg:"2345678",  data_nascimento:"24/07/1978", profissao:"Médico",       estado_civil:"Casado",    email:"bruno.costa@email.com",     telefone:[{residencial:"(11) 97654-3210",comercial:"(11) 2233-4455"}],  endereco:[{logradouro:"Av. Paulista",        numero:"800",complemento:"Ap 52",  bairro:"Bela Vista",       cidade:"São Paulo", estado:"São Paulo", cep:"01310-100"}]},
  { _id:3,  nome:"Carla Souza Lima",      cpf:"345.678.901-23", rg:"3456789",  data_nascimento:"05/11/1990", profissao:"Professora",   estado_civil:"Solteiro",  email:"carla.lima@email.com",      telefone:[{residencial:"(11) 96543-2109",comercial:null}],              endereco:[{logradouro:"Rua das Orquídeas",   numero:"45", complemento:null,      bairro:"Jardim Flamboyant",cidade:"Campinas",  estado:"São Paulo", cep:"13080-050"}]},
  { _id:4,  nome:"Diego Rocha Nunes",     cpf:"456.789.012-34", rg:"4567890",  data_nascimento:"18/01/1982", profissao:"Advogado",     estado_civil:"Divorciado",email:"diego.nunes@email.com",     telefone:[{residencial:"(11) 95432-1098",comercial:"(11) 5566-7788"}],  endereco:[{logradouro:"Rua Goiás",           numero:"230",complemento:"Casa 2", bairro:"Setor Bueno",      cidade:"Goiânia",   estado:"Goiás",     cep:"74230-020"}]},
  { _id:5,  nome:"Eliane Martins Pinto",  cpf:"567.890.123-45", rg:"5678901",  data_nascimento:"30/06/1995", profissao:"Farmacêutica", estado_civil:"Solteiro",  email:"eliane.pinto@email.com",    telefone:[{residencial:"(11) 94321-0987",comercial:null}],              endereco:[{logradouro:"Rua Monsenhor Bruno", numero:"310",complemento:null,      bairro:"Meireles",         cidade:"Fortaleza", estado:"Ceará",     cep:"60165-121"}]},
  { _id:6,  nome:"Fábio Alves Santos",    cpf:"678.901.234-56", rg:"6789012",  data_nascimento:"14/09/1975", profissao:"Contador",     estado_civil:"Casado",    email:"fabio.santos@email.com",    telefone:[{residencial:"(11) 93210-9876",comercial:"(11) 6677-8899"}],  endereco:[{logradouro:"Rua XV de Novembro",  numero:"500",complemento:"Sala 3", bairro:"Centro",           cidade:"Curitiba",  estado:"Paraná",    cep:"80520-060"}]},
  { _id:7,  nome:"Gabriela Cruz Ramos",   cpf:"789.012.345-67", rg:"7890123",  data_nascimento:"22/04/1988", profissao:"Arquiteta",    estado_civil:"Casado",    email:"gabriela.ramos@email.com",  telefone:[{residencial:"(11) 92109-8765",comercial:null}],              endereco:[{logradouro:"Alameda Santos",      numero:"220",complemento:"Ap 31",  bairro:"Jardins",          cidade:"São Paulo", estado:"São Paulo", cep:"01419-000"}]},
  { _id:8,  nome:"Henrique Lima Borges",  cpf:"890.123.456-78", rg:"8901234",  data_nascimento:"03/12/1970", profissao:"Empresário",   estado_civil:"Viuvo",     email:"henrique.borges@email.com", telefone:[{residencial:"(11) 91098-7654",comercial:"(11) 7788-9900"}],  endereco:[{logradouro:"Rua Vol. da Pátria",  numero:"88", complemento:null,      bairro:"Centro",           cidade:"Curitiba",  estado:"Paraná",    cep:"80020-010"}]},
  { _id:9,  nome:"Isabela Gomes Dias",    cpf:"901.234.567-89", rg:"9012345",  data_nascimento:"17/08/1993", profissao:"Dentista",     estado_civil:"Solteiro",  email:"isabela.dias@email.com",    telefone:[{residencial:"(11) 90987-6543",comercial:null}],              endereco:[{logradouro:"Rua Barão de Studart",numero:"150",complemento:null,      bairro:"Aldeota",          cidade:"Fortaleza", estado:"Ceará",     cep:"60120-001"}]},
  { _id:10, nome:"João Victor Teixeira",  cpf:"012.345.678-90", rg:"0123456",  data_nascimento:"28/02/1980", profissao:"Arquiteto",    estado_civil:"Divorciado",email:"joao.teixeira@email.com",   telefone:[{residencial:"(11) 99876-5432",comercial:"(11) 8899-0011"}],  endereco:[{logradouro:"Rua Padre Vieira",    numero:"400",complemento:null,      bairro:"Consolação",       cidade:"São Paulo", estado:"São Paulo", cep:"01224-000"}]},
];

const EMPREENDIMENTOS = [
  { _id:1, nome:"Residencial Vista Verde",    bairro:"Alphaville",     cidade:"Barueri",   estado:"SP", cep:"06453-000",
    unidade_imobiliaria:[
      {_id:1, numero:"1",  quadra:"A",   valor:320000, area:180, tipo:"Casa",        status:"Vendido",   cliente:[{cliente_id:"123.456.789-01",nome:"Ana Paula Ferreira"}]},
      {_id:2, numero:"2",  quadra:"A",   valor:310000, area:175, tipo:"Casa",        status:"Vendido",   cliente:[{cliente_id:"234.567.890-12",nome:"Bruno Mendes Costa"},{cliente_id:"123.456.789-01",nome:"Ana Paula Ferreira"}]},
      {_id:3, numero:"3",  quadra:"A",   valor:290000, area:160, tipo:"Casa",        status:"Distratado",cliente:[{cliente_id:"345.678.901-23",nome:"Carla Souza Lima"}]},
      {_id:4, numero:"4",  quadra:"B",   valor:340000, area:200, tipo:"Casa",        status:"Reservado", cliente:[]},
      {_id:5, numero:"5",  quadra:"B",   valor:280000, area:155, tipo:"Casa",        status:"Em aberto", cliente:[]},
      {_id:6, numero:"6",  quadra:"B",   valor:295000, area:162, tipo:"Casa",        status:"Em aberto", cliente:[]},
      {_id:7, numero:"7",  quadra:"C",   valor:315000, area:178, tipo:"Casa",        status:"Distratado",cliente:[]},
      {_id:8, numero:"8",  quadra:"C",   valor:330000, area:190, tipo:"Casa",        status:"Em aberto", cliente:[]},
    ]},
  { _id:2, nome:"Condomínio Solar das Flores",bairro:"Jardim Paulista", cidade:"São Paulo", estado:"SP", cep:"01427-000",
    unidade_imobiliaria:[
      {_id:9,  numero:"101",quadra:"T1",  valor:480000, area:90,  tipo:"Apartamento", status:"Vendido",   cliente:[{cliente_id:"456.789.012-34",nome:"Diego Rocha Nunes"}]},
      {_id:10, numero:"102",quadra:"T1",  valor:450000, area:85,  tipo:"Apartamento", status:"Vendido",   cliente:[{cliente_id:"567.890.123-45",nome:"Eliane Martins Pinto"}]},
      {_id:11, numero:"103",quadra:"T1",  valor:460000, area:87,  tipo:"Apartamento", status:"Vendido",   cliente:[{cliente_id:"678.901.234-56",nome:"Fábio Alves Santos"}]},
      {_id:12, numero:"104",quadra:"T2",  valor:490000, area:92,  tipo:"Apartamento", status:"Vendido",   cliente:[]},
      {_id:13, numero:"105",quadra:"T2",  valor:430000, area:80,  tipo:"Apartamento", status:"Reservado", cliente:[]},
      {_id:14, numero:"106",quadra:"T2",  valor:440000, area:82,  tipo:"Apartamento", status:"Em aberto", cliente:[]},
      {_id:15, numero:"107",quadra:"T3",  valor:510000, area:98,  tipo:"Apartamento", status:"Distratado",cliente:[]},
    ]},
  { _id:3, nome:"Loteamento Bela Morada",     bairro:"Parque Eldorado", cidade:"Campinas",  estado:"SP", cep:"13080-000",
    unidade_imobiliaria:[
      {_id:16, numero:"1",  quadra:"Q1",  valor:95000,  area:300, tipo:"Lote",        status:"Vendido",   cliente:[{cliente_id:"789.012.345-67",nome:"Gabriela Cruz Ramos"}]},
      {_id:17, numero:"2",  quadra:"Q1",  valor:98000,  area:312, tipo:"Lote",        status:"Vendido",   cliente:[{cliente_id:"890.123.456-78",nome:"Henrique Lima Borges"}]},
      {_id:18, numero:"3",  quadra:"Q1",  valor:90000,  area:290, tipo:"Lote",        status:"Vendido",   cliente:[]},
      {_id:19, numero:"4",  quadra:"Q2",  valor:102000, area:320, tipo:"Lote",        status:"Reservado", cliente:[]},
      {_id:20, numero:"5",  quadra:"Q2",  valor:85000,  area:275, tipo:"Lote",        status:"Em aberto", cliente:[]},
      {_id:21, numero:"6",  quadra:"Q2",  valor:88000,  area:280, tipo:"Lote",        status:"Em aberto", cliente:[]},
      {_id:22, numero:"7",  quadra:"Q3",  valor:93000,  area:295, tipo:"Lote",        status:"Em aberto", cliente:[]},
      {_id:23, numero:"8",  quadra:"Q3",  valor:97000,  area:305, tipo:"Lote",        status:"Distratado",cliente:[]},
    ]},
  { _id:4, nome:"Parque Residencial Aurora",  bairro:"Setor Bueno",    cidade:"Goiânia",   estado:"GO", cep:"74230-020",
    unidade_imobiliaria:[
      {_id:24, numero:"1",  quadra:"S1",  valor:260000, area:140, tipo:"Casa",        status:"Vendido",   cliente:[]},
      {_id:25, numero:"2",  quadra:"S1",  valor:245000, area:132, tipo:"Casa",        status:"Vendido",   cliente:[{cliente_id:"901.234.567-89",nome:"Isabela Gomes Dias"}]},
      {_id:26, numero:"3",  quadra:"S2",  valor:270000, area:148, tipo:"Casa",        status:"Em aberto", cliente:[]},
      {_id:27, numero:"4",  quadra:"S2",  valor:255000, area:136, tipo:"Casa",        status:"Em aberto", cliente:[]},
      {_id:28, numero:"5",  quadra:"S3",  valor:240000, area:128, tipo:"Casa",        status:"Distratado",cliente:[]},
      {_id:29, numero:"6",  quadra:"S3",  valor:265000, area:142, tipo:"Casa",        status:"Reservado", cliente:[]},
    ]},
  { _id:5, nome:"Edifício Horizonte Azul",    bairro:"Meireles",       cidade:"Fortaleza", estado:"CE", cep:"60165-121",
    unidade_imobiliaria:[
      {_id:30, numero:"201",quadra:"BL1", valor:380000, area:75,  tipo:"Apartamento", status:"Vendido",   cliente:[]},
      {_id:31, numero:"202",quadra:"BL1", valor:365000, area:72,  tipo:"Apartamento", status:"Vendido",   cliente:[]},
      {_id:32, numero:"203",quadra:"BL1", valor:390000, area:77,  tipo:"Apartamento", status:"Vendido",   cliente:[]},
      {_id:33, numero:"204",quadra:"BL2", valor:400000, area:80,  tipo:"Apartamento", status:"Vendido",   cliente:[]},
      {_id:34, numero:"205",quadra:"BL2", valor:370000, area:74,  tipo:"Apartamento", status:"Reservado", cliente:[]},
      {_id:35, numero:"206",quadra:"BL2", valor:355000, area:70,  tipo:"Apartamento", status:"Em aberto", cliente:[]},
      {_id:36, numero:"207",quadra:"BL3", valor:410000, area:82,  tipo:"Apartamento", status:"Em aberto", cliente:[]},
      {_id:37, numero:"208",quadra:"BL3", valor:395000, area:78,  tipo:"Apartamento", status:"Em aberto", cliente:[]},
      {_id:38, numero:"209",quadra:"BL3", valor:420000, area:85,  tipo:"Apartamento", status:"Distratado",cliente:[]},
    ]},
  { _id:6, nome:"Vila das Palmeiras",         bairro:"Bom Retiro",     cidade:"Curitiba",  estado:"PR", cep:"80520-060",
    unidade_imobiliaria:[
      {_id:39, numero:"1",  quadra:"V1",  valor:210000, area:200, tipo:"Lote",        status:"Vendido",   cliente:[]},
      {_id:40, numero:"2",  quadra:"V1",  valor:215000, area:205, tipo:"Lote",        status:"Vendido",   cliente:[{cliente_id:"012.345.678-90",nome:"João Victor Teixeira"}]},
      {_id:41, numero:"3",  quadra:"V2",  valor:220000, area:210, tipo:"Lote",        status:"Em aberto", cliente:[]},
      {_id:42, numero:"4",  quadra:"V2",  valor:205000, area:195, tipo:"Lote",        status:"Em aberto", cliente:[]},
      {_id:43, numero:"5",  quadra:"V3",  valor:225000, area:215, tipo:"Lote",        status:"Distratado",cliente:[]},
    ]},
];

const VENDEDORES = [
  { _id:1, nome:"Marcos Vinicius Pereira", cpf:"111.222.333-44", telefone:"(11) 99111-2233", creci:"CR0001",
    vendas:[{venda_id:1,data_venda:"15/01/2023",valor_venda:320000,comissao:3200,data_recebimento_comissao:"15/02/2023"},{venda_id:2,data_venda:"10/03/2023",valor_venda:310000,comissao:3100,data_recebimento_comissao:"10/04/2023"}]},
  { _id:2, nome:"Patrícia Lopes Figueira", cpf:"222.333.444-55", telefone:"(11) 99222-3344", creci:"CR0002",
    vendas:[{venda_id:3,data_venda:"25/05/2023",valor_venda:290000,comissao:2900,data_recebimento_comissao:"25/06/2023"},{venda_id:4,data_venda:"05/07/2023",valor_venda:480000,comissao:4800,data_recebimento_comissao:"05/08/2023"}]},
  { _id:3, nome:"Ricardo Azevedo Melo",    cpf:"333.444.555-66", telefone:"(11) 99333-4455", creci:"CR0003",
    vendas:[{venda_id:5,data_venda:"20/08/2023",valor_venda:450000,comissao:4500,data_recebimento_comissao:"20/09/2023"},{venda_id:6,data_venda:"05/10/2023",valor_venda:460000,comissao:4600,data_recebimento_comissao:"05/11/2023"}]},
  { _id:4, nome:"Simone Barbosa Cunha",    cpf:"444.555.666-77", telefone:"(11) 99444-5566", creci:"CR0004",
    vendas:[{venda_id:7,data_venda:"15/01/2024",valor_venda:95000, comissao:950, data_recebimento_comissao:"15/02/2024"},{venda_id:8,data_venda:"25/02/2024",valor_venda:98000, comissao:980, data_recebimento_comissao:"25/03/2024"}]},
  { _id:5, nome:"Tiago Nascimento Freitas",cpf:"555.666.777-88", telefone:"(11) 99555-6677", creci:"CR0005",
    vendas:[{venda_id:9,data_venda:"10/04/2024",valor_venda:260000,comissao:2600,data_recebimento_comissao:"10/05/2024"},{venda_id:10,data_venda:"05/06/2024",valor_venda:210000,comissao:2100,data_recebimento_comissao:"05/07/2024"}]},
];

const VENDAS = [
  {_id:1, vendedor:{vendedor_id:1,nome:"Marcos Vinicius Pereira"}, data_venda:"15/01/2023",data_pagamento_entrada:"10/01/2023",quantidade_parcelas:6, valor_entrada:32000, valor_venda:320000,comissao_vendedor:3200,status:"Liquidado", unidade_imobiliaria:{empreendimento_id:1,unidade_imobiliaria_id:1, valor_total:320000},
   cliente:[{cliente_id:"123.456.789-01",nome:"Ana Paula Ferreira",  responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"15/02/2023",data_pagamento:"15/02/2023",valor_parcela:48000,juros:0,  forma_pagamento:"Boleto"},{_id:2,data_vencimento:"15/03/2023",data_pagamento:"15/03/2023",valor_parcela:48000,juros:0,  forma_pagamento:"Boleto"},{_id:3,data_vencimento:"15/04/2023",data_pagamento:"15/04/2023",valor_parcela:48000,juros:0,  forma_pagamento:"Transferencia"}]},
  {_id:2, vendedor:{vendedor_id:1,nome:"Marcos Vinicius Pereira"}, data_venda:"10/03/2023",data_pagamento_entrada:"05/03/2023",quantidade_parcelas:10,valor_entrada:31000, valor_venda:310000,comissao_vendedor:3100,status:"Financiado",unidade_imobiliaria:{empreendimento_id:1,unidade_imobiliaria_id:2, valor_total:310000},
   cliente:[{cliente_id:"234.567.890-12",nome:"Bruno Mendes Costa",  responsavel_financeiro:true},{cliente_id:"123.456.789-01",nome:"Ana Paula Ferreira",responsavel_financeiro:false}],
   parcela:[{_id:1,data_vencimento:"10/04/2023",data_pagamento:"10/04/2023",valor_parcela:27900,juros:0,  forma_pagamento:"Boleto"},{_id:2,data_vencimento:"10/05/2023",data_pagamento:"10/05/2023",valor_parcela:27900,juros:150,forma_pagamento:"Boleto"}]},
  {_id:3, vendedor:{vendedor_id:2,nome:"Patrícia Lopes Figueira"}, data_venda:"25/05/2023",data_pagamento_entrada:"20/05/2023",quantidade_parcelas:8, valor_entrada:29000, valor_venda:290000,comissao_vendedor:2900,status:"Distratado",unidade_imobiliaria:{empreendimento_id:1,unidade_imobiliaria_id:3, valor_total:290000},
   cliente:[{cliente_id:"345.678.901-23",nome:"Carla Souza Lima",    responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"25/07/2023",data_pagamento:"25/07/2023",valor_parcela:32625,juros:0,  forma_pagamento:"Boleto"},{_id:2,data_vencimento:"25/08/2023",data_pagamento:"25/08/2023",valor_parcela:32625,juros:200,forma_pagamento:"Boleto"}]},
  {_id:4, vendedor:{vendedor_id:2,nome:"Patrícia Lopes Figueira"}, data_venda:"05/07/2023",data_pagamento_entrada:"01/07/2023",quantidade_parcelas:0, valor_entrada:480000,valor_venda:480000,comissao_vendedor:4800,status:"Liquidado", unidade_imobiliaria:{empreendimento_id:2,unidade_imobiliaria_id:9, valor_total:480000},
   cliente:[{cliente_id:"456.789.012-34",nome:"Diego Rocha Nunes",  responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"05/07/2023",data_pagamento:"05/07/2023",valor_parcela:480000,juros:0,forma_pagamento:"Transferencia"}]},
  {_id:5, vendedor:{vendedor_id:3,nome:"Ricardo Azevedo Melo"},    data_venda:"20/08/2023",data_pagamento_entrada:"15/08/2023",quantidade_parcelas:6, valor_entrada:45000, valor_venda:450000,comissao_vendedor:4500,status:"Financiado",unidade_imobiliaria:{empreendimento_id:2,unidade_imobiliaria_id:10,valor_total:450000},
   cliente:[{cliente_id:"567.890.123-45",nome:"Eliane Martins Pinto",responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"20/09/2023",data_pagamento:"20/09/2023",valor_parcela:67500,juros:0,  forma_pagamento:"Boleto"},{_id:2,data_vencimento:"20/10/2023",data_pagamento:"20/10/2023",valor_parcela:67500,juros:300,forma_pagamento:"Boleto"}]},
  {_id:6, vendedor:{vendedor_id:3,nome:"Ricardo Azevedo Melo"},    data_venda:"05/10/2023",data_pagamento_entrada:"01/10/2023",quantidade_parcelas:10,valor_entrada:46000, valor_venda:460000,comissao_vendedor:4600,status:"Transferido",unidade_imobiliaria:{empreendimento_id:2,unidade_imobiliaria_id:11,valor_total:460000},
   cliente:[{cliente_id:"678.901.234-56",nome:"Fábio Alves Santos",  responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"05/11/2023",data_pagamento:"05/11/2023",valor_parcela:41400,juros:0,  forma_pagamento:"Cartão"},{_id:2,data_vencimento:"05/12/2023",data_pagamento:"05/12/2023",valor_parcela:41400,juros:250,forma_pagamento:"Cartão"}]},
  {_id:7, vendedor:{vendedor_id:4,nome:"Simone Barbosa Cunha"},    data_venda:"15/01/2024",data_pagamento_entrada:"10/01/2024",quantidade_parcelas:4, valor_entrada:19000, valor_venda:95000, comissao_vendedor:950, status:"Liquidado", unidade_imobiliaria:{empreendimento_id:3,unidade_imobiliaria_id:16,valor_total:95000},
   cliente:[{cliente_id:"789.012.345-67",nome:"Gabriela Cruz Ramos", responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"15/02/2024",data_pagamento:"15/02/2024",valor_parcela:19000,juros:0,forma_pagamento:"Dinheiro"},{_id:2,data_vencimento:"15/03/2024",data_pagamento:"15/03/2024",valor_parcela:19000,juros:0,forma_pagamento:"Dinheiro"},{_id:3,data_vencimento:"15/04/2024",data_pagamento:"15/04/2024",valor_parcela:19000,juros:0,forma_pagamento:"Boleto"},{_id:4,data_vencimento:"15/05/2024",data_pagamento:"15/05/2024",valor_parcela:19000,juros:0,forma_pagamento:"Boleto"}]},
  {_id:8, vendedor:{vendedor_id:4,nome:"Simone Barbosa Cunha"},    data_venda:"25/02/2024",data_pagamento_entrada:"20/02/2024",quantidade_parcelas:6, valor_entrada:19600, valor_venda:98000, comissao_vendedor:980, status:"Financiado",unidade_imobiliaria:{empreendimento_id:3,unidade_imobiliaria_id:17,valor_total:98000},
   cliente:[{cliente_id:"890.123.456-78",nome:"Henrique Lima Borges",responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"25/03/2024",data_pagamento:"25/03/2024",valor_parcela:13066.67,juros:0,  forma_pagamento:"Boleto"},{_id:2,data_vencimento:"25/04/2024",data_pagamento:"25/04/2024",valor_parcela:13066.67,juros:100,forma_pagamento:"Boleto"}]},
  {_id:9, vendedor:{vendedor_id:5,nome:"Tiago Nascimento Freitas"},data_venda:"10/04/2024",data_pagamento_entrada:"05/04/2024",quantidade_parcelas:8, valor_entrada:26000, valor_venda:260000,comissao_vendedor:2600,status:"Liquidado", unidade_imobiliaria:{empreendimento_id:4,unidade_imobiliaria_id:25,valor_total:260000},
   cliente:[{cliente_id:"901.234.567-89",nome:"Isabela Gomes Dias",  responsavel_financeiro:true}],
   parcela:[{_id:1,data_vencimento:"10/05/2024",data_pagamento:"10/05/2024",valor_parcela:29250,juros:0,forma_pagamento:"Transferencia"},{_id:2,data_vencimento:"10/06/2024",data_pagamento:"10/06/2024",valor_parcela:29250,juros:0,forma_pagamento:"Boleto"}]},
  {_id:10,vendedor:{vendedor_id:5,nome:"Tiago Nascimento Freitas"},data_venda:"05/06/2024",data_pagamento_entrada:"01/06/2024",quantidade_parcelas:5, valor_entrada:21000, valor_venda:210000,comissao_vendedor:2100,status:"Financiado",unidade_imobiliaria:{empreendimento_id:6,unidade_imobiliaria_id:40,valor_total:210000},
   cliente:[{cliente_id:"012.345.678-90",nome:"João Victor Teixeira", responsavel_financeiro:true}],
   parcela:[]},
];

// ══════════════════════════════════════════════════════════════
// THEME — Light
// ══════════════════════════════════════════════════════════════
const T = {
  bg:"#f0f2f7", surface:"#ffffff", border:"#e2e6ef", borderMd:"#cdd3e0",
  sidebar:"#ffffff", text:"#1a1d2e", textMd:"#4a5068", textSm:"#8a90a8",
  accent:"#4361ee", accentBg:"#eef1fd", accentDark:"#2d46c9",
  gold:"#9a6f00", goldBg:"#fef8e6",
  green:"#1a6e44", greenBg:"#e6f7ef",
  red:"#b32a1a",   redBg:"#fdeeed",
  blue:"#1a5fa8",  blueBg:"#e8f2fc",
  purple:"#6235a0",purpleBg:"#f2eafe",
  row:"#f7f8fb",
};

const brl = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const pct = (a,b) => b>0 ? ((a/b)*100).toFixed(1) : "0.0";

const BADGE = {
  "Vendido":    [T.gold,  T.goldBg],
  "Em aberto":  [T.green, T.greenBg],
  "Reservado":  [T.blue,  T.blueBg],
  "Distratado": [T.red,   T.redBg],
  "Financiado": [T.purple,T.purpleBg],
  "Liquidado":  [T.green, T.greenBg],
  "Transferido":[T.blue,  T.blueBg],
  "Lote":       [T.gold,  T.goldBg],
  "Apartamento":[T.blue,  T.blueBg],
  "Casa":       [T.green, T.greenBg],
  "Casado":     [T.blue,  T.blueBg],
  "Solteiro":   [T.green, T.greenBg],
  "Divorciado": [T.red,   T.redBg],
  "Viuvo":      [T.purple,T.purpleBg],
};

function Badge({label}){
  const [c,bg]=BADGE[label]||[T.textMd,T.border];
  return <span style={{color:c,background:bg,border:`1px solid ${c}33`,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,display:"inline-block",whiteSpace:"nowrap"}}>{label}</span>;
}
function Card({children,style}){return <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:20,...style}}>{children}</div>;}
function SectionTitle({children}){return <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"2px",color:T.textSm,marginBottom:14,fontWeight:700}}>{children}</div>;}
function PageHeader({title,sub}){return <div style={{marginBottom:28}}><h1 style={{fontSize:26,color:T.text,fontWeight:700,letterSpacing:"-0.5px"}}>{title}</h1><p style={{fontSize:12,color:T.textSm,letterSpacing:"1px",textTransform:"uppercase",marginTop:4}}>{sub}</p></div>;}
function Td({children,mono}){return <td style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,color:T.textMd,fontFamily:mono?"'JetBrains Mono',monospace":undefined,fontSize:mono?12:13}}>{children??"-"}</td>;}
function Th({children}){return <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:T.textSm,borderBottom:`1px solid ${T.borderMd}`,fontWeight:700,whiteSpace:"nowrap",background:T.row}}>{children}</th>;}
function ProgressBar({pct:p,color}){
  const c=color||T.accent;
  return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,background:T.border,borderRadius:3,height:5,overflow:"hidden"}}><div style={{height:5,borderRadius:3,background:c,width:`${Math.min(Number(p)||0,100)}%`,transition:"width 0.4s"}}/></div><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textSm,width:40,textAlign:"right"}}>{Number(p).toFixed(1)}%</span></div>;
}

// ══════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════
const NAV=[
  {id:"dashboard",       label:"Dashboard",       icon:LayoutDashboard},
  {id:"empreendimentos", label:"Empreendimentos", icon:Building2},
  {id:"unidades",        label:"Unidades",        icon:MapPin},
  {id:"clientes",        label:"Clientes",        icon:Users},
  {id:"vendedores",      label:"Vendedores",      icon:Award},
  {id:"vendas",          label:"Vendas",          icon:FileText},
  {id:"relatorios",      label:"Relatórios",      icon:TrendingUp},
  {id:"schema",          label:"Esquema NoSQL",   icon:Database},
];
function Sidebar({page,setPage}){
  return(
    <div style={{width:210,background:T.sidebar,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0,boxShadow:"2px 0 8px rgba(0,0,0,0.04)"}}>
      <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:18,color:T.accent,fontWeight:800,letterSpacing:"-0.5px"}}>Prosperiam</div>
        <div style={{fontSize:9,color:T.textSm,letterSpacing:"2px",textTransform:"uppercase",marginTop:3}}>Empreendimentos</div>
      </div>
      <nav style={{marginTop:8,flex:1,overflowY:"auto",padding:"6px 8px"}}>
        {NAV.map(({id,label,icon:Icon})=>{
          const active=page===id;
          return(
            <div key={id} onClick={()=>setPage(id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",cursor:"pointer",fontSize:13,borderRadius:8,marginBottom:2,transition:"all 0.12s",color:active?T.accent:T.textMd,background:active?T.accentBg:"transparent",fontWeight:active?600:400}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.row;}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <Icon size={15} strokeWidth={active?2.5:1.8}/>{label}
            </div>
          );
        })}
      </nav>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`,fontSize:10,color:T.textSm}}>© 2026 Prosperiam</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
function DashboardPage({stats,empStats,vendRanking}){
  const recentes=[...VENDAS].reverse().slice(0,5);
  const chartData=empStats.map(e=>({name:e.nome.split(" ").slice(-1)[0],Vendidas:e.vendidas,"Em aberto":e.disponiveis}));
  const pieData=useMemo(()=>{const t={};EMPREENDIMENTOS.flatMap(e=>e.unidade_imobiliaria).forEach(u=>{t[u.tipo]=(t[u.tipo]||0)+1;});return Object.entries(t).map(([name,value])=>({name,value}));},[]);
  const PC=[T.gold,T.accent,T.green];
  return(
    <div>
      <PageHeader title="Dashboard" sub="Visão geral · Prosperiam Empreendimentos"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[{l:"Total Unidades",v:stats.total,  s:`${stats.vendidas} vendidas`,c:T.gold},
          {l:"Taxa de Vendas", v:`${pct(stats.vendidas,stats.total)}%`,s:`${stats.disponiveis} disponíveis`,c:T.green},
          {l:"Clientes",       v:stats.clientes,s:"cadastrados",c:T.accent},
          {l:"VGV Total",      v:brl(stats.vgv),s:"valor geral de vendas",c:T.purple,sm:true}]
          .map((k,i)=>(
            <Card key={i} style={{borderTop:`3px solid ${k.c}`}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:T.textSm}}>{k.l}</div>
              <div style={{fontSize:k.sm?18:26,color:k.c,marginTop:8,fontWeight:700,lineHeight:1.1}}>{k.v}</div>
              <div style={{fontSize:11,color:T.textSm,marginTop:5}}>{k.s}</div>
            </Card>
          ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 290px",gap:14,marginBottom:14}}>
        <Card>
          <SectionTitle>Unidades por Empreendimento</SectionTitle>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={chartData} barSize={11}>
              <XAxis dataKey="name" tick={{fontSize:10,fill:T.textSm}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:T.textSm}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,fontSize:12}}/>
              <Bar dataKey="Vendidas"   fill={T.gold}   radius={[3,3,0,0]}/>
              <Bar dataKey="Em aberto" fill={T.border}  radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Por Tipo</SectionTitle>
          <ResponsiveContainer width="100%" height={185}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} dataKey="value" paddingAngle={3}>
              {pieData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
            </Pie><Legend iconSize={8} formatter={v=><span style={{fontSize:11,color:T.textMd}}>{v}</span>}/>
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,fontSize:12}}/></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 270px",gap:14}}>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"16px 20px 10px"}}><SectionTitle>Vendas Recentes</SectionTitle></div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>Cliente</Th><Th>Empreendimento</Th><Th>Valor</Th><Th>Status</Th></tr></thead>
            <tbody>{recentes.map(v=>(
              <tr key={v._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Td><span style={{color:T.text,fontWeight:500}}>{v.cliente[0]?.nome}</span></Td>
                <Td>{EMPREENDIMENTOS.find(e=>e._id===v.unidade_imobiliaria.empreendimento_id)?.nome.split(" ").slice(0,2).join(" ")}</Td>
                <Td mono><span style={{color:T.accent,fontWeight:600}}>{brl(v.valor_venda)}</span></Td>
                <Td><Badge label={v.status}/></Td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <Card>
          <SectionTitle>Ranking Vendedores</SectionTitle>
          {vendRanking.map((v,i)=>(
            <div key={v._id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.accent,width:20}}>#{i+1}</span>
              <div style={{flex:1}}><div style={{fontSize:12,color:T.text,fontWeight:500,marginBottom:3}}>{v.nome}</div><ProgressBar pct={(v.count/Math.max(...vendRanking.map(x=>x.count),1))*100}/></div>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color:T.accent,fontWeight:700}}>{v.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EMPREENDIMENTOS
// ══════════════════════════════════════════════════════════════
function EmpreendimentosPage({empStats}){
  const sorted=[...empStats].sort((a,b)=>a.percentual-b.percentual);
  return(
    <div>
      <PageHeader title="Empreendimentos" sub="Consultas 1 e 2"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {[{l:"Empreendimentos",v:empStats.length},{l:"Total Unidades",v:empStats.reduce((s,e)=>s+e.total,0)},{l:"Média de Vendas",v:`${pct(empStats.reduce((s,e)=>s+e.vendidas,0),empStats.reduce((s,e)=>s+e.total,0))}%`}]
          .map((k,i)=><Card key={i}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:T.textSm}}>{k.l}</div><div style={{fontSize:26,color:T.accent,marginTop:8,fontWeight:700}}>{k.v}</div></Card>)}
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"16px 20px 10px"}}><SectionTitle>Consulta 1 — Total por Empreendimento</SectionTitle></div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>#</Th><Th>Empreendimento</Th><Th>Cidade</Th><Th>Total</Th><Th>Vendidas</Th><Th>Disponíveis</Th><Th>Reservadas</Th><Th>Distratadas</Th><Th>% Vendido</Th></tr></thead>
          <tbody>{empStats.map((e,i)=>(
            <tr key={e._id} onMouseEnter={ev=>ev.currentTarget.style.background=T.row} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
              <Td mono>{i+1}</Td><Td><span style={{color:T.text,fontWeight:500}}>{e.nome}</span></Td>
              <Td>{EMPREENDIMENTOS.find(x=>x._id===e._id)?.cidade}</Td>
              <Td mono>{e.total}</Td>
              <Td><Badge label="Vendido"/><span style={{marginLeft:6,fontFamily:"monospace",fontSize:12}}>{e.vendidas}</span></Td>
              <Td><Badge label="Em aberto"/><span style={{marginLeft:6,fontFamily:"monospace",fontSize:12}}>{e.disponiveis}</span></Td>
              <Td mono>{e.reservadas}</Td><Td mono>{e.distratadas}</Td>
              <Td><ProgressBar pct={e.percentual} color={e.percentual>60?T.green:e.percentual>30?T.gold:T.red}/></Td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px 10px"}}><SectionTitle>Consulta 2 — Top 10 com Menor % de Vendas</SectionTitle></div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>Rank</Th><Th>Empreendimento</Th><Th>Disponíveis</Th><Th>Vendidas</Th><Th>% Vendido</Th></tr></thead>
          <tbody>{sorted.slice(0,10).map((e,i)=>(
            <tr key={e._id} onMouseEnter={ev=>ev.currentTarget.style.background=T.row} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
              <Td mono>{i+1}</Td><Td><span style={{color:T.text}}>{e.nome}</span></Td>
              <Td mono>{e.disponiveis}</Td><Td mono>{e.vendidas}</Td>
              <Td><ProgressBar pct={e.percentual}/></Td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// UNIDADES
// ══════════════════════════════════════════════════════════════
function UnidadesPage(){
  const [sF,setSF]=useState("todos");const [tF,setTF]=useState("todos");
  const all=useMemo(()=>EMPREENDIMENTOS.flatMap(e=>e.unidade_imobiliaria.map(u=>({...u,emp_nome:e.nome,emp_cidade:e.cidade}))),[]);
  const filtered=all.filter(u=>(sF==="todos"||u.status===sF)&&(tF==="todos"||u.tipo===tF));
  const btn=(val,cur,set)=>({background:val===cur?T.accentBg:T.surface,border:`1px solid ${val===cur?T.accent:T.border}`,color:val===cur?T.accent:T.textMd,padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12,transition:"all 0.12s"});
  return(
    <div>
      <PageHeader title="Unidades Imobiliárias" sub={`${filtered.length} unidades`}/>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {["todos","Vendido","Em aberto","Reservado","Distratado"].map(v=><div key={v} onClick={()=>setSF(v)} style={btn(v,sF,setSF)}>{v==="todos"?"Todos os status":v}</div>)}
        <div style={{width:1,background:T.border,margin:"0 4px"}}/>
        {["todos","Lote","Apartamento","Casa"].map(v=><div key={v} onClick={()=>setTF(v)} style={btn(v,tF,setTF)}>{v==="todos"?"Todos os tipos":v}</div>)}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>Empreendimento</Th><Th>Cidade</Th><Th>Nº</Th><Th>Quadra</Th><Th>Área m²</Th><Th>Tipo</Th><Th>Status</Th><Th>Valor</Th></tr></thead>
          <tbody>{filtered.map(u=>(
            <tr key={u._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Td><span style={{color:T.text,fontWeight:500}}>{u.emp_nome}</span></Td><Td>{u.emp_cidade}</Td>
              <Td mono>{u.numero}</Td><Td mono>{u.quadra}</Td>
              <Td mono>{u.area?.toLocaleString("pt-BR")}</Td>
              <Td><Badge label={u.tipo}/></Td><Td><Badge label={u.status}/></Td>
              <Td mono><span style={{color:T.accent,fontWeight:600}}>{brl(u.valor)}</span></Td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════
function ClientesPage({topClientes}){
  const [q,setQ]=useState("");
  const filtered=CLIENTES.filter(c=>c.nome.toLowerCase().includes(q.toLowerCase())||c.cpf.includes(q));
  return(
    <div>
      <PageHeader title="Clientes" sub={`${CLIENTES.length} clientes cadastrados`}/>
      <div style={{marginBottom:14,position:"relative",width:280}}>
        <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.textSm}}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome ou CPF…" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"8px 12px 8px 34px",color:T.text,fontSize:13,outline:"none"}}/>
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>Nome</Th><Th>CPF</Th><Th>Estado Civil</Th><Th>Profissão</Th><Th>E-mail</Th><Th>Tel. Res.</Th><Th>Tel. Com.</Th></tr></thead>
          <tbody>{filtered.map(c=>(
            <tr key={c._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Td><span style={{color:T.text,fontWeight:500}}>{c.nome}</span></Td><Td mono>{c.cpf}</Td>
              <Td><Badge label={c.estado_civil}/></Td><Td>{c.profissao}</Td>
              <Td><span style={{color:T.accent,fontSize:12}}>{c.email}</span></Td>
              <Td mono>{c.telefone?.[0]?.residencial??"-"}</Td>
              <Td mono>{c.telefone?.[0]?.comercial??"-"}</Td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <Card>
        <SectionTitle>Consulta 6 — Ranking de Clientes por Unidades Adquiridas</SectionTitle>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>#</Th><Th>Cliente</Th><Th>Total</Th><Th>Pagas</Th><Th>Em Pagamento</Th></tr></thead>
          <tbody>{topClientes.map((c,i)=>(
            <tr key={c._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Td><span style={{fontFamily:"monospace",color:T.accent,fontSize:12}}>#{i+1}</span></Td>
              <Td><span style={{color:T.text,fontWeight:500}}>{c.nome}</span></Td>
              <Td mono><span style={{color:T.accent,fontWeight:700}}>{c.total}</span></Td>
              <Td><Badge label="Liquidado"/><span style={{marginLeft:6,fontSize:12}}>{c.pagas}</span></Td>
              <Td><Badge label="Financiado"/><span style={{marginLeft:6,fontSize:12}}>{c.emPagamento}</span></Td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// VENDEDORES
// ══════════════════════════════════════════════════════════════
function VendedoresPage({vendRanking}){
  const [de,setDe]=useState("01/01/2023");const [ate,setAte]=useState("31/12/2024");
  const pd=s=>{try{const[d,m,y]=s.split("/");return new Date(`${y}-${m}-${d}`);}catch{return new Date(0);}};
  const rf=useMemo(()=>{
    const c={};
    VENDAS.filter(v=>{const d=pd(v.data_venda);return d>=pd(de)&&d<=pd(ate);})
      .forEach(v=>{const id=v.vendedor.vendedor_id;if(!c[id])c[id]={_id:id,nome:v.vendedor.nome,count:0};c[id].count++;});
    return Object.values(c).sort((a,b)=>b.count-a.count);
  },[de,ate]);
  const is={background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 12px",color:T.text,fontSize:13,outline:"none"};
  return(
    <div>
      <PageHeader title="Vendedores" sub="Performance e rankings"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {VENDEDORES.map(v=>{
          const count=VENDAS.filter(vd=>vd.vendedor.vendedor_id===v._id).length;
          const comTotal=v.vendas.reduce((s,vv)=>s+(vv.comissao||0),0);
          const maxCount=Math.max(...VENDEDORES.map(vv=>VENDAS.filter(vd=>vd.vendedor.vendedor_id===vv._id).length),1);
          return(
            <Card key={v._id} style={{borderTop:`3px solid ${T.accent}`}}>
              <div style={{fontSize:12,color:T.text,fontWeight:600,marginBottom:2}}>{v.nome.split(" ").slice(0,2).join(" ")}</div>
              <div style={{fontSize:10,color:T.textSm,marginBottom:10}}>{v.creci}</div>
              <div style={{fontSize:26,color:T.accent,fontWeight:700}}>{count}</div>
              <div style={{fontSize:11,color:T.textSm,marginBottom:8}}>vendas</div>
              <ProgressBar pct={(count/maxCount)*100}/>
              <div style={{marginTop:8,fontSize:11,color:T.green,fontWeight:600}}>{brl(comTotal)}</div>
              <div style={{fontSize:10,color:T.textSm}}>{v.telefone}</div>
            </Card>
          );
        })}
      </div>
      <Card>
        <SectionTitle>Consulta 3 — Maior Número de Vendas em Período</SectionTitle>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
          {[["DE",de,setDe],["ATÉ",ate,setAte]].map(([l,val,set])=>(
            <div key={l}><div style={{fontSize:10,color:T.textSm,letterSpacing:"1px",marginBottom:6}}>{l}</div>
              <input type="text" placeholder="dd/mm/aaaa" value={val} onChange={e=>set(e.target.value)} style={is}/></div>
          ))}
        </div>
        {rf.length===0
          ?<div style={{color:T.textSm,textAlign:"center",padding:24,fontSize:13}}>Nenhuma venda no período</div>
          :<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>Rank</Th><Th>Vendedor</Th><Th>CRECI</Th><Th>CPF</Th><Th>Vendas</Th></tr></thead>
            <tbody>{rf.map((v,i)=>(
              <tr key={v._id} style={{background:i===0?T.accentBg:"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background=i===0?T.accentBg:"transparent"}>
                <Td><span style={{fontFamily:"monospace",color:T.accent,fontSize:12}}>#{i+1}</span>{i===0&&<span style={{marginLeft:6,fontSize:10,color:T.accent}}>★ LÍDER</span>}</Td>
                <Td><span style={{color:T.text,fontWeight:i===0?600:400}}>{v.nome}</span></Td>
                <Td mono>{VENDEDORES.find(x=>x._id===v._id)?.creci??"-"}</Td>
                <Td mono>{VENDEDORES.find(x=>x._id===v._id)?.cpf??"-"}</Td>
                <Td mono><span style={{color:T.accent,fontSize:16,fontWeight:700}}>{v.count}</span></Td>
              </tr>
            ))}</tbody>
          </table>}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// VENDAS
// ══════════════════════════════════════════════════════════════
function VendasPage({distratados}){
  const [tab,setTab]=useState("todos");
  const TABS=["todos","Financiado","Liquidado","Distratado","Transferido"];
  const filtered=VENDAS.filter(v=>tab==="todos"||v.status===tab);
  return(
    <div>
      <PageHeader title="Vendas" sub={`${VENDAS.length} contratos`}/>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:14}}>
        {TABS.map(t=><div key={t} onClick={()=>setTab(t)} style={{padding:"9px 16px",cursor:"pointer",fontSize:12,color:tab===t?T.accent:T.textMd,borderBottom:`2px solid ${tab===t?T.accent:"transparent"}`,transition:"all 0.12s",fontWeight:tab===t?600:400}}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>)}
      </div>
      <Card style={{padding:0,overflow:"hidden",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th>ID</Th><Th>Cliente(s)</Th><Th>Empreendimento</Th><Th>Vendedor</Th><Th>Valor</Th><Th>Parcelas</Th><Th>Pagas</Th><Th>Status</Th><Th>Data</Th></tr></thead>
          <tbody>{filtered.map(v=>{
            const emp=EMPREENDIMENTOS.find(e=>e._id===v.unidade_imobiliaria.empreendimento_id);
            const pagas=v.parcela.filter(p=>p.data_pagamento).length;
            return(
              <tr key={v._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Td mono><span style={{color:T.textSm}}>#{v._id}</span></Td>
                <Td><span style={{color:T.text,fontWeight:500}}>{v.cliente[0]?.nome}</span>{v.cliente.length>1&&<span style={{fontSize:10,color:T.textSm,marginLeft:4}}>+{v.cliente.length-1}</span>}</Td>
                <Td>{emp?.nome.split(" ").slice(0,2).join(" ")}</Td><Td>{v.vendedor.nome.split(" ")[0]}</Td>
                <Td mono><span style={{color:T.accent,fontWeight:600}}>{brl(v.valor_venda)}</span></Td>
                <Td mono>{v.quantidade_parcelas>0?`${v.quantidade_parcelas}x`:"À Vista"}</Td>
                <Td mono>{v.quantidade_parcelas>0?`${pagas}/${v.quantidade_parcelas}`:"—"}</Td>
                <Td><Badge label={v.status}/></Td><Td mono>{v.data_venda}</Td>
              </tr>
            );
          })}</tbody>
        </table>
      </Card>
      {(tab==="todos"||tab==="Distratado")&&(
        <Card>
          <SectionTitle>Consulta 4 — Clientes Distratados · Parcelas em Aberto</SectionTitle>
          {distratados.length===0?<div style={{color:T.textSm,textAlign:"center",padding:20}}>Nenhum distrato</div>
            :<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr><Th>Nome</Th><Th>Profissão</Th><Th>E. Civil</Th><Th>E-mail</Th><Th>Telefone</Th><Th>Parcelas Rest.</Th><Th>Valor em Aberto</Th></tr></thead>
              <tbody>{distratados.map(d=>(
                <tr key={d._id} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Td><span style={{color:T.red,fontWeight:500}}>{d.clienteInfo?.nome}</span></Td>
                  <Td>{d.clienteInfo?.profissao}</Td><Td><Badge label={d.clienteInfo?.estado_civil??""}/></Td>
                  <Td><span style={{color:T.accent,fontSize:12}}>{d.clienteInfo?.email}</span></Td>
                  <Td mono>{d.clienteInfo?.telefone?.[0]?.residencial??"-"}</Td>
                  <Td mono><span style={{color:T.red,fontWeight:600}}>{d.restantes}</span></Td>
                  <Td mono><span style={{color:T.red,fontWeight:600}}>{brl(d.valorAberto)}</span></Td>
                </tr>
              ))}</tbody>
            </table>}
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RELATÓRIOS
// ══════════════════════════════════════════════════════════════
function RelatoriosPage({empStats,vendRanking,distratados,quitadas,topClientes}){
  return(
    <div>
      <PageHeader title="Relatórios" sub="6 consultas analíticas"/>
      <Card style={{marginBottom:14}}>
        <SectionTitle>Consulta 1 — Status por Empreendimento (resumo)</SectionTitle>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          {["Vendido","Em aberto","Reservado","Distratado"].map(s=>{
            const total=EMPREENDIMENTOS.flatMap(e=>e.unidade_imobiliaria).filter(u=>u.status===s).length;
            const [c]=BADGE[s]||[T.textMd];
            return <div key={s} style={{display:"flex",alignItems:"center",gap:10}}><Badge label={s}/><span style={{fontSize:22,color:c,fontWeight:700}}>{total}</span></div>;
          })}
        </div>
      </Card>
      <Card style={{marginBottom:14}}>
        <SectionTitle>Consulta 2 — Top 10 menor % de vendas</SectionTitle>
        {[...empStats].sort((a,b)=>a.percentual-b.percentual).slice(0,10).map((e,i)=>(
          <div key={e._id} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontFamily:"monospace",fontSize:11,color:T.accent,width:22}}>#{i+1}</span>
            <span style={{flex:1,fontSize:13,color:T.text}}>{e.nome}</span>
            <span style={{fontSize:12,color:T.textSm,width:80,textAlign:"right"}}>Disp: <b style={{color:T.green}}>{e.disponiveis}</b></span>
            <span style={{fontSize:12,color:T.textSm,width:80,textAlign:"right"}}>Vend: <b style={{color:T.gold}}>{e.vendidas}</b></span>
            <div style={{width:160}}><ProgressBar pct={e.percentual}/></div>
          </div>
        ))}
      </Card>
      <Card style={{marginBottom:14}}>
        <SectionTitle>Consulta 3 — Vendedor Líder (todo período)</SectionTitle>
        {vendRanking[0]&&(<div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:T.accentBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:T.accent,fontWeight:700}}>{vendRanking[0].nome.charAt(0)}</div>
          <div><div style={{fontSize:16,color:T.text,fontWeight:600}}>{vendRanking[0].nome}</div><div style={{fontSize:11,color:T.textSm,marginTop:2}}>CRECI: {VENDEDORES.find(v=>v._id===vendRanking[0]._id)?.creci} · CPF: {VENDEDORES.find(v=>v._id===vendRanking[0]._id)?.cpf}</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:34,color:T.accent,fontWeight:800}}>{vendRanking[0].count}</div><div style={{fontSize:11,color:T.textSm}}>vendas realizadas</div></div>
        </div>)}
      </Card>
      <Card style={{marginBottom:14}}>
        <SectionTitle>Consulta 4 — Distratados · Parcelas em Aberto</SectionTitle>
        {distratados.length===0?<div style={{color:T.textSm}}>Nenhum distrato.</div>:distratados.map(d=>(
          <div key={d._id} style={{display:"flex",gap:16,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{flex:1}}><span style={{color:T.red,fontSize:13,fontWeight:600}}>{d.clienteInfo?.nome}</span><span style={{marginLeft:10,fontSize:11,color:T.textSm}}>{d.clienteInfo?.profissao}</span><div style={{fontSize:11,color:T.accent,marginTop:2}}>{d.clienteInfo?.email}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,color:T.red,fontWeight:600}}>{d.restantes} parcelas em aberto</div><div style={{fontSize:12,color:T.red}}>{brl(d.valorAberto)}</div></div>
          </div>
        ))}
      </Card>
      <Card style={{marginBottom:14}}>
        <SectionTitle>Consulta 5 — Unidades com Pagamentos Quitados</SectionTitle>
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          <div><div style={{fontSize:10,color:T.textSm,textTransform:"uppercase",letterSpacing:"1.5px"}}>Total</div><div style={{fontSize:28,color:T.accent,fontWeight:700}}>{quitadas.total}</div></div>
          <div><div style={{fontSize:10,color:T.textSm,textTransform:"uppercase",letterSpacing:"1.5px"}}>Quitadas</div><div style={{fontSize:28,color:T.green,fontWeight:700}}>{quitadas.quitadas}</div></div>
          <div style={{flex:1}}><div style={{fontSize:11,color:T.textSm,marginBottom:8}}>Percentual quitado</div><ProgressBar pct={quitadas.percentual} color={T.green}/></div>
        </div>
      </Card>
      <Card>
        <SectionTitle>Consulta 6 — Top 10 Clientes por Unidades</SectionTitle>
        {topClientes.map((c,i)=>(
          <div key={c._id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontFamily:"monospace",fontSize:11,color:T.accent,width:22}}>#{i+1}</span>
            <span style={{flex:1,fontSize:13,color:T.text}}>{c.nome}</span>
            <div style={{display:"flex",gap:16}}>
              <span style={{fontSize:11,color:T.textSm}}>Total: <b style={{color:T.accent}}>{c.total}</b></span>
              <span style={{fontSize:11,color:T.textSm}}>Pagas: <b style={{color:T.green}}>{c.pagas}</b></span>
              <span style={{fontSize:11,color:T.textSm}}>Em pag.: <b style={{color:T.purple}}>{c.emPagamento}</b></span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ESQUEMA NOSQL — collections + queries MongoDB com resultados reais
// ══════════════════════════════════════════════════════════════
const QUERIES=[
  {id:"q1",label:"Consulta 1",title:"Total por status por empreendimento",collection:"db.empreendimento",motivo:"unidade_imobiliaria[] embedded → $unwind in-document, sem $lookup",
   query:`db.empreendimento.aggregate([
  { $unwind: "$unidade_imobiliaria" },
  {
    $group: {
      _id: {
        empreendimento: "$nome",
        status: "$unidade_imobiliaria.status"
      },
      total: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.empreendimento",
      porStatus: {
        $push: {
          status: "$_id.status",
          total:  "$total"
        }
      },
      totalUnidades: { $sum: "$total" }
    }
  },
  { $sort: { _id: 1 } }
])`},
  {id:"q2",label:"Consulta 2",title:"Top 10 menor % de vendas",collection:"db.empreendimento",motivo:"$addFields $divide sobre counters in-document, sem JOIN",
   query:`db.empreendimento.aggregate([
  { $unwind: "$unidade_imobiliaria" },
  {
    $group: {
      _id: "$nome",
      total:      { $sum: 1 },
      vendidas:   { $sum: { $cond: [{ $eq: ["$unidade_imobiliaria.status","Vendido"] }, 1, 0] } },
      disponiveis:{ $sum: { $cond: [{ $eq: ["$unidade_imobiliaria.status","Em aberto"] }, 1, 0] } }
    }
  },
  {
    $addFields: {
      percentualVendido: {
        $round: [{ $multiply: [{ $divide: ["$vendidas","$total"] }, 100] }, 2]
      }
    }
  },
  { $sort:  { percentualVendido: 1 } },
  { $limit: 10 }
])`},
  {id:"q3",label:"Consulta 3",title:"Vendedor com mais vendas no período",collection:"db.venda",motivo:"vendedor denormalizado → $group direto, sem $lookup em db.vendedor",
   query:`db.venda.aggregate([
  {
    $match: {
      data_venda: { $gte: "01/01/2023", $lte: "31/12/2024" }
      // ⚠️ Em produção: converter campo para ISODate na migração
      //    e usar $gte: ISODate("2023-01-01")
    }
  },
  {
    $group: {
      _id:         "$vendedor.vendedor_id",
      nome:        { $first: "$vendedor.nome" },
      totalVendas: { $sum: 1 }
    }
  },
  { $sort:  { totalVendas: -1 } },
  { $limit: 1 }
])`},
  {id:"q4",label:"Consulta 4",title:"Clientes distratados e parcelas em aberto",collection:"db.venda",motivo:"parcela[] embedded → $filter in-document identifica sem data_pagamento",
   query:`db.venda.aggregate([
  { $match: { status: "Distratado" } },
  { $unwind: "$cliente" },
  { $match: { "cliente.responsavel_financeiro": true } },
  {
    $lookup: {
      from:         "cliente",
      localField:   "cliente.cliente_id",
      foreignField: "cpf",
      as:           "dadosCliente"
    }
  },
  { $unwind: "$dadosCliente" },
  {
    $addFields: {
      parcelasEmAberto: {
        $size: {
          $filter: {
            input: "$parcela", as: "p",
            cond: { $not: ["$$p.data_pagamento"] }
          }
        }
      },
      valorEmAberto: {
        $sum: {
          $map: {
            input: { $filter: { input: "$parcela", as: "p", cond: { $not: ["$$p.data_pagamento"] } } },
            as: "p", in: "$$p.valor_parcela"
          }
        }
      }
    }
  },
  {
    $project: {
      "dadosCliente.nome": 1, "dadosCliente.profissao": 1,
      "dadosCliente.estado_civil": 1, "dadosCliente.email": 1,
      "dadosCliente.telefone": 1,
      parcelasEmAberto: 1, valorEmAberto: 1
    }
  }
])`},
  {id:"q5",label:"Consulta 5",title:"Unidades com pagamentos quitados",collection:"db.venda",motivo:"$ifNull sobre data_pagamento — quitação calculada in-document",
   query:`db.venda.aggregate([
  {
    $addFields: {
      parcelasQuitadas: {
        $size: {
          $filter: {
            input: "$parcela", as: "p",
            cond: { $ifNull: ["$$p.data_pagamento", false] }
          }
        }
      }
    }
  },
  {
    $addFields: {
      quitado: {
        $or: [
          { $eq: ["$status", "Liquidado"] },
          {
            $and: [
              { $gt:  ["$quantidade_parcelas", 0] },
              { $gte: ["$parcelasQuitadas","$quantidade_parcelas"] }
            ]
          }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      totalVendas:      { $sum: 1 },
      unidadesQuitadas: { $sum: { $cond: ["$quitado", 1, 0] } }
    }
  },
  {
    $addFields: {
      percentualQuitado: {
        $round: [{ $multiply: [{ $divide: ["$unidadesQuitadas","$totalVendas"] }, 100] }, 2]
      }
    }
  }
])`},
  {id:"q6",label:"Consulta 6",title:"Top 10 clientes por unidades adquiridas",collection:"db.venda",motivo:"cliente[] denormalizado → $unwind + $group, sem $lookup em db.cliente",
   query:`db.venda.aggregate([
  { $unwind: "$cliente" },
  {
    $group: {
      _id:                "$cliente.cliente_id",
      nome:               { $first: "$cliente.nome" },
      totalUnidades:      { $sum: 1 },
      unidadesPagas:      { $sum: { $cond: [{ $eq: ["$status","Liquidado"]  }, 1, 0] } },
      unidadesEmPagamento:{ $sum: { $cond: [{ $eq: ["$status","Financiado"] }, 1, 0] } }
    }
  },
  { $sort:  { totalUnidades: -1 } },
  { $limit: 10 }
])`},
];

function SchemaPage({empStats,vendRanking,distratados,quitadas,topClientes}){
  const [activeQ,setActiveQ]=useState("q1");
  const [activeTab,setActiveTab]=useState("cliente");
  const q=QUERIES.find(x=>x.id===activeQ);

  const results=useMemo(()=>{
    if(activeQ==="q1") return empStats.map(e=>({empreendimento:e.nome,vendido:e.vendidas,"em aberto":e.disponiveis,reservado:e.reservadas,distratado:e.distratadas,total:e.total}));
    if(activeQ==="q2") return [...empStats].sort((a,b)=>a.percentual-b.percentual).slice(0,10).map((e,i)=>({rank:i+1,empreendimento:e.nome,disponiveis:e.disponiveis,vendidas:e.vendidas,"%":e.percentual}));
    if(activeQ==="q3") return vendRanking.slice(0,1).map(v=>({vendedor:v.nome,creci:VENDEDORES.find(x=>x._id===v._id)?.creci,cpf:VENDEDORES.find(x=>x._id===v._id)?.cpf,vendas:v.count}));
    if(activeQ==="q4") return distratados.map(d=>({nome:d.clienteInfo?.nome,profissao:d.clienteInfo?.profissao,email:d.clienteInfo?.email,"parc. abertas":d.restantes,"valor aberto":brl(d.valorAberto)}));
    if(activeQ==="q5") return [{totalVendas:quitadas.total,quitadas:quitadas.quitadas,"%":quitadas.percentual}];
    if(activeQ==="q6") return topClientes.map((c,i)=>({rank:i+1,cliente:c.nome,total:c.total,pagas:c.pagas,"em pag.":c.emPagamento}));
    return [];
  },[activeQ,empStats,vendRanking,distratados,quitadas,topClientes]);

  const SCHEMAS=[
    {id:"cliente",     label:"cliente",          color:T.green,
     desc:"CPF como referência nas vendas. endereco[] e telefone[] embutidos — bounded arrays, sempre lidos junto ao cliente.",
     fields:[{f:"_id",t:"int"},{f:"nome",t:"String"},{f:"cpf",t:"String",n:"unique"},{f:"rg",t:"String"},{f:"data_nascimento",t:"String"},{f:"profissao",t:"String"},{f:"estado_civil",t:"String",n:"enum"},{f:"email",t:"String"},{f:"telefone[]",t:"Array",n:"EMBED"},{f:"endereco[]",t:"Array",n:"EMBED"}],
     ex:`{
  _id: 1,
  nome: "Ana Paula Ferreira",
  cpf: "123.456.789-01",
  estado_civil: "Casado",
  profissao: "Engenheira",
  email: "ana.ferreira@email.com",
  telefone: [{        // EMBED
    residencial: "(11) 98765-4321",
    comercial:   "(11) 3344-5566"
  }],
  endereco: [{        // EMBED
    logradouro: "Rua das Acácias",
    numero: "120",
    bairro: "Alphaville",
    cidade: "Barueri",
    cep: "06453-100"
  }]
}`},
    {id:"empreendimento",label:"empreendimento", color:T.gold,
     desc:"unidade_imobiliaria[] embedded: consultas 1 e 2 com $unwind + $group sem $lookup. cliente[] dentro da unidade é snapshot denormalizado.",
     fields:[{f:"_id",t:"int"},{f:"nome",t:"String"},{f:"bairro",t:"String"},{f:"cidade",t:"String"},{f:"estado",t:"String"},{f:"cep",t:"String"},{f:"unidade_imobiliaria[]",t:"Array",n:"EMBED 1:N"}],
     ex:`{
  _id: 1,
  nome: "Residencial Vista Verde",
  cidade: "Barueri",
  estado: "SP",
  unidade_imobiliaria: [ // EMBED
    {
      _id: 1,
      numero: "1", quadra: "A",
      valor: 320000, area: 180,
      tipo: "casa",
      status: "Vendido",
      cliente: [         // DENORM
        { cliente_id: "123.456.789-01",
          nome: "Ana Paula Ferreira" }
      ]
    }
  ]
}`},
    {id:"venda",       label:"venda",            color:T.purple,
     desc:"parcela[] embedded: consultas 4/5 filtram in-document. cliente[] e vendedor são snapshots denormalizados para evitar $lookup nas queries 3 e 6.",
     fields:[{f:"_id",t:"int"},{f:"vendedor",t:"Object",n:"DENORM"},{f:"data_venda",t:"String"},{f:"quantidade_parcelas",t:"int"},{f:"valor_entrada",t:"double"},{f:"valor_venda",t:"double"},{f:"status",t:"String",n:"enum"},{f:"unidade_imobiliaria",t:"Object",n:"REF leve"},{f:"cliente[]",t:"Array",n:"DENORM"},{f:"parcela[]",t:"Array",n:"EMBED"}],
     ex:`{
  _id: 1,
  vendedor: {         // DENORM
    vendedor_id: 1,
    nome: "Marcos Vinicius Pereira"
  },
  status: "Liquidado",
  valor_venda: 320000,
  unidade_imobiliaria: { // REF leve
    empreendimento_id: 1,
    unidade_imobiliaria_id: 1,
    valor_total: 320000
  },
  cliente: [{         // DENORM
    cliente_id: "123.456.789-01",
    nome: "Ana Paula Ferreira",
    responsavel_financeiro: true
  }],
  parcela: [{         // EMBED
    _id: 1,
    data_vencimento: "15/02/2023",
    data_pagamento:  "15/02/2023", // null = em aberto
    valor_parcela: 48000,
    forma_pagamento: "Boleto"
  }]
}`},
    {id:"vendedor",    label:"vendedor",          color:T.accent,
     desc:"vendas[] é REF array (não embedded) — histórico de vendas é unbounded, cresceria sem limite se embutido.",
     fields:[{f:"_id",t:"int"},{f:"nome",t:"String"},{f:"cpf",t:"String"},{f:"telefone",t:"String"},{f:"creci",t:"String"},{f:"vendas[]",t:"Array",n:"REF array"}],
     ex:`{
  _id: 1,
  nome: "Marcos Vinicius Pereira",
  cpf: "111.222.333-44",
  creci: "CR0001",
  vendas: [           // REF array
    {
      venda_id: 1,
      data_venda: "15/01/2023",
      valor_venda: 320000,
      comissao: 3200,
      data_recebimento_comissao: "15/02/2023"
    }
  ]
}`},
  ];
  const sch=SCHEMAS.find(s=>s.id===activeTab);

  const qBtnStyle=(id)=>({padding:"7px 14px",cursor:"pointer",fontSize:12,transition:"all 0.12s",background:activeQ===id?T.accentBg:T.surface,border:`1px solid ${activeQ===id?T.accent:T.border}`,color:activeQ===id?T.accent:T.textMd,fontWeight:activeQ===id?600:400,borderRadius:6});
  const sBtnStyle=(s)=>({padding:"7px 16px",cursor:"pointer",fontSize:12,transition:"all 0.12s",background:activeTab===s.id?s.color+"18":T.surface,border:`1px solid ${activeTab===s.id?s.color:T.border}`,color:activeTab===s.id?s.color:T.textMd,fontWeight:activeTab===s.id?600:400,borderRadius:6});

  return(
    <div>
      <PageHeader title="Esquema NoSQL" sub="MongoDB · 4 coleções · 6 queries do documento"/>

      {/* Collections */}
      <Card style={{marginBottom:14}}>
        <SectionTitle>Coleções · imobiliaria_db</SectionTitle>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {SCHEMAS.map(s=><div key={s.id} onClick={()=>setActiveTab(s.id)} style={sBtnStyle(s)}>db.{s.label}</div>)}
        </div>
        {sch&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <div style={{fontSize:12,color:T.textMd,marginBottom:12,lineHeight:1.8,background:T.row,padding:12,borderRadius:8,border:`1px solid ${T.border}`}}>{sch.desc}</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr><Th>Campo</Th><Th>Tipo</Th><Th>Nota</Th></tr></thead>
                <tbody>{sch.fields.map((f,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background=T.row} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Td mono><span style={{color:sch.color,fontWeight:600}}>{f.f}</span></Td><Td mono>{f.t}</Td>
                    <Td>{f.n&&<span style={{fontSize:10,background:sch.color+"15",border:`1px solid ${sch.color}33`,color:sch.color,padding:"1px 6px",borderRadius:3}}>{f.n}</span>}</Td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div>
              <div style={{fontSize:10,color:T.textSm,marginBottom:8,letterSpacing:"1.5px",textTransform:"uppercase"}}>Documento de exemplo</div>
              <pre style={{background:T.row,border:`1px solid ${T.border}`,borderRadius:8,padding:14,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textMd,lineHeight:1.8,overflowX:"auto",margin:0,whiteSpace:"pre"}}>{sch.ex}</pre>
            </div>
          </div>
        )}
      </Card>

      {/* Queries */}
      <Card style={{marginBottom:14}}>
        <SectionTitle>Queries MongoDB · 6 consultas do documento</SectionTitle>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {QUERIES.map(qq=><div key={qq.id} onClick={()=>setActiveQ(qq.id)} style={qBtnStyle(qq.id)}>{qq.label}</div>)}
        </div>
        {q&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,gap:10,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:15,color:T.text,fontWeight:700}}>{q.title}</div>
                <div style={{fontSize:12,color:T.textSm,marginTop:3}}>Collection: <span style={{fontFamily:"'JetBrains Mono',monospace",color:T.accent}}>{q.collection}</span></div>
              </div>
              <div style={{fontSize:11,background:T.greenBg,border:`1px solid ${T.green}33`,color:T.green,padding:"5px 12px",borderRadius:6,maxWidth:360,lineHeight:1.5}}>✓ {q.motivo}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <div style={{fontSize:10,color:T.textSm,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>Query</div>
                <pre style={{background:T.row,border:`1px solid ${T.border}`,borderRadius:8,padding:14,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textMd,lineHeight:1.8,overflowX:"auto",margin:0,whiteSpace:"pre"}}>{q.query}</pre>
              </div>
              <div>
                <div style={{fontSize:10,color:T.textSm,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>Resultado real (dados das coleções)</div>
                {results.length===0
                  ?<div style={{padding:16,color:T.textSm,textAlign:"center",fontSize:12,background:T.row,border:`1px solid ${T.border}`,borderRadius:8}}>Sem dados</div>
                  :<div style={{background:T.row,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr>{Object.keys(results[0]).map(k=><Th key={k}>{k}</Th>)}</tr></thead>
                      <tbody>{results.map((row,i)=>(
                        <tr key={i} onMouseEnter={e=>e.currentTarget.style.background=T.borderMd} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          {Object.values(row).map((val,j)=>(
                            <td key={j} style={{padding:"7px 12px",borderBottom:`1px solid ${T.border}`,color:T.textMd,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>
                              {typeof val==="number"?val.toLocaleString("pt-BR"):String(val??"")}
                            </td>
                          ))}
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Embed vs ref summary */}
      <Card>
        <SectionTitle>Decisões Embed vs. Reference</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {col:"cliente",        rel:"endereco[]",            tipo:"EMBED",  c:T.green, m:"Bounded ≤2, sempre com cliente"},
            {col:"cliente",        rel:"telefone[]",            tipo:"EMBED",  c:T.green, m:"Bounded, nunca consultado isolado"},
            {col:"empreendimento", rel:"unidade_imobiliaria[]", tipo:"EMBED",  c:T.gold,  m:"Consultas 1/2 sem $lookup"},
            {col:"empreendimento", rel:"unidade.cliente[]",     tipo:"DENORM", c:T.purple,m:"Snapshot: quem adquiriu"},
            {col:"venda",          rel:"parcela[]",             tipo:"EMBED",  c:T.gold,  m:"Consultas 4/5 com $filter"},
            {col:"venda",          rel:"cliente[]",             tipo:"DENORM", c:T.purple,m:"Consulta 6 sem $lookup"},
            {col:"venda",          rel:"vendedor",              tipo:"DENORM", c:T.purple,m:"Consulta 3 sem $lookup"},
            {col:"vendedor",       rel:"vendas[]",              tipo:"REF ARR",c:T.accent,m:"Unbounded — não embute"},
          ].map((d,i)=>(
            <div key={i} style={{background:T.row,border:`1px solid ${T.border}`,borderRadius:8,padding:12}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textSm,marginBottom:4}}>db.{d.col}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:d.c,fontWeight:600,marginBottom:6}}>{d.rel}</div>
              <span style={{fontSize:9,background:d.c+"18",border:`1px solid ${d.c}33`,color:d.c,padding:"2px 7px",borderRadius:3,letterSpacing:"0.8px"}}>{d.tipo}</span>
              <div style={{fontSize:10,color:T.textSm,marginTop:7,lineHeight:1.5}}>{d.m}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("dashboard");

  const empStats=useMemo(()=>EMPREENDIMENTOS.map(e=>({
    _id:e._id,nome:e.nome,
    vendidas:   e.unidade_imobiliaria.filter(u=>u.status==="Vendido").length,
    disponiveis:e.unidade_imobiliaria.filter(u=>u.status==="Em aberto").length,
    reservadas: e.unidade_imobiliaria.filter(u=>u.status==="Reservado").length,
    distratadas:e.unidade_imobiliaria.filter(u=>u.status==="Distratado").length,
    total:      e.unidade_imobiliaria.length,
    percentual: parseFloat(pct(e.unidade_imobiliaria.filter(u=>u.status==="Vendido").length,e.unidade_imobiliaria.length)),
  })),[]);

  const stats=useMemo(()=>{
    const all=EMPREENDIMENTOS.flatMap(e=>e.unidade_imobiliaria);
    return{total:all.length,vendidas:all.filter(u=>u.status==="Vendido").length,disponiveis:all.filter(u=>u.status==="Em aberto").length,reservadas:all.filter(u=>u.status==="Reservado").length,clientes:CLIENTES.length,vgv:VENDAS.reduce((s,v)=>s+(v.valor_venda??0),0)};
  },[]);

  const vendRanking=useMemo(()=>{
    const m={};VENDAS.forEach(v=>{const id=v.vendedor.vendedor_id;if(!m[id])m[id]={_id:id,nome:v.vendedor.nome,count:0};m[id].count++;});
    return Object.values(m).sort((a,b)=>b.count-a.count);
  },[]);

  const distratados=useMemo(()=>
    VENDAS.filter(v=>v.status==="Distratado").map(v=>{
      const resp=v.cliente.find(c=>c.responsavel_financeiro);
      const cli=CLIENTES.find(c=>c.cpf===resp?.cliente_id);
      const emAberto=v.parcela.filter(p=>!p.data_pagamento);
      return{...v,clienteInfo:cli,restantes:emAberto.length,valorAberto:emAberto.reduce((s,p)=>s+(p.valor_parcela??0),0)};
    })
  ,[]);

  const quitadas=useMemo(()=>{
    const total=VENDAS.length;
    const q=VENDAS.filter(v=>v.status==="Liquidado"||(v.quantidade_parcelas>0&&v.parcela.filter(p=>p.data_pagamento).length>=v.quantidade_parcelas)).length;
    return{total,quitadas:q,percentual:parseFloat(pct(q,total))};
  },[]);

  const topClientes=useMemo(()=>{
    const m={};
    VENDAS.forEach(v=>v.cliente.forEach(cl=>{const id=cl.cliente_id;if(!m[id])m[id]={_id:id,nome:cl.nome,total:0,pagas:0,emPagamento:0};m[id].total++;if(v.status==="Liquidado")m[id].pagas++;else if(v.status==="Financiado")m[id].emPagamento++;}));
    return Object.values(m).sort((a,b)=>b.total-a.total).slice(0,10);
  },[]);

  const props={stats,empStats,vendRanking,distratados,quitadas,topClientes};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.bg};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:${T.bg};}
        ::-webkit-scrollbar-thumb{background:${T.borderMd};border-radius:2px;}
      `}</style>
      <div style={{display:"flex",height:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',sans-serif",fontSize:13,overflow:"hidden"}}>
        <Sidebar page={page} setPage={setPage}/>
        <main style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
          {page==="dashboard"       &&<DashboardPage       {...props}/>}
          {page==="empreendimentos" &&<EmpreendimentosPage {...props}/>}
          {page==="unidades"        &&<UnidadesPage/>}
          {page==="clientes"        &&<ClientesPage        {...props}/>}
          {page==="vendedores"      &&<VendedoresPage      {...props}/>}
          {page==="vendas"          &&<VendasPage          {...props}/>}
          {page==="relatorios"      &&<RelatoriosPage      {...props}/>}
          {page==="schema"          &&<SchemaPage          {...props}/>}
        </main>
      </div>
    </>
  );
}