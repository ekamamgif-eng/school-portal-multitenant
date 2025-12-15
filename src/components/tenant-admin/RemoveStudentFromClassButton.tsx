'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { removeStudentFromClass } from '@/lib/actions/classes';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

interface RemoveStudentFromClassButtonProps {
    classId: string;
    studentId: string;
    studentName: string;
    tenantId: string;
}

export function RemoveStudentFromClassButton({
    classId,
    studentId,
    studentName,
    tenantId,
}: RemoveStudentFromClassButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        setLoading(true);
        try {
            const result = await removeStudentFromClass(classId, studentId, tenantId);

            if (result.success) {
                toast.success('Student removed from class');
                router.refresh();
                setOpen(false);
            } else {
                toast.error(result.error || 'Failed to remove student');
            }
        } catch (error) {
            console.error('Error removing student:', error);
            toast.error('An error occurred while removing student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove Student?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove <strong>{studentName}</strong> from this class?
                        This will delete their enrollment record but not the student account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRemove}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            'Remove'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
