import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, onBack, rightContent, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
};
