import { currentUser, clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { tenants } from "@/lib/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import Link from "next/link";

// Tenant-specific configurations
const tenantConfigs: Record<string, {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
  info: {
    type: string;
    established: string;
    location: string;
    phone: string;
    email: string;
    website: string;
  };
  stats: {
    students: number;
    teachers: number;
    classes: number;
    achievements: number;
  };
  features: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
  highlights: string[];
}> = {
  demo: {
    theme: {
      primary: "from-blue-600 to-cyan-600",
      secondary: "from-blue-50 to-cyan-50",
      accent: "bg-blue-600",
      gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
    },
    info: {
      type: "Demo School",
      established: "2024",
      location: "Jakarta, Indonesia",
      phone: "+62 21 1234 5678",
      email: "info@demo.school",
      website: "www.demo.school"
    },
    stats: {
      students: 450,
      teachers: 32,
      classes: 24,
      achievements: 15
    },
    features: [
      {
        icon: BookOpen,
        title: "Digital Learning",
        description: "Interactive online courses and resources"
      },
      {
        icon: Award,
        title: "Excellence Programs",
        description: "Advanced placement and honors courses"
      },
      {
        icon: Users,
        title: "Community",
        description: "Active parent-teacher collaboration"
      }
    ],
    highlights: [
      "🏆 National Science Competition Winner 2024",
      "📚 Digital Library with 10,000+ Books",
      "🎨 State-of-the-art Art & Music Studios"
    ]
  },
  smpn1: {
    theme: {
      primary: "from-emerald-600 to-teal-600",
      secondary: "from-emerald-50 to-teal-50",
      accent: "bg-emerald-600",
      gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
    },
    info: {
      type: "State Junior High School",
      established: "1985",
      location: "Jakarta Pusat, DKI Jakarta",
      phone: "+62 21 3456 7890",
      email: "admin@smpn1-jakarta.sch.id",
      website: "www.smpn1-jakarta.sch.id"
    },
    stats: {
      students: 680,
      teachers: 48,
      classes: 32,
      achievements: 28
    },
    features: [
      {
        icon: TrendingUp,
        title: "Academic Excellence",
        description: "Top 10 ranking in national exams"
      },
      {
        icon: Globe,
        title: "International Programs",
        description: "Exchange programs with partner schools"
      },
      {
        icon: Award,
        title: "Sports Champions",
        description: "Multiple regional sports titles"
      }
    ],
    highlights: [
      "🥇 Best Junior High School in Jakarta 2023",
      "🌍 Sister School Program with 5 Countries",
      "💻 Full Computer Lab & Coding Classes"
    ]
  },
  sdn1: {
    theme: {
      primary: "from-amber-600 to-orange-600",
      secondary: "from-amber-50 to-orange-50",
      accent: "bg-amber-600",
      gradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
    },
    info: {
      type: "State Elementary School",
      established: "1978",
      location: "Bandung, Jawa Barat",
      phone: "+62 22 2345 6789",
      email: "sdn1@bandung.sch.id",
      website: "www.sdn1-bandung.sch.id"
    },
    stats: {
      students: 320,
      teachers: 24,
      classes: 18,
      achievements: 12
    },
    features: [
      {
        icon: Users,
        title: "Character Building",
        description: "Focus on moral and ethical development"
      },
      {
        icon: BookOpen,
        title: "Reading Program",
        description: "Daily reading activities for all grades"
      },
      {
        icon: Award,
        title: "Creative Arts",
        description: "Music, dance, and visual arts programs"
      }
    ],
    highlights: [
      "🎭 Annual Cultural Festival",
      "📖 Literacy Champion School 2024",
      "🌳 Green School Award Winner"
    ]
  },
  smpn2: {
    theme: {
      primary: "from-purple-600 to-pink-600",
      secondary: "from-purple-50 to-pink-50",
      accent: "bg-purple-600",
      gradient: "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
    },
    info: {
      type: "State Junior High School",
      established: "1990",
      location: "Surabaya, Jawa Timur",
      phone: "+62 31 3456 7890",
      email: "info@smpn2-surabaya.sch.id",
      website: "www.smpn2-surabaya.sch.id"
    },
    stats: {
      students: 520,
      teachers: 38,
      classes: 28,
      achievements: 22
    },
    features: [
      {
        icon: TrendingUp,
        title: "STEM Excellence",
        description: "Advanced science and technology programs"
      },
      {
        icon: Globe,
        title: "Language Center",
        description: "English, Mandarin, and Japanese courses"
      },
      {
        icon: Award,
        title: "Innovation Lab",
        description: "Robotics and coding workshops"
      }
    ],
    highlights: [
      "🤖 Robotics Competition National Champions",
      "🔬 Science Olympiad Gold Medalists",
      "🎯 100% University Acceptance Rate"
    ]
  }
};

export default async function TenantDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await currentUser();

  // Get tenant configuration
  const config = tenantConfigs[slug] || tenantConfigs.demo;
  const initials = slug.toUpperCase().slice(0, 2);

  if (!user) {
    return (
      <div className={`min-h-screen ${config.theme.gradient}`}>
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback className={`bg-gradient-to-br ${config.theme.primary} text-white font-bold`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold capitalize">{slug.replace(/(\d+)/, ' $1')}</h1>
                  <p className="text-sm text-muted-foreground">{config.info.type}</p>
                </div>
              </div>
              <Button asChild className={config.theme.accent}>
                <Link href="/sign-in">Sign In with Clerk</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {config.info.location}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to {slug.toUpperCase().replace(/(\d+)/, ' $1')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {config.info.type} • Established {config.info.established}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className={`h-8 w-8 mx-auto mb-2 text-primary`} />
                  <div className="text-2xl font-bold">{config.stats.students}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{config.stats.teachers}</div>
                  <div className="text-sm text-muted-foreground">Teachers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{config.stats.classes}</div>
                  <div className="text-sm text-muted-foreground">Classes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{config.stats.achievements}</div>
                  <div className="text-sm text-muted-foreground">Awards</div>
                </CardContent>
              </Card>
            </div>

            <Button asChild size="lg" className={config.theme.accent}>
              <Link href="/sign-in">Access Dashboard →</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Our Programs & Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {config.features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${config.theme.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <Card className={`${config.theme.gradient} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements & Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full ${config.theme.accent} mt-2`}></div>
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
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{config.info.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sign-in">
                    <Users className="h-4 w-4 mr-2" />
                    Student Portal
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sign-in">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Teacher Portal
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sign-in">
                    <Calendar className="h-4 w-4 mr-2" />
                    Academic Calendar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  const { orgId } = await auth();
  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Organization Required</CardTitle>
            <CardDescription>Please select or create a school organization to continue.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Auto-create tenant record if missing (first login)
  let tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, orgId as any),
  });

  if (!tenant) {
    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ organizationId: orgId });
    [tenant] = await db.insert(tenants).values({
      id: orgId,
      name: org.name,
      slug: org.slug || org.name.toLowerCase().replace(/\s+/g, "-"),
    }).returning();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to {tenant?.name}</h1>
      <p className="text-gray-600 mt-2">Your school is live at: <strong>{tenant?.slug}.local.cursorschool.test:3000</strong></p>
      <div className="mt-8">
        <a href="/dashboard" className="text-blue-600 hover:underline">Go to Admin Dashboard →</a>
      </div>
    </div>
  );
}