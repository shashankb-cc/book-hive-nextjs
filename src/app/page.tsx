"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpenIcon,
  MenuIcon,
  CalendarIcon,
  HeartIcon,
  CreditCardIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 h-14 flex items-center border-b bg-white dark:bg-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">
            {t("header.title")}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/login`}>
            <Button variant="ghost" size="sm">
              {t("header.buttons.logIn")}
            </Button>
          </Link>
          <Link href={`/register`}>
            <Button size="sm">{t("header.buttons.signUp")}</Button>
          </Link>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">{t("header.mobileMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    className="flex items-center justify-center"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="ml-2  font-bold text-gray-800 dark:text-white">
                      {t("header.title")}
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-2">
                  <Link
                    className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.home")}
                  </Link>
                  <Link
                    className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.favorites")}
                  </Link>
                  <Link
                    className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.schedule")}
                  </Link>
                </nav>
                <div className="mt-auto">
                  <Link href={`/login`}>
                    <Button
                      className="w-full mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.buttons.logIn")}
                    </Button>
                  </Link>
                  <Link href={`/register`}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.buttons.signUp")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-3xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
              {t("hero.title")}
            </h1>
            <p className="text-2xl sm:text-base md:text-lg text-center text-gray-500 dark:text-gray-400 mb-4 max-w-[500px] mx-auto">
              {t("hero.subtitle")}
            </p>
            <Link href="/login">
              <Button size="sm" className="w-full max-w-[200px]">
                {t("hero.ctaButton")}
              </Button>
            </Link>
          </div>
        </section>
        <section className="flex-1 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="h-full flex flex-col px-4 py-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tighter text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 md:text-4xl">
              {t("features.title")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <BookOpenIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-2" />
                <h3 className="text-md font-bold text-gray-800 dark:text-white mb-1">
                  {t("features.vastCollection.title")}
                </h3>
                <p className="text-md text-gray-500 dark:text-gray-400 text-center">
                  {t("features.vastCollection.description")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <HeartIcon className="h-6 w-6 text-red-500 dark:text-red-400 mb-2" />
                <h3 className="text-md font-bold text-gray-800 dark:text-white mb-1">
                  {t("features.favorites.title")}
                </h3>
                <p className="text-md text-gray-500 dark:text-gray-400 text-center">
                  {t("features.favorites.description")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CalendarIcon className="h-6 w-6 text-green-500 dark:text-green-400 mb-2" />
                <h3 className="text-md font-bold text-gray-800 dark:text-white mb-1">
                  {t("features.scheduling.title")}
                </h3>
                <p className="text-md text-gray-500 dark:text-gray-400 text-center">
                  {t("features.scheduling.description")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CreditCardIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mb-2" />
                <h3 className="text-md font-bold text-gray-800 dark:text-white mb-1">
                  {t("features.payment.title")}
                </h3>
                <p className="text-md text-gray-500 dark:text-gray-400 text-center">
                  {t("features.payment.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-3 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap justify-between items-center text-xs">
            <p className="text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
              {t("footer.copyright")}
            </p>
            <nav className="flex gap-4">
              <Link
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                href="#"
              >
                {t("footer.terms")}
              </Link>
              <Link
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                href="#"
              >
                {t("footer.privacy")}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
