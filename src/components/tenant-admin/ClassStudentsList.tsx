'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssignStudentDialog } from './AssignStudentDialog';
import { RemoveStudentFromClassButton } from './RemoveStudentFromClassButton';
import { UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClassStudentsListProps {
    classId: string;
    tenantId: string;
    students: any[];
}

export function ClassStudentsList({
    classId,
    tenantId,
    students,
}: ClassStudentsListProps) {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Enrolled Students</CardTitle>
                        <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Student
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!students || students.length === 0 ? (
                        <p className="text-center text-gray-600 py-8">No students enrolled yet</p>
                    ) : (
                        <div className="space-y-2">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    {student.studentId}
                                                </Badge>
                                                {student.gender && (
                                                    <span className="text-xs text-gray-500 capitalize">
                                                        {student.gender}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <RemoveStudentFromClassButton
                                        classId={classId}
                                        studentId={student.id}
                                        studentName={student.name}
                                        tenantId={tenantId}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AssignStudentDialog
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
                classId={classId}
                tenantId={tenantId}
                enrolledStudentIds={students.map(s => s.id)}
            />
        </>
    );
}
