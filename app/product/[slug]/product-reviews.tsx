import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { Star } from "lucide-react";
import { ReviewForm } from "@/app/product/[slug]/review-form";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
	const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

	return (
		<div className="flex" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={`${sizeClass} ${
						i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
					}`}
				/>
			))}
		</div>
	);
}

function ReviewSummary({ summary }: { summary: APIProductReviewsBrowseResult["summary"] }) {
	if (summary.reviewCount === 0) return null;

	return (
		<div className="mt-4 flex items-center gap-4">
			<p className="text-3xl font-medium">
				{summary.averageRating.toFixed(1)}
				<span className="sr-only"> average review score</span>
			</p>
			<div>
				<StarRating rating={Math.round(summary.averageRating)} size="lg" />
				<p className="mt-0.5 text-xs text-gray-600">
					Based on {summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
				</p>
			</div>
		</div>
	);
}

function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<blockquote>
			<div className="sm:flex sm:items-center sm:gap-4">
				<StarRating rating={review.rating} size="lg" />
				<p className="mt-2 font-medium sm:mt-0">{review.author}</p>
			</div>
			<p className="mt-2 text-gray-700">{review.content}</p>
			<footer className="mt-4">
				<time className="text-xs text-gray-600" dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
			</footer>
		</blockquote>
	);
}

export function ProductReviews({ reviews, slug }: { reviews: APIProductReviewsBrowseResult; slug: string }) {
	return (
		<div id="reviews" className="mt-10 mb-20 scroll-mt-28">
			<h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">Customer Reviews</h2>
			<ReviewSummary summary={reviews.summary} />
			{reviews.data.length > 0 ? (
				<div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
					{reviews.data.map((review) => (
						<ReviewCard key={review.id} review={review} />
					))}
				</div>
			) : (
				<p className="mt-4 text-gray-600">No reviews yet. Be the first to share your thoughts.</p>
			)}
			<div className="mt-10 max-w-2xl">
				<ReviewForm slug={slug} />
			</div>
		</div>
	);
}
