import { getTenantBySlug } from "@/lib/actions/tenants";
import { StudentForm } from "@/components/tenant-admin/StudentForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateStudentPage({
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
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/students`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Student</h2>
                    <p className="text-gray-600 mt-1">
                        Fill in the information below to add a new student
                    </p>
                </div>
            </div>

            {/* Form */}
            <StudentForm
                tenantId={tenant.id}
                tenantSlug={slug}
                mode="create"
            />
        </div>
    );
}
