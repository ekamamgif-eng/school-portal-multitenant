'use server';

import { db } from '@/lib/db';
import { students } from '@/lib/db/schema';
import { eq, and, like, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export interface StudentData {
    id?: string;
    tenantId: string;
    studentId: string;
    name: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female';
    address?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    enrollmentDate?: Date;
    status?: 'active' | 'inactive' | 'graduated';
    photo?: string;
}

export async function getStudentsByTenant(tenantId: string) {
    try {
        const allStudents = await db.query.students.findMany({
            where: eq(students.tenantId, tenantId),
            orderBy: (students, { desc }) => [desc(students.createdAt)],
        });

        return allStudents;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

export async function getStudentById(id: string, tenantId: string) {
    try {
        const student = await db.query.students.findFirst({
            where: and(
                eq(students.id, id),
                eq(students.tenantId, tenantId)
            ),
        });

        return student || null;
    } catch (error) {
        console.error('Error fetching student:', error);
        return null;
    }
}

export async function createStudent(data: StudentData) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [newStudent] = await db.insert(students).values({
            tenantId: data.tenantId,
            studentId: data.studentId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            parentName: data.parentName,
            parentPhone: data.parentPhone,
            parentEmail: data.parentEmail,
            enrollmentDate: data.enrollmentDate || new Date(),
            status: data.status || 'active',
            photo: data.photo,
        }).returning();

        revalidatePath(`/[slug]/admin/students`, 'page');
        return { success: true, student: newStudent };
    } catch (error) {
        console.error('Error creating student:', error);
        return { success: false, error: 'Failed to create student' };
    }
}

export async function updateStudent(id: string, data: Partial<StudentData>) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || !data.tenantId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [updatedStudent] = await db
            .update(students)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(
                eq(students.id, id),
                eq(students.tenantId, data.tenantId)
            ))
            .returning();

        revalidatePath(`/[slug]/admin/students`, 'page');
        revalidatePath(`/[slug]/admin/students/${id}`, 'page');
        return { success: true, student: updatedStudent };
    } catch (error) {
        console.error('Error updating student:', error);
        return { success: false, error: 'Failed to update student' };
    }
}

export async function deleteStudent(id: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db
            .delete(students)
            .where(and(
                eq(students.id, id),
                eq(students.tenantId, tenantId)
            ));

        revalidatePath(`/[slug]/admin/students`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error deleting student:', error);
        return { success: false, error: 'Failed to delete student' };
    }
}

export async function searchStudents(tenantId: string, query: string) {
    try {
        const results = await db.query.students.findMany({
            where: and(
                eq(students.tenantId, tenantId),
                or(
                    like(students.name, `%${query}%`),
                    like(students.studentId, `%${query}%`),
                    like(students.email, `%${query}%`)
                )
            ),
            orderBy: (students, { desc }) => [desc(students.createdAt)],
        });

        return results;
    } catch (error) {
        console.error('Error searching students:', error);
        return [];
    }
}

export async function getStudentStats(tenantId: string) {
    try {
        const allStudents = await db.query.students.findMany({
            where: eq(students.tenantId, tenantId),
        });

        return {
            total: allStudents.length,
            active: allStudents.filter(s => s.status === 'active').length,
            inactive: allStudents.filter(s => s.status === 'inactive').length,
            graduated: allStudents.filter(s => s.status === 'graduated').length,
        };
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return {
            total: 0,
            active: 0,
            inactive: 0,
            graduated: 0,
        };
    }
}
