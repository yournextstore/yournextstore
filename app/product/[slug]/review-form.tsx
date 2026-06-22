"use client";

import type { APIReviewTokenResult } from "commerce-kit";
import { Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useState } from "react";
import { submitReview } from "@/app/product/[slug]/review-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
	const [hovered, setHovered] = useState(0);

	return (
		<div className="flex gap-1">
			{Array.from({ length: 5 }, (_, i) => {
				const starValue = i + 1;
				return (
					<button
						key={starValue}
						type="button"
						onMouseEnter={() => setHovered(starValue)}
						onMouseLeave={() => setHovered(0)}
						onClick={() => onChange(starValue)}
						aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
						aria-pressed={starValue === value}
						className="transition-transform hover:scale-110"
					>
						<Star
							className={`h-6 w-6 ${
								starValue <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

type TokenAnswer = APIReviewTokenResult | { status: "failed" };

// Asked only when the shopper clicks, so the product page stays cached. Same-origin under the
// proxied /checkout, so the browser sends the shopper's session cookie.
async function fetchReviewToken(productId: string): Promise<TokenAnswer> {
	const response = await fetch(`/checkout/api/review-token?product=${encodeURIComponent(productId)}`).catch(
		() => null,
	);
	const answer: APIReviewTokenResult | null = response?.ok ? await response.json().catch(() => null) : null;
	return answer ?? { status: "failed" };
}

// A buyer who checked out as a guest, or under another email, can only review from the link in
// their delivery email.
const BUYERS_ONLY =
	"Only customers who bought this product can review it. Bought it? Use the review link in your delivery email.";

const NOTES: Record<Exclude<TokenAnswer["status"], "ok">, string> = {
	failed: "Reviews can't be written right now.",
	sign_in: BUYERS_ONLY,
	not_bought: BUYERS_ONLY,
	already_reviewed: "You've already reviewed this product.",
};

export function WriteReview({ productId }: { productId: string }) {
	const pathname = usePathname();
	const [answer, setAnswer] = useState<TokenAnswer | null>(null);
	const [checking, setChecking] = useState(false);

	if (answer?.status === "ok") {
		return <ReviewForm productId={productId} token={answer.token} />;
	}

	return (
		<div className="space-y-3">
			<Button
				variant="outline"
				className="h-12 rounded-none border-zinc-900 bg-transparent px-6 text-xs tracking-[0.15em] uppercase text-zinc-900 hover:bg-zinc-900 hover:text-white"
				// Only a failed check is worth repeating; the other answers hold until the shopper navigates.
				disabled={checking || (answer !== null && answer.status !== "failed")}
				onClick={async () => {
					setChecking(true);
					setAnswer(await fetchReviewToken(productId));
					setChecking(false);
				}}
			>
				{checking ? "Checking..." : "Write a Review"}
			</Button>
			{answer && (
				<p className="text-sm font-light text-zinc-500">
					{NOTES[answer.status]}{" "}
					{answer.status === "sign_in" && answer.canSignIn && (
						<a
							href={`/checkout/account/login?return_to=${encodeURIComponent(pathname)}`}
							className="text-zinc-900 underline underline-offset-4"
						>
							Sign in to review
						</a>
					)}
				</p>
			)}
		</div>
	);
}

/** Posts a review with the token that proves the purchase: from WriteReview or the delivered-order email link. */
export function ReviewForm({ productId, token }: { productId: string; token: string }) {
	const [state, action, isPending] = useActionState(submitReview, null);
	const [rating, setRating] = useState(0);

	if (state?.success) {
		return (
			<div className="border border-zinc-200 bg-zinc-100 p-6 text-center">
				<p className="text-sm font-light text-zinc-900">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="space-y-6 border border-zinc-200 p-8">
			<h3 className="text-xs tracking-[0.3em] uppercase text-zinc-400">Write a Review</h3>

			<input type="hidden" name="product" value={productId} />
			<input type="hidden" name="token" value={token} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<span className="mb-1.5 block text-xs tracking-[0.2em] uppercase text-zinc-400">Rating</span>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="review-author" className="text-xs tracking-[0.2em] uppercase text-zinc-400">
					Name
				</Label>
				<Input
					id="review-author"
					name="author"
					type="text"
					required
					placeholder="Your name"
					className="rounded-none border-zinc-200 bg-transparent font-light"
				/>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="review-content" className="text-xs tracking-[0.2em] uppercase text-zinc-400">
					Review
				</Label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full rounded-none border border-zinc-200 bg-transparent px-3 py-2 text-sm font-light resize-none"
					placeholder="Share your experience with this product..."
				/>
			</div>

			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}

			<Button
				type="submit"
				disabled={isPending || rating === 0}
				className="h-12 w-full rounded-none bg-zinc-900 text-xs tracking-[0.15em] uppercase text-white hover:bg-zinc-800"
			>
				{isPending ? "Submitting..." : "Submit Review"}
			</Button>
		</form>
	);
}
