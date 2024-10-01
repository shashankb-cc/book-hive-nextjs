"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, GraduationCap, Calendar, Coins } from "lucide-react";
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
import { IProfessor } from "@/lib/models";
import { useTranslations } from "next-intl";
import RazorpayPayment from "./razor-payment";
import { checkPaymentStatus, createPayment } from "@/actions/paymentActions";
import { useSession } from "next-auth/react";
import { findUserByEmail, updateMemberCredits } from "@/actions/memberActions";

interface ProfessorListProps {
  initialProfessors: IProfessor[];
  userCredits: number;
}

export default function ProfessorList({
  initialProfessors,
  userCredits: initialUserCredits,
}: ProfessorListProps) {
  const t = useTranslations("ProfessorList");
  const router = useRouter();
  const { data: session } = useSession();
  const [professors, setProfessors] = useState<IProfessor[]>(initialProfessors);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userCredits, setUserCredits] = useState(initialUserCredits);

  useEffect(() => {
    const filteredProfessors = initialProfessors.filter(
      (professor) =>
        professor.name.toLowerCase().includes(search.toLowerCase()) ||
        professor.department.toLowerCase().includes(search.toLowerCase())
    );
    setProfessors(filteredProfessors);
  }, [search, initialProfessors]);

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
    if (!member) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }
    if (member.credits < professor.credits) {
      setSelectedProfessor(professor);
      setShowPaymentModal(true);
    } else {
      router.push(`/professors/${professor.id}/schedule`);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedProfessor(null);
  };

  const handlePaymentSuccess = async (response: any) => {
    const member = await findUserByEmail(session?.user?.email!);
    if (selectedProfessor && member) {
      await createPayment({
        userId: member.id,
        professorId: selectedProfessor.id,
        amount: 200,
        status: "paid",
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
      });
      const newCredits = member.credits + 100; // 200 Rs = 100 credits
      await updateMemberCredits(member.id, newCredits);
      setUserCredits(newCredits);
      toast({
        title: "Payment Successful",
        description: "Credits added. You can now schedule your meeting.",
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

  const handlePayWithCredits = async () => {
    if (selectedProfessor && userCredits >= selectedProfessor.credits) {
      const member = await findUserByEmail(session?.user?.email!);
      if (member) {
        await createPayment({
          userId: member.id,
          professorId: selectedProfessor.id,
          amount: 0,
          status: "paid",
          orderId: `CREDITS-${Date.now()}`,
          paymentId: `CREDITS-${Date.now()}`,
        });

        const newCredits = userCredits - selectedProfessor.credits;
        await updateMemberCredits(member.id, newCredits);
        setUserCredits(newCredits);

        toast({
          title: "Payment Successful",
          description:
            "You have successfully paid with credits. You can now schedule your meeting.",
          variant: "default",
        });
        router.push(`/professors/${selectedProfessor.id}/schedule`);
      }
    } else {
      toast({
        title: "Insufficient Credits",
        description: "You do not have enough credits to schedule this meeting.",
        variant: "destructive",
      });
    }
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
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {professor.bio}
                  </p>
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Coins className="mr-2 text-yellow-500" />
                      <span className="font-semibold">Required Credits:</span>
                    </div>
                    <span className="text-lg font-bold">
                      {professor.credits}
                    </span>
                  </div>
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
              <p className="text-lg mb-4">
                Schedule a meeting with{" "}
                <span className="font-semibold">{selectedProfessor?.name}</span>
              </p>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <Coins className="mr-2 text-yellow-500" />
                  <span className="font-semibold">Your Credits:</span>
                </div>
                <span className="text-lg font-bold">{userCredits}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mt-2">
                <div className="flex items-center">
                  <Coins className="mr-2 text-blue-500" />
                  <span className="font-semibold">Required Credits:</span>
                </div>
                <span className="text-lg font-bold">
                  {selectedProfessor?.credits}
                </span>
              </div>
            </div>
            {userCredits >= (selectedProfessor?.credits || 0) ? (
              <Button
                onClick={handlePayWithCredits}
                className="w-full bg-green-600"
              >
                Pay with Credits
              </Button>
            ) : (
              <>
                <p className="text-red-500 mb-4">
                  You do not have enough credits. Please buy some credits to
                  schedule meeting. (2Rs=1 Credit)
                </p>
                <RazorpayPayment
                  amount={200}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
