"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requestResetSchema, resetPasswordSchema, type RequestResetInput, type ResetPasswordInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";

/** Shared by /agent/forgot-password and /client/forgot-password. */
export function ForgotPasswordForm({ portalLoginPath }: { portalLoginPath: string }) {
  const { requestPasswordReset, resetPassword } = useAuth();
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const requestForm = useForm<RequestResetInput>({ resolver: zodResolver(requestResetSchema) });
  const resetForm = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onRequest = async (values: RequestResetInput) => {
    setSubmitting(true);
    const ok = await requestPasswordReset(values);
    setSubmitting(false);
    if (ok) {
      setEmail(values.email);
      resetForm.setValue("email", values.email);
      toast.success("Reset token sent — check your email.");
      setStep("reset");
    } else {
      toast.error("Could not send reset token. Try again.");
    }
  };

  const onReset = async (values: ResetPasswordInput) => {
    setSubmitting(true);
    const ok = await resetPassword(values);
    setSubmitting(false);
    if (ok) {
      toast.success("Password reset. You can sign in now.");
      setStep("done");
    } else {
      toast.error("Could not reset password. Check the token and try again.");
    }
  };

  if (step === "done") {
    return (
      <div className="max-w-sm">
        <h1 className="font-display text-2xl font-bold text-ink-900">Password updated</h1>
        <p className="mt-2 text-sm text-ink-500">Your password has been reset successfully.</p>
        <Link href={portalLoginPath} className="mt-6 block">
          <Button className="w-full" size="lg">Back to sign in</Button>
        </Link>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="max-w-sm w-full">
        <h1 className="font-display text-2xl font-bold text-ink-900">Enter reset token</h1>
        <p className="mt-1.5 text-sm text-ink-500">We sent a reset token to {email}. Paste it below with your new password.</p>
        <form className="mt-8 space-y-4" onSubmit={resetForm.handleSubmit(onReset)} noValidate>
          <input type="hidden" {...resetForm.register("email")} />
          <div>
            <Label htmlFor="token">Reset token</Label>
            <Input id="token" {...resetForm.register("token")} />
            {resetForm.formState.errors.token && (
              <p className="mt-1 text-xs text-red-600">{resetForm.formState.errors.token.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" {...resetForm.register("newPassword")} />
            {resetForm.formState.errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{resetForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" {...resetForm.register("confirmPassword")} />
            {resetForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" disabled={submitting} className="w-full" size="lg">
            {submitting ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full">
      <h1 className="font-display text-2xl font-bold text-ink-900">Forgot password</h1>
      <p className="mt-1.5 text-sm text-ink-500">Enter your account email and we&apos;ll send you a reset token.</p>
      <form className="mt-8 space-y-4" onSubmit={requestForm.handleSubmit(onRequest)} noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...requestForm.register("email")} />
          {requestForm.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600">{requestForm.formState.errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? "Sending…" : "Send reset token"}
        </Button>
      </form>
      <Link href={portalLoginPath} className="mt-4 block text-center text-xs font-medium text-ink-500 hover:text-ink-700">
        Back to sign in
      </Link>
    </div>
  );
}
