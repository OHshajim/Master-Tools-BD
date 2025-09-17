
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from './useDataContext';
import { Credential } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';

export const useAdminCredentials = () => {
  const { planId } = useParams<{ planId: string }>();
  const { 
    credentials, 
    addCredential: addCredentialToStore, 
    updateCredential: updateCredentialInStore, 
    deleteCredential: deleteCredentialFromStore, 
    getCredentialsForPlan,
    getPlanById,
    plans
  } = useDataContext();
  
  // State management for the credential being edited
  const [currentCredential, setCurrentCredential] = useState<Credential | null>(null);
  const [planCredentials, setPlanCredentials] = useState<Credential[]>([]);
  const [plan, setPlan] = useState<{ id: string; name: string } | null>(null);
  const [planNames, setPlanNames] = useState<Record<string, string>>({});
  
  // Dialog state management
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Load plan data and credentials
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Create a map of plan IDs to plan names
      const planNameMap: Record<string, string> = {};
      plans.forEach(p => {
        planNameMap[p._id] = p.name;
      });
      setPlanNames(planNameMap);
      
      if (planId) {
        const foundPlan = getPlanById(planId);
        if (foundPlan) {
          setPlan({ id: foundPlan._id, name: foundPlan.name });
          const planCreds = getCredentialsForPlan(planId);
          setPlanCredentials(planCreds);
        } else {
          setPlanCredentials([]);
        }
      } else {
        // If no plan ID, show all credentials
        setPlanCredentials(credentials);
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [planId, credentials, getPlanById, getCredentialsForPlan, plans]);
  
  // Handlers for dialogs
  const openAddDialog = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);
  
  const openEditDialog = useCallback((credential: Credential) => {
    setCurrentCredential(credential);
    setIsEditDialogOpen(true);
  }, []);
  
  const openDeleteDialog = useCallback((credential: Credential) => {
    setCurrentCredential(credential);
    setIsDeleteDialogOpen(true);
  }, []);
  
  // Handlers for CRUD operations
  const handleAddCredential = useCallback((specificPlanId: string, platformId: string, username: string, password: string, domain?: string) => {
    // Use the provided planId, or the one from URL params
    const targetPlanId = specificPlanId || planId;
    if (!targetPlanId) return;

    if (!domain || domain.trim() === '') {
      toast({
        title: "Domain Required",
        description: "Please enter a domain URL for this credential."
      });
      return;
    }
    
    addCredentialToStore({
      planId: targetPlanId,
      platformId,
      username, 
      password,
      domain: domain.trim(),
      updatedAt: new Date().toISOString()
    });
    
    setIsAddDialogOpen(false);
  }, [planId, addCredentialToStore]);
  
  const handleEditCredential = useCallback((platformId: string, username: string, password: string, domain?: string) => {
    if (!currentCredential) return;

    if (!domain || domain.trim() === '') {
      toast({
        title: "Domain Required",
        description: "Please enter a domain URL for this credential."
      });
      return;
    }
    
    const updatedCredential = {
      ...currentCredential,
      platformId,
      platform: platformId, // For backward compatibility
      username,
      password,
      domain: domain.trim(),
      updatedAt: new Date().toISOString()
    };
    
    updateCredentialInStore(updatedCredential);
    setIsEditDialogOpen(false);
  }, [currentCredential, updateCredentialInStore]);
  
  const handleDeleteCredential = useCallback(() => {
    if (!currentCredential) return;
    
    deleteCredentialFromStore(currentCredential._id);
    setIsDeleteDialogOpen(false);
  }, [currentCredential, deleteCredentialFromStore]);
  
  return {
    isLoading,
    plan,
    planCredentials,
    planNames,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    currentCredential,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleAddCredential,
    handleEditCredential,
    handleDeleteCredential,
    openAddDialog,
    openEditDialog,
    openDeleteDialog
  };
};
