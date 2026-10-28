import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import AdminDeliveryAreas from "@/components/admin/AdminDeliveryAreas";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, deliveryAreas] = await Promise.all([
    prisma.restaurantSettings.findFirst(),
    prisma.deliveryArea.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal-800">Settings</h1>
        <p className="text-sm text-charcoal-400 mt-1">
          Configure your restaurant details, hours, and ordering options.
        </p>
      </div>

      <AdminSettingsForm settings={settings} />
      <AdminDeliveryAreas deliveryAreas={deliveryAreas} />
    </div>
  );
}
