
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building2, GraduationCap, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getPlatformSeo, getPlatformBranding } from "@/lib/actions/branding";
import { getAllTenants, TenantData } from "@/lib/actions/tenants";
import { redirect } from "next/navigation";
import { TenantBrandingProvider } from "@/components/branding/TenantBrandingProvider";


interface TenantCardProps {
  tenant: TenantData;
}

function TenantCard({ tenant }: TenantCardProps) {
  const initials = tenant.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Extract branding colors
  const primaryColor = tenant.branding?.primary || '#2563eb';
  const secondaryColor = tenant.branding?.secondary || '#4f46e5';
  const features = tenant.branding?.features || [];

  return (
    <Link href={`/${tenant.slug}`}>
      <Card
        className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary relative overflow-hidden"
        style={{
          borderColor: `${primaryColor}20`,
        }}
      >
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          }}
        />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <Avatar className="h-16 w-16 border-2" style={{ borderColor: `${primaryColor}40` }}>
              {tenant.logoUrl ? (
                <AvatarImage src={tenant.logoUrl} alt={tenant.name} />
              ) : null}
              <AvatarFallback
                className="text-white text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge
              className="text-white border-0"
              style={{ backgroundColor: primaryColor }}
            >
              active
            </Badge>
          </div>
          <CardTitle
            className="text-xl mt-4 transition-colors"
            style={{
              color: 'inherit'
            }}
          >
            {tenant.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {tenant.slogan || tenant.seo?.description || "Welcome to our school portal"}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {/* Features badges */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {features.slice(0, 3).map((feature, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${primaryColor}40`,
                    color: primaryColor
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          <div
            className="mt-4 flex items-center font-medium group-hover:gap-2 transition-all"
            style={{ color: primaryColor }}
          >
            <span>Visit School</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function Home() {
  const user = await currentUser();
  const platformSeo = await getPlatformSeo() as any;
  const platformBranding = await getPlatformBranding() as any;
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

  // Fetch real tenant data from database
  const tenants = await getAllTenants();

  // Strict Debugging
  console.log("Check SuperAdmin:", {
    hasUser: !!user,
    emailObj: user?.emailAddresses?.[0],
    envEmail: superAdminEmail
  });

  const isSuperAdmin =
    !!user &&
    !!superAdminEmail &&
    user.emailAddresses?.length > 0 &&
    user.emailAddresses[0].emailAddress === superAdminEmail;

  // Branding variables
  const branding = {
    primary: platformBranding?.branding?.primary || '#2563eb',
    secondary: platformBranding?.branding?.secondary || '#4f46e5',
  };

  if (isSuperAdmin) {
    redirect("/super-admin");
  }

  return (
    <TenantBrandingProvider branding={branding}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

        {isSuperAdmin && (
          // Redirect super admin to the new dashboard
          <div className="fixed bottom-4 right-4 z-50">
            <Button asChild className="shadow-lg gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/super-admin">
                <ArrowRight className="h-4 w-4" />
                Go to Admin Dashboard
              </Link>
            </Button>
          </div>
        )}

        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {platformBranding?.logoUrl ? (
                  <div className="h-12 w-12 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={platformBranding.logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-1 overflow-hidden">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{platformBranding?.slogan || "CursorSchool"}</h1>
                  <p className="text-sm text-gray-600">Multi-Tenant School Portal</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Button asChild variant="outline">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </SignedOut>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4" variant="secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              Modern School Management
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Your School Portal
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Access your school&apos;s dashboard, manage students, track attendance, and collaborate with teachers all in one place.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>{tenants.length} Schools Online</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{tenants.length * 100}+ Students</span>
              </div>
            </div>
          </div>

          {/* Tenants Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Select Your School</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Manage student records, attendance, and academic performance in one centralized system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Teacher Portal</CardTitle>
                <CardDescription>
                  Empower teachers with tools for lesson planning, grading, and student communication.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>
                  Create and manage courses, assignments, and educational resources efficiently.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2024 CursorSchool. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TenantBrandingProvider>
  );
}

// Generate Metadata for the page
export async function generateMetadata() {
  const seo = await getPlatformSeo() as any;
  return {
    title: seo?.title || "CursorSchool - Multi-Tenant School Management",
    description: seo?.description || "A powerful school management portal for students, teachers, and administrators.",
    keywords: seo?.keywords || "school, management, portal, education",
  };
}