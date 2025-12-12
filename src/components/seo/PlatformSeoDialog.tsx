'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { SeoEditor } from './SeoEditor';
import { Settings } from 'lucide-react';

interface PlatformSeoDialogProps {
    initialData?: {
        title?: string;
        description?: string;
        keywords?: string;
        image?: string;
    };
}

export function PlatformSeoDialog({ initialData }: PlatformSeoDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="fixed bottom-4 left-4 z-50 shadow-lg gap-2 bg-white/90 backdrop-blur hover:bg-white text-black border-2 border-gray-200">
                    <Settings className="h-4 w-4" />
                    Platform SEO
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">Platform SEO Settings</DialogTitle>
                <div className="p-0">
                    <h2 className="text-xl font-bold mb-1">Platform SEO</h2>
                    <p className="text-sm text-muted-foreground mb-4">Manage Search Engine Optimization for the main landing page.</p>
                    <SeoEditor
                        isPlatform={true}
                        initialData={initialData}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
