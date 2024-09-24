import { unstable_setRequestLocale } from "next-intl/server";
import BookForm from "@/components/admin-dashboard/book-form";
import { getBookById } from "@/actions/bookActions";

export default async function UpdateBookPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  unstable_setRequestLocale(locale);
  const book = await getBookById(parseInt(id));

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Book</h1>
      <BookForm book={book} />
    </div>
  );
}
