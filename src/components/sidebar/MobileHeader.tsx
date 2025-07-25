"use client";
import Image from "next/image";
import { FiMenu as MenuIcon, FiX as CloseIcon } from "react-icons/fi";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";

export function MobileHeader() {
  const isOpen = useMobileSidebarStore((state) => state.isOpen);
  const toggle = useMobileSidebarStore((state) => state.toggle);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/30 backdrop-blur-lg border-b border-gray-300 flex items-center justify-between px-4 z-50 lg:hidden">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={120} height={35} priority />
      </div>

      <button
        onClick={toggle}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-sidebar"
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 text-gray-600" />
        ) : (
          <MenuIcon className="w-6 h-6 text-gray-600" />
        )}
      </button>
    </header>
  );
}
