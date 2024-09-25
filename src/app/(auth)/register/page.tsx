import { RegisterForm } from "@/components/register-form";
import { SignInGoogle } from "@/components/signin-google";
import { unstable_setRequestLocale } from "next-intl/server";

type RegisterPageProps = {
  params: {
    locale: string;
  };
};

export default function RegisterPage({
  params: { locale },
}: RegisterPageProps) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <RegisterForm>
        <SignInGoogle />
      </RegisterForm>
    </div>
  );
}
