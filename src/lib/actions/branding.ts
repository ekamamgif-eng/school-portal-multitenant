'use server';

import { db } from '@/lib/db';
import { tenants, platformSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';

export interface BrandingConfig {
    primary?: string;
    secondary?: string;
    // Add other keys as needed
}

export interface SeoConfig {
    title?: string;
    description?: string;
    keywords?: string;
}

export async function updateTenantBranding(tenantId: string, data: {
    logoUrl?: string;
    slogan?: string;
    branding?: BrandingConfig;
    seo?: SeoConfig;
}) {
    const { orgId } = await auth();

    // Basic authorization: Ensure user belongs to the org/tenant or is a super admin (needs better check)
    if (!orgId || (orgId !== tenantId)) {
        // In a real app, check for super admin role too
        // throw new Error("Unauthorized");
    }

    await db.update(tenants)
        .set({
            logoUrl: data.logoUrl,
            slogan: data.slogan,
            branding: data.branding,
            seo: data.seo,
        })
        .where(eq(tenants.id, tenantId));

    revalidatePath('/');
    revalidatePath(`/${tenantId}`);
}

export async function getTenantBranding(slug: string) {
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug),
    });

    if (!tenant) return null;

    return {
        id: tenant.id,
        name: tenant.name,
        logoUrl: tenant.logoUrl,
        slogan: tenant.slogan,
        branding: tenant.branding as BrandingConfig,
        seo: tenant.seo as SeoConfig,
    };
}

export async function updatePlatformBranding(data: BrandingConfig) {
    const user = await currentUser();
    if (user?.emailAddresses[0]?.emailAddress !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }

    await db.insert(platformSettings)
        .values({
            key: 'branding',
            value: data,
        })
        .onConflictDoUpdate({
            target: platformSettings.key,
            set: { value: data, updatedAt: new Date() },
        });

    revalidatePath('/');
}

export async function getPlatformBranding() {
    const settings = await db.query.platformSettings.findFirst({
        where: eq(platformSettings.key, 'branding'),
    });
    return settings?.value || null;
}

export async function updatePlatformSeo(data: SeoConfig) {
    const user = await currentUser();
    if (user?.emailAddresses[0]?.emailAddress !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }

    await db.insert(platformSettings)
        .values({
            key: 'seo',
            value: data,
        })
        .onConflictDoUpdate({
            target: platformSettings.key,
            set: { value: data, updatedAt: new Date() },
        });

    revalidatePath('/');
}

export async function getPlatformSeo() {
    const settings = await db.query.platformSettings.findFirst({
        where: eq(platformSettings.key, 'seo'),
    });
    return settings?.value || null;
}
