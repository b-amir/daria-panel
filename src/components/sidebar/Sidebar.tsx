"use client";
import Image from "next/image";
import { SidebarNav } from "@/components/sidebar/SidebarNav";
import { UserBox } from "@/components/sidebar/UserBox";
import { COMMON_STYLES } from "@/constants/commonStyles";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";
import { useEffect, useRef } from "react";

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const isOpen = useMobileSidebarStore((state) => state.isOpen);
  const close = useMobileSidebarStore((state) => state.close);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sidebar = document.getElementById("mobile-sidebar");
      const mobileHeader = document.querySelector("header");

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(target) &&
        !mobileHeader?.contains(target)
      ) {
        close();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        sidebarRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        tabIndex={-1}
        className={`
          fixed left-0 top-0 w-64 h-screen bg-gray-50 border-r border-gray-300 shadow-sm shadow-gray-200 flex z-50 flex-col overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-10
        `}
      >
        <div
          className={`${COMMON_STYLES.heights.logoContainer} flex flex-col items-center justify-center border-b border-gray-300 px-6 bg-gradient-to-br from-accent/20 via-accent/5 to-gray-50`}
        >
          <Image src="/logo.svg" alt="Logo" width={164} height={48} priority />
        </div>
        <div className="flex-1 p-6 pb-0 flex flex-col overflow-y-auto">
          <SidebarNav />
        </div>
        <UserBox username={username} />
      </aside>
    </>
  );
}
