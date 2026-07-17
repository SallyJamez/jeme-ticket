"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Input, Label } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import Image from "next/image";
import logo from "@/assets/icons/logo.png";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";

export default function ClientLoginPage() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    const ok = await login(values, "/client/dashboard");
    setSubmitting(false);
    if (!ok) toast.error("Invalid email or password.");
  };

  return (
    <div className="flex flex-col justify-center items-center px-8 py-12 sm:px-16 bg-ink-50">
      <div className="mb-10 flex items-center gap-2.5">
        <Image src={logo} alt="Logo" className="h-20 w-fit" />
      </div>

      <div className="max-w-sm w-full">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Client Portal
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Sign in to raise tickets and track your service requests.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <Label htmlFor="userName">Email</Label>
            <div className="relative">
              <Mail
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <Input
                id="userName"
                type="text"
                placeholder="you@company.com"
                className="pl-9"
                {...register("userName")}
              />
            </div>
            {errors.userName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/client/forgot-password"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full"
            size="lg"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
