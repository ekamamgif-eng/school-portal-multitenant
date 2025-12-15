import {
    getInvoices,
    getPaymentCategories
} from "@/lib/actions/payments";
import { getStudentsByTenant } from "@/lib/actions/students";
import { getTenantBySlug } from "@/lib/actions/tenants";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateCategoryDialog } from "@/components/tenant-admin/CreateCategoryDialog";
import { CreateInvoiceDialog } from "@/components/tenant-admin/CreateInvoiceDialog";
import { RecordPaymentDialog } from "@/components/tenant-admin/RecordPaymentDialog";
import { format } from "date-fns";

export default async function PaymentsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tenant = await getTenantBySlug(slug);

    if (!tenant) {
        redirect("/");
    }

    // Fetch Data
    const invoices = await getInvoices(tenant.id);
    const categories = await getPaymentCategories(tenant.id);
    const students = await getStudentsByTenant(tenant.id);

    // Stats
    const totalCollected = invoices.reduce((acc, inv) => acc + parseFloat(inv.paidAmount), 0);
    const totalOutstanding = invoices.reduce((acc, inv) => {
        if (inv.status !== 'cancelled') {
            return acc + (parseFloat(inv.amount) - parseFloat(inv.paidAmount));
        }
        return acc;
    }, 0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
                    <p className="text-gray-600 mt-1">Manage invoices and tuition fees</p>
                </div>
                <div className="flex gap-2">
                    <CreateCategoryDialog tenantId={tenant.id} />
                    <CreateInvoiceDialog
                        tenantId={tenant.id}
                        students={students.map(s => ({ id: s.id, name: s.name }))}
                        categories={categories.map(c => ({ id: c.id, name: c.name, amount: c.amount }))}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                        No invoices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => {
                                    const amount = parseFloat(invoice.amount);
                                    const paid = parseFloat(invoice.paidAmount);
                                    const remaining = amount - paid;

                                    return (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{invoice.studentName}</div>
                                                <div className="text-xs text-gray-500">{invoice.studentId}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{invoice.title}</div>
                                                <div className="text-xs text-gray-500">{invoice.categoryName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{formatCurrency(amount)}</div>
                                                {paid > 0 && <div className="text-xs text-green-600">Paid: {formatCurrency(paid)}</div>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    invoice.status === 'paid' ? 'default' :
                                                        invoice.status === 'partial' ? 'secondary' :
                                                            invoice.status === 'overdue' ? 'destructive' : 'outline'
                                                }>
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {remaining > 0 && (
                                                    <RecordPaymentDialog
                                                        invoiceId={invoice.id}
                                                        tenantId={tenant.id}
                                                        remainingAmount={remaining}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
