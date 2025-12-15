import { getTenantBySlug } from "@/lib/actions/tenants";
import { ClassForm } from "@/components/tenant-admin/ClassForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateClassPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/classes`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Class</h2>
                    <p className="text-gray-600 mt-1">
                        Fill in the information below to add a new class
                    </p>
                </div>
            </div>

            <ClassForm
                tenantId={tenant.id}
                tenantSlug={slug}
                mode="create"
            />
        </div>
    );
}
