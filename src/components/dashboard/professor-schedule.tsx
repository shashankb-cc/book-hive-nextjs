"use client";

import { InlineWidget } from "react-calendly";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IProfessor } from "@/lib/models";
import { GraduationCap, Mail, Clock } from "lucide-react";

interface ProfessorScheduleClientProps {
  professor: IProfessor;
  prefill: {
    name: string;
    email: string;
  };
}

export default function ProfessorScheduleClient({
  professor,
  prefill,
}: ProfessorScheduleClientProps) {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 sm:p-10">
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              {professor.name}
            </CardTitle>
            <CardDescription className="text-xl text-white flex items-center">
              <GraduationCap className="mr-2" />
              {professor.department}
            </CardDescription>
          </div>
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <Mail className="mr-2 text-gray-500" />
                <span className="text-gray-600">{prefill.email}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" />
                <span className="text-gray-600">60 minutes meeting</span>
              </div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {professor.bio}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Schedule Your Meeting
        </h2>
        {professor.calendly_link ? (
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <InlineWidget
                url={professor.calendly_link}
                prefill={prefill}
                styles={{
                  height: "700px",
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-xl text-gray-500">
            No Calendly link available for this professor.
          </p>
        )}
      </motion.div>
    </div>
  );
}
