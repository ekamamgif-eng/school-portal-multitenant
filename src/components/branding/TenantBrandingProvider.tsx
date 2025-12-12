'use client';

import { useEffect } from 'react';

interface TenantBrandingProviderProps {
    branding: {
        primary?: string;
        secondary?: string;
    } | null;
    children: React.ReactNode;
}

export function TenantBrandingProvider({ branding, children }: TenantBrandingProviderProps) {
    useEffect(() => {
        const root = document.documentElement;

        if (!branding) {
            // Reset to defaults if custom branding is missing
            // Removing the inline style allows the values from global.css to take over
            root.style.removeProperty('--primary');
            root.style.removeProperty('--sidebar-primary');
            root.style.removeProperty('--primary-foreground');
            root.style.removeProperty('--sidebar-primary-foreground');
            root.style.removeProperty('--secondary');
            root.style.removeProperty('--secondary-foreground');
            return;
        }

        // Apply primary color
        if (branding.primary) {
            root.style.setProperty('--primary', branding.primary);
            root.style.setProperty('--sidebar-primary', branding.primary);
            // Naive foreground calculation: default to white for custom colors
            // In a robust system, use a color library to determine contrast
            root.style.setProperty('--primary-foreground', '#ffffff');
            root.style.setProperty('--sidebar-primary-foreground', '#ffffff');
        } else {
            root.style.removeProperty('--primary'); // revert to default if only secondary sets
        }

        // Apply secondary color
        if (branding.secondary) {
            root.style.setProperty('--secondary', branding.secondary);
            root.style.setProperty('--secondary-foreground', '#ffffff');
        } else {
            root.style.removeProperty('--secondary');
        }

        return () => {
            // Cleanup on unmount (navigation away)
            root.style.removeProperty('--primary');
            root.style.removeProperty('--sidebar-primary');
            root.style.removeProperty('--primary-foreground');
            root.style.removeProperty('--sidebar-primary-foreground');
            root.style.removeProperty('--secondary');
            root.style.removeProperty('--secondary-foreground');
        };
    }, [branding]);

    return <>{children}</>;
}
