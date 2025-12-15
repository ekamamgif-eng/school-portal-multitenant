import { getTenantBySlug } from "@/lib/actions/tenants";
import { getTeacherById } from "@/lib/actions/teachers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    Calendar,
    MapPin,
    User,
    GraduationCap,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function TeacherDetailPage({
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'resigned':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/${slug}/admin/teachers`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{teacher.name}</h2>
                        <p className="text-gray-600 mt-1">Teacher ID: {teacher.teacherId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(teacher.status)}>
                        {teacher.status}
                    </Badge>
                    <Button asChild>
                        <Link href={`/${slug}/admin/teachers/${id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                                    <p className="text-base text-gray-900 mt-1">{teacher.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Teacher ID</p>
                                    <p className="text-base text-gray-900 mt-1">{teacher.teacherId}</p>
                                </div>

                                {teacher.email && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{teacher.email}</p>
                                    </div>
                                )}

                                {teacher.phone && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Phone
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{teacher.phone}</p>
                                    </div>
                                )}

                                {teacher.dateOfBirth && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Date of Birth
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">
                                            {format(new Date(teacher.dateOfBirth), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                )}

                                {teacher.gender && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Gender</p>
                                        <p className="text-base text-gray-900 mt-1 capitalize">{teacher.gender}</p>
                                    </div>
                                )}

                                {teacher.hireDate && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            Hire Date
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">
                                            {format(new Date(teacher.hireDate), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <Badge className={`${getStatusColor(teacher.status)} mt-1`}>
                                        {teacher.status}
                                    </Badge>
                                </div>
                            </div>

                            {teacher.address && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{teacher.address}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {teacher.qualification && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Qualification</p>
                                    <p className="text-base text-gray-900 mt-1">{teacher.qualification}</p>
                                </div>
                            )}

                            {teacher.subjects && teacher.subjects.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Subjects Taught</p>
                                        <div className="flex flex-wrap gap-2">
                                            {teacher.subjects.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary">
                                                    {subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Classes Assigned</span>
                                <span className="text-sm font-medium">5</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Students</span>
                                <span className="text-sm font-medium">150</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Subjects</span>
                                <span className="text-sm font-medium">
                                    {teacher.subjects?.length || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common actions for this teacher</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/classes?teacher=${id}`}>
                                    View Classes
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/attendance?teacher=${id}`}>
                                    View Attendance Records
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/reports?teacher=${id}`}>
                                    View Reports
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
