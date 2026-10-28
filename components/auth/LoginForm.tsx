"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { ChefHat, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  error?: string;
  callbackUrl?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  Default: "Something went wrong. Please try again.",
};

export default function LoginForm({ error, callbackUrl }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    error ? (ERROR_MESSAGES[error] || ERROR_MESSAGES.Default) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setFormError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setFormError(ERROR_MESSAGES[result.error] || ERROR_MESSAGES.Default);
      setIsLoading(false);
      return;
    }

    router.push(callbackUrl || "/admin");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-tomato-700 mb-4">
          <ChefHat className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          Staff Login
        </h1>
        <p className="text-charcoal-300 text-sm">
          Belle Food — Administration
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {formError && (
            <div className="flex gap-2 p-3 rounded-xl bg-tomato-50 border border-tomato-200">
              <AlertCircle className="w-4 h-4 text-tomato-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-tomato-700">{formError}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="staff@bellefood.ng"
              className={`form-input ${errors.email ? "border-tomato-400" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`form-input pr-10 ${errors.password ? "border-tomato-400" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center mt-2"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-charcoal-100 text-center">
          <Link
            href="/"
            className="text-xs text-charcoal-400 hover:text-charcoal-600 transition-colors"
          >
            ← Back to Belle Food website
          </Link>
        </div>
      </div>
    </div>
  );
}
