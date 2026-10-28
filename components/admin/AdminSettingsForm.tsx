"use client";

import { useState, useTransition } from "react";
import { updateRestaurantSettings } from "@/actions/admin.actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import type { RestaurantSettings } from "@prisma/client";

interface Props {
  settings: RestaurantSettings | null;
}

export default function AdminSettingsForm({ settings }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await updateRestaurantSettings({
        restaurantName: data.get("restaurantName") as string,
        phone: data.get("phone") as string,
        whatsapp: data.get("whatsapp") as string,
        email: data.get("email") as string,
        address: data.get("address") as string,
        mapEmbedUrl: data.get("mapEmbedUrl") as string,
        deliveryEnabled: data.get("deliveryEnabled") === "on",
        pickupEnabled: data.get("pickupEnabled") === "on",
        minimumOrderNaira: Number(data.get("minimumOrderNaira") || "0"),
        acceptingOrders: data.get("acceptingOrders") === "on",
        orderClosedMessage: data.get("orderClosedMessage") as string,
        instagramUrl: data.get("instagramUrl") as string,
        twitterUrl: data.get("twitterUrl") as string,
        facebookUrl: data.get("facebookUrl") as string,
        tiktokUrl: data.get("tiktokUrl") as string,
        estPrepMinutes: Number(data.get("estPrepMinutes") || "30"),
        estDeliveryMinutes: Number(data.get("estDeliveryMinutes") || "45"),
      });

      if (result.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 md:p-6 space-y-5">
      <h2 className="text-base font-bold text-charcoal-800">Restaurant Details</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
          <input
            id="restaurantName"
            name="restaurantName"
            type="text"
            defaultValue={settings?.restaurantName || "Belle Food"}
            className="form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+234 XXX XXX XXXX"
            defaultValue={settings?.phone || ""}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            placeholder="+2348XXXXXXXXX"
            defaultValue={settings?.whatsapp || ""}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="hello@bellefood.ng"
            defaultValue={settings?.email || ""}
            className="form-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className="form-label">Restaurant Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Full street address"
            defaultValue={settings?.address || ""}
            className="form-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mapEmbedUrl" className="form-label">
            Google Maps Embed URL
          </label>
          <input
            id="mapEmbedUrl"
            name="mapEmbedUrl"
            type="url"
            placeholder="https://www.google.com/maps/embed?..."
            defaultValue={settings?.mapEmbedUrl || ""}
            className="form-input"
          />
          <p className="text-xs text-charcoal-400 mt-1">
            Get this from Google Maps → Share → Embed a map → Copy HTML src URL
          </p>
        </div>
      </div>

      <hr className="border-charcoal-100" />
      <h2 className="text-base font-bold text-charcoal-800">Order Settings</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <input
            id="acceptingOrders"
            name="acceptingOrders"
            type="checkbox"
            defaultChecked={settings?.acceptingOrders ?? true}
            className="w-4 h-4 rounded border-charcoal-300 text-tomato-600"
          />
          <label htmlFor="acceptingOrders" className="text-sm font-medium text-charcoal-700">
            Currently accepting orders
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="deliveryEnabled"
            name="deliveryEnabled"
            type="checkbox"
            defaultChecked={settings?.deliveryEnabled ?? true}
            className="w-4 h-4 rounded border-charcoal-300 text-tomato-600"
          />
          <label htmlFor="deliveryEnabled" className="text-sm font-medium text-charcoal-700">
            Delivery enabled
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="pickupEnabled"
            name="pickupEnabled"
            type="checkbox"
            defaultChecked={settings?.pickupEnabled ?? true}
            className="w-4 h-4 rounded border-charcoal-300 text-tomato-600"
          />
          <label htmlFor="pickupEnabled" className="text-sm font-medium text-charcoal-700">
            Pickup enabled
          </label>
        </div>
        <div>
          <label htmlFor="minimumOrderNaira" className="form-label">
            Minimum Order (₦)
          </label>
          <input
            id="minimumOrderNaira"
            name="minimumOrderNaira"
            type="number"
            min="0"
            defaultValue={(settings?.minimumOrderKobo ?? 0) / 100}
            className="form-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="orderClosedMessage" className="form-label">
            Closed Message
          </label>
          <input
            id="orderClosedMessage"
            name="orderClosedMessage"
            type="text"
            placeholder="We are currently closed. Please check back later."
            defaultValue={settings?.orderClosedMessage || ""}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="estPrepMinutes" className="form-label">
            Est. Prep Time (minutes)
          </label>
          <input
            id="estPrepMinutes"
            name="estPrepMinutes"
            type="number"
            min="0"
            max="480"
            defaultValue={settings?.estPrepMinutes ?? 30}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="estDeliveryMinutes" className="form-label">
            Est. Delivery Time (minutes)
          </label>
          <input
            id="estDeliveryMinutes"
            name="estDeliveryMinutes"
            type="number"
            min="0"
            max="480"
            defaultValue={settings?.estDeliveryMinutes ?? 45}
            className="form-input"
          />
        </div>
      </div>

      <hr className="border-charcoal-100" />
      <h2 className="text-base font-bold text-charcoal-800">Social Media</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { name: "instagramUrl", label: "Instagram URL", defaultValue: settings?.instagramUrl || "" },
          { name: "twitterUrl", label: "Twitter/X URL", defaultValue: settings?.twitterUrl || "" },
          { name: "facebookUrl", label: "Facebook URL", defaultValue: settings?.facebookUrl || "" },
          { name: "tiktokUrl", label: "TikTok URL", defaultValue: settings?.tiktokUrl || "" },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="form-label">{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type="url"
              placeholder="https://..."
              defaultValue={field.defaultValue}
              className="form-input"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
        ) : (
          <><Save className="w-4 h-4" /> Save Settings</>
        )}
      </button>
    </form>
  );
}
