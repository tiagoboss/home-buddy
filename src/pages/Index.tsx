import { useState, useRef, useEffect } from 'react';
import { TabBar } from '@/components/layout/TabBar';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { QuickActionsSheet, QuickActionType } from '@/components/sheets/QuickActionsSheet';
import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { StatusBar } from '@/components/layout/StatusBar';
import { HomeIndicator } from '@/components/layout/HomeIndicator';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/pages/HomePage';
import { LeadsPage } from '@/pages/LeadsPage';
import { ImoveisPage } from '@/pages/ImoveisPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { PerfilPage } from '@/pages/PerfilPage';
import { PropostasPage } from '@/pages/PropostasPage';
import { LeadForm } from '@/components/forms/LeadForm';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { ImovelForm } from '@/components/forms/ImovelForm';
import { LigacaoForm } from '@/components/forms/LigacaoForm';
import { PropostaForm } from '@/components/forms/PropostaForm';
import { CheckinForm } from '@/components/forms/CheckinForm';
import { NotificationsSheet } from '@/components/notifications/NotificationsSheet';
import { ImovelDetailSheet } from '@/components/imoveis/ImovelDetailSheet';
import { LeadDetailSheet } from '@/components/leads/LeadDetailSheet';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { RescheduleSheet } from '@/components/agenda/RescheduleSheet';
import { TabType, Notificacao, Imovel, Compromisso as MockCompromisso, Lead as MockLead } from '@/types';
import { Lead } from '@/hooks/useLeads';
import { Compromisso as HookCompromisso, useCompromissos } from '@/hooks/useCompromissos';
import { notificacoes as initialNotificacoes } from '@/data/mockData';
import { useFavoritos } from '@/hooks/useFavoritos';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<QuickActionType>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificacao[]>(initialNotificacoes);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Global detail states
  const [selectedImovelGlobal, setSelectedImovelGlobal] = useState<Imovel | null>(null);
  const [selectedLeadGlobal, setSelectedLeadGlobal] = useState<Lead | null>(null);
  const [selectedCompromissoGlobal, setSelectedCompromissoGlobal] = useState<HookCompromisso | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const { isFavorito, toggleFavorito } = useFavoritos();
  const { updateCompromisso } = useCompromissos();

  // Reset scroll to top when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  // Convert mock compromisso to hook format for global sheet
  const convertMockCompromisso = (c: MockCompromisso): HookCompromisso => ({
    id: c.id,
    user_id: '',
    tipo: c.tipo,
    data: c.data,
    hora: c.hora,
    cliente: c.cliente,
    imovel: c.imovel || null,
    endereco: c.endereco || null,
    status: c.status,
    lead_id: null,
    lead: null,
    created_at: c.data,
    updated_at: c.data,
  });

  // Convert mock lead to Lead format for global sheet
  const convertMockLead = (l: MockLead): Lead => ({
    id: l.id,
    user_id: '',
    nome: l.nome,
    telefone: l.telefone,
    email: l.email || null,
    status: l.status as Lead['status'],
    interesse: l.interesse,
    faixa_preco: null,
    bairros: null,
    ultimo_contato: l.ultimoContato,
    avatar: l.avatar,
    created_at: l.ultimoContato,
    updated_at: l.ultimoContato,
  });

  const unreadCount = notifications.filter(n => !n.lida).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleActionSelect = (action: QuickActionType) => {
    setActiveForm(action);
  };
  
  

  const handleImovelFavorite = () => {
    if (selectedImovelGlobal) {
      toggleFavorito(selectedImovelGlobal.id);
      setSelectedImovelGlobal({
        ...selectedImovelGlobal,
        favorito: !selectedImovelGlobal.favorito
      });
    }
  };

  const handleCloseCompromisso = () => {
    setSelectedCompromissoGlobal(null);
  };

  const handleConfirmCompromisso = async () => {
    if (!selectedCompromissoGlobal) return;
    const { error } = await updateCompromisso(selectedCompromissoGlobal.id, { status: 'confirmado' });
    if (error) {
      toast.error('Erro ao confirmar compromisso');
    } else {
      toast.success('Compromisso confirmado!');
      handleCloseCompromisso();
    }
  };

  const handleCancelCompromisso = async () => {
    if (!selectedCompromissoGlobal) return;
    const { error } = await updateCompromisso(selectedCompromissoGlobal.id, { status: 'cancelado' });
    if (error) {
      toast.error('Erro ao cancelar compromisso');
    } else {
      toast.success('Compromisso cancelado');
      handleCloseCompromisso();
    }
  };

  const handleCompleteCompromisso = async () => {
    if (!selectedCompromissoGlobal) return;
    const { error } = await updateCompromisso(selectedCompromissoGlobal.id, { status: 'realizado' });
    if (error) {
      toast.error('Erro ao marcar como realizado');
    } else {
      toast.success('Compromisso realizado!');
      handleCloseCompromisso();
    }
  };

  const handleRescheduleCompromisso = async (id: string, newDate: string, newTime: string) => {
    const { error } = await updateCompromisso(id, { data: newDate, hora: newTime });
    if (error) {
      toast.error('Erro ao reagendar compromisso');
    } else {
      toast.success('Compromisso reagendado!');
      handleCloseCompromisso();
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onTabChange={setActiveTab}
            onSelectCompromisso={(c) => setSelectedCompromissoGlobal(convertMockCompromisso(c))}
            onSelectLead={(l) => setSelectedLeadGlobal(convertMockLead(l))}
            onSelectImovel={setSelectedImovelGlobal}
          />
        );
      case 'leads':
        return (
          <LeadsPage 
            onScheduleVisit={() => setActiveForm('visita')}
            onSelectLead={setSelectedLeadGlobal}
          />
        );
      case 'imoveis':
        return (
          <ImoveisPage 
            onSelectImovel={setSelectedImovelGlobal}
          />
        );
      case 'agenda':
        return (
          <AgendaPage 
            onSelectCompromisso={setSelectedCompromissoGlobal}
          />
        );
      case 'perfil':
        return <PerfilPage />;
      case 'propostas':
        return <PropostasPage />;
      default:
        return <HomePage />;
    }
  };

  const showHeader = activeTab === 'home';
  
  return (
    <DeviceFrame>
      <div className="bg-background h-full relative flex flex-col overflow-hidden">
        {/* Fixed Top - StatusBar */}
        <div className="flex-shrink-0 h-[38px] relative z-40">
          <StatusBar />
        </div>
        
        {/* Fixed Header (only on home) */}
        {showHeader && (
          <div className="flex-shrink-0 z-30">
            <Header 
              unreadCount={unreadCount}
              onNotificationsClick={() => setIsNotificationsOpen(true)}
            />
          </div>
        )}
        
        {/* Scrollable Content with Tab Transition */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-[100px]">
          <div 
            key={activeTab}
            className="animate-tab-transition"
          >
            {renderContent()}
          </div>
        </div>
        
        {/* Floating Action Button - ocultar no perfil */}
        {activeTab !== 'perfil' && (
          <FloatingActionButton onClick={() => setIsQuickActionsOpen(true)} isOpen={isQuickActionsOpen} />
        )}
        
        {/* Fixed Bottom Elements */}
        <TabBar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <HomeIndicator />
        
        <QuickActionsSheet 
          isOpen={isQuickActionsOpen}
          onClose={() => setIsQuickActionsOpen(false)}
          onActionSelect={handleActionSelect}
          currentTab={activeTab}
        />

        {/* Notifications Sheet */}
        <NotificationsSheet
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDeleteNotification}
        />

        {/* Global Imovel Detail Sheet */}
        {selectedImovelGlobal && (
          <ImovelDetailSheet
            imovel={selectedImovelGlobal}
            isOpen={!!selectedImovelGlobal}
            onClose={() => setSelectedImovelGlobal(null)}
            onFavorite={handleImovelFavorite}
            onScheduleVisit={() => {
              setSelectedImovelGlobal(null);
              setActiveForm('visita');
            }}
          />
        )}

        {/* Global Lead Detail Sheet */}
        {selectedLeadGlobal && (
          <LeadDetailSheet
            lead={selectedLeadGlobal}
            isOpen={!!selectedLeadGlobal}
            onClose={() => setSelectedLeadGlobal(null)}
            onScheduleVisit={() => {
              setSelectedLeadGlobal(null);
              setActiveForm('visita');
            }}
          />
        )}

        {/* Global Compromisso Detail Sheet */}
        {selectedCompromissoGlobal && (
          <CompromissoDetailSheet
            compromisso={selectedCompromissoGlobal}
            isOpen={!!selectedCompromissoGlobal}
            onClose={handleCloseCompromisso}
            onConfirm={handleConfirmCompromisso}
            onCancel={handleCancelCompromisso}
            onComplete={handleCompleteCompromisso}
            onReschedule={() => setIsRescheduleOpen(true)}
          />
        )}

        {/* Reschedule Sheet */}
        <RescheduleSheet
          compromisso={selectedCompromissoGlobal}
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          onReschedule={handleRescheduleCompromisso}
        />

        {/* Forms */}
        <LeadForm 
          isOpen={activeForm === 'lead'} 
          onClose={() => setActiveForm(null)} 
        />
        <VisitaForm 
          isOpen={activeForm === 'visita'} 
          onClose={() => setActiveForm(null)} 
        />
        <ImovelForm 
          isOpen={activeForm === 'imovel'} 
          onClose={() => setActiveForm(null)} 
        />
        <LigacaoForm 
          isOpen={activeForm === 'ligacao'} 
          onClose={() => setActiveForm(null)} 
        />
        <PropostaForm 
          isOpen={activeForm === 'proposta'} 
          onClose={() => setActiveForm(null)} 
        />
        <CheckinForm 
          isOpen={activeForm === 'checkin'} 
          onClose={() => setActiveForm(null)} 
        />
      </div>
    </DeviceFrame>
  );
};

export default Index;
