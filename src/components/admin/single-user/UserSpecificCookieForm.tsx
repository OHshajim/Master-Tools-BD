import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cookie, Save, X, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDataContext } from "@/hooks/useDataContext";
import { secureApi } from "@/hooks/axios/useAxios";
import { Cookie as CookieType } from "@/types/dataTypes";
import { hasCookieChanges } from "@/utils/changeDetectionUtils";

interface UserSpecificCookieFormProps {
    userId: string;
    planId: string;
    planName: string;
}

const UserSpecificCookieForm: React.FC<UserSpecificCookieFormProps> = ({
    userId,
    planId,
    planName,
}) => {
    const {
        platforms,
        addUserSpecificCookie,
        updateUserSpecificCookie,
        deleteUserSpecificCookie,
    } = useDataContext();

    const [platform, setPlatform] = useState("");
    const [cookieData, setCookieData] = useState("");
    const [domain, setDomain] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCookie, setEditingCookie] = useState<CookieType | null>(null);
    const [userCookies, setUserCookies] = useState<CookieType[]>([]);

    // --- BroadcastChannel for cross-tab updates ---
    const channel = new BroadcastChannel("user-data-sync");

    const loadData = async () => {
        if (!userId) return;
        try {
            const { data } = await secureApi.get(`/api/cookies/user`,{
                params:{
                    userId
                }
            });
            setUserCookies(data);
        } catch (err) {
            console.error("Failed to load user cookies", err);
        }
    };

    const broadcastChange = () => {
        channel.postMessage({ type: "userCookies", timestamp: Date.now() });
    };

    useEffect(() => {
        loadData();

        // Listen to BroadcastChannel for changes
        channel.onmessage = (event) => {
            if (event.data?.type === "userCookies") {
                loadData();
            }
        };

        return () => channel.close();
    }, [userId]);

    // --- Utility to get default domain ---
    const getSanitizedDomain = (platformName: string) => {
        const domainMap: Record<string, string> = {
            udemy: "udemy.com",
            coursera: "coursera.org",
            skillshare: "skillshare.com",
            masterclass: "masterclass.com",
            canva: "canva.com",
            grammarly: "grammarly.com",
            chatgpt: "chat.openai.com",
            quillbot: "quillbot.com",
            codecademy: "codecademy.com",
        };
        const cleanPlatform = platformName.toLowerCase().trim();
        return (
            domainMap[cleanPlatform] ||
            `${cleanPlatform.replace(/\s+/g, "")}.com`
        );
    };

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!platform || !cookieData) {
            toast.error("Please fill in all required fields");
            return;
        }
        setIsSubmitting(true);

        try {
            const platformName =
                platforms.find((p) => p._id === platform)?.name ||
                editingCookie?.platform ||
                platform;

            if (editingCookie) {
                if (!editingCookie.userId)
                    throw new Error(
                        "User ID is missing. Cannot update cookie."
                    );

                const updatedData = {
                    platformId: platform,
                    platform: platformName,
                    cookieData,
                    value: cookieData,
                    domain: domain || getSanitizedDomain(platformName),
                    planId,
                };

                if (!hasCookieChanges(editingCookie, updatedData)) {
                    toast.info("No changes detected");
                    setIsSubmitting(false);
                    return;
                }

                await updateUserSpecificCookie({
                    ...editingCookie,
                    ...updatedData,
                    name: `Cookie for ${platformName}`,
                    userId: editingCookie.userId,
                });
                setEditingCookie(null);
            } else {
                await addUserSpecificCookie({
                    planId,
                    platformId: platform,
                    platform: platformName,
                    name: `Cookie for ${platformName}`,
                    value: cookieData,
                    cookieData,
                    domain: domain || getSanitizedDomain(platformName),
                    updatedAt: new Date().toISOString(),
                    userId,
                });
            }

            setPlatform("");
            setCookieData("");
            setDomain("");
            await loadData();
            broadcastChange();
        } catch (error) {
            toast.error("Failed to save cookie");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Edit cookie ---
    const handleEdit = (cookie: CookieType) => {
        setEditingCookie(cookie);
        const existingId = platforms.some((p) => p._id === cookie.platformId)
            ? cookie.platformId
            : platforms.find((p) => p.name === cookie.platform)?._id || "";
        setPlatform(existingId);
        setCookieData(cookie.cookieData || cookie.value);
        setDomain(cookie.domain || "");
    };

    // --- Delete cookie ---
    const handleDelete = async (id: string) => {
        await deleteUserSpecificCookie(id);
        await loadData();
        broadcastChange();
    };

    const handleCancel = () => {
        setPlatform("");
        setCookieData("");
        setDomain("");
        setEditingCookie(null);
    };

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${type} copied to clipboard`);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    return (
        <div className="space-y-6">
            {/* Add/Edit Cookie Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cookie className="h-5 w-5" />
                        {editingCookie ? "Edit" : "Add"} User-Specific Cookie
                        for {planName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="platform">Platform *</Label>
                            <Select
                                value={platform}
                                onValueChange={setPlatform}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {platforms.map((p) => (
                                        <SelectItem key={p._id} value={p._id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="cookieData">Cookie Data *</Label>
                            <Textarea
                                id="cookieData"
                                value={cookieData}
                                onChange={(e) => setCookieData(e.target.value)}
                                placeholder="Paste cookie data here..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="domain">Domain (Optional)</Label>
                            <Input
                                id="domain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="e.g., udemy.com"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="h-4 w-4 mr-2" />
                                {isSubmitting
                                    ? editingCookie
                                        ? "Updating..."
                                        : "Adding..."
                                    : editingCookie
                                    ? "Update Cookie"
                                    : "Add Cookie"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Existing User-Specific Cookies */}
            {userCookies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Existing User-Specific Cookies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Cookie Data</TableHead>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userCookies.map((cookie) => (
                                    <TableRow key={cookie._id}>
                                        <TableCell>{cookie.platform}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <span className="truncate max-w-[200px]">
                                                {(
                                                    cookie.cookieData ||
                                                    cookie.value
                                                )?.substring(0, 50)}
                                                ...
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        cookie.cookieData ||
                                                            cookie.value,
                                                        "Cookie"
                                                    )
                                                }
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {cookie.domain || "-"}
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-500">
                                            {cookie.updatedAt &&
                                                new Date(
                                                    cookie.updatedAt
                                                ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(cookie)
                                                }
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Cookie
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to delete this
                                                            cookie for{" "}
                                                            {cookie.platform}?
                                                            This action cannot
                                                            be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cookie._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserSpecificCookieForm;
