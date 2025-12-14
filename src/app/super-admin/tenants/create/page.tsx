
import { CreateTenantForm } from "@/components/super-admin/CreateTenantForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateTenantPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/super-admin/tenants" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Tenant</h2>
                    <p className="text-muted-foreground">Add a new organization to the platform.</p>
                </div>
            </div>

            <div className="mt-8">
                <CreateTenantForm />
            </div>
        </div>
    );
}
