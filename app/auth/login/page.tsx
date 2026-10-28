import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  description: "Belle Food staff and admin login.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; callbackUrl?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center px-4 py-12">
      <LoginForm
        error={searchParams.error}
        callbackUrl={searchParams.callbackUrl}
      />
    </div>
  );
}
