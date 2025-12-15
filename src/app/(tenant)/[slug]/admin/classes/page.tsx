import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Eye, Edit, Download, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { getClassesByTenant, getClassStats } from "@/lib/actions/classes";
import { redirect } from "next/navigation";
import { DeleteClassButton } from "@/components/tenant-admin/DeleteClassButton";

export default async function ClassesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const classes = await getClassesByTenant(tenant.id);
    const stats = await getClassStats(tenant.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Classes</h2>
                    <p className="text-gray-600 mt-1">
                        Manage classes and student assignments
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/${slug}/admin/classes/create`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Class
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Classes</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Classes</CardDescription>
                        <CardTitle className="text-3xl text-green-600">
                            {stats.active}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Inactive Classes</CardDescription>
                        <CardTitle className="text-3xl text-gray-400">
                            {stats.inactive}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Archived</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">
                            {stats.archived}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Class List</CardTitle>
                            <CardDescription>
                                A list of all classes in your school
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search classes..."
                                    className="pl-10 w-[300px]"
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {classes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">No classes found</p>
                            <Button asChild>
                                <Link href={`/${slug}/admin/classes/create`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Class
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class Name</TableHead>
                                    <TableHead>Grade Level</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Teachers</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classes.map((classItem) => (
                                    <TableRow key={classItem.id}>
                                        <TableCell className="font-medium">
                                            {classItem.name}
                                        </TableCell>
                                        <TableCell>{classItem.gradeLevel || '-'}</TableCell>
                                        <TableCell className="text-gray-600">
                                            {classItem.academicYear || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {classItem.room || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">
                                                    {classItem.studentCount || 0}/{classItem.maxStudents || 40}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <GraduationCap className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{classItem.teacherCount || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    classItem.status === "active" ? "default" : "secondary"
                                                }
                                            >
                                                {classItem.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/${slug}/admin/classes/${classItem.id}`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/${slug}/admin/classes/${classItem.id}/edit`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DeleteClassButton
                                                        classId={classItem.id}
                                                        className={classItem.name}
                                                        tenantId={tenant.id}
                                                        tenantSlug={slug}
                                                    />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
