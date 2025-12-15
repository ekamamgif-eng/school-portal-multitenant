'use server';

import { db } from '@/lib/db';
import { attendanceRecords, classStudents, students, teacherAttendance, teachers, users } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export interface AttendanceData {
    studentId: string;
    classId: string;
    date: string; // YYYY-MM-DD
    status: 'present' | 'absent' | 'late' | 'excused';
    reason?: string;
}

export async function getClassAttendance(classId: string, date: string, tenantId: string) {
    try {
        // First get all students in the class
        const enrolledStudents = await db
            .select({
                id: students.id,
                name: students.name,
                studentId: students.studentId,
                status: students.status,
            })
            .from(classStudents)
            .innerJoin(students, eq(classStudents.studentId, students.id))
            .where(and(
                eq(classStudents.classId, classId),
                eq(students.tenantId, tenantId),
                eq(students.status, 'active') // Only show active students
            ));

        // Then get attendance records for this date
        const attendance = await db
            .select()
            .from(attendanceRecords)
            .where(and(
                eq(attendanceRecords.classId, classId),
                eq(attendanceRecords.date, date),
                eq(attendanceRecords.tenantId, tenantId)
            ));

        // Combine the data
        const combinedData = enrolledStudents.map(student => {
            const record = attendance.find(a => a.studentId === student.id);
            return {
                studentId: student.id,
                name: student.name,
                nis: student.studentId,
                status: record?.status || null, // null means not recorded yet
                reason: record?.reason || '',
                recordId: record?.id,
            };
        });

        // Sort by name
        combinedData.sort((a, b) => a.name.localeCompare(b.name));

        return { success: true, data: combinedData };
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return { success: false, error: 'Failed to fetch attendance' };
    }
}

export async function saveAttendance(
    classId: string,
    date: string,
    records: { studentId: string; status: string; reason?: string }[],
    tenantId: string
) {
    try {
        const { userId, orgId } = await auth();

        if (!orgId || orgId !== tenantId) {
            throw new Error('Unauthorized');
        }

        const timestamp = new Date();

        // Get user for recordedBy
        const currentUser = await db.query.users.findFirst({
            where: eq(users.clerkId, userId || ''),
        });

        // Prepare data for upsert
        const valuesToInsert = records.map((record) => ({
            tenantId,
            classId,
            studentId: record.studentId,
            date,
            status: record.status as 'present' | 'absent' | 'late' | 'excused',
            reason: record.reason,
            recordedBy: currentUser?.id,
            updatedAt: timestamp,
        }));

        // Drizzle upsert
        for (const value of valuesToInsert) {
            await db
                .insert(attendanceRecords)
                .values(value)
                .onConflictDoUpdate({
                    target: [attendanceRecords.studentId, attendanceRecords.classId, attendanceRecords.date],
                    set: {
                        status: value.status,
                        reason: value.reason,
                        recordedBy: value.recordedBy,
                        updatedAt: timestamp,
                    },
                });
        }

        revalidatePath(`/[slug]/admin/attendance`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error saving attendance:', error);
        return { success: false, error: 'Failed to save attendance' };
    }
}

// QR Code Actions

export async function markStudentAttendanceByQR(
    qrContent: string,
    classId: string,
    tenantId: string,
    recordedByClerkId: string
) {
    try {
        // Assume QR content is the student's UUID or ID.
        // We need to resolve it to a student record.
        // Try to match by ID (UUID) or studentId (NIS)

        let student = await db.query.students.findFirst({
            where: and(
                eq(students.id, qrContent),
                eq(students.tenantId, tenantId)
            )
        });

        if (!student) {
            student = await db.query.students.findFirst({
                where: and(
                    eq(students.studentId, qrContent),
                    eq(students.tenantId, tenantId)
                )
            });
        }

        if (!student) {
            return { success: false, error: 'Student not found' };
        }

        // Verify enrollment in class?
        const enrollment = await db.query.classStudents.findFirst({
            where: and(
                eq(classStudents.classId, classId),
                eq(classStudents.studentId, student.id)
            )
        });

        if (!enrollment) {
            return { success: false, error: 'Student is not enrolled in this class' };
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const timestamp = new Date();

        const currentUser = await db.query.users.findFirst({
            where: eq(users.clerkId, recordedByClerkId),
        });

        await db
            .insert(attendanceRecords)
            .values({
                tenantId,
                classId,
                studentId: student.id,
                date: dateStr,
                status: 'present',
                recordedBy: currentUser?.id,
                updatedAt: timestamp,
            })
            .onConflictDoUpdate({
                target: [attendanceRecords.studentId, attendanceRecords.classId, attendanceRecords.date],
                set: {
                    status: 'present',
                    recordedBy: currentUser?.id,
                    updatedAt: timestamp,
                },
            });

        revalidatePath(`/[slug]/admin/attendance`, 'page');
        return { success: true, studentName: student.name };

    } catch (error) {
        console.error('Error marking QR attendance:', error);
        return { success: false, error: 'Failed to mark attendance' };
    }
}

export async function markTeacherAttendanceByQR(
    qrContent: string,
    tenantId: string,
    type: 'check-in' | 'check-out'
) {
    try {
        let teacher = await db.query.teachers.findFirst({
            where: and(
                eq(teachers.id, qrContent),
                eq(teachers.tenantId, tenantId)
            )
        });

        if (!teacher) {
            teacher = await db.query.teachers.findFirst({
                where: and(
                    eq(teachers.teacherId, qrContent),
                    eq(teachers.tenantId, tenantId)
                )
            });
        }

        if (!teacher) {
            return { success: false, error: 'Teacher not found' };
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const timestamp = new Date();

        // Check for existing record
        const existingRecord = await db.query.teacherAttendance.findFirst({
            where: and(
                eq(teacherAttendance.teacherId, teacher.id),
                eq(teacherAttendance.date, dateStr)
            )
        });

        if (type === 'check-in') {
            if (existingRecord) {
                return { success: false, error: 'Already checked in today' };
            }
            await db.insert(teacherAttendance).values({
                tenantId,
                teacherId: teacher.id,
                date: dateStr,
                checkIn: timestamp,
                status: 'present',
            });
        } else {
            // Check out
            if (!existingRecord) {
                return { success: false, error: 'No check-in record found for today' };
            }
            await db.update(teacherAttendance)
                .set({ checkOut: timestamp })
                .where(eq(teacherAttendance.id, existingRecord.id));
        }

        revalidatePath(`/[slug]/admin/attendance`, 'page');
        return { success: true, teacherName: teacher.name, type };

    } catch (error) {
        console.error('Error marking teacher QR attendance:', error);
        return { success: false, error: 'Failed to mark attendance' };
    }
}
