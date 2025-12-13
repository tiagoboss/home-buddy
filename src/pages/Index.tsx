import { useState } from 'react';
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
import { LeadForm } from '@/components/forms/LeadForm';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { ImovelForm } from '@/components/forms/ImovelForm';
import { LigacaoForm } from '@/components/forms/LigacaoForm';
import { PropostaForm } from '@/components/forms/PropostaForm';
import { NotificationsSheet } from '@/components/notifications/NotificationsSheet';
import { TabType, Notificacao } from '@/types';
import { notificacoes as initialNotificacoes } from '@/data/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<QuickActionType>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificacao[]>(initialNotificacoes);

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
    if (action === 'checkin') {
      toast.info('Check-in de Visita em breve!');
      return;
    }
    setActiveForm(action);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={setActiveTab} />;
      case 'leads':
        return (
          <LeadsPage 
            onScheduleVisit={() => setActiveForm('visita')}
          />
        );
      case 'imoveis':
        return <ImoveisPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'perfil':
        return <PerfilPage />;
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
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          <div className="animate-fade-in">
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
      </div>
    </DeviceFrame>
  );
};

export default Index;
