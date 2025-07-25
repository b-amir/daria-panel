import { Sidebar } from "@/components/sidebar/Sidebar";
import { DashboardClientWrapper } from "@/components/DashboardClientWrapper";
import { MobileHeader } from "@/components/sidebar/MobileHeader";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = (await cookies()).get("username")?.value;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <MobileHeader />
      <Sidebar username={username} />
      <main className="pt-16 lg:pt-0 lg:ml-64 h-screen">
        <DashboardClientWrapper>{children}</DashboardClientWrapper>
      </main>
    </div>
  );
}
