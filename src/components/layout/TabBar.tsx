import { useState } from 'react';
import { Home, Users, Building2, Calendar, User } from 'lucide-react';
import { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, icon: Home, label: 'Home' },
  { id: 'leads' as TabType, icon: Users, label: 'Leads' },
  { id: 'imoveis' as TabType, icon: Building2, label: 'Imóveis' },
  { id: 'agenda' as TabType, icon: Calendar, label: 'Agenda' },
  { id: 'perfil' as TabType, icon: User, label: 'Perfil' },
];

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  const [tappedTab, setTappedTab] = useState<TabType | null>(null);

  const handleTabPress = (tabId: TabType) => {
    setTappedTab(tabId);
    onTabChange(tabId);
    setTimeout(() => setTappedTab(null), 150);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-2xl border-t border-border/50 z-40">
      <div className="flex items-center justify-around px-2 pt-2 pb-8 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isTapped = tappedTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={cn(
                "flex flex-col items-center py-1 px-3 transition-all duration-150",
                isActive ? "text-primary" : "text-muted-foreground",
                isTapped && "scale-90"
              )}
            >
              <tab.icon 
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "scale-110",
                  isTapped && "animate-bounce-tab"
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={cn(
                "text-[10px] mt-1 transition-all duration-200",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
