// app/admin/books/page.tsx
import React from "react";
import AdminDashboard from "@/components/admin-dashboard/dashboad-client";
import { getBooks } from "@/actions/bookActions";


interface AdminDashboardPageProps {
  searchParams: { page?: string; search?: string; genre?: string };
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {

 
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const selectedGenre = searchParams.genre || "";
  const booksPerPage = 10; // Adjust as needed for admin view

  const { books, totalPages, genres } = await getBooks({
    page,
    search,
    genre: selectedGenre,
    booksPerPage,
  });

  return (
    <AdminDashboard
      books={books}
      currentPage={page}
      totalPages={totalPages}
      genres={genres}
      selectedGenre={selectedGenre}
    />
  );
}
