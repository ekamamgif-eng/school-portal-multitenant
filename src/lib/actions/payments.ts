'use server';

import { db } from '@/lib/db';
import { invoices, payments, paymentCategories, students, users } from '@/lib/db/schema';
import { eq, and, sql, desc, getTableColumns } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

// --- Categories ---

export async function getPaymentCategories(tenantId: string) {
    return db.query.paymentCategories.findMany({
        where: eq(paymentCategories.tenantId, tenantId),
        orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });
}

export async function createPaymentCategory(
    data: { name: string; amount?: string; period?: string; description?: string },
    tenantId: string
) {
    try {
        await db.insert(paymentCategories).values({
            tenantId,
            ...data
        });
        revalidatePath(`/[slug]/admin/payments`, 'page');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create category' };
    }
}

// --- Invoices ---

export async function getInvoices(tenantId: string) {
    try {
        const results = await db
            .select({
                ...getTableColumns(invoices),
                studentName: students.name,
                studentId: students.studentId, // NIS
                categoryName: paymentCategories.name,
            })
            .from(invoices)
            .innerJoin(students, eq(invoices.studentId, students.id))
            .leftJoin(paymentCategories, eq(invoices.categoryId, paymentCategories.id))
            .where(eq(invoices.tenantId, tenantId))
            .orderBy(desc(invoices.createdAt));

        return results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createInvoice(
    data: {
        studentId: string;
        categoryId: string;
        amount: string;
        dueDate: string;
        title: string;
        description?: string;
    },
    tenantId: string
) {
    try {
        await db.insert(invoices).values({
            tenantId,
            ...data,
            status: 'unpaid',
            paidAmount: '0',
        });
        revalidatePath(`/[slug]/admin/payments`, 'page');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create invoice' };
    }
}

// Bulk create invoice for a class (future expansion)

// --- Payments ---

export async function recordPayment(
    data: {
        invoiceId: string;
        amount: string;
        method: string;
        reference?: string;
    },
    tenantId: string
) {
    try {
        const { userId } = await auth();

        const currentUser = await db.query.users.findFirst({
            where: eq(users.clerkId, userId || ''),
        });

        // 1. Create Payment Record
        await db.insert(payments).values({
            tenantId,
            invoiceId: data.invoiceId,
            amount: data.amount,
            method: data.method,
            reference: data.reference,
            recordedBy: currentUser?.id,
        });

        // 2. Update Invoice Status
        const invoice = await db.query.invoices.findFirst({
            where: eq(invoices.id, data.invoiceId)
        });

        if (invoice) {
            const currentPaid = parseFloat(invoice.paidAmount);
            const newPayment = parseFloat(data.amount);
            const totalPaid = currentPaid + newPayment;
            const totalAmount = parseFloat(invoice.amount);

            let newStatus = invoice.status;
            if (totalPaid >= totalAmount) {
                newStatus = 'paid';
            } else if (totalPaid > 0) {
                newStatus = 'partial';
            }

            await db.update(invoices)
                .set({
                    paidAmount: totalPaid.toString(),
                    status: newStatus,
                    updatedAt: new Date()
                })
                .where(eq(invoices.id, data.invoiceId));
        }

        revalidatePath(`/[slug]/admin/payments`, 'page');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to record payment' };
    }
}

export async function getPaymentsByInvoice(invoiceId: string) {
    return db.query.payments.findMany({
        where: eq(payments.invoiceId, invoiceId),
        orderBy: desc(payments.paymentDate)
    });
}
