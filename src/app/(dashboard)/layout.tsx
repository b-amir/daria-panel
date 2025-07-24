import { Sidebar } from "@/components/sidebar/Sidebar";
import { DashboardClientWrapper } from "@/components/DashboardClientWrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="ml-64 h-screen">
        <DashboardClientWrapper>{children}</DashboardClientWrapper>
      </main>
    </div>
  );
}
