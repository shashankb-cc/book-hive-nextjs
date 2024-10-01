import { Suspense } from "react";
import { getProfessorById } from "@/actions/professorActions";
import { auth } from "@/auth";
import ProfessorScheduleClient from "@/components/dashboard/professor-schedule";
import { getTranslations } from "next-intl/server";
import ProfessorScheduleSkeleton from "@/components/skeletons/professor-schedule-skeleton";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/actions/memberActions";

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

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    redirect("/login");
  }

  if (user.credits < professor.credits) {
    redirect(`/professors`);
  }

  const prefill = {
    name: session.user.name || "",
    email: session.user.email,
  };

  return (
    <ProfessorScheduleClient
      professor={professor}
      prefill={prefill}
      userId={user.id}
    />
  );
}
