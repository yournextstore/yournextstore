"use server";

import { checkBotId } from "botid/server";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";

type RestockState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function subscribeToRestock(_prev: RestockState, formData: FormData): Promise<RestockState> {
	const productVariantId = formData.get("productVariantId");
	const email = formData.get("email");
	// Optional — only a ticked box makes the address a marketing subscriber.
	const marketingConsent = formData.get("marketingConsent") === "on";

	if (!productVariantId || typeof productVariantId !== "string") {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		return { success: false, message: "", error: "Please enter a valid email." };
	}

	const { isBot } = await checkBotId();
	if (isBot) {
		return { success: true, message: "Done! We'll email you when this item is back in stock." };
	}

	const [error, result] = await try_(
		commerce.request<{ status: string }>("/availability-notifications", {
			method: "POST",
			body: { email, productVariantId, marketingConsent },
		}),
	);
	if (error) {
		console.error("restock: availability-notifications failed", { productVariantId, error });
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	if (result.status === "already_subscribed") {
		return { success: true, message: "You're already on the list — we'll email you when it's back." };
	}

	return { success: true, message: "Done! We'll email you when this item is back in stock." };
}
