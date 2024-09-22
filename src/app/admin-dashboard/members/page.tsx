import { getMemberData } from "@/actions/memberActions";
import MemberDashboard from "@/components/admin-dashboard/members-info";
import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  unstable_setRequestLocale(locale);

  const { members, currentPage, totalPages } = await getMemberData(
    searchParams
  );

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <MemberDashboard
        members={members ?? []}
        currentPage={currentPage ?? 1}
        totalPages={totalPages ?? 1}
      />
    </Suspense>
  );
}
