
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickLink } from '@/types/dataTypes';
import { MessageCircle, Send, Phone, Mail, Globe, ExternalLink, Home, User, Settings, Heart, Star, Zap } from 'lucide-react';

interface QuickLinkFormProps {
  quickLink?: QuickLink | null;
  onSubmit: (linkData: Omit<QuickLink, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const iconOptions = [
  { value: 'none', label: 'No Icon', icon: null },
  { value: 'MessageCircle', label: 'Message Circle', icon: MessageCircle },
  { value: 'Send', label: 'Send', icon: Send },
  { value: 'Phone', label: 'Phone', icon: Phone },
  { value: 'Mail', label: 'Mail', icon: Mail },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'ExternalLink', label: 'External Link', icon: ExternalLink },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'User', label: 'User', icon: User },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Zap', label: 'Zap', icon: Zap },
];

export const QuickLinkForm = ({ quickLink, onSubmit, onCancel }: QuickLinkFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'none',
    isActive: true,
    order: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quickLink) {
      setFormData({
        title: quickLink.title,
        url: quickLink.url,
        icon: quickLink.icon || 'none',
        isActive: quickLink.isActive,
        order: quickLink.order
      });
    }
  }, [quickLink]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert 'none' back to undefined for database storage
    const submitData = {
      ...formData,
      icon: formData.icon === 'none' ? undefined : formData.icon
    };

    onSubmit(submitData);
  };

  const selectedIconOption = iconOptions.find(opt => opt.value === formData.icon);
  const SelectedIcon = selectedIconOption?.icon;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter link title (e.g., WhatsApp Support)"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="Enter full URL (e.g., https://wa.me/1234567890)"
          className={errors.url ? 'border-red-500' : ''}
        />
        {errors.url && <p className="text-sm text-red-500 mt-1">{errors.url}</p>}
      </div>

      <div>
        <Label htmlFor="icon">Icon (Optional)</Label>
        <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select an icon (optional)">
              <div className="flex items-center gap-2">
                {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                <span>{selectedIconOption?.label || 'No Icon'}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {IconComponent ? (
                      <IconComponent className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Active (visible to users)</Label>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Preview</h4>
        <div className="flex items-center gap-2 text-blue-700">
          {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
          <span>{formData.title || 'Link Title'}</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          {formData.url || 'https://example.com'}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {quickLink ? 'Update Link' : 'Add Link'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
