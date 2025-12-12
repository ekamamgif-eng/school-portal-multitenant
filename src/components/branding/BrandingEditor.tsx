'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateTenantBranding, updatePlatformBranding } from '@/lib/actions/branding';

interface BrandingEditorProps {
    tenantId?: string;
    isPlatform?: boolean;
    initialData?: {
        logoUrl?: string;
        slogan?: string;
        branding?: any;
    };
}

export function BrandingEditor({ tenantId, isPlatform, initialData }: BrandingEditorProps) {
    const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || 'https://placehold.co/200x200?text=Logo');
    const [slogan, setSlogan] = useState(initialData?.slogan || '');
    const [primaryColor, setPrimaryColor] = useState(initialData?.branding?.primary || '#2563eb');
    const [secondaryColor, setSecondaryColor] = useState(initialData?.branding?.secondary || '#1e40af');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (isPlatform) {
                await updatePlatformBranding({
                    logoUrl,
                    slogan,
                    branding: {
                        primary: primaryColor,
                        secondary: secondaryColor,
                    }
                });
            } else if (tenantId) {
                await updateTenantBranding(tenantId, {
                    logoUrl,
                    slogan,
                    branding: {
                        primary: primaryColor,
                        secondary: secondaryColor,
                    },
                });
            }
            toast.success('Branding updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update branding');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Branding & Appearance</CardTitle>
                <CardDescription>Customize how your school portal looks to students and teachers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="slogan">Slogan / Mana</Label>
                    <Input
                        id="slogan"
                        placeholder="Ex: Excellence in Education"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <div className="flex gap-4">
                        <Input
                            id="logo"
                            placeholder="https://example.com/logo.png or paste raw <svg>..."
                            value={logoUrl}
                            onChange={(e) => {
                                let val = e.target.value;
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
                        {logoUrl && (
                            <div className="h-10 w-10 flex-shrink-0 rounded border bg-muted p-1 flex items-center justify-center">
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
                    <p className="text-xs text-muted-foreground">Enter a direct link to your logo image or paste raw SVG code.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="primary">Primary Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="primary"
                                type="color"
                                className="h-10 w-20 p-1 cursor-pointer"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                            />
                            <Input
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="font-mono uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="secondary">Secondary Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="secondary"
                                type="color"
                                className="h-10 w-20 p-1 cursor-pointer"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                            />
                            <Input
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="font-mono uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <Label className="mb-2 block">Live Preview</Label>
                    <div
                        className="rounded-md p-6 text-white text-center shadow-lg"
                        style={{
                            background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
                        }}
                    >
                        <h3 className="text-xl font-bold mb-2">School Header</h3>
                        <p className="opacity-90">{slogan || 'Your Slogan Here'}</p>
                        <Button
                            className="mt-4 bg-white text-black hover:bg-white/90"
                        >
                            Action Button
                        </Button>
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
        </Card>
    );
}
