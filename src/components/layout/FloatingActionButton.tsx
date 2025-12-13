import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-elevated z-50 transition-transform duration-150",
        isPressed ? "scale-90" : "scale-100 active:scale-90"
      )}
    >
      <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
    </button>
  );
};
