import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
                <p className="text-muted-foreground">Manage your super admin account settings.</p>
            </div>

            <div className="flex justify-center">
                <UserProfile routing="hash" />
            </div>
        </div>
    );
}
