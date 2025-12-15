import { getTenantBySlug } from "@/lib/actions/tenants";
import { getStudentById } from "@/lib/actions/students";
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
    Users,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function StudentDetailPage({
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'graduated':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/${slug}/admin/students`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
                        <p className="text-gray-600 mt-1">Student ID: {student.studentId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(student.status)}>
                        {student.status}
                    </Badge>
                    <Button asChild>
                        <Link href={`/${slug}/admin/students/${id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
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
                                    <p className="text-base text-gray-900 mt-1">{student.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Student ID</p>
                                    <p className="text-base text-gray-900 mt-1">{student.studentId}</p>
                                </div>

                                {student.email && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{student.email}</p>
                                    </div>
                                )}

                                {student.phone && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Phone
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{student.phone}</p>
                                    </div>
                                )}

                                {student.dateOfBirth && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Date of Birth
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">
                                            {format(new Date(student.dateOfBirth), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                )}

                                {student.gender && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Gender</p>
                                        <p className="text-base text-gray-900 mt-1 capitalize">{student.gender}</p>
                                    </div>
                                )}

                                {student.enrollmentDate && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            Enrollment Date
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">
                                            {format(new Date(student.enrollmentDate), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <Badge className={`${getStatusColor(student.status)} mt-1`}>
                                        {student.status}
                                    </Badge>
                                </div>
                            </div>

                            {student.address && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{student.address}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Parent/Guardian Information */}
                    {(student.parentName || student.parentEmail || student.parentPhone) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Parent/Guardian Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {student.parentName && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Name</p>
                                            <p className="text-base text-gray-900 mt-1">{student.parentName}</p>
                                        </div>
                                    )}

                                    {student.parentPhone && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                Phone
                                            </p>
                                            <p className="text-base text-gray-900 mt-1">{student.parentPhone}</p>
                                        </div>
                                    )}

                                    {student.parentEmail && (
                                        <div className="md:col-span-2">
                                            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </p>
                                            <p className="text-base text-gray-900 mt-1">{student.parentEmail}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Attendance Rate</span>
                                <span className="text-sm font-medium">95%</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Classes Enrolled</span>
                                <span className="text-sm font-medium">6</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Average Grade</span>
                                <span className="text-sm font-medium">85.5</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Status</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Paid
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common actions for this student</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/attendance?student=${id}`}>
                                    View Attendance
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/payments?student=${id}`}>
                                    View Payments
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/${slug}/admin/reports?student=${id}`}>
                                    View Report Card
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
