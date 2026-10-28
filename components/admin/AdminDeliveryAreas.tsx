"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { DeliveryArea } from "@prisma/client";

interface Props {
  deliveryAreas: DeliveryArea[];
}

export default function AdminDeliveryAreas({ deliveryAreas: initial }: Props) {
  const [areas, setAreas] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [newArea, setNewArea] = useState({ name: "", feeKobo: 0 });

  async function addArea() {
    if (!newArea.name.trim()) {
      toast.error("Area name is required");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/admin/delivery-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArea.name.trim(),
          feeKobo: Math.round(newArea.feeKobo * 100),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAreas((prev) => [...prev, data.data]);
        setNewArea({ name: "", feeKobo: 0 });
        toast.success("Delivery area added");
      } else {
        toast.error(data.error || "Failed to add area");
      }
    });
  }

  async function toggleArea(id: string, isActive: boolean) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/delivery-areas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAreas((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: !isActive } : a))
        );
      } else {
        toast.error("Failed to update area");
      }
    });
  }

  return (
    <div className="card p-5 md:p-6">
      <h2 className="text-base font-bold text-charcoal-800 mb-4">
        Delivery Areas
      </h2>
      <p className="text-xs text-charcoal-400 mb-4">
        Configure your delivery zones and fees. Only active areas will appear at checkout.
      </p>

      {/* Current areas */}
      {areas.length > 0 ? (
        <div className="space-y-2 mb-5">
          {areas.map((area) => (
            <div
              key={area.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                area.isActive
                  ? "border-charcoal-200 bg-white"
                  : "border-charcoal-100 bg-charcoal-50 opacity-60"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-charcoal-800">{area.name}</p>
                <p className="text-xs text-charcoal-500">{formatNaira(area.feeKobo)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleArea(area.id, area.isActive)}
                  disabled={isPending}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    area.isActive
                      ? "bg-sage-100 text-sage-700 hover:bg-sage-200"
                      : "bg-charcoal-100 text-charcoal-500 hover:bg-charcoal-200"
                  }`}
                >
                  {area.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-charcoal-400 mb-4 italic">
          No delivery areas configured yet.
        </p>
      )}

      {/* Add new area */}
      <div className="border-t border-charcoal-100 pt-4">
        <p className="text-xs font-semibold text-charcoal-600 mb-2">Add New Area</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Area name (e.g. Lekki Phase 1)"
            value={newArea.name}
            onChange={(e) => setNewArea((n) => ({ ...n, name: e.target.value }))}
            className="form-input flex-1 min-w-40 text-sm"
          />
          <input
            type="number"
            placeholder="Fee (₦)"
            min="0"
            value={newArea.feeKobo || ""}
            onChange={(e) => setNewArea((n) => ({ ...n, feeKobo: Number(e.target.value) }))}
            className="form-input w-32 text-sm"
          />
          <button
            onClick={addArea}
            disabled={isPending}
            className="btn-primary text-sm"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
