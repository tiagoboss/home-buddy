/**
 * FRAMER EXPORT - Real Estate Broker App
 * 
 * Este é um app completo em React puro, sem dependências externas.
 * Cole este código no Framer como um Code Component.
 * 
 * INSTRUÇÕES:
 * 1. No Framer, vá em Assets > Code > New Component
 * 2. Cole todo este código
 * 3. Use o componente FramerApp na sua página
 */

import React, { useState, useEffect, useRef, ReactNode, TouchEvent as ReactTouchEvent } from 'react';

// ========================
// TYPES
// ========================

type TabType = 'home' | 'leads' | 'novo' | 'agenda' | 'perfil';
type QuickActionType = 'lead' | 'visita' | 'imovel' | 'proposta' | 'ligacao' | 'checkin' | null;
type LeadStatus = 'novo' | 'quente' | 'morno' | 'frio' | 'negociacao' | 'fechado' | 'perdido';
type CompromissoTipo = 'visita' | 'ligacao' | 'reuniao';
type CompromissoStatus = 'pendente' | 'confirmado' | 'cancelado' | 'realizado';

interface Corretor {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ranking: number;
  meta: number;
  vendas: number;
  comissoes: number;
  taxaConversao: number;
  tempoMedioFechamento: number;
}

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: LeadStatus;
  interesse: string;
  faixaPreco: string;
  bairros: string[];
  ultimoContato: string;
}

interface Compromisso {
  id: string;
  tipo: CompromissoTipo;
  data: string;
  hora: string;
  cliente: string;
  imovel?: string;
  endereco?: string;
  status: CompromissoStatus;
}

interface Imovel {
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

// ========================
// MOCK DATA
// ========================

const corretor: Corretor = {
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

const leads: Lead[] = [
  { id: "1", nome: "Maria Santos", telefone: "(11) 99999-9999", email: "maria@email.com", status: "quente", interesse: "Apartamento 3 quartos", faixaPreco: "600k - 800k", bairros: ["Jardins", "Pinheiros"], ultimoContato: "2024-01-10" },
  { id: "2", nome: "Carlos Oliveira", telefone: "(11) 98888-8888", email: "carlos@email.com", status: "negociacao", interesse: "Casa com piscina", faixaPreco: "1M - 1.5M", bairros: ["Morumbi"], ultimoContato: "2024-01-12" },
  { id: "3", nome: "Ana Paula Costa", telefone: "(11) 97777-7777", email: "ana@email.com", status: "novo", interesse: "Studio ou 1 quarto", faixaPreco: "300k - 450k", bairros: ["Vila Madalena"], ultimoContato: "2024-01-14" },
  { id: "4", nome: "Roberto Mendes", telefone: "(11) 96666-6666", email: "roberto@email.com", status: "morno", interesse: "Apartamento 2 quartos", faixaPreco: "500k - 700k", bairros: ["Brooklin"], ultimoContato: "2024-01-08" },
  { id: "5", nome: "Fernanda Lima", telefone: "(11) 95555-5555", email: "fernanda@email.com", status: "quente", interesse: "Cobertura duplex", faixaPreco: "2M - 3M", bairros: ["Jardins"], ultimoContato: "2024-01-13" },
];

const compromissos: Compromisso[] = [
  { id: "1", tipo: "visita", data: "2024-01-15", hora: "09:00", cliente: "Maria Santos", imovel: "Apt 3q Jardins", endereco: "Rua das Flores, 123 - Jardins", status: "confirmado" },
  { id: "2", tipo: "ligacao", data: "2024-01-15", hora: "11:30", cliente: "Carlos Oliveira", imovel: "Proposta pendente", status: "pendente" },
  { id: "3", tipo: "visita", data: "2024-01-15", hora: "14:00", cliente: "Ana Paula Costa", imovel: "Studio Vila Madalena", endereco: "Rua Harmonia, 456", status: "confirmado" },
  { id: "4", tipo: "reuniao", data: "2024-01-15", hora: "16:30", cliente: "Roberto Mendes", imovel: "Discussão de contrato", status: "pendente" },
];

const imoveis: Imovel[] = [
  { id: "1", titulo: "Apartamento Moderno", tipo: "Apartamento", preco: 850000, bairro: "Jardins", cidade: "São Paulo", quartos: 3, area: 120, foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop", novo: true },
  { id: "2", titulo: "Casa com Jardim", tipo: "Casa", preco: 1200000, bairro: "Morumbi", cidade: "São Paulo", quartos: 4, area: 280, foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop", baixouPreco: true },
  { id: "3", titulo: "Studio Compacto", tipo: "Studio", preco: 380000, bairro: "Vila Madalena", cidade: "São Paulo", quartos: 1, area: 35, foto: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop", novo: true },
];

// ========================
// UTILITIES
// ========================

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getRankingBadge = (ranking: number): string => {
  if (ranking === 1) return "🥇";
  if (ranking === 2) return "🥈";
  if (ranking === 3) return "🥉";
  return `#${ranking}`;
};

const getStatusColor = (status: LeadStatus): string => {
  const colors: Record<LeadStatus, string> = {
    novo: '#0ea5e9',
    quente: '#ef4444',
    morno: '#f59e0b',
    frio: '#6b7280',
    negociacao: '#22c55e',
    fechado: '#22c55e',
    perdido: '#6b7280',
  };
  return colors[status] || '#6b7280';
};

const getStatusLabel = (status: LeadStatus): string => {
  const labels: Record<LeadStatus, string> = {
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

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

const getTimeSinceContact = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "há 1 dia";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  return `há ${Math.floor(diffDays / 30)} meses`;
};

// ========================
// STYLES (inline for Framer)
// ========================

const styles = {
  // Colors
  colors: {
    background: '#fafafa',
    foreground: '#1f2937',
    card: '#ffffff',
    border: '#e5e7eb',
    muted: '#9ca3af',
    primary: '#1f2937',
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    success: '#22c55e',
    warning: '#f59e0b',
    destructive: '#ef4444',
    info: '#0ea5e9',
  },
  
  // Base styles
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    padding: 16,
  } as React.CSSProperties,
  
  deviceFrame: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: 390,
    height: 844,
    backgroundColor: '#fafafa',
    borderRadius: 44,
    overflow: 'hidden',
    border: '12px solid #1f2937',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  } as React.CSSProperties,
  
  dynamicIsland: {
    position: 'absolute' as const,
    top: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 100,
    height: 28,
    backgroundColor: '#1f2937',
    borderRadius: 14,
    zIndex: 50,
  } as React.CSSProperties,
  
  homeIndicator: {
    position: 'absolute' as const,
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 134,
    height: 5,
    backgroundColor: 'rgba(31, 41, 55, 0.3)',
    borderRadius: 3,
    zIndex: 50,
  } as React.CSSProperties,
  
  appContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    position: 'relative' as const,
  } as React.CSSProperties,
  
  statusBar: {
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
  } as React.CSSProperties,
  
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    paddingBottom: 100,
  } as React.CSSProperties,
  
  tabBar: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid #e5e7eb',
    zIndex: 40,
  } as React.CSSProperties,
  
  tabBarInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '8px 8px 32px',
  } as React.CSSProperties,
  
  tab: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '4px 12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  centerTab: {
    marginTop: -24,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  } as React.CSSProperties,
  
  // Cards
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  } as React.CSSProperties,
  
  // Modal/Sheet
  overlay: {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
  } as React.CSSProperties,
  
  sheet: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 50,
    maxHeight: '80%',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    borderRadius: 2,
    margin: '12px auto 8px',
  } as React.CSSProperties,
};

// ========================
// ICONS (SVG inline)
// ========================

const Icons = {
  Home: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Plus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Camera: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  ),
  Phone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ClipboardList: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Bed: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  ),
  Maximize2: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Signal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  Battery: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/>
    </svg>
  ),
};

// ========================
// COMPONENTS
// ========================

// StatusBar Component
const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.statusBar}>
      <span>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icons.Signal />
        <Icons.Wifi />
        <Icons.Battery />
      </div>
    </div>
  );
};

// Header Component
const Header = () => (
  <header style={{ 
    backgroundColor: 'rgba(250, 250, 250, 0.9)', 
    backdropFilter: 'blur(10px)', 
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(31,41,55,0.2), rgba(31,41,55,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: '#1f2937',
        position: 'relative'
      }}>
        {corretor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
        <span style={{ position: 'absolute', bottom: -4, right: -4, fontSize: 14 }}>
          {getRankingBadge(corretor.ranking)}
        </span>
      </div>
      <div>
        <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>{getGreeting()},</p>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>
          {corretor.nome.split(' ')[0]}!
        </h1>
      </div>
    </div>
    <button style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f3f4f6',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <Icons.Bell />
      <span style={{
        position: 'absolute',
        top: -2,
        right: -2,
        width: 20,
        height: 20,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 700,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>3</span>
    </button>
  </header>
);

// KPI Card Component
const KPICard = ({ icon: Icon, value, label, bgColor }: { icon: React.FC; value: string | number; label: string; bgColor: string }) => (
  <div style={{
    ...styles.card,
    flexShrink: 0,
    width: 100,
    padding: 12,
  }}>
    <div style={{
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      color: '#fff'
    }}>
      <Icon />
    </div>
    <p style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', margin: 0 }}>{value}</p>
    <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>{label}</p>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ current, total, label }: { current: number; total: number; label: string }) => {
  const percentage = Math.min((current / total) * 100, 100);
  const color = percentage >= 100 ? '#22c55e' : percentage >= 80 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ ...styles.card, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{current} de {total}</span>
      </div>
      <div style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          backgroundColor: color, 
          borderRadius: 6,
          transition: 'width 0.7s ease-out'
        }} />
      </div>
      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '8px 0 0' }}>
        {Math.round(percentage)}% alcançado
      </p>
    </div>
  );
};

// Compromisso Card Component
const CompromissoCard = ({ compromisso, onClick }: { compromisso: Compromisso; onClick?: () => void }) => {
  const tipoConfig = {
    visita: { icon: Icons.Home, color: '#22c55e', label: 'Visita' },
    ligacao: { icon: Icons.Phone, color: '#0ea5e9', label: 'Ligação' },
    reuniao: { icon: Icons.Users, color: '#f59e0b', label: 'Reunião' },
  };
  const config = tipoConfig[compromisso.tipo];
  const Icon = config.icon;

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: `${config.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: config.color
        }}>
          <Icon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{compromisso.hora}</span>
            <span style={{ fontSize: 12, color: '#9ca3af', padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: 12 }}>
              {config.label}
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#1f2937', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {compromisso.cliente}
          </p>
          {compromisso.endereco && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#9ca3af' }}>
              <Icons.MapPin />
              <p style={{ fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {compromisso.endereco}
              </p>
            </div>
          )}
        </div>
      </div>
      <div style={{ color: '#9ca3af' }}>
        <Icons.ChevronRight />
      </div>
    </div>
  );
};

// Lead Card Compact Component
const LeadCardCompact = ({ lead }: { lead: Lead }) => (
  <div style={{
    ...styles.card,
    flexShrink: 0,
    width: 110,
    padding: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(31,41,55,0.2), rgba(31,41,55,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 600,
        color: '#1f2937'
      }}>
        {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: getStatusColor(lead.status)
      }} />
    </div>
    <p style={{ fontSize: 12, fontWeight: 500, color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {lead.nome.split(' ')[0]}
    </p>
    <p style={{ fontSize: 9, color: '#9ca3af', margin: '2px 0 0' }}>
      {getTimeSinceContact(lead.ultimoContato)}
    </p>
  </div>
);

// Imovel Card Component
const ImovelCard = ({ imovel }: { imovel: Imovel }) => (
  <div style={{
    ...styles.card,
    flexShrink: 0,
    width: 160,
    overflow: 'hidden',
  }}>
    <div style={{ position: 'relative' }}>
      <img 
        src={imovel.foto} 
        alt={imovel.titulo}
        style={{ width: '100%', height: 80, objectFit: 'cover' }}
      />
      {imovel.novo && (
        <span style={{
          position: 'absolute',
          top: 6,
          left: 6,
          fontSize: 9,
          fontWeight: 600,
          padding: '2px 6px',
          backgroundColor: '#22c55e',
          color: '#fff',
          borderRadius: 8
        }}>Novo</span>
      )}
      {imovel.baixouPreco && (
        <span style={{
          position: 'absolute',
          top: 6,
          left: 6,
          fontSize: 9,
          fontWeight: 600,
          padding: '2px 6px',
          backgroundColor: '#f59e0b',
          color: '#fff',
          borderRadius: 8
        }}>Baixou</span>
      )}
    </div>
    <div style={{ padding: 10 }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0 }}>
        {formatCurrency(imovel.preco)}
      </p>
      <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {imovel.bairro}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, color: '#9ca3af' }}>
          <Icons.Bed />
          <span>{imovel.quartos}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, color: '#9ca3af' }}>
          <Icons.Maximize2 />
          <span>{imovel.area}m²</span>
        </div>
      </div>
    </div>
  </div>
);

// Quick Actions Sheet (Modal)
const QuickActionsSheet = ({ isOpen, onClose, onActionSelect }: { isOpen: boolean; onClose: () => void; onActionSelect: (action: QuickActionType) => void }) => {
  if (!isOpen) return null;

  const actions = [
    { icon: Icons.FileText, label: 'Registrar Lead', color: '#0ea5e9', action: 'lead' as QuickActionType },
    { icon: Icons.Calendar, label: 'Agendar Visita', color: '#22c55e', action: 'visita' as QuickActionType },
    { icon: Icons.Camera, label: 'Capturar Imóvel', color: '#f59e0b', action: 'imovel' as QuickActionType },
    { icon: Icons.ClipboardList, label: 'Nova Proposta', color: '#f3f4f6', action: 'proposta' as QuickActionType },
    { icon: Icons.Phone, label: 'Registrar Ligação', color: '#e5e7eb', action: 'ligacao' as QuickActionType },
    { icon: Icons.MapPin, label: 'Check-in Visita', color: '#ef4444', action: 'checkin' as QuickActionType },
  ];

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.sheet}>
        <div style={styles.sheetHandle} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>Ação Rápida</h2>
          <button 
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icons.X />
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          padding: '0 20px 32px'
        }}>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                onClose();
                onActionSelect(action.action);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(243, 244, 246, 0.5)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: action.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: action.color === '#f3f4f6' || action.color === '#e5e7eb' ? '#6b7280' : '#fff'
              }}>
                <action.icon />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1f2937', textAlign: 'center' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// Compromisso Detail Modal
const CompromissoDetailModal = ({ compromisso, isOpen, onClose }: { compromisso: Compromisso | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !compromisso) return null;

  const tipoConfig = {
    visita: { icon: Icons.Home, color: '#22c55e', label: 'Visita' },
    ligacao: { icon: Icons.Phone, color: '#0ea5e9', label: 'Ligação' },
    reuniao: { icon: Icons.Users, color: '#f59e0b', label: 'Reunião' },
  };
  const config = tipoConfig[compromisso.tipo];
  const Icon = config.icon;

  const statusConfig: Record<CompromissoStatus, { label: string; bgColor: string; color: string }> = {
    pendente: { label: 'Pendente', bgColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
    confirmado: { label: 'Confirmado', bgColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
    cancelado: { label: 'Cancelado', bgColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    realizado: { label: 'Realizado', bgColor: '#f3f4f6', color: '#6b7280' },
  };
  const status = statusConfig[compromisso.status];

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={{ ...styles.sheet, maxHeight: '70%' }}>
        <div style={styles.sheetHandle} />
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px 24px' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Icon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', margin: 0 }}>{config.label}</h2>
              <span style={{
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 8px',
                borderRadius: 8,
                backgroundColor: status.bgColor,
                color: status.color
              }}>{status.label}</span>
            </div>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>{compromisso.cliente}</p>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            marginBottom: 12
          }}>
            <div style={{ color: '#6b7280' }}><Icons.Calendar /></div>
            <div>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{compromisso.data}</p>
              <p style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>{compromisso.hora}</p>
            </div>
          </div>

          {compromisso.imovel && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 12,
              marginBottom: 12
            }}>
              <div style={{ color: '#6b7280' }}><Icons.Home /></div>
              <p style={{ fontSize: 16, color: '#1f2937', margin: 0 }}>{compromisso.imovel}</p>
            </div>
          )}

          {compromisso.endereco && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 12
            }}>
              <div style={{ color: '#6b7280' }}><Icons.MapPin /></div>
              <p style={{ fontSize: 16, color: '#1f2937', margin: 0, flex: 1 }}>{compromisso.endereco}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {compromisso.status !== 'realizado' && compromisso.status !== 'cancelado' && (
          <div style={{ padding: '0 16px 32px' }}>
            <button style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: 16,
              backgroundColor: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 12
            }}>
              <Icons.Check />
              {compromisso.status === 'pendente' ? 'Confirmar Compromisso' : 'Marcar como Realizado'}
            </button>
            <button style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: 16,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <Icons.X />
              Cancelar Compromisso
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Form Modal (Generic)
const FormModal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={{ ...styles.sheet, maxHeight: '85%' }}>
        <div style={styles.sheetHandle} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>{title}</h2>
          <button 
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icons.X />
          </button>
        </div>
        <div style={{ padding: 16, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </>
  );
};

// Lead Form
const LeadFormContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Nome</label>
      <input type="text" placeholder="Nome do lead" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Telefone</label>
      <input type="tel" placeholder="(00) 00000-0000" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Email</label>
      <input type="email" placeholder="email@exemplo.com" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Interesse</label>
      <input type="text" placeholder="Ex: Apartamento 3 quartos" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <button style={{
      width: '100%',
      padding: 16,
      backgroundColor: '#1f2937',
      color: '#fff',
      border: 'none',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8
    }}>
      Salvar Lead
    </button>
  </div>
);

// Visita Form
const VisitaFormContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Cliente</label>
      <select style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none',
        backgroundColor: '#fff'
      }}>
        <option>Selecione um lead</option>
        {leads.map(lead => (
          <option key={lead.id} value={lead.id}>{lead.nome}</option>
        ))}
      </select>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Data</label>
      <input type="date" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Hora</label>
      <input type="time" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Endereço</label>
      <input type="text" placeholder="Endereço do imóvel" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <button style={{
      width: '100%',
      padding: 16,
      backgroundColor: '#22c55e',
      color: '#fff',
      border: 'none',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8
    }}>
      Agendar Visita
    </button>
  </div>
);

// Imovel Form
const ImovelFormContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Título</label>
      <input type="text" placeholder="Ex: Apartamento Moderno" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Preço</label>
      <input type="number" placeholder="R$ 500.000" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Quartos</label>
        <input type="number" placeholder="3" style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          fontSize: 16,
          outline: 'none'
        }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Área (m²)</label>
        <input type="number" placeholder="120" style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          fontSize: 16,
          outline: 'none'
        }} />
      </div>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Bairro</label>
      <input type="text" placeholder="Ex: Jardins" style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none'
      }} />
    </div>
    <button style={{
      width: '100%',
      padding: 16,
      backgroundColor: '#f59e0b',
      color: '#fff',
      border: 'none',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8
    }}>
      Salvar Imóvel
    </button>
  </div>
);

// Ligação Form
const LigacaoFormContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Lead</label>
      <select style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none',
        backgroundColor: '#fff'
      }}>
        <option>Selecione um lead</option>
        {leads.map(lead => (
          <option key={lead.id} value={lead.id}>{lead.nome}</option>
        ))}
      </select>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 6 }}>Descrição</label>
      <textarea placeholder="Descreva a ligação..." rows={4} style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        fontSize: 16,
        outline: 'none',
        resize: 'none'
      }} />
    </div>
    <button style={{
      width: '100%',
      padding: 16,
      backgroundColor: '#1f2937',
      color: '#fff',
      border: 'none',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8
    }}>
      Registrar Ligação
    </button>
  </div>
);

// ========================
// PAGES
// ========================

// Home Page
const HomePage = () => {
  const hotLeads = leads.filter(l => l.status === 'quente' || l.status === 'negociacao');
  const todayCompromissos = compromissos.slice(0, 3);

  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      <main style={{ padding: '16px 0' }}>
        {/* KPIs */}
        <section style={{ padding: '0 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            <KPICard icon={Icons.DollarSign} value={corretor.vendas} label="vendas" bgColor="#22c55e" />
            <KPICard icon={Icons.TrendingUp} value={`${corretor.taxaConversao}%`} label="conversão" bgColor="#0ea5e9" />
            <KPICard icon={Icons.Target} value={`${Math.round((corretor.vendas / corretor.meta) * 100)}%`} label="meta" bgColor="#f59e0b" />
            <KPICard icon={Icons.Clock} value={`${corretor.tempoMedioFechamento}d`} label="fechamento" bgColor="#1f2937" />
          </div>
        </section>

        {/* Progress */}
        <section style={{ padding: '0 16px', marginBottom: 20 }}>
          <ProgressBar current={corretor.vendas} total={corretor.meta} label="Meta Mensal" />
        </section>

        {/* Próximos Compromissos */}
        <section style={{ padding: '0 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
              Próximos Compromissos
            </h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#1f2937', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              Ver todos
              <Icons.ChevronRight />
            </button>
          </div>
          <div style={{ ...styles.card, overflow: 'hidden' }}>
            {todayCompromissos.map((c) => (
              <CompromissoCard key={c.id} compromisso={c} />
            ))}
          </div>
        </section>

        {/* Leads Quentes */}
        <section style={{ padding: '0 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
              Leads Quentes
            </h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#1f2937', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              Ver todos
              <Icons.ChevronRight />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {hotLeads.map((lead) => (
              <LeadCardCompact key={lead.id} lead={lead} />
            ))}
          </div>
        </section>

        {/* Imóveis */}
        <section style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
              Imóveis em Destaque
            </h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#1f2937', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              Ver todos
              <Icons.ChevronRight />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {imoveis.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// Leads Page
const LeadsPage = () => (
  <div style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
    <header style={{ padding: 16, backgroundColor: 'rgba(250,250,250,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: '0 0 12px' }}>Meus Leads</h1>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Buscar por nome ou telefone..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            borderRadius: 12,
            border: 'none',
            backgroundColor: '#f3f4f6',
            fontSize: 16,
            outline: 'none'
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
        {['Todos', 'Novos', 'Quentes', 'Mornos'].map((filter, i) => (
          <button key={filter} style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: i === 0 ? '#1f2937' : '#f3f4f6',
            color: i === 0 ? '#fff' : '#6b7280',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0
          }}>{filter}</button>
        ))}
      </div>
    </header>
    <main style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {leads.map((lead) => (
          <div key={lead.id} style={{
            ...styles.card,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(31,41,55,0.2), rgba(31,41,55,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: '#1f2937',
              flexShrink: 0
            }}>
              {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.nome}
                </p>
                <span style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: 10,
                  backgroundColor: getStatusColor(lead.status),
                  color: '#fff'
                }}>{getStatusLabel(lead.status)}</span>
              </div>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lead.interesse}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                {lead.telefone} • {getTimeSinceContact(lead.ultimoContato)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

// Agenda Page
const AgendaPage = ({ onCompromissoClick }: { onCompromissoClick: (c: Compromisso) => void }) => (
  <div style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
    <header style={{ padding: 16, backgroundColor: 'rgba(250,250,250,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: '0 0 12px' }}>Agenda</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.ChevronLeft />
        </button>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#1f2937', margin: 0 }}>Segunda-feira, 15 de Janeiro</p>
        <button style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.ChevronRight />
        </button>
      </div>
      <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4 }}>
        {['Dia', 'Semana', 'Mês'].map((view, i) => (
          <button key={view} style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: 'none',
            backgroundColor: i === 0 ? '#fff' : 'transparent',
            color: i === 0 ? '#1f2937' : '#6b7280',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}>{view}</button>
        ))}
      </div>
    </header>
    <main style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {compromissos.map((c) => (
          <div key={c.id} onClick={() => onCompromissoClick(c)} style={{ cursor: 'pointer' }}>
            <CompromissoCard compromisso={c} />
          </div>
        ))}
      </div>
    </main>
  </div>
);

// Perfil Page
const PerfilPage = () => (
  <div style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
    <header style={{ padding: '24px 16px', textAlign: 'center' }}>
      <div style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        background: 'linear-gradient(135deg, rgba(31,41,55,0.2), rgba(31,41,55,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 700,
        color: '#1f2937',
        margin: '0 auto 12px',
        position: 'relative'
      }}>
        {corretor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
        <span style={{ position: 'absolute', bottom: -4, right: 0, fontSize: 24 }}>
          {getRankingBadge(corretor.ranking)}
        </span>
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', margin: 0 }}>{corretor.nome}</h1>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{corretor.cargo}</p>
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Corretor desde 2020</p>
    </header>

    <section style={{ padding: '0 16px 24px' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icons.TrendingUp />
        Minha Performance
      </h2>
      <div style={{ ...styles.card, overflow: 'hidden' }}>
        {[
          { label: 'Vendas este mês', value: `${corretor.vendas} / ${corretor.meta}`, sub: '80%' },
          { label: 'Comissões', value: formatCurrency(corretor.comissoes), sub: '' },
          { label: 'Taxa de conversão', value: `${corretor.taxaConversao}%`, sub: '' },
          { label: 'Ranking', value: `#${corretor.ranking}`, sub: 'de 12' },
        ].map((stat, i, arr) => (
          <div key={stat.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none'
          }}>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{stat.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{stat.value}</span>
              {stat.sub && <span style={{ fontSize: 12, color: '#9ca3af' }}>({stat.sub})</span>}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '0 16px' }}>
      <div style={{ ...styles.card, overflow: 'hidden' }}>
        {[
          { label: 'Notificações', value: 'Ativadas' },
          { label: 'Sobre o app', value: 'v1.0.0' },
          { label: 'Sair', value: '', isDestructive: true },
        ].map((item, i, arr) => (
          <button key={item.label} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: item.isDestructive ? '#ef4444' : '#1f2937' }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af' }}>
              {item.value && <span style={{ fontSize: 14 }}>{item.value}</span>}
              <Icons.ChevronRight />
            </div>
          </button>
        ))}
      </div>
    </section>
  </div>
);

// ========================
// TAB BAR
// ========================

const TabBar = ({ activeTab, onTabChange, onNewAction }: { activeTab: TabType; onTabChange: (tab: TabType) => void; onNewAction: () => void }) => {
  const tabs = [
    { id: 'home' as TabType, icon: Icons.Home, label: 'Home' },
    { id: 'leads' as TabType, icon: Icons.Users, label: 'Leads' },
    { id: 'novo' as TabType, icon: Icons.Plus, label: 'Novo' },
    { id: 'agenda' as TabType, icon: Icons.Calendar, label: 'Agenda' },
    { id: 'perfil' as TabType, icon: Icons.User, label: 'Perfil' },
  ];

  return (
    <nav style={styles.tabBar}>
      <div style={styles.tabBarInner}>
        {tabs.map((tab) => {
          const isCenter = tab.id === 'novo';
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (isCenter) {
            return (
              <button key={tab.id} onClick={onNewAction} style={styles.centerTab}>
                <div style={styles.centerTabButton}>
                  <Icon />
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', marginTop: 4 }}>{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                ...styles.tab,
                color: isActive ? '#1f2937' : '#9ca3af'
              }}
            >
              <Icon />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, marginTop: 4 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ========================
// MAIN APP COMPONENT
// ========================

export const FramerApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<QuickActionType>(null);
  const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);

  const handleActionSelect = (action: QuickActionType) => {
    if (action === 'proposta' || action === 'checkin') {
      // Show toast or placeholder
      return;
    }
    setActiveForm(action);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'leads':
        return <LeadsPage />;
      case 'agenda':
        return <AgendaPage onCompromissoClick={(c) => setSelectedCompromisso(c)} />;
      case 'perfil':
        return <PerfilPage />;
      default:
        return <HomePage />;
    }
  };

  const getFormTitle = (action: QuickActionType) => {
    switch (action) {
      case 'lead': return 'Novo Lead';
      case 'visita': return 'Agendar Visita';
      case 'imovel': return 'Novo Imóvel';
      case 'ligacao': return 'Registrar Ligação';
      default: return '';
    }
  };

  const renderFormContent = (action: QuickActionType) => {
    switch (action) {
      case 'lead': return <LeadFormContent />;
      case 'visita': return <VisitaFormContent />;
      case 'imovel': return <ImovelFormContent />;
      case 'ligacao': return <LigacaoFormContent />;
      default: return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.deviceFrame}>
        {/* Dynamic Island */}
        <div style={styles.dynamicIsland} />
        
        {/* App Content */}
        <div style={styles.appContainer}>
          {/* Status Bar */}
          <StatusBar />
          
          {/* Header (only on home) */}
          {activeTab === 'home' && <Header />}
          
          {/* Main Content */}
          <div style={styles.content}>
            {renderContent()}
          </div>
          
          {/* Tab Bar */}
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNewAction={() => setIsQuickActionsOpen(true)}
          />
          
          {/* Home Indicator */}
          <div style={styles.homeIndicator} />
          
          {/* Quick Actions Sheet */}
          <QuickActionsSheet
            isOpen={isQuickActionsOpen}
            onClose={() => setIsQuickActionsOpen(false)}
            onActionSelect={handleActionSelect}
          />

          {/* Form Modals */}
          <FormModal
            isOpen={activeForm !== null}
            onClose={() => setActiveForm(null)}
            title={getFormTitle(activeForm)}
          >
            {renderFormContent(activeForm)}
          </FormModal>

          {/* Compromisso Detail Modal */}
          <CompromissoDetailModal
            compromisso={selectedCompromisso}
            isOpen={selectedCompromisso !== null}
            onClose={() => setSelectedCompromisso(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default FramerApp;
