import { getProfessorById } from "@/actions/professorActions";
import ProfessorForm from "@/components/admin-dashboard/professor-form";

export default async function EditProfessorPage({
  params,
}: {
  params: { id: string };
}) {
  const professor = await getProfessorById(parseInt(params.id));

  if (!professor) {
    return <div>Professor not found</div>;
  }

  return <ProfessorForm professor={professor} />;
}
