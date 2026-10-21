"use client";

import { Star } from "lucide-react";
import { useActionState, useState } from "react";
import { submitReview } from "@/app/product/[slug]/review-action";

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
							aria-hidden="true"
							className={`h-6 w-6 ${
								starValue <= (hovered || value) ? "fill-snow text-snow" : "text-muted-foreground"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

export function ReviewForm({ slug }: { slug: string }) {
	const [state, action, isPending] = useActionState(submitReview, null);
	const [rating, setRating] = useState(0);

	if (state?.success) {
		return (
			<div className="border-t border-snow pt-6 text-center">
				<p className="font-medium">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="space-y-4 border-t border-snow pt-6">
			<h3 className="text-lg font-medium">Write a Review</h3>

			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<span className="mb-1.5 block text-sm font-medium">Rating</span>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label htmlFor="review-author" className="mb-1.5 block text-sm font-medium">
						Name
					</label>
					<input
						id="review-author"
						name="author"
						type="text"
						required
						className="w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm focus:border-snow focus:outline-none"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label htmlFor="review-email" className="mb-1.5 block text-sm font-medium">
						Email
					</label>
					<input
						id="review-email"
						name="email"
						type="email"
						required
						className="w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm focus:border-snow focus:outline-none"
						placeholder="your@email.com"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="review-content" className="mb-1.5 block text-sm font-medium">
					Review
				</label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm focus:border-snow focus:outline-none resize-none"
					placeholder="Share your experience with this product..."
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={isPending || rating === 0}
				className="bg-snow px-8 py-3 text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{isPending ? "Submitting..." : "Submit Review"}
			</button>
		</form>
	);
}
