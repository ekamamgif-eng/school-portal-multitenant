'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { assignTeacherToClass } from '@/lib/actions/classes';
import { getTeachersByTenant } from '@/lib/actions/teachers';
import { toast } from 'sonner';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classId: string;
    tenantId: string;
    assignedTeacherIds: string[];
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

export function AssignTeacherDialog({
    open,
    onOpenChange,
    classId,
    tenantId,
    assignedTeacherIds,
}: AssignTeacherDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [customSubject, setCustomSubject] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (open) {
            fetchTeachers();
        }
    }, [open]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = teachers.filter(
                (teacher) =>
                    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers(teachers);
        }
    }, [searchQuery, teachers]);

    const fetchTeachers = async () => {
        const allTeachers = await getTeachersByTenant(tenantId);
        // Only show active teachers
        const available = allTeachers.filter((t) => t.status === 'active');
        setTeachers(available);
        setFilteredTeachers(available);
    };

    const handleAssign = async () => {
        if (!selectedTeacherId) {
            toast.error('Please select a teacher');
            return;
        }

        const finalSubject = subject === 'custom' ? customSubject : subject;

        if (!finalSubject) {
            toast.error('Please select or enter a subject');
            return;
        }

        setLoading(true);
        try {
            const result = await assignTeacherToClass(classId, selectedTeacherId, finalSubject, tenantId);

            if (result.success) {
                toast.success('Teacher assigned successfully');
                onOpenChange(false);
                setSelectedTeacherId('');
                setSubject('');
                setCustomSubject('');
                setSearchQuery('');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to assign teacher');
            }
        } catch (error) {
            console.error('Error assigning teacher:', error);
            toast.error('An error occurred while assigning teacher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Teacher to Class</DialogTitle>
                    <DialogDescription>
                        Select a teacher and specify the subject they will teach in this class.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search Teachers</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="search"
                                placeholder="Search by name or ID..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teacher">Select Teacher</Label>
                        {filteredTeachers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {teachers.length === 0 ? (
                                    <p>No available teachers to assign</p>
                                ) : (
                                    <p>No teachers found matching "{searchQuery}"</p>
                                )}
                            </div>
                        ) : (
                            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a teacher" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {filteredTeachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{teacher.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {teacher.teacherId}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {commonSubjects.map((subj) => (
                                    <SelectItem key={subj} value={subj}>
                                        {subj}
                                    </SelectItem>
                                ))}
                                <SelectItem value="custom">Custom Subject...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {subject === 'custom' && (
                        <div className="space-y-2">
                            <Label htmlFor="customSubject">Custom Subject Name</Label>
                            <Input
                                id="customSubject"
                                placeholder="Enter subject name"
                                value={customSubject}
                                onChange={(e) => setCustomSubject(e.target.value)}
                            />
                        </div>
                    )}

                    {selectedTeacherId && (subject && subject !== 'custom' || customSubject) && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Assignment:</strong>{' '}
                                {teachers.find((t) => t.id === selectedTeacherId)?.name} will teach{' '}
                                <strong>{subject === 'custom' ? customSubject : subject}</strong>
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={loading || !selectedTeacherId || (!subject || (subject === 'custom' && !customSubject))}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Teacher
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
