'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRight, Paintbrush } from "lucide-react";
import { SeoEditor } from "../seo/SeoEditor";
import { BrandingEditor } from './BrandingEditor';

interface BrandingEditDialogProps {
    tenantId: string;
    currentData: {
        logoUrl?: string;
        slogan?: string;
        branding?: any;
        seo?: any;
    };
}

export function BrandingEditDialog({ tenantId, currentData }: BrandingEditDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 shadow-lg gap-2 bg-white/90 backdrop-blur hover:bg-white text-black border-2 border-gray-200">
                    <Paintbrush className="h-4 w-4" />
                    Customize Site
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full p-0 gap-0">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Site Customization</h2>
                    <p className="text-sm text-muted-foreground">Manage the appearance and visibility of your school portal.</p>
                </div>

                <Tabs defaultValue="branding" className="w-full">
                    <div className="px-6 pt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="branding">Branding & Design</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        <TabsContent value="branding" className="mt-0 space-y-4">
                            <BrandingEditor tenantId={tenantId} initialData={currentData} />
                        </TabsContent>
                        <TabsContent value="seo" className="mt-0 space-y-4">
                            <SeoEditor
                                tenantId={tenantId}
                                initialData={currentData.seo}
                                currentBrandingData={{
                                    logoUrl: currentData.logoUrl,
                                    slogan: currentData.slogan,
                                    branding: currentData.branding
                                }}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
