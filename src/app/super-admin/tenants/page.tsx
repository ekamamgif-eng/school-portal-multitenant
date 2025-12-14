
import { getAllTenants } from "@/lib/actions/super-admin";
import { Button } from "@/components/ui/button";
import { Plus, Building2, User } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function TenantsPage() {
    const tenants = await getAllTenants();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
                    <p className="text-muted-foreground">
                        Manage your organizations and their administrators.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/super-admin/tenants/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Tenant
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {tenants.map((tenant) => (
                    <Card key={tenant.id} className="hover:border-blue-500 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {tenant.name}
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenant.slug}</div>
                            <p className="text-xs text-muted-foreground mb-4">
                                {tenant.domain || "No domain connected"}
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/super-admin/tenants/${tenant.id}`}>
                                    <User className="mr-2 h-4 w-4" />
                                    Manage Admins
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {tenants.length === 0 && (
                    <div className="col-span-3 text-center py-10 text-muted-foreground">
                        No tenants found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
