'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTenant } from "@/lib/actions/super-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Add import


export function CreateTenantForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        id: ''
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData(prev => ({ ...prev, name, slug, id: slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createTenant(formData);
            toast.success("Success", { description: "Tenant created successfully" });
            router.push('/super-admin/tenants');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Failed to create tenant. ID or Slug might already be in use." });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Tenant Details</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                            id="name"
                            placeholder="Acme Schools"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL Identifier)</Label>
                        <Input
                            id="slug"
                            placeholder="acme-schools"
                            value={formData.slug}
                            onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="id">Tenant ID (Unique Internal ID)</Label>
                        <Input
                            id="id"
                            value={formData.id}
                            onChange={(e) => setFormData(p => ({ ...p, id: e.target.value }))}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Creating...' : 'Create Tenant'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
