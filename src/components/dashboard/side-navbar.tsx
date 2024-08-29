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

export function UserNavBar() {
  const userNavItems: {
    name: string;
    href: string;
    icon: keyof typeof LucideIcons;
  }[] = [
    { name: "Home", href: "/dashboard", icon: "Home" },
    { name: "My Books", href: "/collection", icon: "BookOpen" },
    { name: "Borrowing History", href: "/transactions", icon: "History" },
    { name: "Favorites", href: "/favorites", icon: "Heart" },
    { name: "Due Soon", href: "/due-soon", icon: "Clock" },
  ];

  return <SideNav title="BookHive" navItems={userNavItems} />;
}
