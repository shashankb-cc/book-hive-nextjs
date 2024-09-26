import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HistorySkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-12 w-64 mx-auto mb-6" />
      <div className="flex justify-end mb-6">
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(5)].map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-6 w-24" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(5)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-10 w-64" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
