import { getFavorites } from "@/actions/favoriteActions";
import FavoritesClient from "@/components/dashboard/favorites-clientpage";

export default async function FavoritesPage() {
  const result = await getFavorites();
  const favorites = result.favorites || [];

  return <FavoritesClient initialFavorites={favorites} />;
}
