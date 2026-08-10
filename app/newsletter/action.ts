"use server";

import { try_ } from "safe-try";
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

	const [error] = await try_(commerce.subscriberCreate({ email }));
	if (error) {
		console.error("newsletter: subscriberCreate failed", { error });
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	return { success: true, message: "Thanks for subscribing!" };
}
