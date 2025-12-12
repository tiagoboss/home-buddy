import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  iconColor?: string;
  onClick?: () => void;
}

export const KPICard = ({ icon: Icon, value, label, trend, iconColor, onClick }: KPICardProps) => {
  return (
    <div 
      className="flex-shrink-0 w-[100px] ios-card p-3 animate-scale-press snap-start cursor-pointer active:scale-95 transition-transform"
      onClick={onClick}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center mb-2",
        iconColor || "bg-primary/10"
      )}>
        <Icon className={cn(
          "w-3.5 h-3.5",
          iconColor ? "text-primary-foreground" : "text-primary"
        )} />
      </div>
      <p className="text-lg font-bold text-foreground tracking-tight leading-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
    </div>
  );
};
