'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Search,
    Palette,
    Box,
    User,
    Users,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
    {
        title: 'Dashboard',
        href: '/super-admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Tenants',
        href: '/super-admin/tenants',
        icon: Users,
    },
    {
        title: 'Platform SEO',
        href: '/super-admin/seo',
        icon: Search,
    },
    {
        title: 'Branding & Theme',
        href: '/super-admin/branding',
        icon: Palette,
    },
    {
        title: 'Modules',
        href: '/super-admin/modules',
        icon: Box,
    },
    {
        title: 'Profile',
        href: '/super-admin/profile',
        icon: User,
    },
];

export function SuperAdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">
            <div className="p-6">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-blue-400" />
                    <span>Admin Portal</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">Super Admin Management</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="text-xs text-center text-gray-500">
                    v1.0.0
                </div>
            </div>
        </div>
    );
}
