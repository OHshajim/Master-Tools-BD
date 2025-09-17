
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { BrandForm } from '@/components/admin/brand/BrandForm';
import { BrandPreview } from '@/components/admin/brand/BrandPreview';
import { useBrandContext } from '@/hooks/useBrandContext';
import { BrandInfo } from '@/contexts/BrandContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBrandIdentity = () => {
  const { brandInfo, updateBrandInfo, resetToDefaults } = useBrandContext();
  const [pendingChanges, setPendingChanges] = useState<BrandInfo>(brandInfo);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const hasChanges = JSON.stringify(pendingChanges) !== JSON.stringify(brandInfo);

  const handleBrandInfoChange = (newBrandInfo: BrandInfo) => {
    setPendingChanges(newBrandInfo);
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    setPendingChanges(brandInfo);
    toast({
      title: "Success",
      description: "Brand information reset to defaults"
    });
  };

  const handleSaveChanges = () => {
    if (!hasChanges) {
      toast({
        title: "No Changes",
        description: "No changes to save"
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSaveChanges = () => {
    updateBrandInfo(pendingChanges);
    setShowConfirmDialog(false);
    toast({
      title: "Success",
      description: "Brand information updated successfully across the entire system"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/admin" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Brand Identity Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your platform's brand information. Changes will be applied across the entire website.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <BrandForm
            initialBrandInfo={pendingChanges}
            onBrandInfoChange={handleBrandInfoChange}
            onReset={handleResetToDefaults}
          />
          
          <div className="flex gap-4">
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div>
          <BrandPreview
            newBrandInfo={pendingChanges}
            currentBrandInfo={brandInfo}
          />
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Global Brand Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to globally update platform information across the entire system? 
              This will change the brand name, logo, contact information, and email addresses throughout 
              the website including headers, footers, invoices, and all user-facing content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveChanges}>
              Yes, Update Globally
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBrandIdentity;
