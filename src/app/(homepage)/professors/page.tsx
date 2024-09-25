import ProfessorList from "@/components/dashboard/professor-list";
import { Suspense } from "react";

export default function ProfessorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Professors</h1>
      <Suspense fallback={<h1>Loading</h1>}>
        <ProfessorList />
      </Suspense>
    </div>
  );
}
