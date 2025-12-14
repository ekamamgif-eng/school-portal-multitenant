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
import { inviteTenantAdmin } from "@/lib/actions/super-admin";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function InviteAdminDialog({ tenantId }: { tenantId: string }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await inviteTenantAdmin(email, tenantId);
            toast(result.status === 'promoted' ? "User Promoted" : "Invitation Sent", {
                description: result.message,
            });
            setOpen(false);
            setEmail('');
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Failed to invite admin. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleInvite}>
                    <DialogHeader>
                        <DialogTitle>Add Tenant Admin</DialogTitle>
                        <DialogDescription>
                            Enter the email address of the user you want to make an admin for this tenant.
                            If they don't exist, a placeholder account will be created.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Processing..." : "Add Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
