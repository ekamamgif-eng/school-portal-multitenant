
import { getTenantById, getTenantAdmins } from "@/lib/actions/super-admin";
import { InviteAdminDialog } from "@/components/super-admin/InviteAdminDialog";
import { getPlatformBranding } from "@/lib/actions/branding";
import { TenantDetailsEditor } from "@/components/super-admin/TenantDetailsEditor";
import { RemoveAdminButton } from "@/components/super-admin/RemoveAdminButton";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TenantDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TenantDetailsPage(props: TenantDetailsPageProps) {
    const params = await props.params;
    const tenant = await getTenantById(params.id);
    const platformBranding = await getPlatformBranding() as any;

    if (!tenant) {
        notFound();
    }

    const admins = await getTenantAdmins(tenant.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/super-admin/tenants" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{tenant.name}</h2>
                    <p className="text-muted-foreground">Tenant Configuration & Administrators</p>
                </div>
                <InviteAdminDialog tenantId={tenant.id} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Tenant Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TenantDetailsEditor
                            tenantId={tenant.id}
                            initialSlug={tenant.slug}
                            initialDomain={tenant.domain}
                            initialLogoUrl={tenant.logoUrl}
                            platformLogoUrl={platformBranding?.logoUrl}
                        />
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Created At</span>
                            <span className="text-muted-foreground">{new Date(tenant.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Administrators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{admin.email}</span>
                                                <span className="text-xs text-muted-foreground">{admin.displayName || "No Name"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{admin.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RemoveAdminButton userId={admin.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {admins.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No admins assigned yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
