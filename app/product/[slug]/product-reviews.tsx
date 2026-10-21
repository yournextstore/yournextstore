import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { ReviewForm } from "@/app/product/[slug]/review-form";
import { ReviewStars } from "@/components/icons";

function ReviewCard({ review }: { review: APIProductReviewsBrowseResult["data"][number] }) {
	return (
		<li className="border-b border-black p-6 md:odd:border-r lg:p-12">
			<ReviewStars rating={review.rating} />
			<p className="mt-4 mb-3">{review.content}</p>
			<p className="text-caption text-ink-soft">
				{review.author} |{" "}
				<time dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
				</time>
			</p>
		</li>
	);
}

/** The original's review block: a bordered, tinted two-column grid under a one-line summary. */
export function ProductReviews({ reviews, slug }: { reviews: APIProductReviewsBrowseResult; slug: string }) {
	const { summary } = reviews;
	return (
		<section id="reviews" className="container-wide scroll-mt-28 pb-12">
			<div className="lg:mx-[8.333%]">
				<h2 className="mb-4 text-title font-medium">
					{summary.reviewCount > 0
						? `${Number(summary.averageRating.toFixed(1))} stars from ${summary.reviewCount} ${summary.reviewCount === 1 ? "review" : "reviews"}`
						: "Reviews"}
				</h2>
				{reviews.data.length > 0 ? (
					<ul className="grid border border-b-0 border-black bg-tint md:grid-cols-2">
						{reviews.data.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))}
					</ul>
				) : (
					<p className="text-ink-soft">No reviews yet. Be the first to share your thoughts.</p>
				)}
				<div className="mt-10 max-w-xl">
					<ReviewForm slug={slug} />
				</div>
			</div>
		</section>
	);
}
