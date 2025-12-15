import { getTenantBySlug } from "@/lib/actions/tenants";
import { TeacherForm } from "@/components/tenant-admin/TeacherForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateTeacherPage({
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
                    <Link href={`/${slug}/admin/teachers`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Teacher</h2>
                    <p className="text-gray-600 mt-1">
                        Fill in the information below to add a new teacher
                    </p>
                </div>
            </div>

            <TeacherForm
                tenantId={tenant.id}
                tenantSlug={slug}
                mode="create"
            />
        </div>
    );
}
