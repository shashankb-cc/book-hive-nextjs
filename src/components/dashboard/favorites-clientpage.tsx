"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, HeartIcon } from "lucide-react";
import { removeFavorite } from "@/actions/favoriteActions";
import { useTranslations } from "next-intl";

interface FavoritesClientProps {
  initialFavorites: any[];
}

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const t = useTranslations("Favorites");

  const handleRemoveFavorite = async (bookId: number) => {
    await removeFavorite(bookId);
    setFavorites(favorites.filter((book) => book.id !== bookId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {favorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex items-center justify-between">
                  <span>{book.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFavorite(book.id)}
                  >
                    <HeartIcon className="h-6 w-6 text-red-400 fill-red-400" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {t("author")}: {book.author}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {t("genre")}: {book.genre}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {t("isbn")}: {book.isbnNo}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <HeartIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {t("noFavorites")}
            </h2>
            <p className="text-gray-500 text-center">
              {t("noFavoritesMessage")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
