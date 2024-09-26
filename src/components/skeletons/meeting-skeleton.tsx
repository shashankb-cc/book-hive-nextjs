import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function MeetingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="h-full flex flex-col shadow-lg rounded-lg border border-gray-200 relative border-t-blue-700 border-t-4">
            <div className="absolute top-2 right-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <CardHeader className="p-4 bg-gray-50 rounded-t-lg">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 space-y-4 flex flex-col">
              <Skeleton className="h-10 w-full" />
              <div className="flex space-x-2 w-full">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}