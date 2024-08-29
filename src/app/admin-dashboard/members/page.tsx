import { getMemberData } from "@/actions/memberActions";
import MemberDashboard from "@/components/admin-dashboard/members-info";
import { Suspense } from "react";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { members, currentPage, totalPages } = await getMemberData(
    searchParams
  );

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <MemberDashboard
        members={members!}
        currentPage={currentPage!}
        totalPages={totalPages!}
      />
    </Suspense>
  );
}
