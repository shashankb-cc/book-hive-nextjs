import { getProfessors } from "@/actions/professorActions";
import ProfessorDashboard from "@/components/admin-dashboard/professors-info";
import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfessorsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  unstable_setRequestLocale(locale);

  const result = await getProfessors();

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      {Array.isArray(result) ? (
        <ProfessorDashboard professors={result} />
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}
    </Suspense>
  );
}
