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
import { cancelBookRequest } from "@/actions/transactionActions";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Collection");
  const [requests, setRequests] = useState(bookRequests);

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
      setRequests(requests.filter((request) => request.id !== id));
    } else {
      console.error(result.message); // Handle error
    }
  };

  return (
    <div>
      {requests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
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
                      {t(request.status)}
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
                    {t("cancelRequest")}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t("viewDetails")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("noRequestsYet")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
