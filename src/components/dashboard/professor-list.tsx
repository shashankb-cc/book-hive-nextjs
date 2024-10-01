"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getProfessors } from "@/actions/professorActions";
import { IProfessor } from "@/lib/models";
import { useTranslations } from "next-intl";
import RazorpayPayment from "./razor-payment";
import { checkPaymentStatus, createPayment } from "@/actions/paymentActions";
import { useSession } from "next-auth/react";
import { findUserByEmail } from "@/actions/memberActions";

export default function ProfessorList() {
  const t = useTranslations("ProfessorList");
  const router = useRouter();
  const { data: session } = useSession();
  const [professors, setProfessors] = useState<IProfessor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchProfessors = async () => {
    const result = await getProfessors();
    if ("error" in result) {
      setError(result.error);
    } else {
      setProfessors(result);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, [search]);

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearch(e.target.value);
  };

  const handleSchedule = async (professor: IProfessor) => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to schedule a meeting.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    const member = await findUserByEmail(session?.user?.email!);
    const hasPaid = await checkPaymentStatus(member?.id!, professor.id);
    if (hasPaid) {
      router.push(`/professors/${professor.id}/schedule`);
    } else {
      setSelectedProfessor(professor);
      setShowPaymentModal(true);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedProfessor(null);
  };

  const handlePaymentSuccess = async (response: any) => {
    const member = await findUserByEmail(session?.user?.email!);
    if (selectedProfessor) {
      await createPayment({
        userId: member?.id!,
        professorId: selectedProfessor.id,
        amount: 199, // Set the appropriate amount
        status: "paid",
        signature: response.razorpay_signature,
        orderId: response.razorpay_order_id, // You might want to generate and store this
        paymentId: response.razorpay_payment_id, // You might want to store the Razorpay payment ID
      });
      toast({
        title: "Payment Successful",
        description: "You can now schedule your meeting.",
        variant: "default",
      });
      router.push(`/professors/${selectedProfessor.id}/schedule`);
    }
  };

  const handlePaymentFailure = () => {
    toast({
      title: "Payment Failed",
      description: "Your payment was not successful. Please try again.",
      variant: "destructive",
    });
    handleClosePaymentModal();
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-xl max-w-3xl">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="search" className="text-lg font-semibold mb-2">
              {t("searchLabel")}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {professors.map((professor) => (
            <motion.div
              key={professor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {professor.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-lg">
                    <GraduationCap className="mr-2" />
                    {professor.department}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">
                    {professor.bio}
                  </p>
                </CardContent>
                <CardFooter>
                  {professor.calendly_link ? (
                    <Button
                      onClick={() => handleSchedule(professor)}
                      className="w-full bg-blue-600"
                    >
                      <Calendar className="mr-2" />
                      {t("scheduleMeeting")}
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("noCalendlyLink")}
                    </p>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        <Dialog open={showPaymentModal} onOpenChange={handleClosePaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-4">
                Payment for Scheduling
              </DialogTitle>
            </DialogHeader>
            <div className="mb-6">
              <p className="text-lg">
                Please pay ₹199 to schedule the meeting with{" "}
                <span className="font-semibold">{selectedProfessor?.name}</span>
                .
              </p>
            </div>
            <RazorpayPayment
              amount={199} // Set the appropriate amount
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
