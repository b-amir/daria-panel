import Image from "next/image";
import { SidebarNav } from "@/components/SidebarNav";
import { UserBox } from "@/components/UserBox";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-300 shadow-sm shadow-gray-200 flex z-10 flex-col p-6 overflow-y-auto max-h-screen">
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={164}
          height={48}
          priority
        />
      </div>
      <SidebarNav />
      <UserBox />
    </aside>
  );
}