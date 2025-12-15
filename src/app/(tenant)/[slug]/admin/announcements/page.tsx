import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default async function AnnouncementsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
                <p className="text-gray-600 mt-1">
                    Create and manage school announcements
                </p>
            </div>

            <Card>
                <CardHeader className="text-center py-12">
                    <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
                            <Megaphone className="h-10 w-10 text-orange-600" />
                        </div>
                    </div>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>
                        This feature is coming soon. You'll be able to post announcements here.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
