
import React from 'react';
import UserCredentialForm from './UserCredentialForm';
import UserCredentialsTable from './UserCredentialsTable';
import DeleteCredentialDialog from './DeleteCredentialDialog';
import { useUserCredentialForm } from '@/hooks/admin/useUserCredentialForm';

interface UserSpecificCredentialFormProps {
  userId: string;
  planId: string;
  planName: string;
}

const UserSpecificCredentialForm: React.FC<UserSpecificCredentialFormProps> = ({
  userId,
  planId,
  planName
}) => {
  const {
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
  } = useUserCredentialForm(userId, planId);

  return (
    <div className="space-y-6">
      <UserCredentialForm
        platforms={platforms}
        platform={platform}
        setPlatform={setPlatform}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        domain={domain}
        setDomain={setDomain}
        isSubmitting={isSubmitting}
        editingCredential={editingCredential}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        planName={planName}
        showPassword={showPassword}
        onTogglePassword={togglePasswordVisibility}
      />

      <UserCredentialsTable
        credentials={userCredentials}
        platforms={platforms}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCopy={copyToClipboard}
      />

      <DeleteCredentialDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        platformName={deleteDialog.platformName}
      />
    </div>
  );
};

export default UserSpecificCredentialForm;
