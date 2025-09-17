import { useState } from 'react';
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/components/ui/sonner';
import { Credential } from '@/types/dataTypes';
import { hasCredentialChanges } from '@/utils/changeDetectionUtils';
import { useUserSpecificCredentialProvider } from '../providers/credentials/useUserSpecificCredentialProvider';

export const useUserCredentialForm = (userId: string, planId: string) => {
  const { platforms, addUserSpecificCredential, updateUserSpecificCredential, deleteUserSpecificCredential, getUserSpecificCredentials } = useDataContext();
  const { userCredentials } = useUserSpecificCredentialProvider();
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; credentialId: string; platformName: string }>({
    isOpen: false,
    credentialId: '',
    platformName: ''
  });

  // Helper function to get platform name from platform ID
  const getPlatformName = (platformId: string): string => {
    const foundPlatform = platforms.find(p => p._id === platformId);
    return foundPlatform ? foundPlatform.name : platformId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!domain || domain.trim() === '') {
      toast.error('Please enter a domain URL for this credential');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the actual platform name for storage
      const platformName = getPlatformName(platform);

      if (editingCredential) {
        // Ensure userId is provided for existing credentials
        if (!editingCredential.userId) {
          toast.error('User ID is missing. Cannot update credential.');
          setIsSubmitting(false);
          return;
        }

        // Check for actual changes
        const updatedData = {
          platformId: platform,
          platform: platformName,
          username,
          password,
          domain: domain.trim(),
          planId
        };

        const hasChanges = hasCredentialChanges(editingCredential, updatedData);

        if (!hasChanges) {
          toast.info('No changes detected');
          setIsSubmitting(false);
          return;
        }

        updateUserSpecificCredential({
          ...editingCredential,
          ...updatedData,
          userId: editingCredential.userId,
          updatedAt: new Date().toISOString()
        });
        setEditingCredential(null);
      } else {
        addUserSpecificCredential({
          planId,
          platformId: platform,
          platform: platformName,
          username,
          password,
          domain: domain.trim(),
          updatedAt: new Date().toISOString(),
          userId
        });
      }
      
      resetForm();
    } catch (error) {
      toast.error('Failed to save credential');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setPlatform(credential.platformId);
    setUsername(credential.username);
    setPassword(credential.password);
    setDomain(credential.domain || '');
  };

  const handleDeleteClick = (id: string, platformName: string) => {
    setDeleteDialog({
      isOpen: true,
      credentialId: id,
      platformName
    });
  };

  const handleDeleteConfirm = () => {
    deleteUserSpecificCredential(deleteDialog.credentialId);
    setDeleteDialog({ isOpen: false, credentialId: '', platformName: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, credentialId: '', platformName: '' });
  };

  const resetForm = () => {
    setPlatform('');
    setUsername('');
    setPassword('');
    setDomain('');
    setEditingCredential(null);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    platforms,
    platform,
    setPlatform,
    username,
    setUsername,
    password,
    setPassword,
    domain,
    setDomain,
    showPassword,
    isSubmitting,
    editingCredential,
    userCredentials,
    deleteDialog,
    handleSubmit,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    resetForm,
    copyToClipboard,
    togglePasswordVisibility
  };
};
