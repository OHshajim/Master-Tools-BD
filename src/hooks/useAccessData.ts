import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDataContext } from "@/hooks/useDataContext";
import { Credential } from "@/types/credential";
import { Cookie } from "@/types/cookie";
import { Platform } from "@/types/platform";
import { Plan } from "@/types/plan";
import { Order } from "@/types/order";
import { DraftPlatformStatus } from "@/types/draftPlatform";
import { socket } from "@/lib/socket";

interface AccessDataError {
    message: string;
    code?: string;
    retryable?: boolean;
}

export const useAccessData = (planId: string) => {
    const { user } = useAuth();
    const {
        platforms,
        getPlanById,
        getUserOrders,
        getCredentialsForPlan,
        getCookiesForPlan,
        getUserSpecificCredentials,
        getUserSpecificCookies,
        draftPlatforms,
    } = useDataContext();

    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [cookies, setCookies] = useState<Cookie[]>([]);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<AccessDataError | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const platformMap = useMemo(() => {
        const map = new Map<string, Platform>();
        platforms.forEach((p) => {
            map.set(p._id, p);
            map.set(p.name, p);
        });
        return map;
    }, [platforms]);

    const loadData = useCallback(() => {
        if (!planId || !user) return;

        try {
            setIsLoading(true);
            setError(null);

            const planData = getPlanById(planId);
            if (!planData) throw new Error(`Plan not found: ${planId}`);
            setPlan(planData);

            const userOrders = getUserOrders(user._id);
            const planOrder =
                userOrders.find((o) => o.planId === planId) || null;
            setOrder(planOrder);

            // Create draft lookup set
            const draftSet = new Set(
                draftPlatforms
                    .filter((d) => d.userId === user._id && d.planId === planId)
                    .map((d) => `${d.platformId}-${d.type}`)
            );

            // --- Credentials ---
            const globalCredentials = getCredentialsForPlan(planId).filter(
                (c) =>
                    !c.isDrafted &&
                    !draftSet.has(`${c.platformId || c.platform}-credential`)
            );

            const userCreds = getUserSpecificCredentials(
                user._id,
                planId
            ).filter(
                (c) =>
                    !c.isDrafted &&
                    !draftSet.has(`${c.platformId || c.platform}-credential`)
            );

            const mergedCredentials: Credential[] = [
                ...globalCredentials.filter(
                    (g) => !userCreds.some((u) => u._id === g._id)
                ),
                ...userCreds,
            ].sort(
                (a, b) =>
                    new Date(b.updatedAt || "").getTime() -
                    new Date(a.updatedAt || "").getTime()
            );
            setCredentials(mergedCredentials);

            // --- Cookies ---
            const globalCookies = getCookiesForPlan(planId).filter(
                (c) =>
                    !c.isDrafted &&
                    !draftSet.has(`${c.platformId || c.platform}-cookie`)
            );

            const userCookies = getUserSpecificCookies(user._id, planId).filter(
                (c) =>
                    !c.isDrafted &&
                    !draftSet.has(`${c.platformId || c.platform}-cookie`)
            );

            const mergedCookies: Cookie[] = [
                ...globalCookies.filter(
                    (g) => !userCookies.some((u) => u._id === g._id)
                ),
                ...userCookies,
            ].sort(
                (a, b) =>
                    new Date(b.updatedAt || "").getTime() -
                    new Date(a.updatedAt || "").getTime()
            );
            setCookies(mergedCookies);

            setRetryCount(0);
        } catch (err) {
            console.error(err);
            setError({
                message:
                    err instanceof Error ? err.message : "Failed to load data",
                code: "LOAD_ERROR",
                retryable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }, [
        planId,
        user,
        getPlanById,
        getUserOrders,
        getCredentialsForPlan,
        getCookiesForPlan,
        getUserSpecificCredentials,
        getUserSpecificCookies,
        draftPlatforms,
    ]);

    const retryLoadData = useCallback(() => {
        if (retryCount < 3) {
            setRetryCount((prev) => prev + 1);
            loadData();
        }
    }, [loadData, retryCount]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleUpdate = async () => {
            try {
                await loadData();
            } catch (err) {
                console.error("Failed to reload data via socket:", err);
            }
        };

        socket.on("credential", handleUpdate);
        socket.on("cookie", handleUpdate);
        socket.on("draftPlatform:created", handleUpdate);
        socket.on("draftPlatform:deleted", handleUpdate);
        socket.on("draftPlatform", handleUpdate);

        return () => {
            socket.off("credential", handleUpdate);
            socket.off("cookie", handleUpdate);
            socket.off("draftPlatform", handleUpdate);
        };
    }, [socket, loadData, user]);

    const getCredentialsByPlatform = useMemo(() => {
        const grouped = new Map<string, Credential[]>();
        credentials.forEach((c) => {
            const platformName =
                platformMap.get(c.platformId || c.platform)?.name ||
                c.platform ||
                "Unknown";
            if (!grouped.has(platformName)) grouped.set(platformName, []);
            grouped.get(platformName)?.push(c);
        });
        return Array.from(grouped.entries()).map(([platformName, creds]) => ({
            platform: platformName,
            credentials: creds,
        }));
    }, [credentials, platformMap]);

    const getCookiesByPlatform = useMemo(() => {
        const grouped = new Map<string, Cookie[]>();
        cookies.forEach((c) => {
            const platformName =
                platformMap.get(c.platformId || c.platform)?.name ||
                c.platform ||
                "Unknown";
            if (!grouped.has(platformName)) grouped.set(platformName, []);
            grouped.get(platformName)?.push(c);
        });
        return Array.from(grouped.entries()).map(
            ([platformName, cookieList]) => ({
                platform: platformName,
                cookies: cookieList,
            })
        );
    }, [cookies, platformMap]);

    return {
        credentials,
        cookies,
        plan,
        order,
        isLoading,
        error,
        getCredentialsByPlatform,
        getCookiesByPlatform,
        retryLoadData,
    };
};
