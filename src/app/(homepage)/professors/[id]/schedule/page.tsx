// src/app/professors/[id]/schedule/page.tsx (Server Component)
import { getProfessorById } from "@/actions/professorActions";
import { auth } from "@/auth";
import ProfessorScheduleClient from "@/components/dashboard/professor-schedule";
import { useTranslations } from "next-intl";

export default async function ProfessorSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("ProfessorSchedule");
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
