import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCoupons } from '@/hooks/useCoupons';
import { useData } from '@/contexts/DataContext';
import { Coupon } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export const useCouponManagement = () => {
  const { planId } = useParams<{ planId: string }>();
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const { plans } = useData();
  
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newPlanId, setNewPlanId] = useState<string>(planId || '');
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    // If specific planId is provided, select that plan and filter coupons
    if (planId) {
      setSelectedPlanFilter(planId);
      setNewPlanId(planId);
      setFilteredCoupons(coupons.filter(coupon => coupon.planId === planId));
    } else {
      setFilteredCoupons(coupons);
    }
    
    setIsLoading(false);
  }, [planId, coupons]);
  
  useEffect(() => {
    // Filter coupons whenever the filter changes
    if (selectedPlanFilter === "all") {
      setFilteredCoupons(coupons);
    } else {
      setFilteredCoupons(coupons.filter(coupon => coupon.planId === selectedPlanFilter));
    }
  }, [selectedPlanFilter, coupons]);
  
  const handleCreateCoupon = () => {
    if (!newCode.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    
    if (!newPlanId) {
      toast.error("Please select a plan");
      return;
    }
    
    if (newDiscount <= 0 || newDiscount > 100) {
      toast.error("Discount must be between 1 and 100");
      return;
    }
    
    // Check if code already exists for this plan
    const existingCoupon = coupons.find(
      c => c.planId === newPlanId && c.code.toLowerCase() === newCode.trim().toLowerCase()
    );
    
    if (existingCoupon) {
      toast.error("A coupon with this code already exists for the selected plan");
      return;
    }
    
    const newCoupon = {
      planId: newPlanId,
      code: newCode.trim().toUpperCase(),
      discount: newDiscount,
      active: isActive
    };
    
    try {
      addCoupon(newCoupon);
      setIsCreateDialogOpen(false);
      
      // Reset form
      setNewCode('');
      setNewDiscount(10);
      if (!planId) setNewPlanId('');
      
      toast.success("Coupon created successfully");
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error("Failed to create coupon");
    }
  };
  
  const handleEditCoupon = () => {
    if (!currentCoupon) return;
    
    if (!newCode.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    
    if (newDiscount <= 0 || newDiscount > 100) {
      toast.error("Discount must be between 1 and 100");
      return;
    }
    
    // Check if code already exists for this plan (excluding current coupon)
    const existingCoupon = coupons.find(
      c => c._id !== currentCoupon._id && 
          c.planId === currentCoupon.planId && 
          c.code.toLowerCase() === newCode.trim().toLowerCase()
    );
    
    if (existingCoupon) {
      toast.error("A coupon with this code already exists for the selected plan");
      return;
    }
    
    const updatedCoupon = {
      ...currentCoupon,
      code: newCode.trim().toUpperCase(),
      discount: newDiscount,
      active: isActive
    };
    
    try {
      updateCoupon(updatedCoupon);
      setIsEditDialogOpen(false);
      
      // Reset current coupon
      setCurrentCoupon(null);
      
      toast.success("Coupon updated successfully");
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error("Failed to update coupon");
    }
  };
  
  const handleDeleteCoupon = () => {
    if (!currentCoupon) return;
    
    try {
      deleteCoupon(currentCoupon._id);
      setIsDeleteDialogOpen(false);
      setCurrentCoupon(null);
      
      toast.success("Coupon deleted successfully");
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error("Failed to delete coupon");
    }
  };
  
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  
  const openEditDialog = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setNewCode(coupon.code);
    setNewDiscount(coupon.discount);
    setIsActive(coupon.active);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };
  
  const toggleCouponStatus = (coupon: Coupon) => {
    const updatedCoupon = { ...coupon, active: !coupon.active };
    
    try {
      updateCoupon(updatedCoupon);
      toast.success(`Coupon ${updatedCoupon.active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating coupon status:', error);
      toast.error("Failed to update coupon status");
    }
  };
  
  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p._id === planId);
    return plan ? plan.name : 'Unknown Plan';
  };
  
  return {
    filteredCoupons,
    selectedPlanFilter,
    setSelectedPlanFilter,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentCoupon,
    newCode,
    setNewCode,
    newDiscount,
    setNewDiscount,
    newPlanId,
    setNewPlanId,
    isActive,
    setIsActive,
    isLoading,
    plans,
    planId,
    handleCreateCoupon,
    handleEditCoupon,
    handleDeleteCoupon,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    toggleCouponStatus,
    getPlanName
  };
};
