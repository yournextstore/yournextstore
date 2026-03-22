import type { APIProductReviewsBrowseResult } from "commerce-kit";
import { Star } from "lucide-react";
import { ReviewForm } from "@/app/[locale]/product/[slug]/review-form";
import { getCachedTranslations } from "@/lib/translations";

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

function ReviewSummary({
	summary,
	reviewCountLabel,
}: {
	summary: APIProductReviewsBrowseResult["summary"];
	reviewCountLabel: string;
}) {
	if (summary.reviewCount === 0) return null;

	return (
		<div className="flex items-center gap-3">
			<StarRating rating={Math.round(summary.averageRating)} size="lg" />
			<span className="text-lg font-medium">{summary.averageRating.toFixed(1)}</span>
			<span className="text-muted-foreground">{reviewCountLabel}</span>
		</div>
	);
}

function ReviewCard({
	review,
	locale,
}: {
	review: APIProductReviewsBrowseResult["data"][number];
	locale: string;
}) {
	return (
		<div className="space-y-2 border-b border-border pb-6 last:border-0">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<StarRating rating={review.rating} />
					<span className="font-medium">{review.author}</span>
				</div>
				<time className="text-sm text-muted-foreground" dateTime={review.createdAt}>
					{new Date(review.createdAt).toLocaleDateString(locale, {
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

export async function ProductReviews({
	reviews,
	slug,
	locale,
}: {
	reviews: APIProductReviewsBrowseResult;
	slug: string;
	locale: string;
}) {
	const t = await getCachedTranslations(locale, "Reviews");

	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-3xl font-medium tracking-tight">{t("title")}</h2>
				<ReviewSummary
					summary={reviews.summary}
					reviewCountLabel={`(${reviews.summary.reviewCount} ${reviews.summary.reviewCount === 1 ? "review" : "reviews"})`}
				/>
			</div>
			{reviews.data.length > 0 ? (
				<div className="space-y-6">
					{reviews.data.map((review) => (
						<ReviewCard key={review.id} review={review} locale={locale} />
					))}
				</div>
			) : (
				<p className="text-muted-foreground">{t("noReviews")}</p>
			)}
			<div className="mt-10">
				<ReviewForm slug={slug} />
			</div>
		</section>
	);
}
