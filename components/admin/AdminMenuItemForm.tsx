"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMenuItem, updateMenuItem, toggleMenuItemAvailability } from "@/actions/menu.actions";
import { toast } from "sonner";
import { Loader2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import type { Category, MenuItem } from "@prisma/client";

interface Props {
  categories: Category[];
  item?: MenuItem | null;
}

export default function AdminMenuItemForm({ categories, item }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toggling, setToggling] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      priceNaira: Number(data.get("priceNaira")),
      imageUrl: data.get("imageUrl") as string,
      isAvailable: data.get("isAvailable") === "on",
      isFeatured: data.get("isFeatured") === "on",
      categoryId: data.get("categoryId") as string,
      sortOrder: Number(data.get("sortOrder") || "0"),
    };

    startTransition(async () => {
      const result = item
        ? await updateMenuItem(item.id, payload)
        : await createMenuItem(payload);

      if (result.success) {
        toast.success(item ? "Menu item updated" : "Menu item created");
        router.push("/admin/menu");
      } else {
        toast.error(result.error || "Failed to save menu item");
      }
    });
  }

  async function handleToggleAvailability() {
    if (!item) return;
    setToggling(true);
    const result = await toggleMenuItemAvailability(item.id);
    if (result.success) {
      toast.success(result.data.isAvailable ? "Item marked available" : "Item marked unavailable");
      router.refresh();
    } else {
      toast.error("Failed to update availability");
    }
    setToggling(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 md:p-6 space-y-4">
      {item && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-50 border border-charcoal-100">
          <div>
            <p className="text-xs font-semibold text-charcoal-600">Availability</p>
            <p className={`text-sm font-bold ${item.isAvailable ? "text-sage-700" : "text-tomato-600"}`}>
              {item.isAvailable ? "Available" : "Unavailable"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAvailability}
            disabled={toggling}
            className="flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-800"
          >
            {item.isAvailable ? (
              <ToggleRight className="w-5 h-5 text-sage-600" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-charcoal-400" />
            )}
            Toggle
          </button>
        </div>
      )}

      <div>
        <label htmlFor="name" className="form-label">Name <span className="text-tomato-500">*</span></label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={item?.name || ""}
          placeholder="e.g. Party Jollof Rice"
          className="form-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={item?.description || ""}
          placeholder="Describe the dish..."
          className="form-input resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priceNaira" className="form-label">
            Price (₦) <span className="text-tomato-500">*</span>
          </label>
          <input
            id="priceNaira"
            name="priceNaira"
            type="number"
            required
            min="1"
            step="0.01"
            defaultValue={item ? item.priceKobo / 100 : ""}
            placeholder="e.g. 2500"
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="form-label">
            Category <span className="text-tomato-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={item?.categoryId || ""}
            className="form-input"
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="form-label">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={item?.imageUrl || ""}
          placeholder="https://..."
          className="form-input"
        />
        <p className="text-xs text-charcoal-400 mt-1">
          Use an Unsplash URL or upload to Cloudinary and paste the URL here.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sortOrder" className="form-label">Sort Order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={item?.sortOrder || 0}
            className="form-input"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            id="isAvailable"
            name="isAvailable"
            type="checkbox"
            defaultChecked={item?.isAvailable ?? true}
            className="w-4 h-4 rounded border-charcoal-300"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-charcoal-700">
            Available
          </label>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            defaultChecked={item?.isFeatured ?? false}
            className="w-4 h-4 rounded border-charcoal-300"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-charcoal-700">
            Featured
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> {item ? "Update Item" : "Create Item"}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/menu")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
