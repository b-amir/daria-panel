import { HiUsers } from "react-icons/hi";
import { FaTableList } from "react-icons/fa6";
import { ComponentType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  { label: "Users", href: "/users", icon: HiUsers },
  { label: "Logs", href: "/logs", icon: FaTableList },
];
