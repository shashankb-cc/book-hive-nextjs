"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, HeartIcon, TrashIcon } from "lucide-react";
import { removeFavorite } from "@/actions/favoriteActions";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 mt-4 text-center text-primary">
        {t("title")}
      </h1>
      {favorites.length > 0 ? (
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {favorites.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-64 w-full">
                    <Image
                      src={book.imageUrl || "/placeholder-book.jpg"}
                      alt={book.title}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                    <CardTitle className="absolute bottom-4 left-4 right-4 text-white text-3xl font-bold line-clamp-2">
                      {book.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookIcon className="mr-2 h-4 w-4" />
                      <span>Author : {book.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookIcon className="mr-2 h-4 w-4" />
                      <span>Genre : {book.genre}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookIcon className="mr-2 h-4 w-4" />
                      <span>ISBN : {book.isbnNo}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => handleRemoveFavorite(book.id)}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {t("removeFromFavorites")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mt-6 bg-white shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HeartIcon className="h-24 w-24 text-red-400 mb-6" />
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                {t("noFavorites")}
              </h2>
              <p className="text-gray-500 text-center text-lg max-w-md">
                {t("noFavoritesMessage")}
              </p>
              <Button className="mt-8" variant="outline" size="lg">
                {t("exploreBooks")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
