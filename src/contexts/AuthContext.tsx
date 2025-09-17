import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
    useRef,
} from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import { api, secureApi } from "@/hooks/axios/useAxios";
import { User, AuthContextType } from "@/types/auth";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const clientRef = useRef(null);

    useEffect(() => {
        const restoreSession = async () => {
            setIsLoading(true);
            try {
                // Call refresh endpoint (uses httpOnly cookie)
                const res = await api.post("/api/auth/refresh");
                
                if (res.data?.accessToken) {
                    const accessToken = res.data.accessToken;

                    // Store new access token
                    localStorage.setItem("accessToken", accessToken);
                    setAccessToken(accessToken);

                    // Fetch current user info
                    const meRes = await secureApi.get("/api/auth/me");

                    setUser(meRes.data.user);
                    localStorage.setItem("accessVaultUser", JSON.stringify(meRes.data.user));
                } else {
                    setUser(null);
                    setAccessToken(null);
                    localStorage.removeItem("accessVaultUser");
                    localStorage.removeItem("accessToken");
                }
            } catch (e) {
                setUser(null);
                setAccessToken(null);
                localStorage.removeItem("accessVaultUser");
                localStorage.removeItem("accessToken");
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {

          if (!window.google) return;

          clientRef.current = google.accounts.oauth2.initTokenClient({
              client_id: import.meta.env.VITE_GoogleClientID,
              scope: "profile email",
              callback: async (tokenResponse) => {
                  try {
                      const res = await fetch(
                          "https://www.googleapis.com/oauth2/v3/userinfo",
                          {
                              headers: {
                                  Authorization: `Bearer ${tokenResponse.access_token}`,
                              },
                          }
                      );
                      const profile = await res.json(); 
                      const { data } = await api.post("/api/auth/oauth", {
                          providerId: profile.sub,
                          provider: "google",
                          email: profile.email,
                          name: profile.name,
                      });
                      if (!data.success)
                          return toast.error(
                              data?.success === false &&
                                  "Try again later"
                          );
                      setUser(data.user);
                      setAccessToken(data.accessToken);
                      localStorage.setItem(
                          "accessToken",
                          data.accessToken
                      );
                      localStorage.setItem(
                          "accessVaultUser",
                          JSON.stringify(data.user)
                      );
                      toast.success(`Welcome to Master Tools BD, ${data.user.name}!`);
                  } catch (err) {
                      console.error("Google signup error:", err);
                  } finally {
                      setIsLoading(false);
                  }
              },
          });
          
    }, []);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
          const res = await api.post("/api/auth/login", { email, password });

          if (!res.data.success) return toast.error("Login failed");

          const { accessToken, user } = res.data;

          // Save to localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("accessVaultUser", JSON.stringify(user));

          // Update state
          setAccessToken(accessToken);
          setUser(user);

          toast.success(`Welcome back, ${user.name}!`);
          return user;
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (
        name: string,
        email: string,
        password: string
    ) => {
        setIsLoading(true);
        try {
            const res = await api.post("/api/auth/register", {
                name,
                email,
                password,
            });
            if (!res.data.success) return toast.error(res?.data?.success === false && "Try again later");
            // Save to data
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("accessVaultUser", JSON.stringify(user));

            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            toast.success(`Welcome to Master Tools BD, ${res.data.user.name}!`);
            return res.data.user;
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const res =  await secureApi.post("/api/auth/logout");
        } catch (err) {
            toast.error("Logout failed. Please try again.");
        }
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessVaultUser");
        toast.success("Logged out successfully");
    };
    
    const handleGoogle = async () => {
        setIsLoading(true);
        try {
            if (clientRef.current) {
                clientRef.current.requestAccessToken();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMicrosoft = async () => {
        setIsLoading(true);
        try {
            const msalConfig = {
                auth: {
                    clientId: import.meta.env.VITE_MicrosoftClientID,
                    authority: import.meta.env.VITE_MicrosoftAuthority,
                    redirectUri: import.meta.env.VITE_RedirectURI,
                },
            };
            const msalInstance = new PublicClientApplication(msalConfig);
            await msalInstance.initialize();
            // Login popup
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["User.Read"],
            });

            if (!loginResponse.accessToken) {
                throw new Error("Failed to retrieve access token");
            }   
            const { accessToken } = loginResponse;

            // Fetch user profile from Microsoft Graph
            const profileResponse = await axios.get(
                "https://graph.microsoft.com/v1.0/me",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            function mapMicrosoftProfile(profile) {
                return {
                    providerId: profile.id,
                    name: profile.displayName,
                    email:
                        profile.mail || extractEmail(profile.userPrincipalName),
                    provider: "microsoft",
                };
            }

            function extractEmail(upn) {
                if (upn.includes("#EXT#")) {
                    return upn.split("#EXT#")[0].replace("_", "@").replace(/_/g, ".");
                }
                return upn;
            }

            const profile = profileResponse.data;
            const user = mapMicrosoftProfile(profile);
            const { data } = await api.post("/api/auth/oauth", user);
            if (!data.success)
                return toast.error(
                    data?.success === false &&
                        "Try again later"
                );
            setUser(data.user);
            setAccessToken(data.accessToken);
            localStorage.setItem(
                "accessToken",
                data.accessToken
            );
            localStorage.setItem(
                "accessVaultUser",
                JSON.stringify(data.user)
            );
            toast.success(`Welcome to Master Tools BD, ${data.user.name}!`);
        }
        catch (err) {
            console.error("Google signup error:", err);
        }
        finally {
            setIsLoading(false);
        };
    }

    // 🔥 New Features
    const forgotPassword = async (email: string) => {
        try {
            await api.post("/api/auth/forgot-password", { email });
            toast.success("Password reset link sent to your email");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to send reset link"
            );
        }
    };

    const resetPassword = async (
        email: string,
        token: string,
        newPassword: string
    ) => {
        try {
            await api.post("/auth/reset-password", {
                email,
                token,
                newPassword,
            });
            toast.success("Password has been reset successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Password reset failed");
        }
    };

    const updateProfile = async (name: string) => {
        try {
            const res = await api.patch(
                "/api/auth/change-name",
                { name },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setUser(res.data.user);
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to update profile"
            );
        }
    };

    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ) => {
        try {
            const res = await secureApi.post(
                "/api/auth/change-password",
                { currentPassword, newPassword },
            );
            if (res.status == 200) return toast.success(res.data.message || "Password changed successfully");
            toast.error("Try again later");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to change password"
            );
        }
    };


    // Secure Code for Admin 

    const blockUser= async(userId: string)=> {
        try {
            await secureApi.patch(`/api/users/${userId}/block`, {});
            toast.success("User blocked successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to block user");
        }
    }

    const unblockUser = async (userId: string) => {
        try {
            await secureApi.patch(
                `/api/users/${userId}/unblock`,
                {}
            );
            toast.success("User unblocked successfully");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to unblock user"
            );
        }
    };

    const changeUserRole = async (
        userId: string,
        newRole: "admin" | "manager" | "support" | "user"
    ) => {
        try {
            await secureApi.put(
                `/api/users/${userId}/role`,
                { role: newRole }
            );
            toast.success("User role updated");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to change user role"
            );
        }
    };

    const getUsers = async () => {
        try {
            const res = await secureApi.get("/api/users");
            return res.data.users;
        } catch {
            return [];
        }
    };

    const getUserById = async (id: string) => {
        try {
            const res = await secureApi(`/api/users/${id}`);
            return res.data;
        } catch {
            return undefined;
        }
    };

    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const isSupport = user?.role === "support";

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAdmin,
                isManager,
                isSupport,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
                handleGoogle,
                handleMicrosoft,
                forgotPassword,
                resetPassword,
                updateProfile,
                changePassword,
                blockUser,
                unblockUser,
                changeUserRole,
                getUsers,
                getUserById,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
