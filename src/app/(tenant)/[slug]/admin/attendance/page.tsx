import { AttendanceTracker } from "@/components/tenant-admin/AttendanceTracker";
import { getClassesByTenant } from "@/lib/actions/classes";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { redirect } from "next/navigation";
import { QrCode, Printer, Scan } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AttendancePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Server-side data fetching
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    // Pass classes to the client component
    const classes = await getClassesByTenant(tenant.id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
                    <p className="text-gray-600 mt-1">
                        Track and manage student attendance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/${slug}/admin/qr-attendance/cards`}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print QR Cards
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/${slug}/admin/qr-attendance`}>
                            <Scan className="h-4 w-4 mr-2" />
                            Open Kiosk Mode
                        </Link>
                    </Button>
                </div>
            </div>

            <AttendanceTracker
                tenantId={tenant.id}
                classes={classes.map(c => ({ id: c.id, name: c.name }))}
            />
        </div>
    );
}
