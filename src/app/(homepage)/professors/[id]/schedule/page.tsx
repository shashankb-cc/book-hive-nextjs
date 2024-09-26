import { Suspense } from "react";
import { getProfessorById } from "@/actions/professorActions";
import { auth } from "@/auth";
import ProfessorScheduleClient from "@/components/dashboard/professor-schedule";
import { getTranslations } from "next-intl/server";
import ProfessorScheduleSkeleton from "@/components/skeletons/professor-schedule-skeleton";

export default function ProfessorSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<ProfessorScheduleSkeleton />}>
      <ProfessorScheduleContent params={params} />
    </Suspense>
  );
}

async function ProfessorScheduleContent({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("ProfessorSchedule");
  const professor = await getProfessorById(Number(params.id));
  const session = await auth();

  if (!professor) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {t("notFound")}
      </div>
    );
  }

  const prefill = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  };

  return <ProfessorScheduleClient professor={professor} prefill={prefill} />;
}
