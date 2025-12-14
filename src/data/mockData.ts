import { Corretor, Lead, Compromisso, Imovel, Notificacao } from '@/types';

export const corretor: Corretor = {
  id: "1",
  nome: "Corretor de imóveis",
  email: "joao@larbase.com",
  cargo: "Corretor Senior",
  ranking: 2,
  meta: 15,
  vendas: 12,
  comissoes: 45000,
  taxaConversao: 68,
  tempoMedioFechamento: 15,
};

export const leads: Lead[] = [
  {
    id: "1",
    nome: "Maria Santos",
    telefone: "(11) 99999-9999",
    email: "maria@email.com",
    status: "quente",
    interesse: "Apartamento 3 quartos",
    faixaPreco: "600k - 800k",
    bairros: ["Jardins", "Pinheiros"],
    ultimoContato: "2024-01-10",
  },
  {
    id: "2",
    nome: "Carlos Oliveira",
    telefone: "(11) 98888-8888",
    email: "carlos@email.com",
    status: "negociacao",
    interesse: "Casa com piscina",
    faixaPreco: "1M - 1.5M",
    bairros: ["Morumbi", "Alto de Pinheiros"],
    ultimoContato: "2024-01-12",
  },
  {
    id: "3",
    nome: "Ana Paula Costa",
    telefone: "(11) 97777-7777",
    email: "ana@email.com",
    status: "novo",
    interesse: "Studio ou 1 quarto",
    faixaPreco: "300k - 450k",
    bairros: ["Vila Madalena", "Perdizes"],
    ultimoContato: "2024-01-14",
  },
  {
    id: "4",
    nome: "Roberto Mendes",
    telefone: "(11) 96666-6666",
    email: "roberto@email.com",
    status: "morno",
    interesse: "Apartamento 2 quartos",
    faixaPreco: "500k - 700k",
    bairros: ["Brooklin", "Itaim Bibi"],
    ultimoContato: "2024-01-08",
  },
  {
    id: "5",
    nome: "Fernanda Lima",
    telefone: "(11) 95555-5555",
    email: "fernanda@email.com",
    status: "quente",
    interesse: "Cobertura duplex",
    faixaPreco: "2M - 3M",
    bairros: ["Jardins"],
    ultimoContato: "2024-01-13",
  },
];

// Helper to generate dynamic dates
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const compromissos: Compromisso[] = [
  {
    id: "1",
    tipo: "visita",
    data: getDateString(0), // Today
    hora: "09:00",
    cliente: "Maria Santos",
    imovel: "Apt 3q Jardins",
    endereco: "Rua das Flores, 123 - Jardins",
    status: "confirmado",
  },
  {
    id: "2",
    tipo: "ligacao",
    data: getDateString(0), // Today
    hora: "11:30",
    cliente: "Carlos Oliveira",
    imovel: "Proposta pendente",
    status: "pendente",
  },
  {
    id: "3",
    tipo: "visita",
    data: getDateString(0), // Today
    hora: "14:00",
    cliente: "Ana Paula Costa",
    imovel: "Studio Vila Madalena",
    endereco: "Rua Harmonia, 456 - Vila Madalena",
    status: "pendente",
  },
  {
    id: "4",
    tipo: "reuniao",
    data: getDateString(0), // Today
    hora: "16:30",
    cliente: "Roberto Mendes",
    imovel: "Discussão de contrato",
    status: "pendente",
  },
  {
    id: "5",
    tipo: "visita",
    data: getDateString(1), // Tomorrow
    hora: "10:00",
    cliente: "Fernanda Lima",
    imovel: "Cobertura Jardins",
    endereco: "Al. Lorena, 789 - Jardins",
    status: "confirmado",
  },
  {
    id: "6",
    tipo: "ligacao",
    data: getDateString(1), // Tomorrow
    hora: "15:00",
    cliente: "Pedro Almeida",
    imovel: "Follow-up proposta",
    status: "pendente",
  },
  {
    id: "7",
    tipo: "visita",
    data: getDateString(2), // Day after tomorrow
    hora: "11:00",
    cliente: "Juliana Ferreira",
    imovel: "Casa Morumbi",
    endereco: "Rua das Palmeiras, 200 - Morumbi",
    status: "pendente",
  },
  {
    id: "8",
    tipo: "reuniao",
    data: getDateString(3),
    hora: "14:00",
    cliente: "Ricardo Souza",
    imovel: "Fechamento contrato",
    status: "confirmado",
  },
];

export const imoveis: Imovel[] = [
  {
    id: "1",
    titulo: "Apartamento Moderno",
    tipo: "Apartamento",
    modalidade: "venda",
    preco: 850000,
    bairro: "Jardins",
    cidade: "São Paulo",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: 120,
    condominio: 1200,
    iptu: 4800,
    descricao: "Lindo apartamento com acabamento de alto padrão, varanda gourmet e vista para o parque.",
    caracteristicas: ["Varanda Gourmet", "Vista Livre", "Piso Porcelanato", "Ar Condicionado"],
    foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    novo: true,
    telefoneContato: "(11) 99999-1111",
  },
  {
    id: "2",
    titulo: "Casa com Jardim",
    tipo: "Casa",
    modalidade: "venda",
    preco: 1200000,
    bairro: "Morumbi",
    cidade: "São Paulo",
    quartos: 4,
    banheiros: 3,
    vagas: 4,
    area: 280,
    iptu: 8500,
    descricao: "Ampla casa com jardim, piscina e área gourmet. Perfeita para família.",
    caracteristicas: ["Piscina", "Churrasqueira", "Jardim", "Escritório", "Suíte Master"],
    foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    baixouPreco: true,
    telefoneContato: "(11) 99999-2222",
  },
  {
    id: "3",
    titulo: "Studio Compacto",
    tipo: "Studio",
    modalidade: "locacao",
    preco: 2800,
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    quartos: 1,
    banheiros: 1,
    vagas: 1,
    area: 35,
    condominio: 450,
    descricao: "Studio moderno e funcional, próximo ao metrô e comércios.",
    caracteristicas: ["Mobiliado", "Próximo ao Metrô", "Academia no Prédio"],
    foto: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
    novo: true,
    telefoneContato: "(11) 99999-3333",
  },
  {
    id: "4",
    titulo: "Cobertura Duplex",
    tipo: "Cobertura",
    modalidade: "venda",
    preco: 2500000,
    bairro: "Itaim Bibi",
    cidade: "São Paulo",
    quartos: 4,
    banheiros: 5,
    vagas: 4,
    area: 320,
    condominio: 3500,
    iptu: 15000,
    descricao: "Cobertura duplex com terraço, piscina privativa e vista panorâmica.",
    caracteristicas: ["Piscina Privativa", "Terraço", "Vista Panorâmica", "Home Theater", "Lareira"],
    foto: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    telefoneContato: "(11) 99999-4444",
  },
  {
    id: "5",
    titulo: "Residencial Aurora",
    tipo: "Apartamento",
    modalidade: "lancamento",
    preco: 450000,
    bairro: "Pinheiros",
    cidade: "São Paulo",
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    area: 65,
    entrega: "Dez/2025",
    construtora: "MRV Engenharia",
    descricao: "Lançamento exclusivo com lazer completo e localização privilegiada.",
    caracteristicas: ["Lazer Completo", "Próximo ao Metrô", "Rooftop", "Coworking"],
    foto: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    novo: true,
    telefoneContato: "(11) 99999-5555",
  },
  {
    id: "6",
    titulo: "Casa de Praia",
    tipo: "Casa",
    modalidade: "temporada",
    preco: 650,
    bairro: "Riviera de São Lourenço",
    cidade: "Bertioga",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: 150,
    descricao: "Casa aconchegante na praia, perfeita para férias em família.",
    caracteristicas: ["Churrasqueira", "Próximo à Praia", "Wi-Fi", "TV a Cabo"],
    foto: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    telefoneContato: "(11) 99999-6666",
  },
];

export const notificacoes: Notificacao[] = [
  {
    id: "1",
    tipo: "lead",
    titulo: "Novo lead atribuído",
    mensagem: "Ana Paula Costa foi atribuída a você. Interesse em Studio ou 1 quarto.",
    lida: false,
    data: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "2",
    tipo: "visita",
    titulo: "Lembrete de visita",
    mensagem: "Visita com Maria Santos às 09:00 no Apt 3q Jardins.",
    lida: false,
    data: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "3",
    tipo: "proposta",
    titulo: "Proposta aceita!",
    mensagem: "Carlos Oliveira aceitou sua proposta para Casa com Jardim no Morumbi.",
    lida: false,
    data: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "4",
    tipo: "meta",
    titulo: "80% da meta atingida",
    mensagem: "Parabéns! Você está a 3 vendas de bater sua meta mensal.",
    lida: true,
    data: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "5",
    tipo: "sistema",
    titulo: "Atualização do sistema",
    mensagem: "Nova versão do app disponível com melhorias de desempenho.",
    lida: true,
    data: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export const getRankingBadge = (ranking: number): string => {
  if (ranking === 1) return "🥇";
  if (ranking === 2) return "🥈";
  if (ranking === 3) return "🥉";
  return `#${ranking}`;
};

export const getStatusColor = (status: Lead['status']): string => {
  const colors = {
    novo: 'bg-info',
    quente: 'bg-destructive',
    morno: 'bg-warning',
    frio: 'bg-muted-foreground',
    negociacao: 'bg-success',
    fechado: 'bg-success',
    perdido: 'bg-muted-foreground',
  };
  return colors[status] || 'bg-muted-foreground';
};

export const getStatusLabel = (status: Lead['status']): string => {
  const labels = {
    novo: 'Novo',
    quente: 'Quente',
    morno: 'Morno',
    frio: 'Frio',
    negociacao: 'Em Negociação',
    fechado: 'Fechado',
    perdido: 'Perdido',
  };
  return labels[status] || status;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPhone = (phone: string): string => {
  return phone;
};

export const getTimeSinceContact = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "há 1 dia";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  return `há ${Math.floor(diffDays / 30)} meses`;
};
