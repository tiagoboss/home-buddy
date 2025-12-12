import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ current, total, label, showPercentage = true }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-destructive';
  };
  
  return (
    <div className="ios-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {label || 'Meta Mensal'}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {current} de {total}
        </span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {Math.round(percentage)}% alcançado
        </p>
      )}
    </div>
  );
};
