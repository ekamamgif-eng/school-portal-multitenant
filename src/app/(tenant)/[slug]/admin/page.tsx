import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function TenantAdminDashboard({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // TODO: Fetch real data from database
    const stats = {
        totalStudents: 450,
        totalTeachers: 32,
        totalClasses: 15,
        attendanceToday: 95,
        pendingPayments: 12,
        upcomingExams: 3,
    };

    const recentActivities = [
        {
            id: 1,
            type: "student",
            message: "New student enrolled: John Doe",
            time: "2 hours ago",
            icon: Users,
            color: "text-blue-600",
        },
        {
            id: 2,
            type: "payment",
            message: "Payment received from Jane Smith - $150",
            time: "3 hours ago",
            icon: DollarSign,
            color: "text-green-600",
        },
        {
            id: 3,
            type: "attendance",
            message: "Attendance marked for Class 10-A",
            time: "5 hours ago",
            icon: CheckCircle2,
            color: "text-purple-600",
        },
        {
            id: 4,
            type: "announcement",
            message: "New announcement posted: Holiday Notice",
            time: "1 day ago",
            icon: AlertCircle,
            color: "text-orange-600",
        },
    ];

    const quickActions = [
        {
            label: "Add Student",
            href: `/${slug}/admin/students/create`,
            icon: Users,
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            label: "Mark Attendance",
            href: `/${slug}/admin/attendance/mark`,
            icon: CheckCircle2,
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            label: "Create Invoice",
            href: `/${slug}/admin/payments/invoices`,
            icon: DollarSign,
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            label: "Post Announcement",
            href: `/${slug}/admin/announcements/create`,
            icon: AlertCircle,
            color: "bg-orange-500 hover:bg-orange-600",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-1">
                    Welcome back! Here's what's happening with your school today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Students */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Students
                        </CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.totalStudents}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            <span className="text-green-600 font-medium">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Total Teachers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Teachers
                        </CardTitle>
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.totalTeachers}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            <span className="text-green-600 font-medium">+2</span> new this month
                        </p>
                    </CardContent>
                </Card>

                {/* Total Classes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Classes
                        </CardTitle>
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.totalClasses}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Across all grade levels
                        </p>
                    </CardContent>
                </Card>

                {/* Attendance Today */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Attendance Today
                        </CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.attendanceToday}%
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            {Math.round((stats.totalStudents * stats.attendanceToday) / 100)} of {stats.totalStudents} students present
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Payments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Payments
                        </CardTitle>
                        <DollarSign className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.pendingPayments}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Invoices awaiting payment
                        </p>
                    </CardContent>
                </Card>

                {/* Upcoming Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Upcoming Exams
                        </CardTitle>
                        <Calendar className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.upcomingExams}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Scheduled this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Frequently used actions for faster workflow
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={action.label}
                                    asChild
                                    className={`h-auto py-6 flex-col gap-2 ${action.color} text-white`}
                                >
                                    <Link href={action.href}>
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm font-medium">{action.label}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activities & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest updates from your school</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Button variant="outline" className="w-full mt-4" asChild>
                            <Link href={`/${slug}/admin/reports`}>
                                View All Activities
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Alerts & Reminders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts & Reminders</CardTitle>
                        <CardDescription>Important items requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-900">
                                        {stats.pendingPayments} pending payments
                                    </p>
                                    <p className="text-xs text-orange-700 mt-1">
                                        Follow up with parents for overdue fees
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/${slug}/admin/payments`}>View</Link>
                                </Button>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Midterm exams starting next week
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Ensure all schedules are published
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/${slug}/admin/reports`}>View</Link>
                                </Button>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-900">
                                        All systems operational
                                    </p>
                                    <p className="text-xs text-green-700 mt-1">
                                        No critical issues detected
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Good
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
