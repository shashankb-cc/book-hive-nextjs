import React, { Suspense } from "react";
import Dashboard from "@/components/dashboard/dashboard-client";
import { getBooks } from "@/actions/bookActions";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";

interface DashboardPageProps {
  searchParams: { page?: string; search?: string; genre?: string };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({ searchParams }: DashboardPageProps) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const selectedGenre = searchParams.genre || "";
  const booksPerPage = 8;

  const { books, totalPages, genres, recentlyAddedBooks } = await getBooks({
    page,
    search,
    genre: selectedGenre,
    booksPerPage,
  });

  return (
    <Dashboard
      books={books}
      currentPage={page}
      totalPages={totalPages}
      genres={genres}
      selectedGenre={selectedGenre}
    />
  );
}
