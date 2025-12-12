import { useState } from 'react';
import { TabBar } from '@/components/layout/TabBar';
import { QuickActionsSheet } from '@/components/sheets/QuickActionsSheet';
import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { StatusBar } from '@/components/layout/StatusBar';
import { HomeIndicator } from '@/components/layout/HomeIndicator';
import { Header } from '@/components/layout/Header';
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
            <Header />
          </div>
        )}
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[100px]">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
        
        {/* Fixed Bottom Elements */}
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
