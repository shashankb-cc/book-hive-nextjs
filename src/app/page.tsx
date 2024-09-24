"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpenIcon,
  SearchIcon,
  UserIcon,
  BookIcon,
  LibraryIcon,
  MenuIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <BookOpenIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">{t("header.title")}</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            {t("header.nav.home")}
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            {t("header.nav.catalog")}
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            {t("header.nav.myBooks")}
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            {t("header.nav.about")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/register`}>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {t("header.buttons.signUp")}
            </Button>
          </Link>
          <Link href={`/login`}>
            <Button size="sm">{t("header.buttons.logIn")}</Button>
          </Link>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">{t("header.mobileMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link
                    className="flex items-center justify-center"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpenIcon className="h-6 w-6" />
                    <span className="ml-2 text-lg font-bold">
                      {t("header.title")}
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    className="text-lg font-medium hover:text-primary transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.home")}
                  </Link>
                  <Link
                    className="text-lg font-medium hover:text-primary transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.catalog")}
                  </Link>
                  <Link
                    className="text-lg font-medium hover:text-primary transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.myBooks")}
                  </Link>
                  <Link
                    className="text-lg font-medium hover:text-primary transition-colors"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.nav.about")}
                  </Link>
                </nav>
                <div className="mt-auto">
                  <Link href={`/register`}>
                    <Button
                      className="w-full mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.buttons.signUp")}
                    </Button>
                  </Link>
                  <Link href={`/login`}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.buttons.logIn")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  {t("hero.title")}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  {t("hero.subtitle")}
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder={t("hero.searchPlaceholder")}
                    type="search"
                  />
                  <Button type="submit">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">
                      {t("hero.searchButton")}
                    </span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">
              {t("features.title")}
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BookIcon className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">
                  {t("features.vastCollection.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t("features.vastCollection.description")}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <UserIcon className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">
                  {t("features.easyBorrowing.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t("features.easyBorrowing.description")}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <LibraryIcon className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">
                  {t("features.personalBookshelf.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t("features.personalBookshelf.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("footer.copyright")}
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t("footer.terms")}
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {t("footer.privacy")}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
