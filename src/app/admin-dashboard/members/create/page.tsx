import { unstable_setRequestLocale } from "next-intl/server";
import MemberForm from "@/components/admin-dashboard/member-form";

export default function CreateMemberPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Member</h1>
      <MemberForm />
    </div>
  );
}
