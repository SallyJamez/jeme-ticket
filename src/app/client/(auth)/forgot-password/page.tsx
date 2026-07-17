import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ClientForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-8 py-12">
      <ForgotPasswordForm portalLoginPath="/client" />
    </div>
  );
}
