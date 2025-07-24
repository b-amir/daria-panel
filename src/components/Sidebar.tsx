import Image from "next/image";
import { SidebarNav } from "@/components/SidebarNav";
import { UserBox } from "@/components/UserBox";
import { cookies } from "next/headers";

export async function Sidebar() {
  const username = (await cookies()).get("username")?.value;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-50 border-r border-gray-300 shadow-sm shadow-gray-200 flex z-10 flex-col p-6 overflow-y-auto">
      <div className="mb-8 flex flex-col items-center">
        <Image src="/logo.svg" alt="Logo" width={164} height={48} priority />
      </div>
      <SidebarNav />
      <UserBox username={username} />
    </aside>
  );
}
