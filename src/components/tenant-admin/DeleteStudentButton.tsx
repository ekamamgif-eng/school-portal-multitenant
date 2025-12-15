'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteStudent } from '@/lib/actions/students';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteStudentButtonProps {
    studentId: string;
    studentName: string;
    tenantId: string;
    tenantSlug: string;
}

export function DeleteStudentButton({
    studentId,
    studentName,
    tenantId,
    tenantSlug,
}: DeleteStudentButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteStudent(studentId, tenantId);

            if (result.success) {
                toast.success('Student deleted successfully');
                router.refresh();
                setOpen(false);
            } else {
                toast.error(result.error || 'Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error('An error occurred while deleting student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </DropdownMenuItem>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{studentName}</strong> and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
