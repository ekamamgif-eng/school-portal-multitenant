# School Portal Multi-Tenant

A modern, multi-tenant school management system built with Next.js, Clerk authentication, and Drizzle ORM.

## 🌟 Features

- **Multi-Tenant Architecture**: Each school has its own branded subdomain and landing page
- **Authentication**: Secure authentication with Clerk (email/password and Google OAuth)
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon
- **Modern UI**: Beautiful, responsive interface using Shadcn UI components
- **Tenant Branding**: Each school has unique colors, themes, and information
- **Real-time Stats**: Student counts, teacher counts, achievements, and more

## 🏫 Demo Schools

- **Demo School**: `demo.local.cursorschool.test:3000`
- **SMPN 1 Jakarta**: `smpn1.local.cursorschool.test:3000`
- **SDN 1 Bandung**: `sdn1.local.cursorschool.test:3000`
- **SMPN 2 Surabaya**: `smpn2.local.cursorschool.test:3000`

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/school-portal-multitenant.git
   cd school-portal-multitenant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database
   DATABASE_URL=your_neon_database_url
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🌐 Local Development with Subdomains

To test multi-tenant functionality locally, add these entries to your hosts file:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: `/etc/hosts`

```
127.0.0.1   local.cursorschool.test
127.0.0.1   demo.local.cursorschool.test
127.0.0.1   smpn1.local.cursorschool.test
127.0.0.1   sdn1.local.cursorschool.test
127.0.0.1   smpn2.local.cursorschool.test
```

Then flush your DNS cache:
- **Windows**: `ipconfig /flushdns`
- **Mac**: `sudo dscacheutil -flushcache`
- **Linux**: `sudo systemd-resolve --flush-caches`

## 📦 Database Schema

The application uses the following main tables:

- `tenants`: School/organization information
- `users`: User accounts linked to Clerk
- `students`: Student records
- `teachers`: Teacher information
- `classes`: Class/course information
- `schools`: School buildings/campuses
- `audit_logs`: Activity tracking

## 🎨 Customization

### Adding a New Tenant

1. Add tenant configuration in `src/app/(tenant)/[slug]/page.tsx`:
   ```typescript
   const tenantConfigs = {
     yourschool: {
       theme: {
         primary: "from-blue-600 to-cyan-600",
         secondary: "from-blue-50 to-cyan-50",
         accent: "bg-blue-600",
         gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
       },
       info: { /* school details */ },
       stats: { /* statistics */ },
       features: [ /* features */ ],
       highlights: [ /* achievements */ ]
     }
   }
   ```

2. Add to the portal landing page in `src/app/(public)/page.tsx`

3. Update your hosts file with the new subdomain

## 🚀 Deployment

### Netlify Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

4. **Set Environment Variables**
   
   Add all variables from `.env.local` in Netlify dashboard

5. **Deploy**
   
   Netlify will automatically deploy on every push to main branch

### Custom Domain Setup

For production multi-tenant setup:

1. Add your custom domain in Netlify
2. Configure DNS with wildcard subdomain:
   ```
   *.yourdomain.com → your-netlify-site.netlify.app
   ```
3. Update middleware in `src/middleware.ts` to use your domain

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## 🔒 Security

- All routes are protected by Clerk middleware
- Database queries use parameterized statements via Drizzle ORM
- Environment variables are never exposed to the client
- CORS and security headers configured

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Neon](https://neon.tech/)

## 📧 Support

For support, email support@cursorschool.com or open an issue on GitHub.
