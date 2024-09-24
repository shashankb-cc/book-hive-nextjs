import SideNav from "@/components/side-nav";
import * as LucideIcons from "lucide-react";
import {  useTranslations } from "next-intl";

export function UserNavBar() {
  const t = useTranslations("UserNavBar");

  const userNavItems: {
    name: string;
    href: string;
    icon: keyof typeof LucideIcons;
  }[] = [
    { name: t("home"), href: `/dashboard`, icon: "Home" },
    { name: t("myBooks"), href: `/collection`, icon: "BookOpen" },
    {
      name: t("borrowingHistory"),
      href: `/transactions`,
      icon: "History",
    },
    { name: t("favorites"), href: `/favorites`, icon: "Heart" },
    { name: t("dueSoon"), href: `/due-soon`, icon: "Clock" },
  ];

  return <SideNav title={t("title")} navItems={userNavItems} />;
}
