
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tag } from 'lucide-react';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import { useCouponManagement } from '@/hooks/useCouponManagement';

const AdminCoupons = () => {
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  
  const {
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
  } = useCouponManagement();
  
  // Admin check
  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
      return;
    }
  }, [user, isAdmin, isManager, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading coupons...</p>
      </div>
    );
  }
  
  return (
      <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                  <h1 className="text-3xl font-bold mb-1">
                      {planId
                          ? `Coupons for ${getPlanName(planId)}`
                          : "Manage Coupons"}
                  </h1>
                  <p className="text-gray-600">
                      Create and manage discount coupons for your plans
                  </p>
              </div>
              <div className="mt-4 sm:mt-0">
                  <Button onClick={openCreateDialog}>Create New Coupon</Button>
              </div>
          </div>

          {/* Back to Admin Dashboard */}
          <BackToAdminButton />

          {/* Filter (Only show if not filtering by planId already) */}
          {!planId && (
              <Card className="mb-8">
                  <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-1/3">
                              <label className="block text-sm font-medium mb-1">
                                  Filter by Plan
                              </label>
                              <Select
                                  value={selectedPlanFilter}
                                  onValueChange={setSelectedPlanFilter}
                              >
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select a plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="all">
                                          All Plans
                                      </SelectItem>
                                      {plans.map((plan) => (
                                          <SelectItem
                                              key={plan._id}
                                              value={plan._id}
                                          >
                                              {plan.name}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* Coupons List */}
          {filteredCoupons?.length === 0 ? (
              <Card>
                  <CardContent className="py-12 text-center">
                      <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 mb-4">
                          No coupons found for this plan
                      </p>
                      <Button onClick={openCreateDialog}>
                          Create Your First Coupon
                      </Button>
                  </CardContent>
              </Card>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoupons?.map((coupon) => (
                      <Card key={coupon._id}>
                          <CardHeader>
                              <div className="flex justify-between items-start">
                                  <CardTitle>
                                      <code className="bg-gray-100 px-2 py-1 rounded text-lg">
                                          {coupon.code}
                                      </code>
                                  </CardTitle>
                                  <Badge
                                      className={
                                          coupon.active
                                              ? "bg-green-100 text-green-800 border-green-200"
                                              : "bg-gray-100 text-gray-800 border-gray-200"
                                      }
                                  >
                                      {coupon.active ? "Active" : "Inactive"}
                                  </Badge>
                              </div>
                          </CardHeader>
                          <CardContent>
                              <div className="space-y-3">
                                  <div>
                                      <p className="text-sm text-gray-500">
                                          Discount
                                      </p>
                                      <p className="font-medium text-lg">
                                          {coupon.discount}% off
                                      </p>
                                  </div>

                                  {!planId && (
                                      <div>
                                          <p className="text-sm text-gray-500">
                                              Plan
                                          </p>
                                          <p className="font-medium">
                                              {coupon?.planId?.name ?? "Unknown"}
                                          </p>
                                      </div>
                                  )}

                                  <div className="flex items-center pt-4">
                                      <Checkbox
                                          id={`active-${coupon._id}`}
                                          checked={coupon.active}
                                          onCheckedChange={() =>
                                              toggleCouponStatus(coupon)
                                          }
                                      />
                                      <label
                                          htmlFor={`active-${coupon._id}`}
                                          className="text-sm ml-2 cursor-pointer"
                                      >
                                          Active
                                      </label>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                      <Button
                                          variant="outline"
                                          className="flex-1"
                                          onClick={() => openEditDialog(coupon)}
                                      >
                                          Edit
                                      </Button>
                                      <Button
                                          variant="outline"
                                          className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                                          onClick={() =>
                                              openDeleteDialog(coupon)
                                          }
                                      >
                                          Delete
                                      </Button>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          )}

          {/* Create Coupon Dialog */}
          <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
          >
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                      <div className="space-y-2">
                          <label htmlFor="code" className="text-sm font-medium">
                              Coupon Code
                          </label>
                          <Input
                              id="code"
                              value={newCode}
                              onChange={(e) =>
                                  setNewCode(e.target.value.toUpperCase())
                              }
                              placeholder="e.g., SUMMER20"
                              className="uppercase"
                          />
                          <p className="text-xs text-gray-500">
                              Use short, memorable coupon codes (e.g., SAVE10,
                              BUNDLE20)
                          </p>
                      </div>

                      <div className="space-y-2">
                          <label
                              htmlFor="discount"
                              className="text-sm font-medium"
                          >
                              Discount Percentage
                          </label>
                          <div className="flex">
                              <Input
                                  id="discount"
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={newDiscount}
                                  onChange={(e) =>
                                      setNewDiscount(
                                          parseInt(e.target.value) || 0
                                      )
                                  }
                              />
                              <div className="flex items-center justify-center px-3 bg-muted border border-l-0 rounded-r-md">
                                  %
                              </div>
                          </div>
                      </div>

                      {!planId && (
                          <div className="space-y-2">
                              <label
                                  htmlFor="plan"
                                  className="text-sm font-medium"
                              >
                                  Plan
                              </label>
                              <Select
                                  value={newPlanId}
                                  onValueChange={setNewPlanId}
                              >
                                  <SelectTrigger id="plan">
                                      <SelectValue placeholder="Select a plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {plans.map((plan) => (
                                          <SelectItem
                                              key={plan._id}
                                              value={plan._id}
                                          >
                                              {plan.name}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      )}

                      <div className="flex items-center space-x-2">
                          <Checkbox
                              id="active"
                              checked={isActive}
                              onCheckedChange={(checked) =>
                                  setIsActive(!!checked)
                              }
                          />
                          <label
                              htmlFor="active"
                              className="text-sm cursor-pointer"
                          >
                              Active
                          </label>
                      </div>
                  </div>

                  <DialogFooter>
                      <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                      >
                          Cancel
                      </Button>
                      <Button onClick={handleCreateCoupon}>
                          Create Coupon
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

          {/* Edit Coupon Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Edit Coupon</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                      <div className="space-y-2">
                          <label
                              htmlFor="edit-code"
                              className="text-sm font-medium"
                          >
                              Coupon Code
                          </label>
                          <Input
                              id="edit-code"
                              value={newCode}
                              onChange={(e) =>
                                  setNewCode(e.target.value.toUpperCase())
                              }
                              className="uppercase"
                          />
                      </div>

                      <div className="space-y-2">
                          <label
                              htmlFor="edit-discount"
                              className="text-sm font-medium"
                          >
                              Discount Percentage
                          </label>
                          <div className="flex">
                              <Input
                                  id="edit-discount"
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={newDiscount}
                                  onChange={(e) =>
                                      setNewDiscount(
                                          parseInt(e.target.value) || 0
                                      )
                                  }
                              />
                              <div className="flex items-center justify-center px-3 bg-muted border border-l-0 rounded-r-md">
                                  %
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center space-x-2">
                          <Checkbox
                              id="edit-active"
                              checked={isActive}
                              onCheckedChange={(checked) =>
                                  setIsActive(!!checked)
                              }
                          />
                          <label
                              htmlFor="edit-active"
                              className="text-sm cursor-pointer"
                          >
                              Active
                          </label>
                      </div>
                  </div>

                  <DialogFooter>
                      <Button
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                      >
                          Cancel
                      </Button>
                      <Button onClick={handleEditCoupon}>Save Changes</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

          {/* Delete Coupon Confirmation */}
          <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
          >
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                      <AlertDialogDescription>
                          Are you sure you want to delete the coupon{" "}
                          <strong>{currentCoupon?.code}</strong>? This action
                          cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={handleDeleteCoupon}
                          className="bg-red-500 hover:bg-red-600"
                      >
                          Delete
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
};

export default AdminCoupons;
