import { SeoEditor } from "@/components/seo/SeoEditor";
import { getPlatformSeo } from "@/lib/actions/branding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformSeoPage() {
    const platformSeo = await getPlatformSeo() as any;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Platform SEO</h2>
                <p className="text-muted-foreground">Manage search engine optimization settings for the main landing page.</p>
            </div>

            <div className="grid gap-6">
                <SeoEditor
                    isPlatform={true}
                    initialData={platformSeo}
                />
            </div>
        </div>
    );
}
