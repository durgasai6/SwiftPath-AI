"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, MoveRight } from "lucide-react";
import { AuthShowcase } from "@/components/auth-showcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    return {
      email: submitted && !/^\S+@\S+\.\S+$/.test(email) ? "Use a valid work email address." : "",
      password: submitted && password.length < 8 ? "Password must be at least 8 characters." : ""
    };
  }, [email, password, submitted]);

  const handleLogin = async () => {
    setSubmitted(true);
    if (errors.email || errors.password) return;

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container grid min-h-screen items-center gap-10 bg-background px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-8 xl:gap-14">
      <AuthShowcase />
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-xl border-white/10 bg-surface/80">
          <CardContent className="p-8 sm:p-10">
            <div>
              <p className="section-eyebrow">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Sign in to SwiftPath</h1>
              <p className="mt-2 text-sm leading-7 text-muted">
                Access supplier intelligence, active alerts, and AI-guided mitigation recommendations.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className={cn("pl-10", errors.email && "border-danger focus-visible:ring-danger/30")}
                  />
                </div>
                {errors.email ? <p className="text-sm text-danger">{errors.email}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={cn("pl-10 pr-12", errors.password && "border-danger focus-visible:ring-danger/30")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="text-sm text-danger">{errors.password}</p> : null}
              </div>

              <Button className="w-full" onClick={handleLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
                <MoveRight className="h-4 w-4" />
              </Button>

              <Button variant="secondary" className="w-full">
                Sign in with Google
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted">
              New to SwiftPath?{" "}
              <Link href="/signup" className="font-semibold text-primary">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

