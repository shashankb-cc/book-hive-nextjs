import { Suspense } from "react";
import ProfessorList from "@/components/dashboard/professor-list";
import ProfessorListSkeleton from "@/components/skeletons/professor-list-skeleton";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { getUserDetails } from "@/actions/memberActions";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { getProfessors } from "@/actions/professorActions";

export default async function ProfessorsPage() {
  const t = await getTranslations("ProfessorList");
  const session = await auth();
  const user = await getUserDetails(session);
  if ("error" in user) {
    return;
  }

  // Fetch professors data in the server component
  const professors = await getProfessors();
  if ("error" in professors) {
    return;
  }
  console.log("profbhai", professors);

  return (
    <div className="container mx-auto py-8">
      <TopNavbar userCredits={user.credits} />
      <h1 className="text-3xl font-bold mb-6">{t("ourProfessor")}</h1>
      <Suspense fallback={<ProfessorListSkeleton />}>
        <ProfessorList
          initialProfessors={professors}
          userCredits={user.credits}
        />
      </Suspense>
    </div>
  );
}
