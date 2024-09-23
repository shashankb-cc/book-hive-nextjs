import { getFavorites } from "@/actions/favoriteActions";
import FavoritesClient from "@/components/dashboard/favorites-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";

export default async function FavoritesPage() {
  const result = await getFavorites();
  const favorites = result.favorites || [];

  return (
    <>
      <TopNavbar />
      <FavoritesClient initialFavorites={favorites} />
    </>
  );
}