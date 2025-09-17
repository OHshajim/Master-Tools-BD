import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Cookie } from "@/types/dataTypes";
import { toast } from "@/components/ui/sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cookieService } from "@/services/cookieService";

export const useAdminCookies = () => {
    const {
        cookies :allCookies,
        plans,
        addCookie,
        updateCookie,
        deleteCookie,
        togglePinnedStatus,
    } = useData();

    const { planId: routePlanId } = useParams<{ planId: string }>();
    const cookies = allCookies
        .filter((c) => !c.userId)
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.isPinned && b.isPinned) {
                const aTime = a.pinnedAt || a.updatedAt || "";
                const bTime = b.pinnedAt || b.updatedAt || "";
                return (
                    new Date(aTime).getTime() - new Date(bTime).getTime()
                );
            }
            if (!a.updatedAt) return 1;
            if (!b.updatedAt) return -1;
            return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
        });


    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentCookieId, setCurrentCookieId] = useState("");
    const [originalCookie, setOriginalCookie] = useState<Cookie | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState(routePlanId || "");
    const [shouldResetForm, setShouldResetForm] = useState(false);

    // Local storage for viewed cookies
    const [viewedCookies, setViewedCookies] = useLocalStorage<
        Record<string, boolean>
    >("viewed_cookies", {});

    // Current plan name
    const currentPlanName = routePlanId
        ? plans.find((p) => p._id === routePlanId)?.name
        : undefined;

    // Delete cookie
    const handleDeleteCookie = (id: string) => {
        if (confirm("Are you sure you want to delete this cookie?")) {
            deleteCookie(id);
            if (currentCookieId === id) handleCancelEdit();
        }
    };

    // Toggle pinned status
    const handleTogglePinned = (cookie: Cookie) => {
        togglePinnedStatus(cookie._id);
    };

    // Edit cookie
    const handleEditCookie = (cookie: Cookie) => {
        setIsEditing(true);
        setCurrentCookieId(cookie._id);
        setOriginalCookie({ ...cookie });
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentCookieId("");
        setOriginalCookie(null);
    };

    // Save cookie (add/update)
    const handleSaveCookie = (cookieData: Partial<Cookie>) => {
        try {
            if (isEditing && currentCookieId && originalCookie) {
                const cookieToUpdate = cookies.find(
                    (c) => c._id === currentCookieId
                );
                if (!cookieToUpdate) return;

                const updatedCookie = {
                    ...cookieToUpdate,
                    ...cookieData,
                    isPinned: cookieToUpdate.isPinned,
                    pinnedAt: cookieToUpdate.pinnedAt,
                };

                const originalPlatformId = cookieService.normalizePlatformId(
                    originalCookie.platformId || "",
                    originalCookie.platform || ""
                );
                const updatedPlatformId = cookieService.normalizePlatformId(
                    updatedCookie.platformId || "",
                    updatedCookie.platform || ""
                );

                const hasContentChanges =
                    originalPlatformId !== updatedPlatformId ||
                    originalCookie.name !== updatedCookie.name ||
                    originalCookie.value !== updatedCookie.value ||
                    originalCookie.cookieData !== updatedCookie.cookieData ||
                    originalCookie.domain !== updatedCookie.domain ||
                    originalCookie.planId !== updatedCookie.planId;

                const onlyDraftChanged =
                    !hasContentChanges &&
                    originalCookie.isDrafted !== updatedCookie.isDrafted;

                if (hasContentChanges || onlyDraftChanged) {
                    updateCookie(updatedCookie);
                } else {
                    toast.info("No changes detected");
                }
            } else {
                  addCookie({
                    platformId: cookieData.platformId || "",
                    name: `Cookie for ${
                        cookieData.platform || cookieData.platformId || ""
                    }`,
                    value: cookieData.cookieData || "",
                    platform: cookieData.platform || "",
                    cookieData: cookieData.cookieData || "",
                    domain: cookieData.domain || "",
                    planId: cookieData.planId || "",
                    isPinned: cookieData.isPinned || false,
                    pinnedAt: cookieData.isPinned
                        ? new Date().toISOString()
                        : undefined,
                    isDrafted: cookieData.isDrafted || false,
                });
                setShouldResetForm(true);
            }

            handleCancelEdit();
        } catch (error) {
            console.error("Error saving cookie:", error);
            toast.error("Failed to save cookie");
        }
    };

    return {
        cookies,
        plans,
        isEditing,
        currentCookie:
            isEditing && currentCookieId
                ? cookies.find((c) => c._id === currentCookieId) || null
                : null,
        selectedPlanId,
        currentPlanName,
        viewedCookies,
        shouldResetForm,
        setShouldResetForm,
        handleDeleteCookie,
        handleEditCookie,
        handleSaveCookie,
        handleCancelEdit,
        handleTogglePinned,
    };
};
