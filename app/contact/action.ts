"use server";

import { try_ } from "safe-try";
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

	const [error] = await try_(commerce.contactMessageCreate({ email, message }));
	if (error) {
		console.error("contact: contactMessageCreate failed", { error });
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}

	return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
}
