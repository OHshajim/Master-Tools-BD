import { useEffect, useState } from "react";
import { QuickLink } from "@/types/dataTypes";
import { api } from "../axios/useAxios";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = "/api/quicklinks";

export const useQuickLinkProvider = () => {
    const {user}=useAuth()
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

    // Fetch all links on mount
    useEffect(() => {
        if (!user)return;
        fetchQuickLinks();
    }, []);

    const fetchQuickLinks = async () => {
        try {
            const {data} = await api.get(API_BASE);
            setQuickLinks(data);
        } catch (error) {
            console.error("Error fetching quick links:", error);
        }
    };

    const addQuickLink = async (
        quickLinkData: Omit<QuickLink, "_id" | "createdAt">
    ) => {
        try {
            const { data } = await api.post(API_BASE,  quickLinkData);
            setQuickLinks((prev) => [...prev, data]);
        } catch (error) {
            console.error("Error adding quick link:", error);
        }
    };

    const updateQuickLink = async (quickLinkData: QuickLink) => {
        try {
            const {data} = await api.put(`${API_BASE}/${quickLinkData._id}`, quickLinkData);
            setQuickLinks((prev) =>
                prev.map((link) => (link._id === data._id ? data : link))
            );
        } catch (error) {
            console.error("Error updating quick link:", error);
        }
    };

    const deleteQuickLink = async (id: string) => {
        try {
             await api.delete(`${API_BASE}/${id}`);
            setQuickLinks((prev) => prev.filter((link) => link._id !== id));
        } catch (error) {
            console.error("Error deleting quick link:", error);
        }
    };

    const getActiveQuickLinks = (): QuickLink[] => {
        return quickLinks.filter((link) => link.isActive).sort();
    };

    const reorderQuickLinks = async (reorderedLinks: QuickLink[]) => {
        try {
            // Update local order immediately (optimistic update)
            const updatedLinks = await reorderedLinks.map((link, index) => ({
                ...link,
                order: index + 1,
                updatedAt: new Date().toISOString(),
            }));
            setQuickLinks(updatedLinks);

            // Send each updated order to backend
            await Promise.all(
                updatedLinks.map((link) =>
                    api.patch(`${API_BASE}/${link._id}/reorder`,{ order: link.order })
                )
            );
        } catch (error) {
            console.error("Error reordering quick links:", error);
        }
    };

    return {
        quickLinks,
        addQuickLink,
        updateQuickLink,
        deleteQuickLink,
        getActiveQuickLinks,
        reorderQuickLinks,
        fetchQuickLinks, // useful if you want manual refresh
    };
};
