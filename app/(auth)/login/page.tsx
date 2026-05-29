"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { useAuth } from "@/app/contexts/AuthContext";
import { Scissors, Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(username, password);

    if (!success) {
      setError("Invalid username or password. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Side - Decorative */}
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-gray-700 via-gray-600 to-gray-500" />
        <div className="absolute inset-0 opacity-20" />
        <div className="relative z-10 mx-10 max-w-md space-y-6 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
            <Scissors className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome back to your barbershop workspace.
          </h1>
          <p className="text-sm text-white/80">
            Sign in to manage services, track transactions, and coordinate every shift.
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

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-(--muted)">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-(--text)">
                Sign in
              </h2>
              <p className="text-sm text-(--muted)">
                Use your credentials to access the dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="h-5 w-5" />}
                required
                autoComplete="username"
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-8.5 text-(--muted) transition hover:text-(--text)"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

          </Card>
        </div>
      </div>
    </div>
  );
}
