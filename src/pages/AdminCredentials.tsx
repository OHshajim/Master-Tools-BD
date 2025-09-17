
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CredentialsCard } from '@/components/admin/credentials/CredentialTable';
import CredentialForm from '@/components/admin/credentials/CredentialForm';
import { useCredentialManagement } from '@/hooks/useCredentialManagement';
import { PlanSelector } from '@/components/admin/plans/PlanSelector';
import { Card, CardContent } from '@/components/ui/card';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminCredentials = () => {
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const navigate = useNavigate();
  
  const {
    platform,
    setPlatform,
    username,
    setUsername,
    password, 
    setPassword,
    domain,
    setDomain,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlatformId,
    setSelectedPlatformId,
    isDrafted,
    setIsDrafted,
    isEditing,
    planNames,
    plans,
    filteredCredentials,
    currentPlan,
    handleSubmit,
    handleEditCredential,
    handleDeleteCredential,
    resetForm,
    copyToClipboard
  } = useCredentialManagement();
  
  const [filterPlanId, setFilterPlanId] = useState<string>('all');
  
  
  // Make sure we always use the complete list of credentials from the hook
  const credentials = filteredCredentials;
  
  // Apply plan filter in the component level
  const displayedCredentials = filterPlanId !== 'all'
    ? credentials.filter(cred => cred.planId === filterPlanId)
    : credentials; // Show all credentials when "all" is selected
  
  // Get count per plan for summary
  const credentialsByPlan = plans.map(plan => {
    const count = credentials.filter(cred => cred.planId === plan._id).length;
    return { plan, count };
  }).filter(item => item.count > 0);
  
  // Admin check
  useEffect(() => {
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
    }
  }, [user, isAdmin, isManager, isSupport, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Manage Credentials</h1>
        <p className="text-gray-600">
          Add and manage login credentials for your plans
        </p>
      </div>
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div>
          {/* Plan Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <PlanSelector 
                plans={plans}
                selectedPlanId={filterPlanId}
                onPlanChange={setFilterPlanId}
              />
            </CardContent>
          </Card>
          
          {/* Form */}
          <CredentialForm 
            platform={platform}
            setPlatform={setPlatform}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            domain={domain}
            setDomain={setDomain}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            selectedPlatformId={selectedPlatformId}
            setSelectedPlatformId={setSelectedPlatformId}
            isDrafted={isDrafted}
            setIsDrafted={setIsDrafted}
            isEditing={isEditing}
            handleSubmit={handleSubmit}
            handleCancelEdit={resetForm}
            plans={plans}
          />
          
          {/* Plan Credentials Summary */}
          {credentialsByPlan.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-3">Credentials Per Plan</h3>
                <div className="space-y-2">
                  {credentialsByPlan.map(({plan, count}) => (
                    <div key={plan._id} className="flex justify-between text-sm">
                      <span>{plan.name}</span>
                      <span className="font-medium">{count} credentials</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Credentials List */}
        <div className="lg:col-span-2">
          <CredentialsCard
            credentials={displayedCredentials}
            planNames={planNames}
            plan={filterPlanId !== 'all' ? {_id: filterPlanId, name: planNames[filterPlanId] || 'Unknown Plan'} : currentPlan}
            handleEditCredentialClick={handleEditCredential}
            openDeleteDialog={handleDeleteCredential}
            copyToClipboard={copyToClipboard}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminCredentials;
