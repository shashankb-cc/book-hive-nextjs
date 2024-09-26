import { Suspense } from "react";
import ProfessorList from "@/components/dashboard/professor-list";
import { useTranslations } from "next-intl";
import ProfessorListSkeleton from "@/components/skeletons/professor-list-skeleton";

export default function ProfessorsPage() {
  const t = useTranslations("ProfessorList");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("ourProfessor")}</h1>
      <Suspense fallback={<ProfessorListSkeleton />}>
        <ProfessorList />
      </Suspense>
    </div>
  );
}
