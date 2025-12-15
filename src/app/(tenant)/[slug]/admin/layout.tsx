import { redirect } from "next/navigation";
import { currentUser, auth } from "@clerk/nextjs/server";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { TenantAdminSidebar } from "@/components/tenant-admin/TenantAdminSidebar";
import { TenantBrandingProvider } from "@/components/branding/TenantBrandingProvider";

export default async function TenantAdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const user = await currentUser();
    const { orgId, orgRole } = await auth();

    // Check if user is authenticated
    if (!user) {
        redirect(`/${slug}?redirect=admin`);
    }

    // Fetch tenant data
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    // Check if user is tenant admin
    const isTenantAdmin = !!(
        orgId === tenant.id &&
        (orgRole === "org:admin" || orgRole === "org:creator")
    );

    if (!isTenantAdmin) {
        // Check if user has tenant_admin role in database
        // For now, redirect to tenant landing page
        redirect(`/${slug}`);
    }

    // Get branding
    const branding = tenant.branding as any || {};

    return (
        <TenantBrandingProvider branding={branding}>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                {/* Sidebar */}
                <TenantAdminSidebar
                    tenantSlug={slug}
                    tenantName={tenant.name}
                    tenantLogo={tenant.logoUrl}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {tenant.name} - Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Manage your school efficiently
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {orgRole === "org:creator" ? "Owner" : "Admin"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </TenantBrandingProvider>
    );
}
