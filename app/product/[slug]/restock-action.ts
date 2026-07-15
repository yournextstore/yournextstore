"use server";

import { commerce } from "@/lib/commerce";

type RestockState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function subscribeToRestock(_prev: RestockState, formData: FormData): Promise<RestockState> {
	const productVariantId = formData.get("productVariantId");
	const email = formData.get("email");

	if (!productVariantId || typeof productVariantId !== "string") {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		return { success: false, message: "", error: "Please enter a valid email." };
	}

	try {
		const result = await commerce.request<{ status: string }>("/availability-notifications", {
			method: "POST",
			body: { email, productVariantId },
		});

		if (result.status === "already_subscribed") {
			return { success: true, message: "You're already on the list — we'll email you when it's back." };
		}

		return { success: true, message: "Done! We'll email you when this item is back in stock." };
	} catch {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}
}
