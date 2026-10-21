import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { CircleCheck, Star } from "lucide-react";
import { ReviewForm } from "@/app/product/[slug]/review-form";

function StarRating({ rating }: { rating: number }) {
	return (
		<span className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					aria-hidden
					className={i < rating ? "size-5 fill-star text-star" : "size-5 fill-pill text-pill"}
				/>
			))}
		</span>
	);
}

/** The original's review card: stars, name with a green tick, the review, "Posted on". */
function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<li className="flex flex-col items-start rounded-[20px] border border-black/10 p-6 sm:px-8 sm:py-7">
			<StarRating rating={review.rating} />
			<p className="mt-3 mb-2 flex items-center gap-1 sm:mt-4 sm:mb-3">
				<strong className="sm:text-xl">{review.author}</strong>
				<CircleCheck className="size-5 fill-verified text-white sm:size-6" aria-hidden />
			</p>
			<p className="text-sm text-muted-foreground sm:text-base">{review.content}</p>
			<p className="mt-4 text-sm font-medium text-muted-foreground sm:mt-6">
				Posted on{" "}
				<time dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
			</p>
		</li>
	);
}

export function ProductReviews({ reviews, slug }: { reviews: APIProductReviewsBrowseResult; slug: string }) {
	const { summary } = reviews;
	return (
		<section id="reviews" className="scroll-mt-24">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
				<h2 className="text-xl font-bold sm:text-2xl">
					All Reviews{" "}
					<span className="text-sm font-normal text-muted-foreground sm:text-base">
						({summary.reviewCount})
					</span>
				</h2>
				{summary.reviewCount > 0 && (
					<span className="flex items-center gap-2 text-sm">
						<StarRating rating={Math.round(summary.averageRating)} />
						{summary.averageRating.toFixed(1)}
						<span className="text-muted-foreground">/5</span>
					</span>
				)}
			</div>
			{reviews.data.length > 0 ? (
				<ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
					{reviews.data.map((review) => (
						<ReviewCard key={review.id} review={review} />
					))}
				</ul>
			) : (
				<p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
			)}
			<div className="mt-10 max-w-2xl">
				<ReviewForm slug={slug} />
			</div>
		</section>
	);
}
