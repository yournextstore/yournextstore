import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBanner, type ShopParams, ShopResults, ShopResultsSkeleton } from "@/components/shop-listing";
import { getStoreSeo } from "@/lib/commerce";

export async function generateMetadata(): Promise<Metadata> {
	// "View More" grows one list, so every ?page= is the same listing.
	const canonical = "/products";
	const title = "All Products";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse the complete ${storeName} collection. ${storeDescription}`
		: `Browse the complete ${storeName} product collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
		},
	};
}

// Awaits `searchParams` (runtime data) inside the Suspense boundary so the banner and the
// chrome stay in the prerendered shell.
async function ProductSection({ searchParams }: { searchParams: Promise<ShopParams> }) {
	const params = await searchParams;
	return <ShopResults basePath="/products" params={params} />;
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ShopParams> }) {
	return (
		<div className="mx-auto max-w-screen-2xl px-5 pt-10 max-[400px]:px-3">
			<ShopBanner title="Shop" />
			<Suspense fallback={<ShopResultsSkeleton />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
