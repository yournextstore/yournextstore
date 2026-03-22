"use server";

import { commerce } from "@/lib/commerce";

type ReviewState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
	const slug = formData.get("slug");
	const author = formData.get("author");
	const email = formData.get("email");
	const content = formData.get("content");
	const rating = formData.get("rating");

	if (!slug || typeof slug !== "string") {
		return { success: false, message: "", error: "Product not found." };
	}

	if (!author || typeof author !== "string" || !author.trim()) {
		return { success: false, message: "", error: "Please enter your name." };
	}

	if (!email || typeof email !== "string") {
		return { success: false, message: "", error: "Please enter a valid email." };
	}

	if (!content || typeof content !== "string" || !content.trim()) {
		return { success: false, message: "", error: "Please write a review." };
	}

	const ratingNum = Number(rating);
	if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
		return { success: false, message: "", error: "Please select a rating." };
	}

	try {
		await commerce.productReviewCreate(
			{ idOrSlug: slug },
			{ author: author.trim(), email, content: content.trim(), rating: ratingNum },
		);

		return { success: true, message: "Thanks for your review! It will appear once approved." };
	} catch {
		return { success: false, message: "", error: "Something went wrong. Please try again." };
	}
}
