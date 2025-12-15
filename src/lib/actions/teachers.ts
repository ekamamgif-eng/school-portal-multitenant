'use server';

import { db } from '@/lib/db';
import { teachers } from '@/lib/db/schema';
import { eq, and, like, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export interface TeacherData {
    id?: string;
    tenantId: string;
    teacherId: string;
    name: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female';
    address?: string;
    subjects?: string[];
    qualification?: string;
    hireDate?: Date;
    status?: 'active' | 'inactive' | 'resigned';
    photo?: string;
}

export async function getTeachersByTenant(tenantId: string) {
    try {
        const allTeachers = await db.query.teachers.findMany({
            where: eq(teachers.tenantId, tenantId),
            orderBy: (teachers, { desc }) => [desc(teachers.createdAt)],
        });

        return allTeachers;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return [];
    }
}

export async function getTeacherById(id: string, tenantId: string) {
    try {
        const teacher = await db.query.teachers.findFirst({
            where: and(
                eq(teachers.id, id),
                eq(teachers.tenantId, tenantId)
            ),
        });

        return teacher || null;
    } catch (error) {
        console.error('Error fetching teacher:', error);
        return null;
    }
}

export async function createTeacher(data: TeacherData) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [newTeacher] = await db.insert(teachers).values({
            tenantId: data.tenantId,
            teacherId: data.teacherId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            subjects: data.subjects,
            qualification: data.qualification,
            hireDate: data.hireDate || new Date(),
            status: data.status || 'active',
            photo: data.photo,
        }).returning();

        revalidatePath(`/[slug]/admin/teachers`, 'page');
        return { success: true, teacher: newTeacher };
    } catch (error) {
        console.error('Error creating teacher:', error);
        return { success: false, error: 'Failed to create teacher' };
    }
}

export async function updateTeacher(id: string, data: Partial<TeacherData>) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || !data.tenantId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [updatedTeacher] = await db
            .update(teachers)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(
                eq(teachers.id, id),
                eq(teachers.tenantId, data.tenantId)
            ))
            .returning();

        revalidatePath(`/[slug]/admin/teachers`, 'page');
        revalidatePath(`/[slug]/admin/teachers/${id}`, 'page');
        return { success: true, teacher: updatedTeacher };
    } catch (error) {
        console.error('Error updating teacher:', error);
        return { success: false, error: 'Failed to update teacher' };
    }
}

export async function deleteTeacher(id: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        // Verify tenant access
        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db
            .delete(teachers)
            .where(and(
                eq(teachers.id, id),
                eq(teachers.tenantId, tenantId)
            ));

        revalidatePath(`/[slug]/admin/teachers`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return { success: false, error: 'Failed to delete teacher' };
    }
}

export async function searchTeachers(tenantId: string, query: string) {
    try {
        const results = await db.query.teachers.findMany({
            where: and(
                eq(teachers.tenantId, tenantId),
                or(
                    like(teachers.name, `%${query}%`),
                    like(teachers.teacherId, `%${query}%`),
                    like(teachers.email, `%${query}%`)
                )
            ),
            orderBy: (teachers, { desc }) => [desc(teachers.createdAt)],
        });

        return results;
    } catch (error) {
        console.error('Error searching teachers:', error);
        return [];
    }
}

export async function getTeacherStats(tenantId: string) {
    try {
        const allTeachers = await db.query.teachers.findMany({
            where: eq(teachers.tenantId, tenantId),
        });

        return {
            total: allTeachers.length,
            active: allTeachers.filter(t => t.status === 'active').length,
            inactive: allTeachers.filter(t => t.status === 'inactive').length,
            resigned: allTeachers.filter(t => t.status === 'resigned').length,
        };
    } catch (error) {
        console.error('Error fetching teacher stats:', error);
        return {
            total: 0,
            active: 0,
            inactive: 0,
            resigned: 0,
        };
    }
}
