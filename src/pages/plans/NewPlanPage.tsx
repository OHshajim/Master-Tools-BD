
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminPlanDetail } from '@/hooks/useAdminPlanDetail';
import PlanForm from '@/components/admin/plans/PlanForm';
import PlanDetailHeader from '@/components/admin/plans/PlanDetailHeader';
import { useData } from '@/contexts/DataContext';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const NewPlanPage = () => {
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const { platforms } = useData();
  
  const {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    selectedPlatforms,
    togglePlatform,
    benefits,
    setBenefits,
    stickerText,
    setStickerText,
    stickerColor,
    setStickerColor,
    durationType,
    handleDurationTypeChange,
    durationValue,
    setDurationValue,
    slug,
    setSlug,
    isDraft,
    setIsDraft,
    slugError,
    handleSave,
    isSaving
  } = useAdminPlanDetail('new');
  
  // Handle authentication
  if (!user || (!isAdmin && !isManager)) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <PlanDetailHeader 
        planName="Create New Plan" 
        navigateBack={() => navigate('/admin/plans')} 
        isNewPlan={true}
      />
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2">
          <PlanForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            platforms={platforms}
            benefits={benefits}
            setBenefits={setBenefits}
            stickerText={stickerText}
            setStickerText={setStickerText}
            stickerColor={stickerColor}
            setStickerColor={setStickerColor}
            durationType={durationType}
            handleDurationTypeChange={handleDurationTypeChange}
            durationValue={durationValue}
            setDurationValue={setDurationValue}
            slug={slug}
            setSlug={setSlug}
            isDraft={isDraft}
            setIsDraft={setIsDraft}
            slugError={slugError}
            handleSave={handleSave}
            isSaving={isSaving}
            isNewPlan={true}
          />
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Tips for Creating Plans</h3>
            <ul className="space-y-2 text-sm">
              <li>• Add a clear, concise plan name</li>
              <li>• Write detailed descriptions to help customers</li>
              <li>• Select all platforms included in this plan</li>
              <li>• Set competitive pricing based on market research</li>
              <li>• Add specific benefits to highlight plan value</li>
              <li>• Consider adding a promotional sticker for visibility</li>
              <li>• Use custom slugs for marketing campaigns</li>
              <li>• Save as draft to test before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlanPage;
