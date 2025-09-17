
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickLinkForm } from '@/components/admin/quick-links/QuickLinkForm';
import { QuickLinkList } from '@/components/admin/quick-links/QuickLinkList';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import { QuickLink } from '@/types/dataTypes';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminQuickLinks = () => {
  const { quickLinks, addQuickLink, updateQuickLink, deleteQuickLink, reorderQuickLinks } = useData();
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingLink(null);
    setShowForm(true);
  };

  const handleEdit = (link: QuickLink) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLink(null);
  };

  const handleFormSubmit = (linkData: Omit<QuickLink, 'id' | 'createdAt'>) => {
    if (editingLink) {
      updateQuickLink({
        ...editingLink,
        ...linkData,
        updatedAt: new Date().toISOString()
      });
      toast.success("Quick link updated successfully!");
    } else {
      const maxOrder = Math.max(...quickLinks.map(l => l.order), 0);
      addQuickLink({
        ...linkData,
        order: maxOrder + 1
      });
      toast.success("Quick link added successfully!");
    }
    handleFormClose();
  };

  const handleDeleteWithToast = (id: string) => {
    deleteQuickLink(id);
    toast.success("Quick link deleted successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Quick Links</h1>
          <p className="text-gray-600">Control the quick links shown in user dashboards</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Link
        </Button>
      </div>

      <BackToAdminButton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Manage the custom links that appear in user dashboards. You can reorder them by dragging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickLinkList
              quickLinks={quickLinks}
              onEdit={handleEdit}
              onDelete={handleDeleteWithToast}
              onReorder={reorderQuickLinks}
            />
          </CardContent>
        </Card>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLink ? 'Edit Quick Link' : 'Add New Quick Link'}
              </CardTitle>
              <CardDescription>
                Create custom links that will appear in user dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickLinkForm
                quickLink={editingLink}
                onSubmit={handleFormSubmit}
                onCancel={handleFormClose}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminQuickLinks;
