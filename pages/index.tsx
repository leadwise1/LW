import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Brain,
  FileText,
  Download,
  Sparkles,
  BookOpenCheck,
  Target,
  Copy,
  Check,
  BarChart3,
  Layers,
  ShieldCheck,
  CalendarClock,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";
import Head from "next/head";

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <div className="mb-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-gray-600">{subtitle}</p>}
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function TypingLine() {
  const phrases = [
    "Analyzing job description…",
    "Crafting professional summary…",
    "Optimizing for ATS systems…",
    "Highlighting key achievements…",
  ];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timer: number;
    const tick = () => {
      const current = phrases[index % phrases.length];
      const step = deleting ? -1 : 1;
      const next = current.slice(0, text.length + step);
      setText(next);
      const atEnd = next === current;
      const atStart = next.length === 0;
      let delay = deleting ? 40 : 60;
      if (atEnd && !deleting) {
        delay = 900;
        setDeleting(true);
      } else if (atStart && deleting) {
        delay = 350;
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, [index, text, deleting, phrases]);

  return (
    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />
      <span className="font-mono">{text}</span>
    </div>
  );
}

export default function Index() {
  const [profile, setProfile] = useState("");
  const [job, setJob] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!profile.trim() || !job.trim()) {
      setError("Please fill in both profile and job description");
      return;
    }

    try {
      setLoading(true);
      setGenerated(null);
      setProvider(null);
      setError(null);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profile.trim(),
          job: job.trim(),
          temperature: 0.7,
          maxTokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.text) {
        setGenerated(data.text);
        setProvider(data.provider || "AI");
      } else {
        throw new Error("No content generated");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate resume content");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (generated) {
      try {
        await navigator.clipboard.writeText(generated);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const isFormValid = profile.trim().length >= 40 && job.trim().length >= 60;

  return (
    <>
      <Head>
        <title>Coach LeoWise - AI-Powered Resume Builder</title>
        <meta name="description" content="Create ATS-optimized resumes with AI-powered career coaching" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs text-gray-700 backdrop-blur">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              AI-Powered Career Coaching
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Unlock Your Career Potential with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Coach LeoWise
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Revolutionize your job search and career growth with personalized AI guidance 
              and expert human support. Create ATS-friendly resumes that get results.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500"
                onClick={() => document.getElementById('ai-generator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Building Resume
              </Button>
              <Button size="lg" variant="outline">
                View Templates
              </Button>
            </div>
            <TypingLine />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Key Features"
            title="Everything you need to land your dream job"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Brain}
              title="AI Content Generation"
              desc="Get personalized suggestions for every section of your resume"
            />
            <Feature
              icon={FileText}
              title="Professional Templates"
              desc="Choose from modern, ATS-friendly templates designed by experts"
            />
            <Feature
              icon={Download}
              title="Instant Export"
              desc="Download your resume as PDF or Word document in seconds"
            />
            <Feature
              icon={Target}
              title="ATS Optimization"
              desc="Mirror job language to increase compatibility with applicant tracking systems"
            />
            <Feature
              icon={ShieldCheck}
              title="Bias Detection"
              desc="Advanced algorithms ensure your applications are free from unconscious bias"
            />
            <Feature
              icon={BarChart3}
              title="Performance Analytics"
              desc="Track your application success rates and optimize your approach"
            />
          </div>
        </div>
      </section>

      {/* AI Generator Section */}
      <section
        id="ai-generator"
        className="relative overflow-hidden border-y bg-gradient-to-b from-white to-indigo-50/40 py-20 sm:py-24"
      >
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="AI Resume Generator"
            title="Generate a personalized resume snippet"
            subtitle="Enter your profile and target job description to get AI-powered content suggestions."
          />
          
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Your Profile / Experience
                </label>
                <Textarea
                  placeholder="Describe your professional background, key skills, and notable achievements. Be specific about your experience, technologies you've worked with, and measurable outcomes you've delivered..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="min-h-[140px]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 40 characters. Include skills, experience, and quantifiable achievements.
                </p>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Target Job Description
                </label>
                <Textarea
                  placeholder="Paste the complete job description including responsibilities, required skills, qualifications, and company information. The more detailed, the better the AI can tailor your resume..."
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="min-h-[140px]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 60 characters. Include responsibilities, requirements, and preferred qualifications.
                </p>
              </div>
              
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={onGenerate}
                  disabled={loading || !isFormValid}
                  className={cn(
                    "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500",
                    loading && "opacity-80"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Resume Content"
                  )}
                </Button>
                {provider && (
                  <Badge variant="secondary" className="text-xs">
                    Powered by {provider}
                  </Badge>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-1">
              <div className="h-full rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Generated Content</div>
                  {generated && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onCopy}
                      className="text-xs"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                  )}
                </div>
                <div className="mt-3 h-[400px] w-full overflow-auto rounded-md bg-gray-50 p-3">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                        <p className="mt-2 text-sm text-gray-600">Generating your personalized content...</p>
                      </div>
                    </div>
                  ) : generated ? (
                    <pre className="text-xs leading-6 text-gray-800 whitespace-pre-wrap">
                      {generated}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Your AI-generated resume content will appear here...</p>
                        <p className="text-xs mt-1">Fill in both fields and click Generate to start</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Why Choose Coach LeoWise"
            title="Our AI crafts compelling narratives that showcase your unique value"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={BookOpenCheck}
              title="Narrative Storytelling"
              desc="Transform your experience into compelling stories that resonate with hiring managers"
            />
            <Feature
              icon={BarChart3}
              title="Quantifiable Achievements"
              desc="AI coaching to identify and articulate measurable impact in your roles"
            />
            <Feature
              icon={Layers}
              title="Industry Customization"
              desc="Tailored content that speaks the language of your target industry and role"
            />
            <Feature
              icon={ShieldCheck}
              title="Bias Detection"
              desc="Advanced algorithms ensure your applications are free from unconscious bias"
            />
            <Feature
              icon={Target}
              title="ATS Alignment"
              desc="Mirror job language to increase compatibility with applicant tracking systems"
            />
            <Feature
              icon={CalendarClock}
              title="Faster Applications"
              desc="Accelerate your job search with reusable sections and smart autofill"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-indigo-50/40 to-white" />
        <div className="container mx-auto px-4">
          <SectionTitle
            eyebrow="Pricing"
            title="Choose the plan that fits your journey"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PricingCard
              title="Starter"
              price="$0"
              period="/mo"
              cta="Start Free"
              highlighted={false}
              features={[
                "AI content suggestions",
                "ATS-friendly templates",
                "PDF & Word export",
                "Basic resume builder",
              ]}
            />
            <PricingCard
              title="Pro"
              price="$19"
              period="/mo"
              cta="Start 14‑Day Trial"
              highlighted
              badge="Most Popular"
              features={[
                "Everything in Starter",
                "Cover letters & tailoring",
                "Application tracking dashboard",
                "Interview simulation (AI/VR)",
                "Priority support",
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              period=""
              cta="Contact Sales"
              highlighted={false}
              features={[
                "Everything in Pro",
                "SSO & advanced security",
                "Team coaching & analytics",
                "Custom templates & branding",
                "Dedicated support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px] shadow-xl">
            <div className="rounded-2xl bg-white p-8 text-center sm:p-12">
              <h3 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                Ready to Transform Your Career?
              </h3>
              <p className="mt-3 text-gray-600">
                Join thousands of professionals who have accelerated their careers
                with AI-powered insights and personalized coaching.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500"
                  onClick={() => document.getElementById('ai-generator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Try AI Generator Now
                </Button>
                <Button size="lg" variant="outline">
                  Book Demo
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                <Badge variant="secondary">Free to Try</Badge>
                <Badge variant="secondary">No Credit Card Required</Badge>
                <Badge variant="secondary">Expert Support 24/7</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingCard({
  title,
  price,
  period,
  cta,
  features,
  highlighted = false,
  badge,
}: {
  title: string;
  price: string;
  period: string;
  cta: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white p-6 shadow-sm",
        highlighted &&
          "border-transparent p-[1px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600",
      )}
    >
      <div className={cn("rounded-2xl p-5", highlighted && "bg-white")}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          {badge && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <div className="text-4xl font-extrabold tracking-tight text-gray-900">{price}</div>
          <div className="text-sm text-gray-500">{period}</div>
        </div>
        <ul className="mt-5 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-xs">
                ✓
              </span>
              <span className="text-gray-700">{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button
            className={cn(
              "w-full",
              highlighted &&
                "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500",
            )}
            variant={highlighted ? "default" : "outline"}
          >
            {cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
