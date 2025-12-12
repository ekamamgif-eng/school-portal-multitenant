import { BrandingEditor } from "@/components/branding/BrandingEditor";
import { getPlatformBranding } from "@/lib/actions/branding";

export default async function PlatformBrandingPage() {
    const branding = await getPlatformBranding() as any;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Branding & Theme</h2>
                <p className="text-muted-foreground">Customize the global look and feel of the platform.</p>
            </div>

            <div className="grid gap-6">
                <BrandingEditor
                    isPlatform={true}
                    initialData={branding}
                />
            </div>
        </div>
    );
}
