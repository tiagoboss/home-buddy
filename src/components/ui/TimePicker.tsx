import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export const TimePicker = ({ value, onChange, placeholder = 'Selecione o horário', className, hasError }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  // Scroll to selected values when opening
  useEffect(() => {
    if (isOpen && selectedHour && hourRef.current) {
      const hourIndex = hours.indexOf(selectedHour);
      if (hourIndex !== -1) {
        const element = hourRef.current.children[hourIndex] as HTMLElement;
        element?.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [isOpen, selectedHour]);

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    if (selectedMinute) {
      onChange(`${hour}:${selectedMinute}`);
    }
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    if (selectedHour) {
      onChange(`${selectedHour}:${minute}`);
      setIsOpen(false);
    }
  };

  const displayValue = value || null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 rounded-xl justify-start text-left font-normal",
            !displayValue && "text-muted-foreground",
            hasError && "border-destructive",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-card border border-border shadow-elevated" align="start">
        <div className="flex h-[280px]">
          {/* Hours Column */}
          <div 
            ref={hourRef}
            className="flex-1 overflow-y-auto border-r border-border scrollbar-hide"
          >
            <div className="p-1">
              {hours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => handleHourSelect(hour)}
                  className={cn(
                    "w-full py-2.5 text-center text-sm font-medium rounded-lg transition-colors",
                    selectedHour === hour
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
          
          {/* Minutes Column */}
          <div 
            ref={minuteRef}
            className="flex-1 overflow-y-auto scrollbar-hide"
          >
            <div className="p-1">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  onClick={() => handleMinuteSelect(minute)}
                  className={cn(
                    "w-full py-2.5 text-center text-sm font-medium rounded-lg transition-colors",
                    selectedMinute === minute
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick select footer */}
        <div className="border-t border-border p-2 flex gap-1">
          {['09:00', '14:00', '18:00'].map((time) => (
            <button
              key={time}
              onClick={() => {
                const [h, m] = time.split(':');
                setSelectedHour(h);
                setSelectedMinute(m);
                onChange(time);
                setIsOpen(false);
              }}
              className="flex-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              {time}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
