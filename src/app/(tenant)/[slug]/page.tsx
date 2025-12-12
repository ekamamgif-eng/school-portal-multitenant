import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { tenants } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getTenantBranding } from "@/lib/actions/branding";
import { TenantBrandingProvider } from "@/components/branding/TenantBrandingProvider";
import { BrandingEditDialog } from "@/components/branding/BrandingEditDialog";

// Fallback/Default configuration
const defaultTenantConfig = {
  theme: {
    primary: "from-blue-600 to-cyan-600",
    secondary: "from-blue-50 to-cyan-50",
    accent: "bg-blue-600",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
  },
  info: {
    type: "School",
    established: "2024",
    location: "Location",
    phone: "+1 234 567 890",
    email: "info@school.edu",
    website: "www.school.edu"
  },
  stats: {
    students: 100,
    teachers: 10,
    classes: 5,
    achievements: 0
  },
  features: [
    {
      icon: BookOpen,
      title: "Digital Learning",
      description: "Interactive online courses and resources"
    },
    {
      icon: Users,
      title: "Community",
      description: "Active parent-teacher collaboration"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Advanced placement and honors courses"
    }
  ],
  highlights: [
    "🏆 Excellence in Education",
    "📚 Comprehensive Curriculum",
    "🎨 Creative Arts Programs"
  ]
};

// SEO Metadata Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await getTenantBranding(slug);
  const seo = tenant?.seo as any;

  return {
    title: seo?.title || `${tenant?.name || slug} - School Portal`,
    description: seo?.description || `Welcome to the official portal for ${tenant?.name || slug}.`,
    keywords: seo?.keywords || "school, education, portal, student, teacher",
    // OpenGraph
    openGraph: {
      title: seo?.title || tenant?.name,
      description: seo?.description,
      images: tenant?.logoUrl ? [tenant.logoUrl] : [],
    }
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await currentUser();
  const { orgId, orgRole, userId } = await auth();

  // Fetch Tenant Data from DB
  let tenant = await getTenantBranding(slug);

  // ... (rest of the logic) ...

  const isTenantAdmin = !!(user && tenant && orgId === tenant.id && (orgRole === 'org:admin' || orgRole === 'org:creator')); // Adjust roles as needed

  // ... (branding logic) ...
  const branding = tenant?.branding as any || {};
  const primaryColor = branding.primary || '#2563eb';
  const secondaryColor = branding.secondary || '#eff6ff';

  const config = {
    ...defaultTenantConfig,
    info: { ...defaultTenantConfig.info, type: tenant?.slogan || defaultTenantConfig.info.type },
  };

  const logoUrl = tenant?.logoUrl || "https://placehold.co/200x200?text=School+Logo";
  const schoolName = tenant?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const initials = schoolName.slice(0, 2).toUpperCase();

  return (
    <TenantBrandingProvider branding={branding}>
      <div className="min-h-screen bg-gradient-to-br from-[var(--secondary)]/50 to-[var(--primary)]/5">

        {/* Admin Edit Trigger */}
        {isTenantAdmin && tenant && (
          <BrandingEditDialog
            tenantId={tenant.id}
            currentData={{
              logoUrl: tenant.logoUrl || '',
              slogan: tenant.slogan || '',
              branding: tenant.branding,
              seo: tenant.seo, // Pass SEO data
            }}
          />
        )}

        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={schoolName} className="h-12 w-auto object-contain" />
                ) : (
                  <Avatar className="h-12 w-12 border-2 border-[var(--primary)]">
                    <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h1 className="text-xl font-bold capitalize text-foreground">{schoolName}</h1>
                  <p className="text-sm text-muted-foreground">{config.info.type}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {user ? (
                  <Button asChild className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-90">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-90">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80" variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {config.info.location}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Welcome to {schoolName}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {tenant?.slogan || "Empowering the next generation of leaders"}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-[var(--primary)]" />
                  <div className="text-2xl font-bold">{config.stats.students}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-[var(--primary)]" />
                  <div className="text-2xl font-bold">{config.stats.teachers}</div>
                  <div className="text-sm text-muted-foreground">Teachers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-[var(--primary)]" />
                  <div className="text-2xl font-bold">{config.stats.classes}</div>
                  <div className="text-sm text-muted-foreground">Classes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-[var(--primary)]" />
                  <div className="text-2xl font-bold">{config.stats.achievements}</div>
                  <div className="text-sm text-muted-foreground">Awards</div>
                </CardContent>
              </Card>
            </div>

            <Button asChild size="lg" className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-90">
              <Link href="/sign-in">Access Student Portal →</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Our Programs & Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {config.features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-[var(--secondary)] flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <Card className="bg-[var(--secondary)]/10 border-2 border-[var(--secondary)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--primary)]" />
                Recent Achievements & Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-[var(--primary)] mt-2"></div>
                    <p className="text-sm">{highlight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{config.info.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{config.info.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{config.info.website}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start hover:text-[var(--primary)] hover:border-[var(--primary)]" asChild>
                  <Link href="/sign-in">
                    <Users className="h-4 w-4 mr-2" />
                    Student Portal
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start hover:text-[var(--primary)] hover:border-[var(--primary)]" asChild>
                  <Link href="/sign-in">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Teacher Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </TenantBrandingProvider>
  );
}