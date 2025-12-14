import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function ModulesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Modules & Features</h2>
                <p className="text-muted-foreground">Enable or disable system-wide modules.</p>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Tenant Onboarding</CardTitle>
                                <CardDescription>Allow new schools to register.</CardDescription>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>AI Assistant (Antigravity)</CardTitle>
                                <CardDescription>Enable AI features for teachers.</CardDescription>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
