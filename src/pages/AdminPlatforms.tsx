import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Platform } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
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
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminPlatforms = () => {
  const { user, isAdmin, isManager } = useAuth();
  const { platforms, addPlatform, updatePlatform, deletePlatform } = useData();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null);
  
  // Form state
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState('/placeholder.svg');

  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
      return;
    }
  }, [user, isAdmin, isManager, navigate]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPlatforms(
        platforms.filter(platform => 
          platform.name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPlatforms([...platforms]);
    }
  }, [platforms, searchQuery]);
  
  const handleCreatePlatform = () => {
    try {
      if (!newName.trim()) {
        toast.error("Platform name is required");
        return;
      }
      
      // Check if platform name already exists
      const nameExists = platforms.some(
        p => p.name.toLowerCase() === newName.trim().toLowerCase()
      );
      
      if (nameExists) {
        toast.error("A platform with this name already exists");
        return;
      }
      
      addPlatform({
        name: newName.trim(),
        logo: newLogo,
        url: `https://${newName.toLowerCase().replace(/\s+/g, '')}.com`, // Add default URL
        description: `${newName} learning platform` // Add default description
      });
      setIsCreateDialogOpen(false);
      toast.success("Platform created successfully");
      
      // Reset form
      setNewName('');
      setNewLogo('/placeholder.svg');
    } catch (error) {
      toast.error("Failed to create platform");
      console.error(error);
    }
  };
  
  const handleEditPlatform = () => {
    if (!currentPlatform) return;
    
    try {
      if (!newName.trim()) {
        toast.error("Platform name is required");
        return;
      }
      
      // Check if platform name already exists (excluding current platform)
      const nameExists = platforms.some(
        p => p._id !== currentPlatform._id && 
            p.name.toLowerCase() === newName.trim().toLowerCase()
      );
      
      if (nameExists) {
        toast.error("A platform with this name already exists");
        return;
      }
      updatePlatform(currentPlatform._id, {
        ...currentPlatform,
        name: newName.trim(),
        logo: newLogo
      });
      setIsEditDialogOpen(false);
      toast.success("Platform updated successfully");
      
      // Reset current platform
      setCurrentPlatform(null);
    } catch (error) {
      toast.error("Failed to update platform");
      console.error(error);
    }
  };
  
  const handleDeletePlatform = () => {
    if (!currentPlatform) return;
    
    try {
      deletePlatform(currentPlatform._id);
      setIsDeleteDialogOpen(false);
      toast.success("Platform deleted successfully");
    } catch (error) {
      toast.error("Failed to delete platform");
      console.error(error);
    }
  };
  
  const openEditDialog = (platform: Platform) => {
    setCurrentPlatform(platform);
    setNewName(platform.name);
    setNewLogo(platform.logo);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (platform: Platform) => {
    setCurrentPlatform(platform);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Platforms</h1>
          <p className="text-gray-600">Create, edit, and delete learning platforms</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add New Platform
        </Button>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      {/* Search */}
      <div className="mb-8">
        <Input
          placeholder="Search platforms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Platforms List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlatforms?.map(platform => (
          <Card key={platform._id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{platform.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="h-20 flex items-center justify-center bg-gray-50 rounded-md">
                  <img 
                    src={platform.logo} 
                    alt={platform.name}
                    className="max-h-16 max-w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => openEditDialog(platform)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => openDeleteDialog(platform)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPlatforms.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-2">No platforms found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Add a Platform</Button>
          </div>
        )}
      </div>
      
      {/* Create Platform Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Platform</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Platform Name
              </label>
              <Input
                id="name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Coursera"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                Logo URL (Optional)
              </label>
              <Input
                id="logo"
                value={newLogo}
                onChange={e => setNewLogo(e.target.value)}
                placeholder="e.g., /placeholder.svg"
              />
              <p className="text-xs text-gray-500">
                Leave as default if you don't have a logo
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlatform}>
              Create Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Platform Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Platform Name
              </label>
              <Input
                id="edit-name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-logo" className="text-sm font-medium">
                Logo URL
              </label>
              <Input
                id="edit-logo"
                value={newLogo}
                onChange={e => setNewLogo(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPlatform}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Platform Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Platform</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentPlatform?.name}"? This action cannot be undone.
              <br /><br />
              <strong>Warning:</strong> Deleting this platform may affect plans that include it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlatform} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPlatforms;
