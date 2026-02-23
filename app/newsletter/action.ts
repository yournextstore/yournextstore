"use server";

import { commerce } from "@/lib/commerce";

type NewsletterState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function subscribeToNewsletter(
	_prev: NewsletterState,
	formData: FormData,
): Promise<NewsletterState> {
	const email = formData.get("email");

	if (!email || typeof email !== "string") {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	try {
		await commerce.subscriberCreate({ email });

		return { success: true, message: "Thanks for subscribing!" };
	} catch {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}
}
