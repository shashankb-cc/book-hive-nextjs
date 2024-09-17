"use server";
import { Suspense } from "react";
import CollectionClient from "@/components/dashboard/my-collection-client";
import { getUserTransactions } from "@/actions/transactionActions";


export default async function CollectionPage() {
  const bookRequests = await getUserTransactions();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Book Collection</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionClient bookRequests={bookRequests!} />
      </Suspense>
    </div>
  );
}
