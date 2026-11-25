"use server";

import { checkBotId } from "botid/server";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { getStoreConfig } from "@/lib/store-config";

type NewsletterState = {
	success: boolean;
	message: string;
	/** Echoed on success so the page can pass it to the tracking `visitor()`. */
	email?: string;
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

	// The form disables its submit button until the box is ticked; this is the server-side
	// half of that gate, so a signup with no marketing consent is never recorded.
	if (formData.get("marketingConsent") !== "on") {
		return {
			success: false,
			message: "",
			error: "Please accept marketing permissions to subscribe.",
		};
	}

	// A bot gets the shopper's answer, so it can't tell it was turned away, and no email is echoed
	// back to tracking. The browser half is <BotIdClient> in the root layout.
	const { isBot } = await checkBotId();
	if (isBot) {
		return { success: true, message: "Thanks for subscribing!" };
	}

	// The signup's language: the confirmation and welcome emails are sent in it.
	const { language } = await getStoreConfig();
	const [error, subscriber] = await try_(
		commerce.subscriberCreate({ email, marketingConsent: true, locale: language ?? undefined }),
	);
	if (error) {
		console.error("newsletter: subscriberCreate failed", { error });
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	// Double opt-in: the address is not on the list until the shopper clicks the emailed link.
	if (subscriber.pending) {
		return { success: true, message: "Almost done! Check your inbox to confirm your subscription.", email };
	}

	return { success: true, message: "Thanks for subscribing!", email };
}
