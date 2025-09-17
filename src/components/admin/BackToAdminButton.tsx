
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackToAdminButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Button>
    </div>
  );
};

export default BackToAdminButton;
