import SideNav from "@/components/side-nav";
import * as LucideIcons from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function UserNavBar() {
  const locale = useLocale();
  const t = useTranslations("UserNavBar");

  const userNavItems: {
    name: string;
    href: string;
    icon: keyof typeof LucideIcons;
  }[] = [
    { name: t("home"), href: `/${locale}/dashboard`, icon: "Home" },
    { name: t("myBooks"), href: `/${locale}/collection`, icon: "BookOpen" },
    {
      name: t("borrowingHistory"),
      href: `/${locale}/transactions`,
      icon: "History",
    },
    { name: t("favorites"), href: `/${locale}/favorites`, icon: "Heart" },
    { name: t("dueSoon"), href: `/${locale}/due-soon`, icon: "Clock" },
  ];

  return <SideNav title={t("title")} navItems={userNavItems} />;
}
