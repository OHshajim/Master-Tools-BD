import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Plan, DurationType } from "@/types/dataTypes";
import { slugService } from "@/services/slugService";
import { usePlanProvider } from "./providers/usePlanProvider";
import { useNavigate } from "react-router-dom";

const defaultBenefits = [
    "Full access to all courses on included platforms",
    "Premium account privileges on each platform",
    "Certificates of completion (where available)",
    "Access to exclusive downloadable resources",
];

export const useAdminPlanDetail = (id?: string) => {
    const { plans, addPlan, updatePlan, formatPlanDuration, loadPlans } = usePlanProvider();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [benefits, setBenefits] = useState<string[]>(defaultBenefits);
    const [stickerText, setStickerText] = useState("");
    const [stickerColor, setStickerColor] = useState("");
    const [durationType, setDurationType] = useState<DurationType>("months");
    const [durationValue, setDurationValue] = useState<number>(1);
    const [slug, setSlug] = useState("");
    const [isDraft, setIsDraft] = useState(false);
    const [slugError, setSlugError] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const Navigate = useNavigate();


    // Reset form
    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice(0);
        setSelectedPlatforms([]);
        setBenefits([]);
        setStickerText("");
        setStickerColor("");
        setDurationType("months");
        setDurationValue(1);
        setSlug("");
        setIsDraft(false);
        setSlugError("");
        setSlugTouched(false);
    };

    // Auto-generate slug
    useEffect(() => {
        if (name && !slug && !slugTouched) {
            setSlug(slugService.generateSlug(name));
        }
    }, [name, slug, slugTouched]);

    // Slug validation
    useEffect(() => {
        if (!slug) return setSlugError("");
        const isUnique = slugService.isSlugUnique(plans, slug, plan?._id);
        if (!isUnique) {
            setSlugError(
                "This slug is already in use. Please choose a different one."
            );
            setIsSaving(false);
        } else if (!/^[a-z0-9-]+$/.test(slug)) {
            setSlugError(
                "Slug can only contain lowercase letters, numbers, and hyphens."
            );
            setIsSaving(false);
        } else {
            setSlugError("");
        }
    }, [slug, plans, plan?._id]);

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platformId)
                ? prev.filter((id) => id !== platformId)
                : [...prev, platformId]
        );
    };

    const handleDurationTypeChange = (value: DurationType) => setDurationType(value);

    const handleSave = async () => {
        setIsSaving(true);
        // Validation
        if (!name.trim()){
            setIsSaving(false);
            return toast.error("Plan name is required");}
        if (price <= 0){
            setIsSaving(false);
            return toast.error("Price must be greater than zero");}
        if (selectedPlatforms.length === 0){        
            setIsSaving(false);
            return toast.error("Select at least one platform");
        }
        if (id === "new" && !slug.trim()){
            setIsSaving(false);
            return toast.error("Slug is required");}
        if (slugError) {
            setIsSaving(false);
            return toast.error("Fix slug error before saving")};

        const filteredBenefits = benefits.filter((b) => b.trim() !== "") ;
        const finalBenefits = filteredBenefits.length ? filteredBenefits : defaultBenefits;
        const planData = {
            name,
            description,
            price,
            platforms: selectedPlatforms,
            PlanBenefits: [...finalBenefits,...defaultBenefits.filter(db => !finalBenefits.includes(db))],
            stickerText,
            stickerColor,
            durationType,
            durationValue,
            slug,
            isDraft,
        };

        try {
            if (id === "new") {
                await addPlan({
                    ...planData,
                    showOnHomepage: false,
                    homepageOrder: 0,
                });
                resetForm();
                setBenefits([...defaultBenefits]);
                setSlugTouched(false);
            } else if (plan) {
                await updatePlan({ ...plan, ...planData });
                toast.success("Plan updated successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to save plan");
        } finally {
            loadPlans();
            setIsSaving(false);
            Navigate('/admin/plans');
        }
    };

    return {
        isLoading,
        setIsLoading,
        isSaving,
        plan,
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
        setSlug: (newSlug: string) => {
            setSlug(newSlug);
            setSlugTouched(true);
        },
        isDraft,
        setIsDraft,
        slugError,
        handleSave,
        resetForm,
        formatPlanDuration,
        setPlan,
        setSelectedPlatforms,
        setDurationType,
    };
};
