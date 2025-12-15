import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-600 mt-1">
                    Manage school settings and preferences
                </p>
            </div>

            <Card>
                <CardHeader className="text-center py-12">
                    <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                            <SettingsIcon className="h-10 w-10 text-gray-600" />
                        </div>
                    </div>
                    <CardTitle>School Settings</CardTitle>
                    <CardDescription>
                        This feature is coming soon. You'll be able to configure settings here.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
