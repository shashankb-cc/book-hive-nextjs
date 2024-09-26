import { Suspense } from "react";
import { getFavorites } from "@/actions/favoriteActions";
import FavoritesClient from "@/components/dashboard/favorites-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import FavoritesSkeleton from "@/components/skeletons/favorites-skeleton";

export default function FavoritesPage() {
  return (
    <Suspense fallback={<FavoritesSkeleton />}>
      <FavoritesContent />
    </Suspense>
  );
}

async function FavoritesContent() {
  const result = await getFavorites();
  const favorites = result.favorites || [];

  return (
    <>
      <TopNavbar />
      <FavoritesClient initialFavorites={favorites} />
    </>
  );
}
