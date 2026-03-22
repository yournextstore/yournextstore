"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { submitReview } from "@/app/[locale]/product/[slug]/review-action";

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
	const t = useTranslations("Reviews");

	if (state?.success) {
		return (
			<div className="rounded-lg border border-border bg-secondary/50 p-6 text-center">
				<p className="font-medium">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="space-y-4 rounded-lg border border-border p-6">
			<h3 className="text-lg font-medium">{t("writeReview")}</h3>

			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="rating" value={rating} />

			<div>
				<label className="mb-1.5 block text-sm font-medium">{t("rating")}</label>
				<StarInput value={rating} onChange={setRating} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label htmlFor="review-author" className="mb-1.5 block text-sm font-medium">
						{t("name")}
					</label>
					<input
						id="review-author"
						name="author"
						type="text"
						required
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						placeholder={t("namePlaceholder")}
					/>
				</div>
				<div>
					<label htmlFor="review-email" className="mb-1.5 block text-sm font-medium">
						{t("email")}
					</label>
					<input
						id="review-email"
						name="email"
						type="email"
						required
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						placeholder={t("emailPlaceholder")}
					/>
				</div>
			</div>

			<div>
				<label htmlFor="review-content" className="mb-1.5 block text-sm font-medium">
					{t("review")}
				</label>
				<textarea
					id="review-content"
					name="content"
					required
					rows={4}
					className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
					placeholder={t("reviewPlaceholder")}
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={isPending || rating === 0}
				className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{isPending ? t("submitting") : t("submitReview")}
			</button>
		</form>
	);
}
