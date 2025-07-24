import Image from "next/image";
import { SidebarNav } from "@/components/sidebar/SidebarNav";
import { UserBox } from "@/components/sidebar/UserBox";
import { cookies } from "next/headers";
import { COMMON_STYLES } from "@/constants/commonStyles";

export async function Sidebar() {
  const username = (await cookies()).get("username")?.value;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-50 border-r border-gray-300 shadow-sm shadow-gray-200 flex z-10 flex-col overflow-y-auto">
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
  );
}
