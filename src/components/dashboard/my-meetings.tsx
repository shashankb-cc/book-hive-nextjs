"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, User, Video, MapPin, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { InlineWidget } from "react-calendly";

interface Event {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  event_memberships: {
    user_name: string;
    user_email: string;
  }[];
  location: { type: string; status: string; join_url?: string };
  cancel_url: string;
  reschedule_url: string;
}

interface MeetingsClientPageProps {
  events: Event[];
}

export default function MeetingClientPage({ events }: MeetingsClientPageProps) {
  const t = useTranslations("MeetingClientPage");
  const [selectedAction, setSelectedAction] = useState<{
    type: "cancel" | "reschedule";
    url: string;
  } | null>(null);

  const handleAction = (type: "cancel" | "reschedule", url: string) => {
    setSelectedAction({ type, url });
  };

  const closeCalendly = () => {
    setSelectedAction(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">{t("noEvents")}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {events.map((event) => {
              const isActive =
                event.status === "active" && event.location.status === "pushed";
              return (
                <motion.div
                  key={event.uri}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col shadow-lg rounded-lg border border-gray-200 relative border-t-blue-700 border-t-4">
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isActive ? t("active") : t("inactive")}
                    </div>
                    <CardHeader className="p-4 bg-gray-50 rounded-t-lg">
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{t("from")}</span>
                          </div>
                          <div className="pl-6 text-gray-800">
                            {format(new Date(event.start_time), "PPPp")}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{t("to")}</span>
                          </div>
                          <div className="pl-6 text-gray-800">
                            {format(new Date(event.end_time), "PPPp")}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {t("professor")}
                            </span>
                          </div>
                          <div className="pl-6 text-gray-800">
                            {event.event_memberships[0]?.user_name}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 space-y-4 flex flex-col">
                      {isActive &&
                        event.location.type === "google_conference" && (
                          <>
                            <div className="w-full block">
                              <Link
                                href={event.location.join_url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                              >
                                <Button className="w-full bg-blue-600 text-white hover:bg-blue-400">
                                  {t("joinGoogleMeet")}
                                </Button>
                              </Link>
                            </div>
                            <div className="flex space-x-2 w-full">
                              <Button
                                variant="outline"
                                className="w-1/2 text-white bg-red-500 hover:bg-red-400"
                                onClick={() => handleAction("cancel", event.cancel_url)}
                              >
                                {t("cancelMeeting")}
                              </Button>
                              <Button
                                variant="outline"
                                className="w-1/2 text-white bg-blue-700 hover:bg-blue-400"
                                onClick={() => handleAction("reschedule", event.reschedule_url)}
                              >
                                {t("rescheduleMeeting")}
                              </Button>
                            </div>
                          </>
                        )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
            <Button
              className="absolute top-2 right-2 p-1"
              variant="ghost"
              onClick={closeCalendly}
            >
              <X className="h-6 w-6" />
            </Button>
            <InlineWidget
              url={selectedAction.url}
              styles={{ height: '630px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}