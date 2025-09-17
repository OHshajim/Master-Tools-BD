
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CopyButtonProps } from '@/types/access';

export const CopyButton: React.FC<CopyButtonProps> = ({ text, type, onCopy, className }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    onCopy(text, type);
    setIsCopied(true);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a new timer
    timerRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleCopy}
    >
      {isCopied ? "Copied" : "Copy"}
    </Button>
  );
};
