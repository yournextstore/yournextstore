import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReviewForm } from "@/app/product/[slug]/review-form";
import { Skeleton } from "@/components/ui/skeleton";
import { productGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Write a Review",
	robots: { index: false, follow: false },
};

// The delivered-order email links each bought product here with the order's review token
// (`/product/<id>/review?token=…`); the platform checks the token again when the form is sent.
export default function ProductReviewPage(props: PageProps<"/product/[slug]/review">) {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
			<Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
				<ReviewPageContent {...props} />
			</Suspense>
		</div>
	);
}

const ReviewPageContent = async ({ params, searchParams }: PageProps<"/product/[slug]/review">) => {
	const [{ slug }, { token }] = await Promise.all([params, searchParams]);
	const product = await productGetCached(slug);

	if (!product) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm text-muted-foreground">Your review of</p>
				<h1 className="text-2xl font-medium tracking-tight">
					<Link href={`/product/${product.slug}`} className="hover:underline">
						{product.name}
					</Link>
				</h1>
			</div>
			{typeof token === "string" && token ? (
				<ReviewForm productId={product.id} token={token} />
			) : (
				<p className="text-muted-foreground">
					This review link is incomplete. Open it again from your order email, or write your review on the{" "}
					<Link
						href={`/product/${product.slug}`}
						className="font-medium text-foreground underline underline-offset-4"
					>
						product page
					</Link>
					.
				</p>
			)}
		</div>
	);
};
