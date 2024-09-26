import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow fixed top-0 left-16 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-evenly lg:pl-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4 sm:mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Skeleton className="h-8 w-40 mb-4 sm:mb-0" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <Skeleton className="aspect-[0.9] rounded-t-lg" />
              <CardContent className="flex-grow p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 border-t">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
