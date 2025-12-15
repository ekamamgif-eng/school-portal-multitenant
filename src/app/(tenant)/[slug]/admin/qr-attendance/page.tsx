import { AttendanceKiosk } from "@/components/modules/qr-attendance/AttendanceKiosk";
import { getClassesByTenant } from "@/lib/actions/classes";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function QRScanPage({
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${slug}/admin/attendance`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Attendance Kiosk</h2>
                    <p className="text-gray-600 mt-1">
                        Scan QR codes to mark attendance
                    </p>
                </div>
            </div>

            <AttendanceKiosk
                tenantId={tenant.id}
                classes={classes.map(c => ({ id: c.id, name: c.name }))}
            />
        </div>
    );
}
