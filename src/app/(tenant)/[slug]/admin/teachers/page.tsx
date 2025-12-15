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
import { getTeachersByTenant, getTeacherStats } from "@/lib/actions/teachers";
import { redirect } from "next/navigation";
import { DeleteTeacherButton } from "@/components/tenant-admin/DeleteTeacherButton";

export default async function TeachersPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const teachers = await getTeachersByTenant(tenant.id);
    const stats = await getTeacherStats(tenant.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Teachers</h2>
                    <p className="text-gray-600 mt-1">
                        Manage teacher records and assignments
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/${slug}/admin/teachers/create`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Teachers</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Teachers</CardDescription>
                        <CardTitle className="text-3xl text-green-600">
                            {stats.active}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Inactive Teachers</CardDescription>
                        <CardTitle className="text-3xl text-gray-400">
                            {stats.inactive}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Resigned</CardDescription>
                        <CardTitle className="text-3xl text-red-600">
                            {stats.resigned}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Teacher List</CardTitle>
                            <CardDescription>
                                A list of all teachers in your school
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search teachers..."
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
                    {teachers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">No teachers found</p>
                            <Button asChild>
                                <Link href={`/${slug}/admin/teachers/create`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Teacher
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-medium">
                                            {teacher.teacherId}
                                        </TableCell>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell className="text-gray-600">
                                            {teacher.email || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {teacher.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {teacher.subjects.slice(0, 2).map((subject, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                    {teacher.subjects.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{teacher.subjects.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    teacher.status === "active" ? "default" : "secondary"
                                                }
                                            >
                                                {teacher.status}
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
                                                            href={`/${slug}/admin/teachers/${teacher.id}`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/${slug}/admin/teachers/${teacher.id}/edit`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DeleteTeacherButton
                                                        teacherId={teacher.id}
                                                        teacherName={teacher.name}
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
