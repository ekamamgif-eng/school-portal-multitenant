'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { removeTenantAdmin } from "@/lib/actions/super-admin";
import { Loader2, Trash2 } from "lucide-react";

export function RemoveAdminButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this admin? They will be demoted to a regular user.")) return;

        setLoading(true);
        try {
            await removeTenantAdmin(userId);
        } catch (error) {
            console.error(error);
            alert("Failed to remove admin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" size="sm" onClick={handleRemove} disabled={loading} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
