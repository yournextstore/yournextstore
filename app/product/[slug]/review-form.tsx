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
				const filled = starValue <= (hovered || value);
				return (
					<button
						key={starValue}
						type="button"
						onMouseEnter={() => setHovered(starValue)}
						onMouseLeave={() => setHovered(0)}
						onClick={() => onChange(starValue)}
						className="transition-transform hover:scale-110"
						aria-label={`Rate ${starValue} of 5`}
					>
						<Star
							className={`h-7 w-7 ${
								filled
									? "fill-foreground text-foreground"
									: "fill-[var(--color-surface-variant)] text-[var(--color-surface-variant)]"
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
			<div className="neo-border bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] p-6 text-center">
				<p className="font-serif text-xl">{state.message}</p>
			</div>
		);
	}

	const inputCls =
		"w-full neo-border bg-[var(--color-surface-container-lowest)] px-3 py-2 text-sm focus:outline-none focus:neo-shadow-sm transition-shadow";

	return (
		<form
			action={action}
			className="neo-border bg-[var(--color-surface-container-lowest)] p-6 space-y-5 md:sticky md:top-32"
		>
			<div>
				<span className="label-caps">Write a Review</span>
				<h3 className="font-serif text-2xl mt-1">Share your experience</h3>
			</div>

			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<label className="label-caps mb-2 block">Rating</label>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="grid gap-3">
				<div>
					<label htmlFor="review-author" className="label-caps mb-2 block">
						Name
					</label>
					<input
						id="review-author"
						name="author"
						type="text"
						required
						className={inputCls}
						placeholder="Your name"
					/>
				</div>
				<div>
					<label htmlFor="review-email" className="label-caps mb-2 block">
						Email
					</label>
					<input
						id="review-email"
						name="email"
						type="email"
						required
						className={inputCls}
						placeholder="you@email.com"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="review-content" className="label-caps mb-2 block">
					Review
				</label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className={`${inputCls} resize-none`}
					placeholder="What did you think?"
				/>
			</div>

			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}

			<button
				type="submit"
				disabled={isPending || rating === 0}
				className="w-full label-caps neo-border bg-foreground text-background h-12 transition-all hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] hover:neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:hover:bg-foreground disabled:hover:text-background disabled:hover:shadow-none"
			>
				{isPending ? "Submitting…" : "Submit Review"}
			</button>
		</form>
	);
}
