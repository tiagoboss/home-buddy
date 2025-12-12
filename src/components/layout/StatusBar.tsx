import { useState, useEffect } from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

export const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="absolute inset-0 flex items-center justify-between px-8">
      <span className="text-sm font-semibold text-foreground">
        {formattedTime}
      </span>
      
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4 text-foreground" strokeWidth={2.5} />
        <Wifi className="w-4 h-4 text-foreground" strokeWidth={2.5} />
        <Battery className="w-5 h-5 text-foreground" strokeWidth={2.5} />
      </div>
    </div>
  );
};
