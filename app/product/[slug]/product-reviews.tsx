import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { Star } from "lucide-react";
import { ReviewForm } from "@/app/product/[slug]/review-form";
import { Em } from "@/components/brand/em";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
	const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={`${sizeClass} ${i < rating ? "fill-gold text-gold" : "fill-raised text-raised"}`}
				/>
			))}
		</div>
	);
}

function ReviewSummary({ summary }: { summary: APIProductReviewsBrowseResult["summary"] }) {
	if (summary.reviewCount === 0) return null;

	return (
		<div className="flex items-center gap-3">
			<StarRating rating={Math.round(summary.averageRating)} size="lg" />
			<span className="font-display text-xl">{summary.averageRating.toFixed(1)}</span>
			<span className="text-muted-foreground">
				({summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"})
			</span>
		</div>
	);
}

/** The original's "What people say": each review a display-serif quote, with its author beneath. */
function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<li className="md:px-10 md:first:pl-0 md:last:pr-0">
			<StarRating rating={review.rating} />
			<blockquote className="mt-4 font-display text-xl leading-snug">{review.content}</blockquote>
			<p className="mt-6 text-sm text-muted-foreground">
				{review.author},{" "}
				<time dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</time>
			</p>
		</li>
	);
}

export function ProductReviews({ reviews, slug }: { reviews: APIProductReviewsBrowseResult; slug: string }) {
	return (
		<section id="reviews" className="scroll-mt-24 border-t border-line py-24 md:py-28">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="font-display text-title-lg md:text-title-xl">
					What <Em>people</Em> say
				</h2>
				<ReviewSummary summary={reviews.summary} />
			</div>
			{reviews.data.length > 0 ? (
				<ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
					{reviews.data.slice(0, 6).map((review) => (
						<ReviewCard key={review.id} review={review} />
					))}
				</ul>
			) : (
				<p className="mt-8 text-muted-foreground">No reviews yet. Be the first to share your thoughts.</p>
			)}
			<div className="mt-14 max-w-3xl">
				<ReviewForm slug={slug} />
			</div>
		</section>
	);
}
