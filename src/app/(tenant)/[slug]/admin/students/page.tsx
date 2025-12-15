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
import { Plus, Search, MoreVertical, Eye, Edit, Download } from "lucide-react";
import Link from "next/link";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { getStudentsByTenant, getStudentStats } from "@/lib/actions/students";
import { redirect } from "next/navigation";
import { DeleteStudentButton } from "@/components/tenant-admin/DeleteStudentButton";

export default async function StudentsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    // Fetch real data from database
    const students = await getStudentsByTenant(tenant.id);
    const stats = await getStudentStats(tenant.id);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Students</h2>
                    <p className="text-gray-600 mt-1">
                        Manage student records and information
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/${slug}/admin/students/create`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Students</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Students</CardDescription>
                        <CardTitle className="text-3xl text-green-600">
                            {stats.active}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Inactive Students</CardDescription>
                        <CardTitle className="text-3xl text-gray-400">
                            {stats.inactive}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Graduated</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">
                            {stats.graduated}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Student List</CardTitle>
                            <CardDescription>
                                A list of all students in your school
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search students..."
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
                    {students.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">No students found</p>
                            <Button asChild>
                                <Link href={`/${slug}/admin/students/create`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Student
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.studentId}
                                        </TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell className="text-gray-600">
                                            {student.email || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {student.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    student.status === "active" ? "default" : "secondary"
                                                }
                                            >
                                                {student.status}
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
                                                            href={`/${slug}/admin/students/${student.id}`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/${slug}/admin/students/${student.id}/edit`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DeleteStudentButton
                                                        studentId={student.id}
                                                        studentName={student.name}
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
