import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  iconColor?: string;
}

export const KPICard = ({ icon: Icon, value, label, trend, iconColor }: KPICardProps) => {
  return (
    <div className="flex-shrink-0 w-[130px] ios-card p-4 animate-scale-press snap-start">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
        iconColor || "bg-primary/10"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          iconColor ? "text-primary-foreground" : "text-primary"
        )} />
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};
