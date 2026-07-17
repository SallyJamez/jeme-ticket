"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";

/**
 * Landing page for the link emailed during client onboarding:
 * /client/reset-password?email=...&token=...
 * Middleware (src/middleware.ts) already guarantees both params are present
 * before this page renders — it redirects to /client otherwise.
 */
export default function ClientResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, token, newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setSubmitting(true);
    const ok = await resetPassword(values);
    setSubmitting(false);
    if (ok) {
      toast.success("Password set. You can sign in now.");
      setDone(true);
    } else {
      toast.error("This link may have expired. Request a new one.");
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-8">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-2xl font-bold text-ink-900">Password set</h1>
          <p className="mt-2 text-sm text-ink-500">Your account is ready. Sign in with your new password.</p>
          <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/client")}>
            Go to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-8 py-12">
      <div className="max-w-sm w-full">
        <h1 className="font-display text-2xl font-bold text-ink-900">Set your password</h1>
        <p className="mt-1.5 text-sm text-ink-500">Finish setting up {email}.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register("email")} />
          <input type="hidden" {...register("token")} />

          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
            {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={submitting} className="w-full" size="lg">
            {submitting ? "Setting password…" : "Set password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
