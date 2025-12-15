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
import { createStudent, updateStudent, type StudentData } from '@/lib/actions/students';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface StudentFormProps {
    tenantId: string;
    tenantSlug: string;
    initialData?: Partial<StudentData> & { id?: string };
    mode: 'create' | 'edit';
}

export function StudentForm({ tenantId, tenantSlug, initialData, mode }: StudentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<StudentData>>({
        studentId: initialData?.studentId || '',
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        dateOfBirth: initialData?.dateOfBirth,
        gender: initialData?.gender || undefined,
        address: initialData?.address || '',
        parentName: initialData?.parentName || '',
        parentPhone: initialData?.parentPhone || '',
        parentEmail: initialData?.parentEmail || '',
        enrollmentDate: initialData?.enrollmentDate || new Date(),
        status: initialData?.status || 'active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: StudentData = {
                tenantId,
                studentId: formData.studentId!,
                name: formData.name!,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                parentName: formData.parentName,
                parentPhone: formData.parentPhone,
                parentEmail: formData.parentEmail,
                enrollmentDate: formData.enrollmentDate,
                status: formData.status,
            };

            let result;
            if (mode === 'create') {
                result = await createStudent(data);
            } else {
                result = await updateStudent(initialData!.id!, data);
            }

            if (result.success) {
                toast.success(mode === 'create' ? 'Student created successfully' : 'Student updated successfully');
                router.push(`/${tenantSlug}/admin/students`);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to save student');
            }
        } catch (error) {
            console.error('Error saving student:', error);
            toast.error('An error occurred while saving student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic information about the student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID *</Label>
                            <Input
                                id="studentId"
                                required
                                placeholder="e.g., 2024001"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
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
                                placeholder="student@example.com"
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
                            <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                            <Input
                                id="enrollmentDate"
                                type="date"
                                value={formData.enrollmentDate ? new Date(formData.enrollmentDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, enrollmentDate: new Date(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'active' | 'inactive' | 'graduated') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="graduated">Graduated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Student's address"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Parent/Guardian Information</CardTitle>
                    <CardDescription>Contact information for parent or guardian</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parentName">Parent/Guardian Name</Label>
                            <Input
                                id="parentName"
                                placeholder="e.g., Jane Doe"
                                value={formData.parentName}
                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                            <Input
                                id="parentPhone"
                                type="tel"
                                placeholder="+62 813-4567-8901"
                                value={formData.parentPhone}
                                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                            <Input
                                id="parentEmail"
                                type="email"
                                placeholder="parent@example.com"
                                value={formData.parentEmail}
                                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                            />
                        </div>
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
                    <Link href={`/${tenantSlug}/admin/students`}>
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
                            {mode === 'create' ? 'Create Student' : 'Update Student'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
