"use server";
import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";

export async function SignInGoogle() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <Button variant="outline" type="submit" className="w-full">
        <Icons.google className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </form>
  );
}
