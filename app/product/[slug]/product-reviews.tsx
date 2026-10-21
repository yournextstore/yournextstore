import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { ReviewForm } from "@/app/product/[slug]/review-form";

/** Read-only star rating; fractional averages fill partially, the text carries the value. */
export function Stars({ value, size = 15 }: { value: number; size?: number }) {
	const row = [0, 1, 2, 3, 4].map((i) => (
		<svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
			<path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z" />
		</svg>
	));
	return (
		<span
			className="stars"
			role="img"
			aria-label={`Rated ${value.toFixed(1)} out of 5`}
			style={{ "--stars": `${Math.max(0, Math.min(5, value)) * 20}%` } as React.CSSProperties}
		>
			<span className="stars-base">{row}</span>
			<span className="stars-fill">{row}</span>
		</span>
	);
}

export function ProductReviews({
	reviews,
	slug,
	productName,
}: {
	reviews: APIProductReviewsBrowseResult;
	slug: string;
	productName: string;
}) {
	const { summary } = reviews;
	return (
		<section id="reviews" className="reviews-section">
			<div className="reviews-summary panel">
				<h2>Customer reviews</h2>
				{summary.reviewCount > 0 ? (
					<div className="reviews-score">
						<strong>{summary.averageRating.toFixed(1)}</strong>
						<div>
							<Stars value={summary.averageRating} />
							<span className="muted">
								{summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
							</span>
						</div>
					</div>
				) : (
					<p className="muted">No reviews yet. Tried {productName}? Tell other shoppers what you think.</p>
				)}
				<p className="reviews-policy">Reviews are checked by our team before they appear.</p>
			</div>
			<div className="reviews-list">
				{reviews.data.length > 0 ? (
					<ol>
						{reviews.data.map((review) => (
							<li key={review.id} className="review">
								<div className="review-head">
									<Stars value={review.rating} size={14} />
									<time className="review-meta" dateTime={review.createdAt}>
										{new Date(review.createdAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</time>
								</div>
								<p className="review-body">{review.content}</p>
								<p className="review-meta">
									<strong>{review.author}</strong>
								</p>
							</li>
						))}
					</ol>
				) : null}
				<ReviewForm slug={slug} />
			</div>
		</section>
	);
}
