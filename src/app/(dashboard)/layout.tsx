import { Sidebar } from "@/components/Sidebar";
import { DashboardClientWrapper } from "@/components/DashboardClientWrapper";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="ml-64">
        <DashboardClientWrapper>{children}</DashboardClientWrapper>
      </main>
    </div>
  );
}
