const fs = require('fs');
const path = require('path');

const content = `# Neon Postgres
DATABASE_URL="postgresql://neondb_owner:npg_p1Ato0BUSDZK@ep-orange-brook-ad969ogn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YXNzdXJpbmctZWFnbGUtMzMuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_wXg9t7CXVVlIEeRwCDfwrblTPR8nEfkco1tC9O2ver"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

try {
    const filePath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(filePath, content.trim(), 'utf8');
    console.log('.env.local has been rewritten successfully.');
} catch (error) {
    console.error('Failed to write .env.local:', error);
    process.exit(1);
}
