
import { SignedIn, SignedOut, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building2, GraduationCap, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getPlatformSeo, getPlatformBranding } from "@/lib/actions/branding";
import { PlatformSeoDialog } from "@/components/seo/PlatformSeoDialog";
import { redirect } from "next/navigation";

// Mock tenant data - in production, this would come from your database
const tenants = [
  {
    id: "demo",
    name: "Demo School",
    slug: "demo",
    description: "Explore our demo school environment",
    logo: null,
    studentCount: 450,
    teacherCount: 32,
    status: "active"
  },
  {
    id: "smpn1",
    name: "SMPN 1 Jakarta",
    slug: "smpn1",
    description: "State Junior High School 1 Jakarta",
    logo: null,
    studentCount: 680,
    teacherCount: 48,
    status: "active"
  },
  {
    id: "sdn1",
    name: "SDN 1 Bandung",
    slug: "sdn1",
    description: "State Elementary School 1 Bandung",
    logo: null,
    studentCount: 320,
    teacherCount: 24,
    status: "active"
  },
  {
    id: "smpn2",
    name: "SMPN 2 Surabaya",
    slug: "smpn2",
    description: "State Junior High School 2 Surabaya",
    logo: null,
    studentCount: 520,
    teacherCount: 38,
    status: "active"
  }
];

function TenantCard({ tenant }: { tenant: typeof tenants[0] }) {
  const initials = tenant.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`http://${tenant.slug}.local.cursorschool.test:3000`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={tenant.logo || undefined} alt={tenant.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge variant={tenant.status === "active" ? "default" : "secondary"}>
              {tenant.status}
            </Badge>
          </div>
          <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
            {tenant.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">{tenant.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{tenant.studentCount} students</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>{tenant.teacherCount} teachers</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-primary font-medium group-hover:gap-2 transition-all">
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
  const isSuperAdmin = user?.emailAddresses[0]?.emailAddress === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

  // Apply branding if exists
  const brandingStyle = platformBranding ? {
    '--primary': platformBranding.branding?.primary,
    '--primary-foreground': '#ffffff', // Simplified: assume white text on primary
    '--secondary': platformBranding.branding?.secondary,
  } as React.CSSProperties : {};

  // Auto-redirect super admin to dashboard
  if (isSuperAdmin) {
    redirect("/super-admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" style={brandingStyle}>

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
                <div className="h-12 w-12 flex items-center justify-center overflow-hidden">
                  <img src={platformBranding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
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
                <OrganizationSwitcher
                  afterCreateOrganizationUrl="/app/%s"
                  afterLeaveOrganizationUrl="/"
                />
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
            Access your school's dashboard, manage students, track attendance, and collaborate with teachers all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>{tenants.length} Schools Online</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{tenants.reduce((acc, t) => acc + t.studentCount, 0)}+ Students</span>
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