import { useState } from 'react';
import { TabBar } from '@/components/layout/TabBar';
import { QuickActionsSheet } from '@/components/sheets/QuickActionsSheet';
import { HomePage } from '@/pages/HomePage';
import { LeadsPage } from '@/pages/LeadsPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { PerfilPage } from '@/pages/PerfilPage';
import { TabType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'leads':
        return <LeadsPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'perfil':
        return <PerfilPage />;
      default:
        return <HomePage />;
    }
  };
  
  return (
    <div className="max-w-lg mx-auto bg-background min-h-screen relative">
      {renderContent()}
      
      <TabBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewAction={() => setIsQuickActionsOpen(true)}
      />
      
      <QuickActionsSheet 
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
      />
    </div>
  );
};

export default Index;
