// app/layout.tsx
import { UserNavBar } from "@/components/dashboard/side-navbar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookHive",
  description: "Your digital library management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <UserNavBar />
      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 ml-16 transition-all duration-300">
        <TopNavbar />
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
}
