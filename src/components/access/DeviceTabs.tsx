
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Tablet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DeviceTabsProps {
  activeDevice: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
}

export const DeviceTabs = ({ activeDevice, onDeviceChange }: DeviceTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs 
      value={activeDevice} 
      onValueChange={(value) => onDeviceChange(value as 'desktop' | 'mobile')} 
      className="mt-4"
    >
      <TabsList className={cn(
        "w-full max-w-[400px] mx-auto grid bg-gray-50 border border-gray-200",
        isMobile ? "grid-cols-1 gap-2" : "grid-cols-2"
      )}>
        <TabsTrigger 
          value="desktop" 
          className="flex items-center gap-1 text-xs px-2 sm:text-sm sm:px-3 data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 transition-all duration-200"
        >
          <Tablet className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate">How To Access Desktop</span>
        </TabsTrigger>
        <TabsTrigger 
          value="mobile" 
          className="flex items-center gap-1 text-xs px-2 sm:text-sm sm:px-3 data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 transition-all duration-200"
        >
          <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate">How to access Mobile device</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
