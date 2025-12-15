'use server';

import { db } from '@/lib/db';
import { tenants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface TenantData {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    logoUrl: string | null;
    slogan: string | null;
    branding: {
        primary?: string;
        secondary?: string;
        accent?: string;
        features?: string[];
    } | null;
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    } | null;
    createdAt: Date;
}

export async function getAllTenants(): Promise<TenantData[]> {
    try {
        const allTenants = await db.query.tenants.findMany({
            orderBy: (tenants, { asc }) => [asc(tenants.name)],
        });

        return allTenants.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            logoUrl: tenant.logoUrl,
            slogan: tenant.slogan,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            branding: tenant.branding as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            seo: tenant.seo as any,
            createdAt: tenant.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching tenants:', error);
        return [];
    }
}

export async function getTenantBySlug(slug: string): Promise<TenantData | null> {
    try {
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, slug),
        });

        if (!tenant) return null;

        return {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            logoUrl: tenant.logoUrl,
            slogan: tenant.slogan,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            branding: tenant.branding as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            seo: tenant.seo as any,
            createdAt: tenant.createdAt,
        };
    } catch (error) {
        console.error('Error fetching tenant:', error);
        return null;
    }
}

export async function getTenantById(id: string): Promise<TenantData | null> {
    try {
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.id, id),
        });

        if (!tenant) return null;

        return {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            logoUrl: tenant.logoUrl,
            slogan: tenant.slogan,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            branding: tenant.branding as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            seo: tenant.seo as any,
            createdAt: tenant.createdAt,
        };
    } catch (error) {
        console.error('Error fetching tenant:', error);
        return null;
    }
}
