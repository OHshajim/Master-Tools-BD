
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="p-0 mr-2" 
      onClick={onClick}
    >
      <ArrowLeft size={18} />
    </Button>
  );
};

export default BackButton;
