import { useState } from 'react';
import { TabBar } from '@/components/layout/TabBar';
import { QuickActionsSheet } from '@/components/sheets/QuickActionsSheet';
import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { StatusBar } from '@/components/layout/StatusBar';
import { HomeIndicator } from '@/components/layout/HomeIndicator';
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
    <DeviceFrame>
      <div className="bg-background h-full relative overflow-y-auto">
        <StatusBar />
        
        <div className="pt-[44px] pb-[100px] animate-fade-in">
          {renderContent()}
        </div>
        
        <TabBar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewAction={() => setIsQuickActionsOpen(true)}
        />
        
        <HomeIndicator />
        
        <QuickActionsSheet 
          isOpen={isQuickActionsOpen}
          onClose={() => setIsQuickActionsOpen(false)}
        />
      </div>
    </DeviceFrame>
  );
};

export default Index;
