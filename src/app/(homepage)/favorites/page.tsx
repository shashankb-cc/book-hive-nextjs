import { Suspense } from "react";
import { getFavorites } from "@/actions/favoriteActions";
import FavoritesClient from "@/components/dashboard/favorites-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import FavoritesSkeleton from "@/components/skeletons/favorites-skeleton";
import { auth } from "@/auth";
import { getUserDetails } from "@/actions/memberActions";

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
  const session = await auth();
  const user = await getUserDetails(session);
  if ("error" in user) {
    return;
  }
  return (
    <>
      <TopNavbar userCredits={user.credits} />
      <FavoritesClient initialFavorites={favorites} />
    </>
  );
}
