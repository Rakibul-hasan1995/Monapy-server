// components/defaultNavItems.tsx
import React from "react";
import {
  ArrowDownOnSquareIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpOnSquareIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  // DocumentTextIcon,
  // CalendarIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};
export const defaultNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <FolderIcon className="w-6 h-6" />,
  },
  {
    label: "Report",
    href: "/report/orders",
    icon: <ArrowPathRoundedSquareIcon className="w-6 h-6" />,
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: <BanknotesIcon className="w-6 h-6" />,
  },
  {
    label: "Productions",
    href: "/productions",
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
  {
    label: "Delivery",
    href: "/delivery-chalan",
    icon: <ArrowUpOnSquareIcon className="w-6 h-6" />,
  },
  {
    label: "Receive",
    href: "/receive-chalan",
    icon: <ArrowDownOnSquareIcon className="w-6 h-6" />,
  },

];
export const clientNavItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <FolderIcon className="w-6 h-6" />,
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: <BanknotesIcon className="w-6 h-6" />,
  },
  {
    label: "Statement",
    href: "/statement",
    icon: <DocumentTextIcon className="w-6 h-6" />,
  },

];
