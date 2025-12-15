import {
    getAttendanceTrends,
    getDashboardStats,
    getFinancialOverview
} from "@/lib/actions/reports";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceChart } from "@/components/tenant-admin/reports/AttendanceChart";
import { FinancialChart } from "@/components/tenant-admin/reports/FinancialChart";
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign } from "lucide-react";

export default async function ReportsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    // Parallel data fetching
    const [stats, attendanceData, financialData] = await Promise.all([
        getDashboardStats(tenant.id),
        getAttendanceTrends(tenant.id),
        getFinancialOverview(tenant.id)
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
                <p className="text-gray-600 mt-1">
                    Overview of your school's performance
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.students}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.teachers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalRecorded} records today
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.classes}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Attendance Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                        <CardDescription>
                            Daily attendance rate over the last 7 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AttendanceChart data={attendanceData} />
                    </CardContent>
                </Card>

                {/* Financial Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Monthly Tuition & Fee collection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FinancialChart data={financialData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
