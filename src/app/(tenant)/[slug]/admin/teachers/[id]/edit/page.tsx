import { getTenantBySlug } from "@/lib/actions/tenants";
import { getTeacherById } from "@/lib/actions/teachers";
import { TeacherForm } from "@/components/tenant-admin/TeacherForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditTeacherPage({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const teacher = await getTeacherById(id, tenant.id);

    if (!teacher) {
        redirect(`/${slug}/admin/teachers`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/teachers/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Teacher</h2>
                    <p className="text-gray-600 mt-1">
                        Update information for {teacher.name}
                    </p>
                </div>
            </div>

            <TeacherForm
                tenantId={tenant.id}
                tenantSlug={slug}
                initialData={{
                    id: teacher.id,
                    teacherId: teacher.teacherId,
                    name: teacher.name,
                    email: teacher.email || undefined,
                    phone: teacher.phone || undefined,
                    dateOfBirth: teacher.dateOfBirth || undefined,
                    gender: teacher.gender as 'male' | 'female' | undefined,
                    address: teacher.address || undefined,
                    subjects: teacher.subjects || undefined,
                    qualification: teacher.qualification || undefined,
                    hireDate: teacher.hireDate || undefined,
                    status: teacher.status as 'active' | 'inactive' | 'resigned',
                }}
                mode="edit"
            />
        </div>
    );
}
