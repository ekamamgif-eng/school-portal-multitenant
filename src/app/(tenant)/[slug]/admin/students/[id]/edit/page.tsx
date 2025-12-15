import { getTenantBySlug } from "@/lib/actions/tenants";
import { getStudentById } from "@/lib/actions/students";
import { StudentForm } from "@/components/tenant-admin/StudentForm";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditStudentPage({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const student = await getStudentById(id, tenant.id);

    if (!student) {
        redirect(`/${slug}/admin/students`);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/students/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Student</h2>
                    <p className="text-gray-600 mt-1">
                        Update information for {student.name}
                    </p>
                </div>
            </div>

            {/* Form */}
            <StudentForm
                tenantId={tenant.id}
                tenantSlug={slug}
                initialData={{
                    id: student.id,
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email || undefined,
                    phone: student.phone || undefined,
                    dateOfBirth: student.dateOfBirth || undefined,
                    gender: student.gender as 'male' | 'female' | undefined,
                    address: student.address || undefined,
                    parentName: student.parentName || undefined,
                    parentPhone: student.parentPhone || undefined,
                    parentEmail: student.parentEmail || undefined,
                    enrollmentDate: student.enrollmentDate || undefined,
                    status: student.status as 'active' | 'inactive' | 'graduated',
                }}
                mode="edit"
            />
        </div>
    );
}
