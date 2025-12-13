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

export type Modalidade = 'venda' | 'locacao' | 'lancamento' | 'temporada';

export interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  modalidade: Modalidade;
  preco: number;
  bairro: string;
  cidade: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  foto: string;
  condominio?: number;
  iptu?: number;
  descricao?: string;
  caracteristicas?: string[];
  entrega?: string;
  construtora?: string;
  novo?: boolean;
  baixouPreco?: boolean;
  favorito?: boolean;
  telefoneContato?: string;
}

export type TabType = 'home' | 'leads' | 'imoveis' | 'agenda' | 'perfil' | 'propostas';

export type NotificationType = 'lead' | 'visita' | 'proposta' | 'meta' | 'sistema';

export interface Notificacao {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
  link?: string;
}

export type PropostaStatus = 'pendente' | 'aceita' | 'recusada' | 'contra_proposta' | 'expirada';

export interface Proposta {
  id: string;
  user_id: string;
  lead_id: string;
  imovel_id: string;
  valor_proposta: number;
  status: PropostaStatus;
  observacoes?: string;
  validade?: string;
  created_at: string;
  updated_at: string;
}

export interface Checkin {
  id: string;
  user_id: string;
  compromisso_id: string;
  latitude: number | null;
  longitude: number | null;
  endereco_confirmado: string | null;
  observacoes: string | null;
  foto_url: string | null;
  created_at: string;
}
