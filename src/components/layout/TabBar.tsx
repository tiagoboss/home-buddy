import { Home, Users, Plus, Calendar, User } from 'lucide-react';
import { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onNewAction: () => void;
}

const tabs = [
  { id: 'home' as TabType, icon: Home, label: 'Home' },
  { id: 'leads' as TabType, icon: Users, label: 'Leads' },
  { id: 'novo' as TabType, icon: Plus, label: 'Novo' },
  { id: 'agenda' as TabType, icon: Calendar, label: 'Agenda' },
  { id: 'perfil' as TabType, icon: User, label: 'Perfil' },
];

export const TabBar = ({ activeTab, onTabChange, onNewAction }: TabBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glassmorphism border-t border-border z-50">
      <div className="flex items-center justify-around px-2 pt-2 tab-bar-safe max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isCenter = tab.id === 'novo';
          const isActive = activeTab === tab.id;
          
          if (isCenter) {
            return (
              <button
                key={tab.id}
                onClick={onNewAction}
                className="relative -mt-6 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-elevated animate-scale-press">
                  <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-1">
                  {tab.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center py-1 px-3 animate-scale-press transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon 
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
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
