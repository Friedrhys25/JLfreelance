"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import {
  Scissors,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  UserCircle,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "cashier">(
    "cashier"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register attempt:", { ...formData, role: selectedRole });
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          <Card className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 border-2 border-gray-800 shadow-[4px_4px_0px_0px_#171717]">
                <UserPlus className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold uppercase text-(--text)">
                Create Account
              </h2>
              <p className="text-sm font-medium text-(--text)">
                Join the Barbershop POS system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Full name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                icon={<User className="w-5 h-5" />}
                required
              />

              <Input
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  icon={<Lock className="w-5 h-5" />}
                  required
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

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-8.5 text-(--muted) transition hover:text-(--text)"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wide text-(--text) mb-3 block">
                  Select role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-4 border-2 border-gray-800 transition-all ${
                      selectedRole === "admin"
                        ? "bg-gray-200 shadow-[6px_6px_0px_0px_#171717]"
                        : "bg-white shadow-[4px_4px_0px_0px_#171717] hover:shadow-[6px_6px_0px_0px_#171717]"
                    }`}
                  >
                    <Shield className="w-6 h-6 text-(--text) mx-auto mb-2" />
                    <div className="font-bold uppercase text-(--text) text-sm">
                      Admin
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("cashier")}
                    className={`p-4 border-2 border-gray-800 transition-all ${
                      selectedRole === "cashier"
                        ? "bg-green-200 shadow-[6px_6px_0px_0px_#171717]"
                        : "bg-white shadow-[4px_4px_0px_0px_#171717] hover:shadow-[6px_6px_0px_0px_#171717]"
                    }`}
                  >
                    <UserCircle className="w-6 h-6 text-(--text) mx-auto mb-2" />
                    <div className="font-bold uppercase text-(--text) text-sm">
                      Cashier
                    </div>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm font-medium text-(--text)">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 border-2 border-gray-800 accent-gray-600"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link className="text-gray-600 hover:underline" href="#">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link className="text-gray-600 hover:underline" href="#">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Create Account
              </Button>
            </form>
            <div className="mt-6 border-t-2 border-gray-800 pt-6 text-center">
              <p className="font-medium text-(--text)">
                Already have an account?
              </p>
              <div className="mt-3">
                <Link href="/login">
                  <Button variant="primary" size="md">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-gray-700 via-gray-600 to-gray-500" />
        <div className="relative z-10 mx-10 max-w-md space-y-6 text-white">
          <div className="flex h-20 w-20 items-center justify-center bg-white border-2 border-gray-800 shadow-[8px_8px_0px_0px_#171717]">
            <Scissors className="h-10 w-10 text-gray-800" />
          </div>
          <h2 className="text-4xl font-bold uppercase tracking-tight">
            Join Today
          </h2>
          <p className="text-lg font-medium text-white">
            Create your account and start managing your barbershop with
            efficiency and style.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-800 shadow-[4px_4px_0px_0px_#171717] px-4 py-3">
              <Shield className="h-5 w-5 text-gray-800" />
              <span className="font-medium text-gray-800">
                Role-based permissions
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-gray-800 shadow-[4px_4px_0px_0px_#171717] px-4 py-3">
              <UserCircle className="h-5 w-5 text-gray-800" />
              <span className="font-medium text-gray-800">
                Team management
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-gray-800 shadow-[4px_4px_0px_0px_#171717] px-4 py-3">
              <Lock className="h-5 w-5 text-gray-800" />
              <span className="font-medium text-gray-800">
                Secure authentication
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
