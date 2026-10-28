import type { Metadata } from "next";
import { getAdminOrders } from "@/actions/admin.actions";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import Link from "next/link";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "",                     label: "All Orders" },
  { value: "PENDING_CONFIRMATION", label: "Pending" },
  { value: "CONFIRMED",            label: "Confirmed" },
  { value: "PREPARING",            label: "Preparing" },
  { value: "READY",                label: "Ready" },
  { value: "OUT_FOR_DELIVERY",     label: "Delivering" },
  { value: "COMPLETED",            label: "Completed" },
  { value: "CANCELLED",            label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const { orders, total } = await getAdminOrders({
    status: searchParams.status,
    page,
    limit: 25,
  });

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-800">Orders</h1>
          <p className="text-sm text-charcoal-400 mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/admin/orders${s.value ? `?status=${s.value}` : ""}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              (searchParams.status || "") === s.value
                ? "bg-charcoal-800 text-white"
                : "bg-white text-charcoal-500 hover:bg-charcoal-100 border border-charcoal-200"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <AdminOrdersTable orders={orders} />
      </div>

      {/* Pagination */}
      {total > 25 && (
        <div className="flex justify-center gap-2 mt-5">
          {page > 1 && (
            <Link
              href={`/admin/orders?${new URLSearchParams({ ...(searchParams.status ? { status: searchParams.status } : {}), page: String(page - 1) })}`}
              className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50"
            >
              ← Previous
            </Link>
          )}
          {page * 25 < total && (
            <Link
              href={`/admin/orders?${new URLSearchParams({ ...(searchParams.status ? { status: searchParams.status } : {}), page: String(page + 1) })}`}
              className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
