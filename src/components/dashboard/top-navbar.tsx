"use client";

import React from "react";
import { UserDropdown } from "@/components/dashboard/user-dropdown";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../localSwitcher";
import { Coins } from "lucide-react";

export function TopNavbar({ userCredits }: { userCredits: number }) {
  const t = useTranslations("Common");
  const pathname = usePathname();

  const dashboardPath = pathname === `/dashboard`;

  if (dashboardPath) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow fixed top-0 left-16 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-orange-400 text-primary-foreground px-3 py-1 rounded-full">
            <Coins className="w-4 h-4" />
            <span className="font-medium">{userCredits} Credits</span>
          </div>
          <LocaleSwitcher />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
