'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTenantInfo } from "@/lib/actions/super-admin";
import { toast } from "sonner";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TenantDetailsEditorProps {
    tenantId: string;
    initialSlug: string;
    initialDomain?: string | null;
    initialLogoUrl?: string | null;
    platformLogoUrl?: string | null;
}

export function TenantDetailsEditor({
    tenantId,
    initialSlug,
    initialDomain,
    initialLogoUrl,
    platformLogoUrl
}: TenantDetailsEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        slug: initialSlug,
        domain: initialDomain || '',
        logoUrl: initialLogoUrl || '', // If empty, we show platform logo but value is empty string
    });

    const isSecure = process.env.NODE_ENV === 'production';
    const protocol = isSecure ? 'https' : 'http';
    const rootDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'local.cursorschool.test:3000';

    // Fallback Domain Logic
    const constructedDomain = `${protocol}://${formData.slug}.${rootDomain}`;
    const displayDomain = formData.domain ? formData.domain : constructedDomain;

    // Logo Display Logic
    const displayLogo = formData.logoUrl || platformLogoUrl;

    const handleSave = async () => {
        setLoading(true);
        try {
            // Use the specific super admin action
            await updateTenantInfo(tenantId, {
                slug: formData.slug,
                domain: formData.domain || undefined,
                logoUrl: formData.logoUrl || undefined,
            });

            toast.success("Tenant updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update tenant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Slug</span>
                {isEditing ? (
                    <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="h-8 w-[200px]"
                    />
                ) : (
                    <span className="text-muted-foreground">{formData.slug}</span>
                )}
            </div>

            <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Domain</span>
                {isEditing ? (
                    <Input
                        placeholder="Custom Domain (Optional)"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        className="h-8 w-[200px]"
                    />
                ) : (
                    <div className="flex flex-col items-end">
                        {!formData.domain && <Badge variant="secondary" className="mb-1 text-[10px]">Auto-Generated</Badge>}
                        <a href={displayDomain} target="_blank" className="text-blue-500 hover:underline text-sm">
                            {displayDomain}
                        </a>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Logo</span>
                {isEditing ? (
                    <Input
                        placeholder="Logo URL"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        className="h-8 w-[200px]"
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        {!formData.logoUrl && <span className="text-xs text-muted-foreground">(Platform Default)</span>}
                        {displayLogo ? (
                            <img src={displayLogo} alt="Logo" className="h-8 w-8 object-contain rounded" />
                        ) : (
                            <span className="text-muted-foreground text-xs">No Logo</span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-2">
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                            <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Details
                    </Button>
                )}
            </div>
        </div>
    );
}
