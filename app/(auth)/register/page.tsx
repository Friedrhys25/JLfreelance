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
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff6b9d] text-[#0d0d0d] border-3 border-[#0d0d0d] shadow-[4px_4px_0px_0px_#0d0d0d]">
                <UserPlus className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-black uppercase text-[#0d0d0d]">
                Create Account
              </h2>
              <p className="text-sm font-bold text-[#0d0d0d]">
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
                  className="absolute right-4 top-[34px] text-[#0d0d0d] transition hover:text-[#ff6b9d]"
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
                  className="absolute right-4 top-[34px] text-[#0d0d0d] transition hover:text-[#ff6b9d]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wide text-[#0d0d0d] mb-3 block">
                  Select role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-4 border-3 border-[#0d0d0d] transition-all ${
                      selectedRole === "admin"
                        ? "bg-[#ffeb3b] shadow-[6px_6px_0px_0px_#0d0d0d]"
                        : "bg-[#ffffff] shadow-[4px_4px_0px_0px_#0d0d0d] hover:shadow-[6px_6px_0px_0px_#0d0d0d]"
                    }`}
                  >
                    <Shield className="w-6 h-6 text-[#0d0d0d] mx-auto mb-2" />
                    <div className="font-black uppercase text-[#0d0d0d] text-sm">
                      Admin
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("cashier")}
                    className={`p-4 border-3 border-[#0d0d0d] transition-all ${
                      selectedRole === "cashier"
                        ? "bg-[#4fc3f7] shadow-[6px_6px_0px_0px_#0d0d0d]"
                        : "bg-[#ffffff] shadow-[4px_4px_0px_0px_#0d0d0d] hover:shadow-[6px_6px_0px_0px_#0d0d0d]"
                    }`}
                  >
                    <UserCircle className="w-6 h-6 text-[#0d0d0d] mx-auto mb-2" />
                    <div className="font-black uppercase text-[#0d0d0d] text-sm">
                      Cashier
                    </div>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm font-bold text-[#0d0d0d]">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 border-3 border-[#0d0d0d] accent-[#ff6b9d]"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link className="text-[#ff6b9d] hover:underline" href="#">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link className="text-[#ff6b9d] hover:underline" href="#">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                Create Account
              </Button>
            </form>
            <div className="mt-6 border-t-3 border-[#0d0d0d] pt-6 text-center">
              <p className="font-bold text-[#0d0d0d]">
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
        <div className="absolute inset-0 gradient-neo-accent" />
        <div className="relative z-10 mx-10 max-w-md space-y-6 text-[#0d0d0d]">
          <div className="flex h-20 w-20 items-center justify-center bg-[#ffffff] border-4 border-[#0d0d0d] shadow-[8px_8px_0px_0px_#0d0d0d]">
            <Scissors className="h-10 w-10 text-[#0d0d0d]" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Join Today
          </h2>
          <p className="text-lg font-bold text-[#0d0d0d]">
            Create your account and start managing your barbershop with
            efficiency and style.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-[#ffffff] border-3 border-[#0d0d0d] shadow-[4px_4px_0px_0px_#0d0d0d] px-4 py-3">
              <Shield className="h-5 w-5 text-[#0d0d0d]" />
              <span className="font-bold text-[#0d0d0d]">
                Role-based permissions
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#ffffff] border-3 border-[#0d0d0d] shadow-[4px_4px_0px_0px_#0d0d0d] px-4 py-3">
              <UserCircle className="h-5 w-5 text-[#0d0d0d]" />
              <span className="font-bold text-[#0d0d0d]">
                Team management
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#ffffff] border-3 border-[#0d0d0d] shadow-[4px_4px_0px_0px_#0d0d0d] px-4 py-3">
              <Lock className="h-5 w-5 text-[#0d0d0d]" />
              <span className="font-bold text-[#0d0d0d]">
                Secure authentication
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
