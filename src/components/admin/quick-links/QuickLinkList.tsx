
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuickLink } from '@/types/dataTypes';
import { Edit, Trash2, GripVertical, ExternalLink, MessageCircle, Send, Phone, Mail, Globe, Home, User, Settings, Heart, Star, Zap } from 'lucide-react';

interface QuickLinkListProps {
  quickLinks: QuickLink[];
  onEdit: (link: QuickLink) => void;
  onDelete: (id: string) => void;
  onReorder: (links: QuickLink[]) => void;
}

const iconMap = {
  MessageCircle,
  Send,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Home,
  User,
  Settings,
  Heart,
  Star,
  Zap,
};

export const QuickLinkList = ({ quickLinks, onEdit, onDelete, onReorder }: QuickLinkListProps) => {
  const [draggedItem, setDraggedItem] = useState<QuickLink | null>(null);

  const sortedLinks = [...quickLinks].sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, link: QuickLink) => {
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLink: QuickLink) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem._id === targetLink._id) {
      setDraggedItem(null);
      return;
    }

    const reorderedLinks = [...sortedLinks];
    const draggedIndex = reorderedLinks.findIndex(link => link._id === draggedItem._id);
    const targetIndex = reorderedLinks.findIndex(link => link._id === targetLink._id);

    // Remove dragged item and insert at target position
    const [removed] = reorderedLinks.splice(draggedIndex, 1);
    reorderedLinks.splice(targetIndex, 0, removed);

    onReorder(reorderedLinks);
    setDraggedItem(null);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) {
      return null;
    }
    return iconMap[iconName as keyof typeof iconMap];
  };

  if (sortedLinks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No quick links created yet.</p>
        <p className="text-sm">Click "Add New Link" to create your first quick link.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedLinks.map((link) => {
        const IconComponent = getIcon(link.icon);
        
        return (
            <div
                key={link._id}
                // draggable
                onDragStart={(e) => handleDragStart(e, link)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, link)}
                className={`flex items-center gap-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors ${
                    draggedItem?._id === link._id ? "opacity-50 " : ""
                }`}
            >
                <div
                    draggable={true}
                    className={`flex items-center  transition-colors cursor-default ${
                        draggedItem?._id === link._id ? "opacity-50 " : ""
                    }`}
                >
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move " />
                </div>
                <div
                    className="flex items-center gap-2 flex-1"
                >
                    {IconComponent ? (
                        <IconComponent className="h-4 w-4 text-gray-600" />
                    ) : (
                        <div className="h-4 w-4" />
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{link.title}</span>
                            <Badge
                                variant={
                                    link.isActive ? "default" : "secondary"
                                }
                            >
                                {link.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                            {link.url}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(link)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(link._id)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Drag and drop links to reorder them. The order here determines how they appear in user dashboards.
        </p>
      </div>
    </div>
  );
};
