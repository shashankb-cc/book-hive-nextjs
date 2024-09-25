// app/dashboard/DashboardClientPage.tsx (Client Component)
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, User, Video, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Beautiful button component
import Link from "next/link";

interface Event {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  event_memberships: {
    user_name: string; // Professor name
    user_email: string;
  }[];
  location: { type: string; status: string; join_url?: string };
}

interface MeetingsClientPageProps {
  events: Event[];
}

export default function MeetingClientPage({ events }: MeetingsClientPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Scheduled Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          You have no scheduled events.
        </p>
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
                    {/* Status Indicator */}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </div>
                    <CardHeader className="p-4 bg-gray-50 rounded-t-lg">
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardDescription>
                        {/* Event Timing */}
                        <div className="mb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">From:</span>
                          </div>
                          <span className="pl-6 text-gray-800">
                            {format(new Date(event.start_time), "PPPp")}
                          </span>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">To:</span>
                          </div>
                          <span className="pl-6 text-gray-800">
                            {format(new Date(event.end_time), "PPPp")}
                          </span>
                        </div>

                        {/* Professor/Organizer */}
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Professor:</span>
                          </div>
                          <span className="pl-6 text-gray-800">
                            {event.event_memberships[0]?.user_name}
                          </span>
                        </div>
                      </CardDescription>
                    </CardContent>

                    {/* Join Button */}
                    {isActive &&
                      event.location.type === "google_conference" && (
                        <div className="px-4 py-2 mt-auto">
                          <Link
                            href={event.location.join_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                              Join Google Meet
                            </Button>
                          </Link>
                        </div>
                      )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
