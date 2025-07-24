import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 ">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={164} height={48} priority />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
