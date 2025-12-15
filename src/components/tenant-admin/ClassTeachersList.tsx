'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssignTeacherDialog } from './AssignTeacherDialog';
import { RemoveTeacherFromClassButton } from './RemoveTeacherFromClassButton';
import { UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClassTeachersListProps {
    classId: string;
    tenantId: string;
    teachers: any[];
}

export function ClassTeachersList({
    classId,
    tenantId,
    teachers,
}: ClassTeachersListProps) {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Assigned Teachers</CardTitle>
                        <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Teacher
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!teachers || teachers.length === 0 ? (
                        <p className="text-center text-gray-600 py-8">No teachers assigned yet</p>
                    ) : (
                        <div className="space-y-2">
                            {teachers.map((teacher) => (
                                <div
                                    key={`${teacher.id}-${teacher.subject}`}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium">{teacher.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {teacher.subject || 'No Subject'}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    NIP: {teacher.teacherId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <RemoveTeacherFromClassButton
                                        classId={classId}
                                        teacherId={teacher.id}
                                        teacherName={teacher.name}
                                        subject={teacher.subject}
                                        tenantId={tenantId}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AssignTeacherDialog
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
                classId={classId}
                tenantId={tenantId}
                assignedTeacherIds={teachers.map(t => t.id)}
            />
        </>
    );
}
