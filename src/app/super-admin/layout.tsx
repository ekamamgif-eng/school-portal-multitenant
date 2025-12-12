import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SuperAdminSidebar } from "@/components/super-admin/SuperAdminSidebar";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    // Strict Security Check
    if (!user || user.emailAddresses[0].emailAddress !== superAdminEmail) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <SuperAdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
