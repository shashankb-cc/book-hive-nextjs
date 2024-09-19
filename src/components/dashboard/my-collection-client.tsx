"use client";

import { useState } from "react";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cancelBookRequest } from "@/actions/transactionActions";

interface BookRequest {
  id: number;
  bookTitle: string;
  author: string;
  status: "pending" | "issued" | "rejected" | "returned";
}

interface CollectionClientProps {
  bookRequests: BookRequest[];
}

export default function CollectionClient({
  bookRequests,
}: CollectionClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [requests, setRequests] = useState(bookRequests);

  const filteredRequests = requests.filter(
    (request) => filter === "all" || request.status === filter
  );

  const statusIcon = {
    pending: <Clock className="w-4 h-4" />,
    returned: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
    issued: <BookOpen className="w-4 h-4" />,
  };

  const statusColor = {
    pending: "text-yellow-500",
    returned: "text-green-500",
    rejected: "text-red-500",
    issued: "text-blue-500",
  };

  const handleCancel = async (id: number) => {
    const result = await cancelBookRequest(id);
    if (result.success) {
      setRequests(requests.filter(request => request.id !== id));
    } else {
      // Handle error (e.g., show an error message)
      console.error(result.message);
    }
  };

  return (
    <div>
      {requests.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Book Requests</h2>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No book requests found for the selected filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="flex flex-col">
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <CardTitle className="text-lg leading-tight">
                        {request.bookTitle}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ${statusColor[request.status]}`}
                      >
                        {statusIcon[request.status]}
                        <span className="ml-1 capitalize whitespace-nowrap">
                          {request.status}
                        </span>
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {request.author}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    {request.status === "pending" ? (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleCancel(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Request
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven&apos;t made any book requests yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}