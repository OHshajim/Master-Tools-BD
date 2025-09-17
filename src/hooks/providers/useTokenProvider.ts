import { useEffect, useState } from "react";
import { Token, CreateTokenRequest } from "@/types/tokenTypes";
import { tokenService } from "@/services/tokenService";
import { secureApi } from "@/hooks/axios/useAxios";

export const useTokenProvider = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
          if (!localStorage.getItem("accessToken")) return;
          const { data } = await secureApi.get<Token[]>("/api/tokens");
          setTokens(data);
        } catch (err) {
            console.error("Failed to load tokens", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const createToken = async (tokenData: CreateTokenRequest) => {
        const newToken = await tokenService.createToken(tokenData);
        setTokens((prev) => [...prev, newToken]);
        return newToken;
    };

    const updateTokenStatus = async (tokenId: string, isActive: boolean) => {
        const updatedToken = await tokenService.updateTokenStatus(
            tokenId,
            isActive
        );
        setTokens((prev) =>
            prev.map((t) => (t._id === tokenId ? updatedToken : t))
        );
    };

    const deleteToken = async (tokenId: string) => {
        await tokenService.deleteToken(tokenId);
        setTokens((prev) => prev.filter((t) => t._id !== tokenId));
    };

    const updateLastUsed = async (tokenId: string) => {
        const updatedToken = await tokenService.updateLastUsed(tokenId);
        setTokens((prev) =>
            prev.map((t) => (t._id === tokenId ? updatedToken : t))
        );
    };

    return {
        tokens,
        loading,
        reload: loadData,
        createToken,
        updateTokenStatus,
        deleteToken,
        updateLastUsed,
    };
};
