import { IBook } from "@/lib/models";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface BookDetailsProps {
  book: IBook;
  onClose: () => void;
  onBorrow: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function BookDetails({
  book,
  onClose,
  onBorrow,
  isFavorite,
  onToggleFavorite,
}: BookDetailsProps) {
  const t = useTranslations("BookDetails");
  const dashboardT = useTranslations("Dashboard");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={150}
                height={225}
                objectFit="cover"
                className="rounded-md"
              />
            ) : (
              <div className="w-full h-[225px] bg-primary rounded-md flex items-center justify-center">
                <div className="text-xl font-bold text-white">{book.genre}</div>
              </div>
            )}
          </div>
          <div className="w-full sm:w-2/3">
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {t("author")}: {book.author}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {t("genre")}: {book.genre}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {t("isbn")}: {book.isbnNo}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("availableCopies")}: {book.availableNumberOfCopies}
            </p>
          </div>
        </div>
        <div className="flex justify-between flex-col gap-4">
          <Button onClick={onToggleFavorite} variant="outline">
            <Heart
              className={`w-5 h-5 mr-2 ${
                isFavorite ? "fill-current text-red-500" : ""
              }`}
            />
            {isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
          </Button>
          <Button
            onClick={onBorrow}
            disabled={book.availableNumberOfCopies === 0}
          >
            {book.availableNumberOfCopies > 0
              ? dashboardT("borrowBook")
              : dashboardT("unavailable")}
          </Button>
        </div>
        <Button onClick={onClose} className="mt-4 w-full">
          {t("close")}
        </Button>
      </div>
    </div>
  );
}
