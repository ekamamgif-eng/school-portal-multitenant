'use client';

import { useState, useEffect } from 'react';
import { QRScanner } from './QRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { markStudentAttendanceByQR, markTeacherAttendanceByQR } from '@/lib/actions/attendance';
import { toast } from 'sonner';
import { CheckCircle2, User, School, XCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AttendanceKioskProps {
    tenantId: string;
    classes: { id: string; name: string }[];
}

export function AttendanceKiosk({ tenantId, classes }: AttendanceKioskProps) {
    const { user } = useUser();
    const [mode, setMode] = useState<'student' | 'teacher'>('student');
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [teacherAction, setTeacherAction] = useState<'check-in' | 'check-out'>('check-in');

    // Feedback state
    const [lastScanResult, setLastScanResult] = useState<{
        success: boolean;
        message: string;
        name?: string;
        timestamp: Date;
    } | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    // Audio refs
    const successAudio = typeof Audio !== "undefined" ? new Audio('/sounds/success.mp3') : null;
    const errorAudio = typeof Audio !== "undefined" ? new Audio('/sounds/error.mp3') : null;

    const playSound = (success: boolean) => {
        // Placeholder for audio - browsers block autoplay often, assumes interaction first
        // In a real Kiosk, we'd ensure a "Start Kiosk" button was clicked to enable audio context.
        // For now, assume creating Audio object works on click, but maybe not automatically on scan without prior interaction.
        // We'll rely on visual feedback principally.
    };

    const handleScan = async (decodedText: string) => {
        if (isProcessing) return;

        // Simple debounce: Ignore identical scans within 3 seconds? 
        // Or just generic processing lock.
        setIsProcessing(true);

        try {
            let result;

            if (mode === 'student') {
                if (!selectedClassId) {
                    toast.error("Please select a class first!");
                    setLastScanResult({
                        success: false,
                        message: "No Class Selected",
                        timestamp: new Date()
                    });
                    setIsProcessing(false);
                    return;
                }

                result = await markStudentAttendanceByQR(
                    decodedText,
                    selectedClassId,
                    tenantId,
                    user?.id || ''
                );
            } else {
                // Teacher Mode
                result = await markTeacherAttendanceByQR(
                    decodedText,
                    tenantId,
                    teacherAction
                );
            }

            if (result.success) {
                // Cast to any to access mutually exclusive properties without complex guards
                const name = (result as any).studentName || (result as any).teacherName;

                setLastScanResult({
                    success: true,
                    message: "Attendance Marked",
                    name: name,
                    timestamp: new Date()
                });
                toast.success(`Marked present: ${name}`);
            } else {
                setLastScanResult({
                    success: false,
                    message: result.error || "Failed to mark attendance",
                    timestamp: new Date()
                });
                toast.error(result.error);
            }

        } catch (error) {
            console.error(error);
            setLastScanResult({
                success: false,
                message: "System Error",
                timestamp: new Date()
            });
        } finally {
            // Wait a bit before allowing next scan to prevent double taps
            setTimeout(() => {
                setIsProcessing(false);
            }, 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Scanner ({mode === 'student' ? 'Student Mode' : 'Staff Mode'})
                        </CardTitle>
                        <CardDescription>
                            Position the QR code in front of the camera
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QRScanner
                            onScan={handleScan}
                            onError={(err) => console.log(err)} // Suppress console spam
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="student">
                                    <School className="h-4 w-4 mr-2" />
                                    Student
                                </TabsTrigger>
                                <TabsTrigger value="teacher">
                                    <User className="h-4 w-4 mr-2" />
                                    Staff
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {mode === 'student' ? (
                            <div className="space-y-2">
                                <Label>Select Active Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a class..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Students scanned will be marked present in this class.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Label>Action</Label>
                                <RadioGroup
                                    value={teacherAction}
                                    onValueChange={(v: string) => setTeacherAction(v as 'check-in' | 'check-out')}
                                >
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <RadioGroupItem value="check-in" id="in" />
                                        <Label htmlFor="in" className="cursor-pointer flex-1">Check In</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <RadioGroupItem value="check-out" id="out" />
                                        <Label htmlFor="out" className="cursor-pointer flex-1">Check Out</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Feedback Card */}
                <Card className={!lastScanResult ? 'opacity-50' : ''}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            Last Scan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lastScanResult ? (
                            <div className={`text-center py-4 rounded-lg border-2 ${lastScanResult.success
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                <div className="flex justify-center mb-2">
                                    {lastScanResult.success ? (
                                        <CheckCircle2 className="h-12 w-12" />
                                    ) : (
                                        <XCircle className="h-12 w-12" />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold">
                                    {lastScanResult.success ? "Success" : "Error"}
                                </h3>
                                <p className="text-sm mt-1">{lastScanResult.message}</p>
                                {lastScanResult.name && (
                                    <p className="text-xl font-bold mt-2 text-black">
                                        {lastScanResult.name}
                                    </p>
                                )}
                                <p className="text-xs mt-3 opacity-70">
                                    {lastScanResult.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 font-medium">
                                Ready to scan
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
