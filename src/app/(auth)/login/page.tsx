import { LoginForm } from "@/components/login-form";
import { SignInGoogle } from "@/components/signin-google";
import { unstable_setRequestLocale } from "next-intl/server";

type LoginPageProps = {
  params: {
    locale: string;
  };
};

export default async function LoginPage({
  params: { locale },
}: LoginPageProps) {
  unstable_setRequestLocale(locale);
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <LoginForm >
        <SignInGoogle />
      </LoginForm>
    </div>
  );
}
