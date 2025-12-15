'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { recordPayment } from "@/lib/actions/payments";
import { toast } from "sonner";
import { Banknote, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RecordPaymentDialog({
    invoiceId,
    tenantId,
    remainingAmount
}: {
    invoiceId: string;
    tenantId: string;
    remainingAmount: number;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            invoiceId,
            amount: formData.get('amount') as string,
            method: formData.get('method') as string,
            reference: formData.get('reference') as string,
        };

        const result = await recordPayment(data, tenantId);

        if (result.success) {
            toast.success('Payment recorded');
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                    <Banknote className="mr-2 h-3.5 w-3.5" />
                    Pay
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Enter payment details for this invoice.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount Payed</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                defaultValue={remainingAmount}
                                max={remainingAmount}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Remaining due: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(remainingAmount)}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="method">Method</Label>
                            <Select name="method" defaultValue="cash">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="qris">QRIS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reference">Reference / Note</Label>
                            <Input id="reference" name="reference" placeholder="Optional" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
