"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react"; // Import Eye & EyeOff Icons
import { loginSchema, type LoginFormData } from "@/lib/zodSchema";
import { useFormState } from "react-dom";
import { authenticate } from "@/actions/authActions";
import { useTranslations } from "next-intl";

type LoginFormProps = {
  children: React.ReactNode;
};

export function LoginForm({ children }: LoginFormProps) {
  const t = useTranslations("LoginPage");
  const [state, formAction] = useFormState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formAction(formData);
  });

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              id="email"
              placeholder="m@example.com"
              {...register("email")}
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 form-error">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              {...register("password")}
              className="pl-10 pr-10"
              placeholder="**********"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} {/* Eye toggle */}
            </div>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signingIn")}
            </>
          ) : (
            t("signIn")
          )}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            {t("or")}
          </span>
        </div>
      </div>
      <div className="">{children}</div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {t("noAccount")}{" "}
        <Link className="font-medium text-primary hover:underline" href={`/register`}>
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
