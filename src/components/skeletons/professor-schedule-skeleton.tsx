import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfessorScheduleSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="mb-12 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 sm:p-10">
          <Skeleton className="h-8 w-3/4 bg-white/20 mb-2" />
          <Skeleton className="h-6 w-1/2 bg-white/20" />
        </div>
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Skeleton className="h-6 w-48 mb-4 sm:mb-0" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      <Skeleton className="h-8 w-64 mx-auto mb-6" />
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <Skeleton className="h-[700px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
