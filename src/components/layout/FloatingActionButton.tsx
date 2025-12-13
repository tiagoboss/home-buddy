import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const FloatingActionButton = ({ onClick, isOpen = false }: FloatingActionButtonProps) => {
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
        "absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-elevated z-50 transition-all duration-300",
        isPressed ? "scale-90" : "scale-100 active:scale-90",
        !isOpen && "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
      )}
    >
      <Plus 
        className={cn(
          "w-7 h-7 text-primary-foreground transition-transform duration-300",
          isOpen && "rotate-45"
        )} 
        strokeWidth={2.5} 
      />
    </button>
  );
};
