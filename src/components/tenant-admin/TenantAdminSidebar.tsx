'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardCheck,
    CreditCard,
    FileText,
    Settings,
    Megaphone,
    ChevronLeft,
    Home,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TenantAdminSidebarProps {
    tenantSlug: string;
    tenantName: string;
    tenantLogo?: string | null;
}

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        label: "Students",
        icon: Users,
        href: "/admin/students",
    },
    {
        label: "Teachers",
        icon: GraduationCap,
        href: "/admin/teachers",
    },
    {
        label: "Classes",
        icon: BookOpen,
        href: "/admin/classes",
    },
    {
        label: "Attendance",
        icon: ClipboardCheck,
        href: "/admin/attendance",
    },
    {
        label: "Payments",
        icon: CreditCard,
        href: "/admin/payments",
    },
    {
        label: "Reports",
        icon: FileText,
        href: "/admin/reports",
    },
    {
        label: "Announcements",
        icon: Megaphone,
        href: "/admin/announcements",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
];

export function TenantAdminSidebar({
    tenantSlug,
    tenantName,
    tenantLogo,
}: TenantAdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        const fullPath = `/${tenantSlug}${href}`;
        if (href === "/admin") {
            return pathname === fullPath;
        }
        return pathname.startsWith(fullPath);
    };

    const initials = tenantName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <Link href={`/${tenantSlug}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        {tenantLogo ? (
                            <AvatarImage src={tenantLogo} alt={tenantName} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {tenantName}
                        </h2>
                        <p className="text-xs text-gray-600">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Back to School Button */}
            <div className="px-4 py-3">
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                >
                    <Link href={`/${tenantSlug}`}>
                        <Home className="h-4 w-4 mr-2" />
                        Back to School Page
                    </Link>
                </Button>
            </div>

            <Separator />

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={`/${tenantSlug}${item.href}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                    CursorSchool © 2024
                </p>
            </div>
        </aside>
    );
}
