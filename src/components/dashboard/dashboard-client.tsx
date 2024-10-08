"use client";

import React, { useState, useEffect } from "react";
import { Heart, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/dashboard/search-form";
import { UserDropdown } from "@/components/dashboard/user-dropdown";
import Pagination from "@/components/dashboard/pagination";
import { BookDetails } from "@/components/dashboard/book-details";
import { IBook } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { BorrowConfirmationDialog } from "@/components/dashboard/borrow-confirmation";
import Image from "next/image";

import { toast } from "@/hooks/use-toast";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/actions/favoriteActions";
import { borrowBook } from "@/actions/transactionActions";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/localSwitcher";

interface DashboardProps {
  books: IBook[];
  currentPage: number;
  totalPages: number;
  genres: string[];
  selectedGenre: string;
  userCredits: number;
}

const timeZoneCurrencyMap: Record<string, string> = {
  "Asia/Calcutta": "INR",
  "America/New_York": "USD",
  "Europe/London": "GBP",
  // Add more mappings as needed
};

const exchangeRates: Record<string, number> = {
  USD: 0.012,
  INR: 1,
  GBP: 0.009,
  // Add more exchange rates as needed
};

export default function Dashboard({
  books,
  currentPage,
  totalPages,
  genres,
  selectedGenre,
  userCredits,
}: DashboardProps) {
  const t = useTranslations("Dashboard");
  const commonT = useTranslations("Common");
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [borrowingBook, setBorrowingBook] = useState<IBook | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currency, setCurrency] = useState<string>("INR");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchFavorites = async () => {
      const result = await getFavorites();
      if (result.favorites) {
        setFavorites(new Set(result.favorites.map((book) => book.id)));
      }
    };
    fetchFavorites();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const detectedCurrency = timeZoneCurrencyMap[timeZone] || "INR";
    setCurrency(detectedCurrency);
  }, []);

  const formatPrice = (price: number) => {
    const baseCurrency = "INR";
    const convertedPrice =
      price * (exchangeRates[currency] / exchangeRates[baseCurrency]);

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  const handleViewDetails = (book: IBook) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  const handleGenreChange = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre && genre !== "all") {
      params.set("genre", genre);
    } else {
      params.delete("genre");
    }
    params.set("page", "1");
    router.push(`/dashboard?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleBorrowBook = (book: IBook) => {
    if (book.availableNumberOfCopies > 0) {
      setBorrowingBook(book);
    } else {
      alert(t("unavailable"));
    }
  };

  const handleConfirmBorrow = async () => {
    if (borrowingBook) {
      try {
        const result = await borrowBook(borrowingBook.id);
        if (result.success) {
          toast({
            title: commonT("success"),
            description: result.message,
            className: "bg-green-400 text-white",
          });
          setBorrowingBook(null);
          router.refresh();
        } else {
          toast({
            title: commonT("error"),
            description: result.message,
            className: "bg-red-400 text-white",
          });
        }
      } catch (error) {
        console.error("Error borrowing book:", error);
        alert(t("borrowError"));
      }
    }
  };

  const handleToggleFavorite = async (bookId: number) => {
    try {
      if (favorites.has(bookId)) {
        await removeFavorite(bookId);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(bookId);
          return newFavorites;
        });
        toast({
          title: t("removedFromFavorites"),
          description: t("removedFromFavoritesDescription"),
          className: "bg-blue-400 text-white",
        });
      } else {
        await addFavorite(bookId);
        setFavorites((prev) => new Set(prev).add(bookId));
        toast({
          title: t("addedToFavorites"),
          description: t("addedToFavoritesDescription"),
          className: "bg-green-400 text-white",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: commonT("error"),
        description: t("favoriteToggleError"),
        className: "bg-red-400 text-white",
      });
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow fixed top-0 left-16 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-1xl font-bold text-gray-900 dark:text-white md:text-2xl lg:2xl">
              {t("title")}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-[180px]">
                <Select
                  onValueChange={handleGenreChange}
                  value={selectedGenre || "all"}
                >
                  <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder={t("selectGenre")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGenres")}</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-evenly ">
              <div className="flex items-center space-x-2 text-primary-foreground bg-orange-400 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4" />
                <span className="font-medium">{userCredits} Credits</span>
              </div>
              <LocaleSwitcher />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4 sm:mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 lg:flex-grow">
          <div className="flex-grow w-full sm:w-auto mb-4 sm:mb-0">
            <SearchInput placeholder={t("searchPlaceholder")} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleViewDetails(book)}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center p-4">
                    <div className="text-xl text-center font-bold text-primary-foreground">
                      {book.genre}
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {formatPrice(book.price)}
                </div>
              </div>
              <CardContent className="flex-grow p-4">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {book.author}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(book.id);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(book.id) ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  className="max-sm:w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBorrowBook(book);
                  }}
                  disabled={book.availableNumberOfCopies === 0}
                >
                  {book.availableNumberOfCopies > 0
                    ? t("borrowBook")
                    : t("unavailable")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {selectedBook && (
        <BookDetails
          book={{
            ...selectedBook,
            price: Number(formatPrice(selectedBook.price)),
          }}
          onClose={closeBookDetails}
          onBorrow={() => handleBorrowBook(selectedBook)}
          isFavorite={favorites.has(selectedBook.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedBook.id)}
        />
      )}
      {borrowingBook && (
        <BorrowConfirmationDialog
          book={{
            ...borrowingBook,
            price: Number(formatPrice(borrowingBook.price)),
          }}
          onConfirm={handleConfirmBorrow}
          onCancel={() => setBorrowingBook(null)}
        />
      )}
    </>
  );
}
