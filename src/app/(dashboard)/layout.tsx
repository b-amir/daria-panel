import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
