import { Corretor, Lead, Compromisso, Imovel } from '@/types';

export const corretor: Corretor = {
  id: "1",
  nome: "Larbase",
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

export const compromissos: Compromisso[] = [
  {
    id: "1",
    tipo: "visita",
    data: "2024-01-15",
    hora: "09:00",
    cliente: "Maria Santos",
    imovel: "Apt 3q Jardins",
    endereco: "Rua das Flores, 123 - Jardins",
    status: "confirmado",
  },
  {
    id: "2",
    tipo: "ligacao",
    data: "2024-01-15",
    hora: "11:30",
    cliente: "Carlos Oliveira",
    imovel: "Proposta pendente",
    status: "pendente",
  },
  {
    id: "3",
    tipo: "visita",
    data: "2024-01-15",
    hora: "14:00",
    cliente: "Ana Paula Costa",
    imovel: "Studio Vila Madalena",
    endereco: "Rua Harmonia, 456 - Vila Madalena",
    status: "confirmado",
  },
  {
    id: "4",
    tipo: "reuniao",
    data: "2024-01-15",
    hora: "16:30",
    cliente: "Roberto Mendes",
    imovel: "Discussão de contrato",
    status: "pendente",
  },
  {
    id: "5",
    tipo: "visita",
    data: "2024-01-16",
    hora: "10:00",
    cliente: "Fernanda Lima",
    imovel: "Cobertura Jardins",
    endereco: "Al. Lorena, 789 - Jardins",
    status: "confirmado",
  },
];

export const imoveis: Imovel[] = [
  {
    id: "1",
    titulo: "Apartamento Moderno",
    tipo: "Apartamento",
    preco: 850000,
    bairro: "Jardins",
    cidade: "São Paulo",
    quartos: 3,
    area: 120,
    foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    novo: true,
  },
  {
    id: "2",
    titulo: "Casa com Jardim",
    tipo: "Casa",
    preco: 1200000,
    bairro: "Morumbi",
    cidade: "São Paulo",
    quartos: 4,
    area: 280,
    foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    baixouPreco: true,
  },
  {
    id: "3",
    titulo: "Studio Compacto",
    tipo: "Studio",
    preco: 380000,
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    quartos: 1,
    area: 35,
    foto: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
    novo: true,
  },
  {
    id: "4",
    titulo: "Cobertura Duplex",
    tipo: "Cobertura",
    preco: 2500000,
    bairro: "Itaim Bibi",
    cidade: "São Paulo",
    quartos: 4,
    area: 320,
    foto: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
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
