'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClass, updateClass, type ClassData } from '@/lib/actions/classes';
import { getTeachersByTenant } from '@/lib/actions/teachers';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface ClassFormProps {
    tenantId: string;
    tenantSlug: string;
    initialData?: Partial<ClassData> & { id?: string };
    mode: 'create' | 'edit';
}

export function ClassForm({ tenantId, tenantSlug, initialData, mode }: ClassFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);

    const [formData, setFormData] = useState<Partial<ClassData>>({
        name: initialData?.name || '',
        gradeLevel: initialData?.gradeLevel || '',
        academicYear: initialData?.academicYear || new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
        homeroomTeacherId: initialData?.homeroomTeacherId || undefined,
        maxStudents: initialData?.maxStudents || '40',
        room: initialData?.room || '',
        schedule: initialData?.schedule || '',
        status: initialData?.status || 'active',
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            const teachersList = await getTeachersByTenant(tenantId);
            setTeachers(teachersList.filter(t => t.status === 'active'));
        };
        fetchTeachers();
    }, [tenantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: ClassData = {
                tenantId,
                name: formData.name!,
                gradeLevel: formData.gradeLevel,
                academicYear: formData.academicYear,
                homeroomTeacherId: formData.homeroomTeacherId === 'none' ? undefined : formData.homeroomTeacherId,
                maxStudents: formData.maxStudents,
                room: formData.room,
                schedule: formData.schedule,
                status: formData.status,
            };

            let result;
            if (mode === 'create') {
                result = await createClass(data);
            } else {
                result = await updateClass(initialData!.id!, data);
            }

            if (result.success) {
                toast.success(mode === 'create' ? 'Class created successfully' : 'Class updated successfully');
                router.push(`/${tenantSlug}/admin/classes`);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to save class');
            }
        } catch (error) {
            console.error('Error saving class:', error);
            toast.error('An error occurred while saving class');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Class Information</CardTitle>
                    <CardDescription>Basic information about the class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Class Name *</Label>
                            <Input
                                id="name"
                                required
                                placeholder="e.g., 10-A, 7-B"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gradeLevel">Grade Level</Label>
                            <Input
                                id="gradeLevel"
                                placeholder="e.g., 10, 7"
                                value={formData.gradeLevel}
                                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="academicYear">Academic Year</Label>
                            <Input
                                id="academicYear"
                                placeholder="e.g., 2024/2025"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxStudents">Max Students</Label>
                            <Input
                                id="maxStudents"
                                type="number"
                                placeholder="40"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Input
                                id="room"
                                placeholder="e.g., Room 101, Lab A"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'active' | 'inactive' | 'archived') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="homeroomTeacher">Homeroom Teacher</Label>
                            <Select
                                value={formData.homeroomTeacherId}
                                onValueChange={(value) => setFormData({ ...formData, homeroomTeacherId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select homeroom teacher (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No homeroom teacher</SelectItem>
                                    {teachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.teacherId})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Textarea
                            id="schedule"
                            placeholder="Class schedule description (e.g., Monday-Friday, 08:00-14:00)"
                            rows={3}
                            value={formData.schedule}
                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    asChild
                    disabled={loading}
                >
                    <Link href={`/${tenantSlug}/admin/classes`}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Link>
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            {mode === 'create' ? 'Create Class' : 'Update Class'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
