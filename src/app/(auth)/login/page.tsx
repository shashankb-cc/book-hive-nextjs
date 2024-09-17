import { LoginForm } from "@/components/login-form";
import { SignInGoogle } from "@/components/signin-google";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <LoginForm>{SignInGoogle()}</LoginForm>
    </div>
  );
}
