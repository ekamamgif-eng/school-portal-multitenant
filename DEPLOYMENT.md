# Deployment Guide

## 🚀 Deploying to Netlify

### Prerequisites
- GitHub account
- Netlify account (free tier works)
- Neon database (already set up)
- Clerk account (already configured)

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: School Portal Multi-Tenant"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Repository name: `school-portal-multitenant`
   - Description: "Multi-tenant school management system with Next.js and Clerk"
   - Make it Public or Private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/school-portal-multitenant.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Netlify

1. **Sign in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select `school-portal-multitenant` repository

3. **Configure Build Settings**
   
   Netlify should auto-detect Next.js settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 or higher

   If not auto-detected, enter these manually.

4. **Add Environment Variables**
   
   Click "Add environment variables" and add:
   
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key
   CLERK_SECRET_KEY=your_actual_clerk_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   DATABASE_URL=your_actual_neon_database_url
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (2-3 minutes)
   - Your site will be live at `https://random-name.netlify.app`

### Step 3: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain (e.g., `cursorschool.com`)

2. **Configure DNS for Multi-Tenant**
   
   In your domain registrar's DNS settings:
   
   ```
   Type: CNAME
   Name: *
   Value: your-site.netlify.app
   
   Type: CNAME
   Name: @
   Value: your-site.netlify.app
   ```

3. **Update Middleware**
   
   In `src/middleware.ts`, change:
   ```typescript
   const rootDomain = "cursorschool.com"; // your actual domain
   ```

4. **Update Clerk Settings**
   - Go to Clerk Dashboard
   - Add your production domain to allowed origins
   - Update redirect URLs

### Step 4: Test Your Deployment

Visit these URLs (replace with your domain):
- Main portal: `https://cursorschool.com`
- Demo school: `https://demo.cursorschool.com`
- SMPN1: `https://smpn1.cursorschool.com`

### Continuous Deployment

Netlify automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Your site will rebuild and deploy automatically!

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify Node version is 18+

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon database is accessible from Netlify IPs
- Ensure connection string includes `?sslmode=require`

### Authentication Not Working
- Verify Clerk keys are correct
- Check Clerk dashboard for allowed domains
- Ensure redirect URLs match your deployment URL

### Subdomain Not Working
- Verify DNS wildcard record is set
- Wait for DNS propagation (up to 48 hours)
- Check Netlify domain settings

## 📊 Monitoring

- **Netlify Analytics**: Built-in traffic analytics
- **Clerk Dashboard**: User authentication metrics
- **Neon Dashboard**: Database performance and queries

## 🔄 Rollback

If deployment has issues:
1. Go to Netlify dashboard
2. Click "Deploys"
3. Find previous working deploy
4. Click "Publish deploy"

## 📝 Environment Variables Checklist

- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- [ ] CLERK_SECRET_KEY
- [ ] NEXT_PUBLIC_CLERK_SIGN_IN_URL
- [ ] NEXT_PUBLIC_CLERK_SIGN_UP_URL
- [ ] DATABASE_URL
- [ ] (Optional) NEXT_PUBLIC_APP_URL

## 🎉 You're Live!

Your multi-tenant school portal is now deployed and accessible worldwide!
