"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { handleSignOut } from "@/actions/authActions";

type IconName = keyof typeof LucideIcons;

// Explicitly type IconComponent as React.ElementType
const SideNavBar = ({
  title,
  navItems,
}: {
  title: string;
  navItems: {
    name: string;
    href: string;
    icon: IconName;
  }[];
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <nav className="bg-white dark:bg-gray-800 h-full shadow-lg flex flex-col">
        <div className="p-4 flex items-center justify-between">
          {isOpen && (
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto"
          >
            {isOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </Button>
        </div>
        <ul className="space-y-2 p-4 flex-grow">
          {navItems.map((item) => {
            // Explicitly assert IconComponent type as React.ElementType
            const IconComponent = LucideIcons[item.icon] as React.ElementType;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4">
          <form action={handleSignOut}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isOpen && <span>Sign Out</span>}
            </Button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default SideNavBar;
