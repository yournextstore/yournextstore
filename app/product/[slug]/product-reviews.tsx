import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { BadgeCheck, Star } from "lucide-react";
import { WriteReview } from "@/app/product/[slug]/review-form";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
	const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={`${sizeClass} ${
						i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
					}`}
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
			<span className="text-lg font-medium">{summary.averageRating.toFixed(1)}</span>
			<span className="text-muted-foreground">
				({summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"})
			</span>
		</div>
	);
}

function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<div className="space-y-2 border-b border-border pb-6 last:border-0">
			<div className="flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<StarRating rating={review.rating} />
					<span className="font-medium">{review.author}</span>
					{review.verified && (
						<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
							<BadgeCheck className="h-3.5 w-3.5" aria-hidden />
							Verified purchase
						</span>
					)}
				</div>
				<time className="text-sm text-muted-foreground" dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</time>
			</div>
			<p className="text-muted-foreground leading-relaxed">{review.content}</p>
		</div>
	);
}

export function ProductReviews({
	reviews,
	productId,
}: {
	reviews: APIProductReviewsBrowseResult;
	productId: string;
}) {
	return (
		<section id="reviews" className="mt-20 border-t border-border pt-16 scroll-mt-24">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-3xl font-medium tracking-tight">Customer Reviews</h2>
				<ReviewSummary summary={reviews.summary} />
			</div>
			{/* How reviews are checked (EU Omnibus): shown wherever reviews are. */}
			<p className="-mt-4 mb-8 text-sm text-muted-foreground">
				Only customers who bought a product can review it. Reviews marked "Verified purchase" come from a
				confirmed order.
			</p>
			{reviews.data.length > 0 ? (
				<div className="space-y-6">
					{reviews.data.map((review) => (
						<ReviewCard key={review.id} review={review} />
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No reviews yet.</p>
			)}
			<div className="mt-10">
				<WriteReview productId={productId} />
			</div>
		</section>
	);
}
