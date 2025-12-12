'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { updateTenantBranding, updatePlatformSeo } from '@/lib/actions/branding';

interface SeoEditorProps {
    tenantId?: string; // Optional if updating platform
    isPlatform?: boolean;
    initialData?: {
        title?: string;
        description?: string;
        keywords?: string;
        image?: string;
    };
    // Pass existing branding data so we don't wipe it out when updating (tenant only)
    currentBrandingData?: {
        logoUrl?: string;
        slogan?: string;
        branding?: any;
    }
}

export function SeoEditor({ tenantId, isPlatform, initialData, currentBrandingData }: SeoEditorProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [keywords, setKeywords] = useState(initialData?.keywords || '');
    const [logoUrl, setLogoUrl] = useState(initialData?.image || ''); // Use 'image' for og:image
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (isPlatform) {
                await updatePlatformSeo({
                    title,
                    description,
                    keywords,
                    image: logoUrl,
                });
            } else if (tenantId) {
                await updateTenantBranding(tenantId, {
                    ...currentBrandingData,
                    seo: {
                        title,
                        description,
                        keywords,
                    }
                });
            }
            toast.success('SEO settings updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update SEO');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize how your school appears in search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="seo-title">Meta Title</Label>
                    <Input
                        id="seo-title"
                        placeholder="School Name - Official Portal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground text-right">{title.length}/60</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seo-desc">Meta Description</Label>
                    <Textarea
                        id="seo-desc"
                        placeholder="A brief summary of your school..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground text-right">{description.length}/160</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seo-keywords">Keywords (comma separated)</Label>
                    <Input
                        id="seo-keywords"
                        placeholder="education, school, learning, ..."
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </div>

                {isPlatform && (
                    <div className="space-y-2">
                        <Label htmlFor="seo-image">OG Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="seo-image"
                                placeholder="https://example.com/logo.png or paste raw <svg>..."
                                value={logoUrl}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    // Auto-convert raw SVG to Data URI
                                    if (val.trim().startsWith('<svg')) {
                                        try {
                                            const encoded = Buffer.from(val).toString('base64');
                                            val = `data:image/svg+xml;base64,${encoded}`;
                                            toast.info("Converted raw SVG to Data URI");
                                        } catch (err) {
                                            console.error("Failed to encode SVG", err);
                                        }
                                    }
                                    setLogoUrl(val);
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            URL to the image. <strong>Note:</strong> Raw SVGs (converted to Data URIs) usually work for the site logo but may not display in social media previews (Facebook/LinkedIn require public HTTPS URLs).
                        </p>
                        {logoUrl && (
                            <div className="mt-2 h-20 w-40 rounded border bg-muted p-1 overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logoUrl}
                                    alt="Preview"
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="rounded-lg bg-muted p-4 mt-4">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Search Result Preview</h4>
                    <div className="font-sans">
                        <div className="text-blue-600 text-xl hover:underline cursor-pointer truncate">
                            {title || "Your School Title"}
                        </div>
                        <div className="text-green-700 text-sm mb-1">
                            www.cursor.school/your-school
                        </div>
                        <div className="text-gray-600 text-sm line-clamp-2">
                            {description || "Your school description will appear here in search engine results."}
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? 'Saving...' : 'Save SEO Settings'}
                </Button>
            </CardContent>
        </Card>
    );
}
