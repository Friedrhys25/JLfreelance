"use client";

import Link from "next/link";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import {
  Scissors,
  UserCircle,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-(--border) bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand) text-white shadow-(--shadow)">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-(--text)">
              Barbershop POS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        <div className="pointer-events-none absolute -top-16 right-6 h-72 w-72 rounded-full bg-gray-200/40 blur-3xl" />
        <div className="pointer-events-none absolute left-6 top-40 h-60 w-60 rounded-full bg-green-200/40 blur-3xl" />

        <section className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-white/70 px-4 py-2 text-xs font-semibold text-(--muted)">
              <Sparkles className="h-4 w-4" />
              Module 1: User and Role Management
            </span>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-(--text) md:text-6xl">
              A modern POS platform built for high-volume barbershops.
            </h1>
            <p className="text-lg text-(--muted)">
              Streamline checkout, track service-level revenue, and keep every
              shift aligned with role-based access control.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login">
                <Button variant="primary" size="lg" className="group">
                  Proceed to Login
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <Card variant="gradient" className="relative overflow-hidden">
              <div className="space-y-5">
                <div className="flex items-center gap-4 rounded-2xl border border-(--border) bg-white/80 px-4 py-4">
                  <UserCircle className="h-12 w-12 text-(--brand)" />
                  <div>
                    <h3 className="text-xl font-semibold text-(--text)">
                      Welcome back
                    </h3>
                    <p className="text-sm text-(--muted)">
                      Select a role to continue your shift
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl border border-(--border) bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-(--text)" />
                      <span className="text-sm font-semibold text-(--text)">
                        Admin access
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-(--muted)" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-(--border) bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-5 w-5 text-(--text)" />
                      <span className="text-sm font-semibold text-(--text)">
                        Cashier access
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-(--muted)" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-semibold text-(--text)">
              Core features for busy teams
            </h2>
            <p className="mt-3 text-(--muted)">
              Everything you need to run the floor with confidence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card hover className="animate-fade-up">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-(--text)">
                Role-based access
              </h3>
              <p className="mt-2 text-sm text-(--muted)">
                Define permissions for admins and cashiers with confidence.
              </p>
            </Card>

            <Card hover className="animate-fade-up stagger-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-(--text)">
                Fast checkout flows
              </h3>
              <p className="mt-2 text-sm text-(--muted)">
                Keep lines moving with a streamlined POS experience.
              </p>
            </Card>

            <Card hover className="animate-fade-up stagger-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-(--text)">
                Revenue tracking
              </h3>
              <p className="mt-2 text-sm text-(--muted)">
                Monitor service performance and daily revenue in real time.
              </p>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20 pt-6">
          <Card variant="gradient" className="py-12 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <Sparkles className="mx-auto h-10 w-10 text-(--brand)" />
              <h2 className="text-4xl font-semibold text-(--text)">
                Ready to get started?
              </h2>
              <p className="text-(--muted)">
                Join the modern barbershop management system built for
                efficiency and growth.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Login to Existing Account
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="lg">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-(--border) bg-white/70">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-(--muted) md:flex-row">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-(--brand)" />
            <span>Barbershop POS</span>
          </div>
          <span>© 2026 Barbershop POS System. Module 1 - User and Role Management.</span>
        </div>
      </footer>
    </div>
  );
}

