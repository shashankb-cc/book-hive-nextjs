import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function CollectionSkeleton() {
  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow fixed top-0 left-16 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 mt-16">
        <Skeleton className="h-10 w-64 mx-auto mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardFooter className="pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
