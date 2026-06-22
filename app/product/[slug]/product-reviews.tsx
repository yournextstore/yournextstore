import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { Star } from "lucide-react";
import { ReviewForm } from "@/app/product/[slug]/review-form";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
	const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={`${sizeClass} ${
						i < rating
							? "fill-foreground text-foreground"
							: "fill-[var(--color-surface-variant)] text-[var(--color-surface-variant)]"
					}`}
				/>
			))}
		</div>
	);
}

function ReviewSummary({ summary }: { summary: APIProductReviewsBrowseResult["summary"] }) {
	if (summary.reviewCount === 0) return null;

	return (
		<div className="inline-flex items-center gap-3 neo-border bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-4 py-2">
			<StarRating rating={Math.round(summary.averageRating)} size="lg" />
			<span className="font-serif text-2xl font-semibold">{summary.averageRating.toFixed(1)}</span>
			<span className="label-caps">
				{summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
			</span>
		</div>
	);
}

function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<article className="neo-border bg-[var(--color-surface-container-lowest)] p-6">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-3">
					<StarRating rating={review.rating} />
					<span className="font-sans font-semibold">{review.author}</span>
				</div>
				<time className="label-caps text-[var(--color-on-surface-variant)]" dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</time>
			</div>
			<p className="text-[var(--color-on-surface-variant)] leading-relaxed">{review.content}</p>
		</article>
	);
}

export function ProductReviews({ reviews, slug }: { reviews: APIProductReviewsBrowseResult; slug: string }) {
	return (
		<section
			id="reviews"
			className="border-b border-foreground py-16 md:py-20 px-5 md:px-20 bg-background scroll-mt-24"
		>
			<div className="max-w-[1280px] mx-auto">
				<div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
					<div>
						<span className="label-caps text-[var(--color-on-surface-variant)]">Voices</span>
						<h2 className="font-serif text-3xl md:text-4xl mt-3">Customer Reviews</h2>
					</div>
					<ReviewSummary summary={reviews.summary} />
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-4">
						{reviews.data.length > 0 ? (
							reviews.data.map((review) => <ReviewCard key={review.id} review={review} />)
						) : (
							<div className="neo-border bg-[var(--color-surface-container-lowest)] p-8 text-center">
								<p className="font-serif text-xl">No reviews yet</p>
								<p className="text-[var(--color-on-surface-variant)] mt-2">
									Be the first to share your thoughts.
								</p>
							</div>
						)}
					</div>
					<div className="lg:col-span-1">
						<ReviewForm slug={slug} />
					</div>
				</div>
			</div>
		</section>
	);
}
