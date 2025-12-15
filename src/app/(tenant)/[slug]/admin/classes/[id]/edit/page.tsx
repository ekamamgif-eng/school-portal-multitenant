import { getTenantBySlug } from "@/lib/actions/tenants";
import { getClassById } from "@/lib/actions/classes";
import { ClassForm } from "@/components/tenant-admin/ClassForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditClassPage({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const classData = await getClassById(id, tenant.id);

    if (!classData) {
        redirect(`/${slug}/admin/classes`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/classes/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Class</h2>
                    <p className="text-gray-600 mt-1">
                        Update information for {classData.name}
                    </p>
                </div>
            </div>

            <ClassForm
                tenantId={tenant.id}
                tenantSlug={slug}
                initialData={{
                    id: classData.id,
                    name: classData.name,
                    gradeLevel: classData.gradeLevel || undefined,
                    academicYear: classData.academicYear || undefined,
                    homeroomTeacherId: classData.homeroomTeacherId || undefined,
                    maxStudents: classData.maxStudents || '40',
                    room: classData.room || undefined,
                    schedule: classData.schedule || undefined,
                    status: classData.status as 'active' | 'inactive' | 'archived',
                }}
                mode="edit"
            />
        </div>
    );
}
