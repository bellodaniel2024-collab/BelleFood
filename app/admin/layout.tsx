import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — Belle Food",
    template: "%s — Admin | Belle Food",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      <AdminSidebar user={session.user} />
      <div className="flex-1 min-w-0 md:ml-60">
        <main className="p-4 md:p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
