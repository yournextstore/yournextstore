"use server";

import { commerce } from "@/lib/commerce";

type ContactState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
	const email = formData.get("email");
	const message = formData.get("message");

	if (!email || typeof email !== "string") {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	if (!message || typeof message !== "string" || message.trim().length === 0) {
		return { success: false, message: "", error: "Please enter a message." };
	}

	try {
		await commerce.contactMessageCreate({ email, message });

		return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
	} catch {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}
}
