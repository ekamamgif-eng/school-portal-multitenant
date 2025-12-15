import { getTenantBySlug } from "@/lib/actions/tenants";
import { getClassById } from "@/lib/actions/classes";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Edit,
    Users,
    GraduationCap,
    BookOpen,
    MapPin,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import { ClassStudentsList } from "@/components/tenant-admin/ClassStudentsList";
import { ClassTeachersList } from "@/components/tenant-admin/ClassTeachersList";

export default async function ClassDetailPage({
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'archived':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const studentCount = classData.students?.length || 0;
    const maxStudents = parseInt(classData.maxStudents || '40');
    const capacityPercentage = (studentCount / maxStudents) * 100;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/${slug}/admin/classes`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{classData.name}</h2>
                        <p className="text-gray-600 mt-1">
                            {classData.gradeLevel && `Grade ${classData.gradeLevel} • `}
                            {classData.academicYear || 'No academic year set'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(classData.status)}>
                        {classData.status}
                    </Badge>
                    <Button asChild>
                        <Link href={`/${slug}/admin/classes/${id}/edit`}>
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
                                <BookOpen className="h-5 w-5" />
                                Class Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Class Name</p>
                                    <p className="text-base text-gray-900 mt-1">{classData.name}</p>
                                </div>

                                {classData.gradeLevel && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Grade Level</p>
                                        <p className="text-base text-gray-900 mt-1">{classData.gradeLevel}</p>
                                    </div>
                                )}

                                {classData.academicYear && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Academic Year
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{classData.academicYear}</p>
                                    </div>
                                )}

                                {classData.room && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Room
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{classData.room}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-600">Capacity</p>
                                    <p className="text-base text-gray-900 mt-1">
                                        {studentCount} / {classData.maxStudents || 40} students
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className={`h-2 rounded-full ${capacityPercentage >= 90
                                                ? 'bg-red-600'
                                                : capacityPercentage >= 75
                                                    ? 'bg-yellow-600'
                                                    : 'bg-green-600'
                                                }`}
                                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {classData.homeroomTeacher && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            Homeroom Teacher
                                        </p>
                                        <p className="text-base text-gray-900 mt-1">{classData.homeroomTeacher.name}</p>
                                    </div>
                                )}
                            </div>

                            {classData.schedule && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Schedule</p>
                                        <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap">{classData.schedule}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="students" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="students">
                                <Users className="h-4 w-4 mr-2" />
                                Students ({studentCount})
                            </TabsTrigger>
                            <TabsTrigger value="teachers">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Teachers ({classData.teachers?.length || 0})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="students" className="space-y-4">
                            <ClassStudentsList
                                classId={id}
                                tenantId={tenant.id}
                                students={classData.students || []}
                            />
                        </TabsContent>
                        <TabsContent value="teachers" className="space-y-4">
                            <ClassTeachersList
                                classId={id}
                                tenantId={tenant.id}
                                teachers={classData.teachers || []}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Students</span>
                                <span className="text-sm font-medium">{studentCount}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Teachers</span>
                                <span className="text-sm font-medium">{classData.teachers?.length || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Capacity</span>
                                <span className="text-sm font-medium">{capacityPercentage.toFixed(0)}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
