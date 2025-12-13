import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
}

export const DeviceFrame = ({ children }: DeviceFrameProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-[390px] h-[844px] bg-background rounded-[44px] shadow-device overflow-hidden border-[12px] border-foreground/90 dark:border-foreground/20">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-foreground/90 dark:bg-foreground/20 rounded-full z-50" />
        
        {/* Content */}
        <div className="h-full overflow-hidden rounded-[32px]">
          {children}
        </div>
      </div>
    </div>
  );
};
