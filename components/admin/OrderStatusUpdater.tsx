"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/admin.actions";
import { VALID_ORDER_TRANSITIONS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@prisma/client";

const STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: "Confirm Order",
  CONFIRMED:            "Start Preparing",
  PREPARING:            "Mark Ready",
  READY:                "Mark Out for Delivery / Complete",
  OUT_FOR_DELIVERY:     "Mark Completed",
  COMPLETED:            "",
  CANCELLED:            "",
};

const NEXT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED:        "Confirm Order",
  PREPARING:        "Start Preparing",
  READY:            "Mark Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED:        "Mark Completed",
  CANCELLED:        "Cancel Order",
};

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [staffNote, setStaffNote] = useState("");

  const allowedNext = VALID_ORDER_TRANSITIONS[currentStatus] || [];

  if (allowedNext.length === 0) {
    return (
      <p className="text-sm text-charcoal-400 italic">
        No further status updates available.
      </p>
    );
  }

  function handleUpdate(newStatus: string) {
    startTransition(async () => {
      const result = await updateOrderStatus({
        orderId,
        orderStatus: newStatus as OrderStatus,
        staffNote: staffNote || undefined,
      });

      if (result.success) {
        toast.success(`Order status updated to: ${newStatus.replace(/_/g, " ")}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="staffNote" className="text-xs text-charcoal-500 block mb-1">
          Staff note (optional)
        </label>
        <input
          id="staffNote"
          type="text"
          value={staffNote}
          onChange={(e) => setStaffNote(e.target.value)}
          placeholder="Internal note..."
          className="form-input text-sm"
        />
      </div>

      <div className="space-y-2">
        {allowedNext.map((status) => (
          <button
            key={status}
            onClick={() => handleUpdate(status)}
            disabled={isPending}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              status === "CANCELLED"
                ? "bg-tomato-50 text-tomato-700 hover:bg-tomato-100"
                : "bg-charcoal-800 text-white hover:bg-charcoal-700"
            } disabled:opacity-50`}
          >
            {isPending && (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            )}
            {NEXT_STATUS_LABELS[status] || status.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
