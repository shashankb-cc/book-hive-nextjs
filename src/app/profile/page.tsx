import { Suspense } from "react";
import { getProfileData } from "@/actions/memberActions";
import ProfileSkeleton from "@/components/skeletons/profile-skeleton";
import ProfileClient from "./profile-client-page";

export default async function ProfilePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const profileData = await getProfileData();

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileClient initialData={profileData.data!} locale={locale} />
    </Suspense>
  );
}
