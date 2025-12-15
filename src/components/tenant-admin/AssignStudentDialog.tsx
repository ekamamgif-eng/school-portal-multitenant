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
import { assignStudentToClass } from '@/lib/actions/classes';
import { getStudentsByTenant } from '@/lib/actions/students';
import { toast } from 'sonner';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classId: string;
    tenantId: string;
    enrolledStudentIds: string[];
}

export function AssignStudentDialog({
    open,
    onOpenChange,
    classId,
    tenantId,
    enrolledStudentIds,
}: AssignStudentDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (open) {
            fetchStudents();
        }
    }, [open]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = students.filter(
                (student) =>
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    }, [searchQuery, students]);

    const fetchStudents = async () => {
        const allStudents = await getStudentsByTenant(tenantId);
        // Filter out already enrolled students and only show active students
        const available = allStudents.filter(
            (s) => !enrolledStudentIds.includes(s.id) && s.status === 'active'
        );
        setStudents(available);
        setFilteredStudents(available);
    };

    const handleAssign = async () => {
        if (!selectedStudentId) {
            toast.error('Please select a student');
            return;
        }

        setLoading(true);
        try {
            const result = await assignStudentToClass(classId, selectedStudentId, tenantId);

            if (result.success) {
                toast.success('Student assigned successfully');
                onOpenChange(false);
                setSelectedStudentId('');
                setSearchQuery('');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to assign student');
            }
        } catch (error) {
            console.error('Error assigning student:', error);
            toast.error('An error occurred while assigning student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Student to Class</DialogTitle>
                    <DialogDescription>
                        Select a student to add to this class. Only active students who are not already enrolled are shown.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search Students</Label>
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
                        <Label htmlFor="student">Select Student</Label>
                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {students.length === 0 ? (
                                    <p>No available students to assign</p>
                                ) : (
                                    <p>No students found matching "{searchQuery}"</p>
                                )}
                            </div>
                        ) : (
                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a student" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {filteredStudents.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{student.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {student.studentId}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {selectedStudentId && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Selected:</strong>{' '}
                                {students.find((s) => s.id === selectedStudentId)?.name}
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
                    <Button onClick={handleAssign} disabled={loading || !selectedStudentId}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Student
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
