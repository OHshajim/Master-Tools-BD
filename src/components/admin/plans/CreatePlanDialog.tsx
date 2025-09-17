
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Platform, Plan, DurationType } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { BasicPlanDetails } from './BasicPlanDetails';
import { DurationInputs } from './DurationInputs';
import { StickerSettings } from './StickerSettings';
import { PlatformSelector } from './PlatformSelector';
import { PlanBenefitsSection } from './PlanBenefitsSection';
import { SlugAndDraftSettings } from './SlugAndDraftSettings';
import { slugService } from '@/services/slugService';

interface CreatePlanDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (plan: Omit<Plan, "_id" | "createdAt" | "updatedAt">) => void;
    platforms: Platform[];
    homepagePlansCount: number;
    nextHomepageOrder: number;
}

const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  platforms,
  homepagePlansCount,
  nextHomepageOrder
}) => {
  const { plans } = useData();

  // Default benefits for new plans
  const defaultBenefits = [
    'Full access to all courses on included platforms',
    'Premium account privileges on each platform',
    'Certificates of completion (where available)',
    'Access to exclusive downloadable resources'
  ];

  const [newPlan, setNewPlan] = useState<Omit<Plan, "_id" | "createdAt" | "updatedAt">>({
      name: "",
      description: "",
      price: 0,
      platforms: [],
      PlanBenefits: [...defaultBenefits],
      durationType: "months",
      durationValue: 1,
      stickerText: "",
      stickerColor: "#8B5CF6",
      showOnHomepage: false,
      slug: "",
      homepageOrder:0,
      isDraft: false,
  });

  const [slugError, setSlugError] = useState<string>('');
  const [slugTouched, setSlugTouched] = useState<boolean>(false);

  const togglePlatform = (platformId: string) => {
    if (newPlan.platforms.includes(platformId)) {
      setNewPlan({
        ...newPlan,
        platforms: newPlan.platforms.filter(id => id !== platformId)
      });
    } else {
      setNewPlan({
        ...newPlan,
        platforms: [...newPlan.platforms, platformId]
      });
    }
  };

  const setBenefits = (benefits: string[]) => {
    setNewPlan({
        ...newPlan,
        PlanBenefits: benefits,
        homepageOrder:0,
    });
  };

  // Auto-generate slug from name if slug is empty and not manually edited
  useEffect(() => {
    if (newPlan.name && !newPlan.slug && !slugTouched) {
      const generatedSlug = slugService.generateSlug(newPlan.name);
      setNewPlan(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [newPlan.name, newPlan.slug, slugTouched]);

  // Validate slug
  useEffect(() => {
    if (newPlan.slug) {
      const isUnique = slugService.isSlugUnique(plans, newPlan.slug);
      if (!isUnique) {
        setSlugError('This slug is already in use. Please choose a different one.');
      } else if (!/^[a-z0-9-]+$/.test(newPlan.slug)) {
        setSlugError('Slug can only contain lowercase letters, numbers, and hyphens.');
      } else {
        setSlugError('');
      }
    } else {
      setSlugError('');
    }
  }, [newPlan.slug, plans]);

  const handleCreatePlan = () => {
    try {
      if (!newPlan.name) {
        toast({ title: "Error", description: "Plan name is required" });
        return;
      }
      
      if (newPlan.price <= 0) {
        toast({ title: "Error", description: "Price must be greater than 0" });
        return;
      }
      
      if (newPlan.platforms.length === 0) {
        toast({ title: "Error", description: "Select at least one platform" });
        return;
      }
      
      if (newPlan.durationValue <= 0) {
        toast({ title: "Error", description: "Duration value must be greater than 0" });
        return;
      }
      
      if (!newPlan.slug.trim()) {
        toast({ title: "Error", description: "Slug is required" });
        return;
      }
      
      if (slugError) {
        toast({ title: "Error", description: "Please fix the slug error before creating the plan" });
        return;
      }
      
      // Filter out empty benefits
      const filteredBenefits = newPlan.PlanBenefits.filter((benefit) => benefit.trim() !== "");
      const finalPlan = {
        ...newPlan,
        benefits: filteredBenefits.length > 0 ? filteredBenefits : defaultBenefits
      };
      
      // If plan is for homepage, set the order
      if (finalPlan.showOnHomepage) {
        finalPlan.homepageOrder = nextHomepageOrder;
      }

      onSubmit(finalPlan);
      
      // Reset form
      setNewPlan({
          name: "",
          description: "",
          price: 0,
          platforms: [],
          PlanBenefits: [...defaultBenefits],
          durationType: "months",
          durationValue: 1,
          stickerText: "",
          stickerColor: "#8B5CF6",
          showOnHomepage: false,
          slug: "",
          isDraft: false,
          homepageOrder:0
      });
      setSlugError('');
      setSlugTouched(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create plan" });
      console.error(error);
    }
  };

  const handleHomepageChange = (checked: boolean) => {
    setNewPlan({ ...newPlan, showOnHomepage: checked });
  };

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
              <DialogHeader>
                  <DialogTitle>Create New Plan</DialogTitle>
                  <DialogDescription>
                      Add a new subscription plan to your platform
                  </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4 py-4">
                      <BasicPlanDetails
                          name={newPlan.name}
                          setName={(name) => setNewPlan({ ...newPlan, name })}
                          description={newPlan.description}
                          setDescription={(description) =>
                              setNewPlan({ ...newPlan, description })
                          }
                          price={newPlan.price}
                          setPrice={(price) =>
                              setNewPlan({ ...newPlan, price })
                          }
                          showOnHomepage={newPlan.showOnHomepage}
                          setShowOnHomepage={handleHomepageChange}
                          homepagePlansCount={homepagePlansCount}
                      />

                      <SlugAndDraftSettings
                          slug={newPlan.slug}
                          setSlug={(slug) => {
                              setNewPlan({ ...newPlan, slug });
                              setSlugTouched(true);
                          }}
                          isDraft={newPlan.isDraft}
                          setIsDraft={(isDraft) =>
                              setNewPlan({ ...newPlan, isDraft })
                          }
                          slugError={slugError}
                      />

                      <DurationInputs
                          durationType={newPlan.durationType}
                          setDurationType={(durationType) =>
                              setNewPlan({ ...newPlan, durationType })
                          }
                          durationValue={newPlan.durationValue}
                          setDurationValue={(durationValue) =>
                              setNewPlan({ ...newPlan, durationValue })
                          }
                      />

                      <PlanBenefitsSection
                          benefits={newPlan.PlanBenefits}
                          setBenefits={setBenefits}
                      />

                      <StickerSettings
                          stickerText={newPlan.stickerText}
                          setStickerText={(stickerText) =>
                              setNewPlan({ ...newPlan, stickerText })
                          }
                          stickerColor={newPlan.stickerColor}
                          setStickerColor={(stickerColor) =>
                              setNewPlan({ ...newPlan, stickerColor })
                          }
                      />

                      <PlatformSelector
                          platforms={platforms}
                          selectedPlatforms={newPlan.platforms}
                          togglePlatform={togglePlatform}
                      />
                  </div>
              </ScrollArea>

              <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                  </Button>
                  <Button onClick={handleCreatePlan}>Create Plan</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
};

export default CreatePlanDialog;
