"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";

type ReviewState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
	const product = formData.get("product");
	const token = formData.get("token");
	const author = formData.get("author");
	const content = formData.get("content");
	const rating = formData.get("rating");

	if (!product || typeof product !== "string") {
		return { success: false, message: "", error: "Product not found." };
	}

	if (!token || typeof token !== "string") {
		return { success: false, message: "", error: "Only customers who bought this product can review it." };
	}

	if (!author || typeof author !== "string" || !author.trim()) {
		return { success: false, message: "", error: "Please enter your name." };
	}

	if (!content || typeof content !== "string" || !content.trim()) {
		return { success: false, message: "", error: "Please write a review." };
	}

	const ratingNum = Number(rating);
	if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
		return { success: false, message: "", error: "Please select a rating." };
	}

	// The platform takes the reviewer's email from the order the token names, and refuses a
	// token whose order no longer counts as a purchase or was already reviewed.
	const [error] = await try_(
		commerce.productReviewCreate(
			{ idOrSlug: product },
			{ token, author: author.trim(), content: content.trim(), rating: ratingNum },
		),
	);
	if (error) {
		console.error("review: productReviewCreate failed", { product, error });
		return {
			success: false,
			message: "",
			error:
				"We couldn't post your review. This purchase may already be reviewed, or the order no longer counts.",
		};
	}

	return { success: true, message: "Thanks for your review! It will appear once approved." };
}
