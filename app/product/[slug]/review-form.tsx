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
						className="inline-flex size-9 items-center justify-center transition-transform hover:scale-110"
					>
						<Star
							className={`h-6 w-6 ${
								starValue <= (hovered || value) ? "fill-gold text-gold" : "fill-raised text-raised"
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
			<div className="glass p-6 text-center">
				<p className="font-medium">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="glass space-y-5 p-6 md:p-7">
			<h3 className="font-display text-title-sm">Write a review</h3>

			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<span className="eyebrow mb-2 block">Rating</span>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label htmlFor="review-author" className="eyebrow mb-2 block">
						Name
					</label>
					<input
						id="review-author"
						name="author"
						type="text"
						required
						className="w-full h-11 rounded-md border border-line bg-page px-3 py-2 text-base"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label htmlFor="review-email" className="eyebrow mb-2 block">
						Email
					</label>
					<input
						id="review-email"
						name="email"
						type="email"
						required
						className="w-full h-11 rounded-md border border-line bg-page px-3 py-2 text-base"
						placeholder="your@email.com"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="review-content" className="eyebrow mb-2 block">
					Review
				</label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full min-h-28 rounded-md border border-line bg-page px-3 py-2 text-base resize-none"
					placeholder="Share your experience with this product..."
				/>
			</div>

			{state?.error && <p className="text-sm text-[#e08a82]">{state.error}</p>}

			<button type="submit" disabled={isPending || rating === 0} className="btn-gold h-11 text-sm">
				{isPending ? "Submitting..." : "Submit Review"}
			</button>
		</form>
	);
}
