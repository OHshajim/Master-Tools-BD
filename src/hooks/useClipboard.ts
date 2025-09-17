
import { toast } from '@/components/ui/sonner';

/**
 * Custom hook for clipboard operations
 */
export const useClipboard = () => {
  /**
   * Copy text to clipboard
   * @param text Text to copy
   * @param type Type of content being copied (for toast message)
   */
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return {
    copyToClipboard
  };
};
