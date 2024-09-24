import { Suspense } from "react";
import CollectionClient from "@/components/dashboard/my-collection-client";
import { getUserTransactions } from "@/actions/transactionActions";
import { getTranslations } from "next-intl/server";
import { TopNavbar } from "@/components/dashboard/top-navbar";

export default async function CollectionPage() {
  const t = await getTranslations("Collection");
  const bookRequests = await getUserTransactions();
  return (
    <>
      <TopNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl text-center font-bold mb-6">
          {t("myBookCollection")}
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <CollectionClient bookRequests={bookRequests || []} />
        </Suspense>
      </div>
    </>
  );
}
