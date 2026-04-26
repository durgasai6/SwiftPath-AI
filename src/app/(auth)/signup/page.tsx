"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, MoveRight, UserRound } from "lucide-react";
import { AuthShowcase } from "@/components/auth-showcase";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    return {
      fullName: submitted && form.fullName.trim().length < 2 ? "Add your full name." : "",
      companyName: submitted && form.companyName.trim().length < 2 ? "Add your company name." : "",
      email: submitted && !/^\S+@\S+\.\S+$/.test(form.email) ? "Use a valid work email." : "",
      password: submitted && form.password.length < 8 ? "Password must be at least 8 characters." : "",
      confirmPassword:
        submitted && form.confirmPassword !== form.password ? "Passwords do not match." : "",
      terms: submitted && !form.terms ? "You need to accept the terms to continue." : ""
    };
  }, [form, submitted]);

  const handleSignup = async () => {
    setSubmitted(true);
    if (Object.values(errors).some(e => e)) return;

    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          companyName: form.companyName,
          email: form.email,
          password: form.password
        })
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json().catch(() => null);
        setServerError(data?.error ?? "Signup failed.");
      }
    } catch (error) {
      setServerError("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container grid min-h-screen items-center gap-10 bg-background px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-8 xl:gap-14">
      <AuthShowcase />
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl border-white/10 bg-surface/80">
          <CardContent className="p-8 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">Start free</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Create your SwiftPath workspace</h1>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={cn("h-2.5 w-14 rounded-full", step === 1 ? "bg-primary" : "bg-white/10")} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">
              Set up your company workspace, invite your team later, and start monitoring supplier exposure immediately.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="full-name"
                    className={cn("pl-10", errors.fullName && "border-danger focus-visible:ring-danger/30")}
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                {errors.fullName ? <p className="text-sm text-danger">{errors.fullName}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  className={cn(errors.companyName && "border-danger focus-visible:ring-danger/30")}
                  value={form.companyName}
                  onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                  placeholder="Your company"
                />
                {errors.companyName ? <p className="text-sm text-danger">{errors.companyName}</p> : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="signup-email"
                    className={cn("pl-10", errors.email && "border-danger focus-visible:ring-danger/30")}
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email ? <p className="text-sm text-danger">{errors.email}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    className={cn("pl-10 pr-12", errors.password && "border-danger focus-visible:ring-danger/30")}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="text-sm text-danger">{errors.password}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className={cn("pl-10 pr-12", errors.confirmPassword && "border-danger focus-visible:ring-danger/30")}
                    value={form.confirmPassword}
                    onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="text-sm text-danger">{errors.confirmPassword}</p> : null}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                checked={form.terms}
                onCheckedChange={(checked) => setForm((current) => ({ ...current, terms: Boolean(checked) }))}
                aria-label="Accept terms"
              />
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  I agree to the SwiftPath terms and understand this workspace will be used for supplier monitoring.
                </p>
                {errors.terms ? <p className="text-sm text-danger">{errors.terms}</p> : null}
              </div>
            </div>

            <Button className="mt-8 w-full" onClick={handleSignup} disabled={loading}>
              {loading ? "Creating..." : "Create workspace"}
              <MoveRight className="h-4 w-4" />
            </Button>

            {serverError ? <p className="mt-4 text-sm text-danger">{serverError}</p> : null}

            <p className="mt-8 text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
