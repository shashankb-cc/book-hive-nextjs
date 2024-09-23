import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  Clock,
  DollarSign,
  AlertCircle,
  Home,
  History,
  Heart,
} from "lucide-react";
import SideNav from "@/components/side-nav";
import * as LucideIcons from "lucide-react";
import { useLocale } from "next-intl";

export function UserNavBar() {
  const locale = useLocale();

  const userNavItems: {
    name: string;
    href: string;
    icon: keyof typeof LucideIcons;
  }[] = [
    { name: "Home", href: `/${locale}/dashboard`, icon: "Home" }, //`/${locale}/`
    { name: "My Books", href: `/${locale}/collection`, icon: "BookOpen" },
    {
      name: "Borrowing History",
      href: `/${locale}/transactions`,
      icon: "History",
    },
    { name: "Favorites", href: `/${locale}/favorites`, icon: "Heart" },
    { name: "Due Soon", href: `/${locale}/due-soon`, icon: "Clock" },
  ];

  return <SideNav title="BookHive" navItems={userNavItems} />;
}
