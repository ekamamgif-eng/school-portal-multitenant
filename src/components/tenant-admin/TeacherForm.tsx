'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { createTeacher, updateTeacher, type TeacherData } from '@/lib/actions/teachers';
import { toast } from 'sonner';
import { Loader2, Save, X, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface TeacherFormProps {
    tenantId: string;
    tenantSlug: string;
    initialData?: Partial<TeacherData> & { id?: string };
    mode: 'create' | 'edit';
}

const commonSubjects = [
    'Mathematics',
    'Science',
    'English',
    'Indonesian',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Economics',
    'Art',
    'Music',
    'Physical Education',
    'Computer Science',
];

export function TeacherForm({ tenantId, tenantSlug, initialData, mode }: TeacherFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<string[]>(initialData?.subjects || []);
    const [newSubject, setNewSubject] = useState('');

    const [formData, setFormData] = useState<Partial<TeacherData>>({
        teacherId: initialData?.teacherId || '',
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        dateOfBirth: initialData?.dateOfBirth,
        gender: initialData?.gender || undefined,
        address: initialData?.address || '',
        qualification: initialData?.qualification || '',
        hireDate: initialData?.hireDate || new Date(),
        status: initialData?.status || 'active',
    });

    const handleAddSubject = (subject: string) => {
        if (subject && !subjects.includes(subject)) {
            setSubjects([...subjects, subject]);
            setNewSubject('');
        }
    };

    const handleRemoveSubject = (subject: string) => {
        setSubjects(subjects.filter(s => s !== subject));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: TeacherData = {
                tenantId,
                teacherId: formData.teacherId!,
                name: formData.name!,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                subjects: subjects.length > 0 ? subjects : undefined,
                qualification: formData.qualification,
                hireDate: formData.hireDate,
                status: formData.status,
            };

            let result;
            if (mode === 'create') {
                result = await createTeacher(data);
            } else {
                result = await updateTeacher(initialData!.id!, data);
            }

            if (result.success) {
                toast.success(mode === 'create' ? 'Teacher created successfully' : 'Teacher updated successfully');
                router.push(`/${tenantSlug}/admin/teachers`);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to save teacher');
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            toast.error('An error occurred while saving teacher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic information about the teacher</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teacherId">Teacher ID *</Label>
                            <Input
                                id="teacherId"
                                required
                                placeholder="e.g., T2024001"
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                required
                                placeholder="e.g., John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="teacher@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+62 812-3456-7890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: new Date(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value: 'male' | 'female') => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hireDate">Hire Date</Label>
                            <Input
                                id="hireDate"
                                type="date"
                                value={formData.hireDate ? new Date(formData.hireDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, hireDate: new Date(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'active' | 'inactive' | 'resigned') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="resigned">Resigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Teacher's address"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Teaching qualifications and subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input
                            id="qualification"
                            placeholder="e.g., Bachelor of Education, Master of Science"
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Subjects Taught</Label>
                        <div className="flex gap-2">
                            <Select value={newSubject} onValueChange={setNewSubject}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonSubjects
                                        .filter(s => !subjects.includes(s))
                                        .map((subject) => (
                                            <SelectItem key={subject} value={subject}>
                                                {subject}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAddSubject(newSubject)}
                                disabled={!newSubject}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {subjects.map((subject) => (
                                    <Badge key={subject} variant="secondary" className="gap-1">
                                        {subject}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubject(subject)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
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
                    <Link href={`/${tenantSlug}/admin/teachers`}>
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
                            {mode === 'create' ? 'Create Teacher' : 'Update Teacher'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
