"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { Scissors, Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500" />
        <div className="absolute inset-0 opacity-20" />
        <div className="relative z-10 mx-10 max-w-md space-y-6 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 shadow-(--shadow)">
            <Scissors className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome back to your barbershop workspace.
          </h1>
          <p className="text-sm text-white/80">
            Sign in to review revenue, manage services, and coordinate every
            shift in one place.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              Secure access
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              Real-time reporting
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              Shift handoffs
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              Service insights
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-(--muted)">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-(--brand)">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-(--text)">
                Sign in
              </h2>
              <p className="text-sm text-(--muted)">
                Use your credentials to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email address"
                placeholder="name@barbershop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-5 w-5" />}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-5 w-5" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[34px] text-(--muted) transition hover:text-(--text)"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-(--muted)">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-(--border) accent-[var(--brand)]"
                  />
                  Remember me
                </label>
                <Link href="#" className="text-(--brand) hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Sign In
              </Button>
            </form>

            <div className="mt-6 border-t border-(--border) pt-6 text-center text-sm text-(--muted)">
              Don&apos;t have an account?
              <div className="mt-3">
                <Link href="/register">
                  <Button variant="outline" size="md">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

