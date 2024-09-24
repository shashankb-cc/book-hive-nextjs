"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from "lucide-react"; // Import Eye & EyeOff icons
import { registerSchema, type RegisterFormData } from "@/lib/zodSchema";
import { createMember } from "@/actions/memberActions";
import { useTranslations } from "next-intl";

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("RegisterPage");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const result = await createMember(undefined, formData);
      if (result.message) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          router.push(`/login`);
        }, 3000);
      } else if (result.error === "Email already exists") {
        setError("email", {
          type: "manual",
          message: t("emailAlreadyExists"),
        });
      } else {
        setServerError(result.error || t("registrationFailed"));
      }
    } catch (error) {
      setServerError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">
          {t("successTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t("successMessage")}
        </p>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                size={18}
              />
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="John"
                className="pl-10"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500 form-error">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                size={18}
              />
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Doe"
                className="pl-10"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500 form-error">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              id="email"
              {...register("email")}
              placeholder="m@example.com"
              type="email"
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
          <Label htmlFor="phone">{t("phone")}</Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1 (555) 000-0000"
              type="tel"
              className="pl-10"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 form-error">
              {errors.phone.message}
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
              {...register("password")}
              type={showPassword ? "text" : "password"} // Toggle between text and password
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
            <p className="text-sm text-red-500 form-error">
              {errors.password.message}
            </p>
          )}
        </div>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creatingAccount")}
            </>
          ) : (
            t("createAccount")
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
      <Button variant="outline" type="button" className="w-full">
        <Icons.google className="mr-2 h-4 w-4" />
        {t("google")}
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {t("haveAccount")}{" "}
        <Link
          className="font-medium text-primary hover:underline"
          href={`/login`}
        >
          {t("logIn")}
        </Link>
      </p>
    </div>
  );
}
