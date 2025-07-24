"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../constants/navItems";
import { FaChevronRight } from "react-icons/fa";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 mt-4 flex-1">
      {navItems.map((item) => {
        const isSelected = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-between ${
              isSelected
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            {item.label}
            {isSelected && <FaChevronRight fontSize="small" />}
          </Link>
        );
      })}
    </nav>
  );
}
