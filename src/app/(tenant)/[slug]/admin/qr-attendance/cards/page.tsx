import { getStudentsByTenant } from "@/lib/actions/students";
import { getTeachersByTenant } from "@/lib/actions/teachers";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { QRCard } from "@/components/modules/qr-attendance/QRCard";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function QRCardsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    const students = await getStudentsByTenant(tenant.id);
    const teachers = await getTeachersByTenant(tenant.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/${slug}/admin/attendance`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">QR ID Cards</h2>
                        <p className="text-gray-600 mt-1">
                            Printable QR codes for students and staff
                        </p>
                    </div>
                </div>
                <Button onClick={() => { }} className="print-button" asChild>
                    {/* Hacky print trigger via simple script or just user explanation */}
                    <span className="cursor-pointer" onClick={() => { /* In client comp ideally */ }}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print (Ctrl+P)
                    </span>
                </Button>
            </div>

            <Tabs defaultValue="students" className="print:block">
                <TabsList className="print:hidden">
                    <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                    <TabsTrigger value="teachers">Staff ({teachers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-4 print:block">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 print:grid-cols-4 print:gap-4">
                        {students.map(s => (
                            <QRCard
                                key={s.id}
                                id={s.id} // Or s.studentId if we prefer NIS
                                name={s.name}
                                role="Student"
                                subtext={s.studentId}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="teachers" className="space-y-4 print:block">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 print:grid-cols-4 print:gap-4">
                        {teachers.map(t => (
                            <QRCard
                                key={t.id}
                                id={t.id}
                                name={t.name}
                                role="Staff"
                                subtext={t.teacherId}
                            />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <style>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
                    body { background: white; }
                    nav, aside, header { display: none; }
                }
            `}</style>
        </div>
    );
}
