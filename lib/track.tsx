"use client";

// ─── Storefront analytics contract (vendor-neutral, keep thin) ──────────────
// Components publish commerce events here; the platform-served storefront kit
// (injected by instrumentation-client.ts) consumes the queue and forwards to
// whatever trackers the store has configured (Meta Pixel, …). Tracker-specific
// logic lives in the platform, NOT in this repo — never add tracker snippets
// (fbq, gtag, …) to template code.

import { useEffect } from "react";
import { CURRENCY } from "@/lib/constants";
import { minorUnitsToMajor } from "@/lib/money";

export type TrackedVariant = {
	id: string;
	sku?: string | null;
	/** Minor units, as the API returns it — converted internally. */
	price: string;
};

type TrackedItem = {
	id: string;
	name: string;
	price: number;
	quantity?: number;
	currency: string;
};

type QueueItem = ({ event: "ViewContent" | "AddToCart" } & TrackedItem) | { event: "ConsentChanged" };

declare global {
	interface Window {
		ynsTrackQueue?: QueueItem[];
	}
}

const publish = (item: QueueItem) => {
	window.ynsTrackQueue = window.ynsTrackQueue || [];
	window.ynsTrackQueue.push(item);
	window.dispatchEvent(new Event("yns:track"));
};

/** Same item id convention as the product feeds: variant sku when set, variant id otherwise. */
const trackItemId = (variant: TrackedVariant) => variant.sku || variant.id;

const toItem = (variant: TrackedVariant, name: string, quantity?: number): TrackedItem => ({
	id: trackItemId(variant),
	name,
	price: minorUnitsToMajor({ amount: variant.price, currency: CURRENCY }),
	quantity,
	currency: CURRENCY,
});

/** Publish an add-to-cart. Queued, so it is safe to call before the kit has loaded. */
export const trackAddToCart = (variant: TrackedVariant, name: string, quantity: number) =>
	publish({ event: "AddToCart", ...toItem(variant, name, quantity) });

/** Tell the kit the consent cookie changed so it can re-read it (no reload needed). */
export const notifyConsentChanged = () => publish({ event: "ConsentChanged" });

/** Fire-once product view — mount on the product page. */
export function TrackProductView({ variant, name }: { variant: TrackedVariant; name: string }) {
	const itemId = trackItemId(variant);
	// biome-ignore lint/correctness/useExhaustiveDependencies: fire once per product, not per render
	useEffect(() => {
		publish({ event: "ViewContent", ...toItem(variant, name) });
	}, [itemId]);
	return null;
}
