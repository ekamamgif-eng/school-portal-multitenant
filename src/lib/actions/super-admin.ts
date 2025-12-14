'use server';

import { db } from "@/lib/db";
import { tenants, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sendTenantAdminInvitation, sendTenantAdminPromotion } from "@/lib/mail";

// --- Middleware / Security ---
async function ensureSuperAdmin() {
    const user = await currentUser();
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    if (!user || user.emailAddresses[0]?.emailAddress !== superAdminEmail) {
        throw new Error("Unauthorized: Super Admin access required");
    }
    return user;
}

// --- Tenant Actions ---

export async function getAllTenants() {
    await ensureSuperAdmin();
    // Fetch tenants and join with users to count admins or list them if needed
    // For simplicity, just get tenants first
    return await db.select().from(tenants);
}

export async function createTenant(data: { name: string; slug: string; id: string }) {
    await ensureSuperAdmin();
    // Basic validation
    if (!data.slug || !data.name || !data.id) throw new Error("Missing fields");

    await db.insert(tenants).values({
        id: data.id,
        name: data.name,
        slug: data.slug,
    });
    revalidatePath('/super-admin/tenants');
}

export async function getTenantById(tenantId: string) {
    await ensureSuperAdmin();
    const result = await db.select().from(tenants).where(eq(tenants.id, tenantId));
    return result[0] || null;
}

// --- User / Admin Actions ---

export async function getPotentialAdmins() {
    await ensureSuperAdmin();
    // Get users who are NOT already tenant admins or maybe all users?
    // Let's return all users for now, front-end can filter.
    return await db.select().from(users);
}

export async function getTenantAdmins(tenantId: string) {
    await ensureSuperAdmin();
    return await db.select().from(users).where(
        eq(users.tenantId, tenantId)
    );
}

export async function assignTenantAdmin(userId: string, tenantId: string) {
    await ensureSuperAdmin();

    // Update user role and tenant
    await db.update(users)
        .set({
            role: 'tenant_admin',
            tenantId: tenantId
        })
        .where(eq(users.id, userId));

    revalidatePath(`/super-admin/tenants`);
}



export async function inviteTenantAdmin(email: string, tenantId: string) {
    await ensureSuperAdmin();

    // Fetch tenant details for the email
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId)
    });

    if (!tenant) throw new Error("Tenant not found");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // Fallback for dev

    // 1. Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existingUser) {
        // If exists, promote them directly
        await assignTenantAdmin(existingUser.id, tenantId);

        // Send promotion email
        await sendTenantAdminPromotion(email, tenant.name, `${appUrl}/admin`);

        revalidatePath(`/super-admin/tenants`);
        return { status: 'promoted', message: `User ${email} already existed and was promoted to Admin. Email notification sent.` };
    } else {
        // 2. If not, create a placeholder "Invited" user
        await db.insert(users).values({
            email,
            tenantId,
            role: 'tenant_admin',
            clerkId: `invited_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Placeholder
            displayName: 'Invited Admin'
        });

        // Send invitation email
        await sendTenantAdminInvitation(email, tenant.name, `${appUrl}/sign-up?email=${encodeURIComponent(email)}`);

        revalidatePath(`/super-admin/tenants`);
        return { status: 'invited', message: `Invitation email sent to ${email}.` };
    }
}

export async function removeTenantAdmin(userId: string) {
    await ensureSuperAdmin();

    await db.update(users)
        .set({
            role: 'user', // Demote to standard user
            tenantId: null // Remove from tenant
        })
        .where(eq(users.id, userId));

    revalidatePath(`/super-admin/tenants`);
}

export async function updateTenantInfo(tenantId: string, data: { slug?: string; domain?: string; logoUrl?: string }) {
    await ensureSuperAdmin();

    await db.update(tenants)
        .set({
            slug: data.slug,
            domain: data.domain,
            logoUrl: data.logoUrl
        })
        .where(eq(tenants.id, tenantId));

    revalidatePath(`/super-admin/tenants`);
    revalidatePath(`/super-admin/tenants/${tenantId}`);
}
