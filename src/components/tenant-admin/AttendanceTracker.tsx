'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, X, Clock, HelpCircle, Save, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClassAttendance, saveAttendance } from '@/lib/actions/attendance';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface AttendanceTrackerProps {
    tenantId: string;
    classes: { id: string; name: string }[];
}

interface StudentAttendance {
    studentId: string;
    name: string;
    nis: string;
    status: 'present' | 'absent' | 'late' | 'excused' | null;
    reason: string;
    recordId?: string;
}

export function AttendanceTracker({ tenantId, classes }: AttendanceTrackerProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [students, setStudents] = useState<StudentAttendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (selectedClassId && date) {
            fetchAttendance();
        } else {
            setStudents([]);
        }
    }, [selectedClassId, date]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const result = await getClassAttendance(selectedClassId, dateStr, tenantId);
            if (result.success && result.data) {
                // Ensure status is typed correctly from DB string
                const safeData = result.data.map(d => ({
                    ...d,
                    status: (d.status as any) || null
                }));
                setStudents(safeData);
            } else {
                toast.error('Failed to load attendance');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, status } : s
        ));
    };

    const handleReasonChange = (studentId: string, reason: string) => {
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, reason } : s
        ));
    };

    const handleSave = async () => {
        // Filter out students with no status? Or allow saving null as 'absent' defaults?
        // Typically we want to enforce status, or at least only save those with status.
        // Let's only save students who have a status set.
        const recordsToSave = students
            .filter(s => s.status !== null)
            .map(s => ({
                studentId: s.studentId,
                status: s.status!,
                reason: s.reason,
            }));

        if (recordsToSave.length === 0) {
            toast.info('No attendance marks to save');
            return;
        }

        setSaving(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const result = await saveAttendance(selectedClassId, dateStr, recordsToSave, tenantId);

            if (result.success) {
                toast.success('Attendance saved successfully');
                // Optional: refresh to get IDs or just keep state
            } else {
                toast.error('Failed to save attendance');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving attendance');
        } finally {
            setSaving(false);
        }
    };

    const markAll = (status: StudentAttendance['status']) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    // Filter students
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.nis.toLowerCase().includes(filter.toLowerCase())
    );

    const stats = {
        present: students.filter(s => s.status === 'present').length,
        absent: students.filter(s => s.status === 'absent').length,
        late: students.filter(s => s.status === 'late').length,
        excused: students.filter(s => s.status === 'excused').length,
        total: students.length,
    };

    // Calculate percentage based on total students, treating null as not recorded (not counting against?)
    // Or normally attendance is % of Present out of Total.
    const attendanceRate = stats.total > 0
        ? Math.round(((stats.present + stats.late) / stats.total) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Tracker</CardTitle>
                    <CardDescription>Select a class and date to take attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-[250px]">
                            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[250px]">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => d && setDate(d)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {selectedClassId && (
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search student..."
                                            className="pl-8"
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => markAll('present')}>All Present</Button>
                                        <Button onClick={handleSave} disabled={saving}>
                                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Attendance
                                        </Button>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                ) : students.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-gray-50 text-gray-500">
                                        No students found in this class
                                    </div>
                                ) : (
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[300px]">Student</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.map((student) => (
                                                    <TableRow key={student.studentId}>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{student.name}</p>
                                                                <p className="text-sm text-gray-500">{student.nis}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1">
                                                                <StatusButton
                                                                    status="present"
                                                                    current={student.status}
                                                                    onClick={() => handleStatusChange(student.studentId, 'present')}
                                                                    icon={Check}
                                                                    color="green"
                                                                    label="Present"
                                                                />
                                                                <StatusButton
                                                                    status="absent"
                                                                    current={student.status}
                                                                    onClick={() => handleStatusChange(student.studentId, 'absent')}
                                                                    icon={X}
                                                                    color="red"
                                                                    label="Absent"
                                                                />
                                                                <StatusButton
                                                                    status="late"
                                                                    current={student.status}
                                                                    onClick={() => handleStatusChange(student.studentId, 'late')}
                                                                    icon={Clock}
                                                                    color="yellow"
                                                                    label="Late"
                                                                />
                                                                <StatusButton
                                                                    status="excused"
                                                                    current={student.status}
                                                                    onClick={() => handleStatusChange(student.studentId, 'excused')}
                                                                    icon={HelpCircle}
                                                                    color="blue"
                                                                    label="Excused"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                placeholder="Add note..."
                                                                value={student.reason}
                                                                onChange={(e) => handleReasonChange(student.studentId, e.target.value)}
                                                                className="h-8 text-sm"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-64 space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Daily Attendance Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{attendanceRate}%</div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: `${attendanceRate}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Present</span>
                                            <span className="font-medium">{stats.present}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> Absent</span>
                                            <span className="font-medium">{stats.absent}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Late</span>
                                            <span className="font-medium">{stats.late}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /> Excused</span>
                                            <span className="font-medium">{stats.excused}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatusButton({ status, current, onClick, icon: Icon, color, label }: any) {
    const isSelected = current === status;
    const variant = isSelected ? 'default' : 'outline';

    // Hard to do dynamic tailwind colors with interpolated strings, best to map
    const colorStyles: Record<string, string> = {
        green: isSelected ? 'bg-green-600 hover:bg-green-700' : 'text-green-600 hover:text-green-700 hover:bg-green-50',
        red: isSelected ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 hover:text-red-700 hover:bg-red-50',
        yellow: isSelected ? 'bg-yellow-500 hover:bg-yellow-600' : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50',
        blue: isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    };

    return (
        <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
                "h-8 w-8 p-0 md:w-auto md:px-3 md:h-8",
                colorStyles[color],
                !isSelected && "border-dashed"
            )}
            onClick={onClick}
            title={label}
        >
            <Icon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{label}</span>
        </Button>
    );
}
