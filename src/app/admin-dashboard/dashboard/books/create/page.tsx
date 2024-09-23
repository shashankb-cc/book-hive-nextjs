import { unstable_setRequestLocale } from "next-intl/server";
import BookForm from "@/components/admin-dashboard/book-form";

export default function CreateBookPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Book</h1>
      <BookForm />
    </div>
  );
}
