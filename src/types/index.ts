export interface Corretor {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  ranking: number;
  meta: number;
  vendas: number;
  comissoes: number;
  taxaConversao: number;
  tempoMedioFechamento: number;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: 'novo' | 'quente' | 'morno' | 'frio' | 'negociacao' | 'fechado' | 'perdido';
  interesse: string;
  faixaPreco: string;
  bairros: string[];
  ultimoContato: string;
  avatar?: string;
}

export interface Compromisso {
  id: string;
  tipo: 'visita' | 'reuniao' | 'ligacao';
  data: string;
  hora: string;
  cliente: string;
  imovel?: string;
  endereco?: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'realizado';
}

export interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  preco: number;
  bairro: string;
  cidade: string;
  quartos: number;
  area: number;
  foto: string;
  novo?: boolean;
  baixouPreco?: boolean;
}

export type TabType = 'home' | 'leads' | 'novo' | 'agenda' | 'perfil';
