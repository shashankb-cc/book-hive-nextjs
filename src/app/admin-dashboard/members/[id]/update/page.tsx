import { unstable_setRequestLocale } from "next-intl/server";
import MemberForm from "@/components/admin-dashboard/member-form";
import { getMemberById } from "@/actions/memberActions";

export default async function UpdateMemberPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  unstable_setRequestLocale(locale);
  const member = await getMemberById(parseInt(id));

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Member</h1>
      <MemberForm member={member} />
    </div>
  );
}
