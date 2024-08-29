import SideNav from "@/components/side-nav";
import * as LucideIcons from "lucide-react";

//Admin SideNav
export function AdminNavBar() {
  const adminNavItems: {
    name: string;
    href: string;
    icon: keyof typeof LucideIcons;
  }[] = [
    {
      name: "Dashboard",
      href: "/admin-dashboard",
      icon: "LayoutDashboard",
    },
    { name: "Manage Members", href: "/admin-dashboard/members", icon: "Users" },
    {
      name: "Book Requests",
      href: "/admin-dashboard/book-requests",
      icon: "UserCheck",
    },
    { name: "Due Today", href: "/admin-dashboard/due-today", icon: "Clock" },
    {
      name: "Latest Transactions",
      href: "/admin-dashboard/transactions",
      icon: "ArrowRightLeft",
    },
  ];

  return <SideNav title="Admin Panel" navItems={adminNavItems} />;
}
