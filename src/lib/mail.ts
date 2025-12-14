import { Resend } from 'resend';

// Helper to get Resend instance lazily
function getResend() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY is missing in environment variables (checked at runtime).");
        return null;
    }
    return new Resend(apiKey);
}

export async function sendTenantAdminInvitation(email: string, tenantName: string, inviteUrl: string) {
    const resend = getResend();
    if (!resend) {
        console.error("Resend client not initialized. Check RESEND_API_KEY.");
        return { success: false, error: "Email service not configured" };
    }
    try {
        const data = await resend.emails.send({
            from: 'CursorSchool <onboarding@resend.dev>', // Default testing domain
            to: email,
            subject: `Invitation to manage ${tenantName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>You've been invited!</h1>
                    <p>You have been added as an administrator for <strong>${tenantName}</strong> on CursorSchool.</p>
                    <p>Click the button below to access your dashboard:</p>
                    <a href="${inviteUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
                        Access Dashboard
                    </a>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">
                        If you don't have an account yet, you will be prompted to create one.
                    </p>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send invitation email:", JSON.stringify(error, null, 2));
        return { success: false, error };
    }
}

export async function sendTenantAdminPromotion(email: string, tenantName: string, dashboardUrl: string) {
    const resend = getResend();
    if (!resend) {
        console.error("Resend client not initialized. Check RESEND_API_KEY.");
        return { success: false, error: "Email service not configured" };
    }
    try {
        const data = await resend.emails.send({
            from: 'CursorSchool <onboarding@resend.dev>',
            to: email,
            subject: `Role Updated: Admin for ${tenantName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Admin Access Granted</h1>
                    <p>Your account has been promoted to administrator for <strong>${tenantName}</strong>.</p>
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
                        Go to Dashboard
                    </a>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send promotion email:", JSON.stringify(error, null, 2));
        return { success: false, error };
    }
}
