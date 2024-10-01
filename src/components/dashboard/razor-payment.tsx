import React, { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: (response: any) => void;
  onFailure: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPayment({
  amount,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, userId: session?.user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const order = await response.json();
      console.log("order", order);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Company Name",
        description: "Payment for scheduling a meeting",
        order_id: order.id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          onSuccess(response);
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            onFailure();
          },
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </Button>
    </>
  );
}
