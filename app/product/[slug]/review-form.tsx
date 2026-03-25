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

export function ReviewForm({ slug }: { slug: string }) {
	const [state, action, isPending] = useActionState(submitReview, null);
	const [rating, setRating] = useState(0);

	if (state?.success) {
		return (
			<div className="surface-panel p-6 text-center">
				<p className="font-medium">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="surface-panel space-y-4 p-6">
			<h3 className="font-editorial text-[1.7rem] leading-none tracking-[-0.04em] text-foreground">
				Write a review
			</h3>

			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<label className="mb-2 block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
					Rating
				</label>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label
						htmlFor="review-author"
						className="mb-2 block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground"
					>
						Name
					</label>
					<input
						id="review-author"
						name="author"
						type="text"
						required
						className="h-11 w-full border border-input bg-background px-3 text-sm"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label
						htmlFor="review-email"
						className="mb-2 block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground"
					>
						Email
					</label>
					<input
						id="review-email"
						name="email"
						type="email"
						required
						className="h-11 w-full border border-input bg-background px-3 text-sm"
						placeholder="your@email.com"
					/>
				</div>
			</div>

			<div>
				<label
					htmlFor="review-content"
					className="mb-2 block text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground"
				>
					Review
				</label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full resize-none border border-input bg-background px-3 py-3 text-sm"
					placeholder="Share your experience with this product..."
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={isPending || rating === 0}
				className="border border-foreground bg-foreground px-6 py-3 text-[0.72rem] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-92 disabled:opacity-50"
			>
				{isPending ? "Submitting..." : "Submit review"}
			</button>
		</form>
	);
}
