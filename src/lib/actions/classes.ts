'use server';

import { db } from '@/lib/db';
import { classes, classStudents, classTeachers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export interface ClassData {
    id?: string;
    tenantId: string;
    name: string;
    gradeLevel?: string;
    academicYear?: string;
    homeroomTeacherId?: string;
    maxStudents?: string;
    room?: string;
    schedule?: string;
    status?: 'active' | 'inactive' | 'archived';
}

export async function getClassesByTenant(tenantId: string) {
    try {
        const allClasses = await db.query.classes.findMany({
            where: eq(classes.tenantId, tenantId),
            orderBy: (classes, { desc }) => [desc(classes.createdAt)],
            with: {
                // We'll add relations later
            },
        });

        // Get student and teacher counts for each class
        const classesWithCounts = await Promise.all(
            allClasses.map(async (cls) => {
                const students = await db.query.classStudents.findMany({
                    where: eq(classStudents.classId, cls.id),
                });

                const teachers = await db.query.classTeachers.findMany({
                    where: eq(classTeachers.classId, cls.id),
                });

                return {
                    ...cls,
                    studentCount: students.length,
                    teacherCount: teachers.length,
                };
            })
        );

        return classesWithCounts;
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
}

export async function getClassById(id: string, tenantId: string) {
    try {
        const classData = await db.query.classes.findFirst({
            where: and(
                eq(classes.id, id),
                eq(classes.tenantId, tenantId)
            ),
        });

        if (!classData) return null;

        // Get students
        const students = await db.query.classStudents.findMany({
            where: eq(classStudents.classId, id),
            with: {
                student: true,
            },
        });

        // Get teachers
        const teachers = await db.query.classTeachers.findMany({
            where: eq(classTeachers.classId, id),
            with: {
                teacher: true,
            },
        });

        // Get homeroom teacher
        let homeroomTeacher = null;
        if (classData.homeroomTeacherId) {
            homeroomTeacher = await db.query.teachers.findFirst({
                where: eq(classes.id, classData.homeroomTeacherId),
            });
        }

        return {
            ...classData,
            students: students.map(s => s.student),
            teachers: teachers.map(t => ({ ...t.teacher, subject: t.subject })),
            homeroomTeacher,
        };
    } catch (error) {
        console.error('Error fetching class:', error);
        return null;
    }
}

export async function createClass(data: ClassData) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [newClass] = await db.insert(classes).values({
            tenantId: data.tenantId,
            name: data.name,
            gradeLevel: data.gradeLevel,
            academicYear: data.academicYear,
            homeroomTeacherId: data.homeroomTeacherId,
            maxStudents: data.maxStudents || '40',
            room: data.room,
            schedule: data.schedule,
            status: data.status || 'active',
        }).returning();

        revalidatePath(`/[slug]/admin/classes`, 'page');
        return { success: true, class: newClass };
    } catch (error) {
        console.error('Error creating class:', error);
        return { success: false, error: 'Failed to create class' };
    }
}

export async function updateClass(id: string, data: Partial<ClassData>) {
    try {
        const { orgId } = await auth();

        if (!orgId || !data.tenantId || orgId !== data.tenantId) {
            throw new Error('Unauthorized');
        }

        const [updatedClass] = await db
            .update(classes)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(
                eq(classes.id, id),
                eq(classes.tenantId, data.tenantId)
            ))
            .returning();

        revalidatePath(`/[slug]/admin/classes`, 'page');
        revalidatePath(`/[slug]/admin/classes/${id}`, 'page');
        return { success: true, class: updatedClass };
    } catch (error) {
        console.error('Error updating class:', error);
        return { success: false, error: 'Failed to update class' };
    }
}

export async function deleteClass(id: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db
            .delete(classes)
            .where(and(
                eq(classes.id, id),
                eq(classes.tenantId, tenantId)
            ));

        revalidatePath(`/[slug]/admin/classes`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error deleting class:', error);
        return { success: false, error: 'Failed to delete class' };
    }
}

export async function assignStudentToClass(classId: string, studentId: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db.insert(classStudents).values({
            classId,
            studentId,
        });

        revalidatePath(`/[slug]/admin/classes/${classId}`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error assigning student:', error);
        return { success: false, error: 'Failed to assign student' };
    }
}

export async function removeStudentFromClass(classId: string, studentId: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db
            .delete(classStudents)
            .where(and(
                eq(classStudents.classId, classId),
                eq(classStudents.studentId, studentId)
            ));

        revalidatePath(`/[slug]/admin/classes/${classId}`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error removing student:', error);
        return { success: false, error: 'Failed to remove student' };
    }
}

export async function assignTeacherToClass(classId: string, teacherId: string, subject: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db.insert(classTeachers).values({
            classId,
            teacherId,
            subject,
        });

        revalidatePath(`/[slug]/admin/classes/${classId}`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error assigning teacher:', error);
        return { success: false, error: 'Failed to assign teacher' };
    }
}

export async function removeTeacherFromClass(classId: string, teacherId: string, subject: string, tenantId: string) {
    try {
        const { orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        await db
            .delete(classTeachers)
            .where(and(
                eq(classTeachers.classId, classId),
                eq(classTeachers.teacherId, teacherId),
                eq(classTeachers.subject, subject)
            ));

        revalidatePath(`/[slug]/admin/classes/${classId}`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error removing teacher:', error);
        return { success: false, error: 'Failed to remove teacher' };
    }
}

export async function getClassStats(tenantId: string) {
    try {
        const allClasses = await db.query.classes.findMany({
            where: eq(classes.tenantId, tenantId),
        });

        const totalStudents = await db.query.classStudents.findMany({
            where: eq(classStudents.classId, allClasses[0]?.id || ''),
        });

        return {
            total: allClasses.length,
            active: allClasses.filter(c => c.status === 'active').length,
            inactive: allClasses.filter(c => c.status === 'inactive').length,
            archived: allClasses.filter(c => c.status === 'archived').length,
        };
    } catch (error) {
        console.error('Error fetching class stats:', error);
        return {
            total: 0,
            active: 0,
            inactive: 0,
            archived: 0,
        };
    }
}
