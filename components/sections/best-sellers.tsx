import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { ProductCardMedium } from "./product-card";
import { SectionHeader } from "./section-header";

type BestSellersProps = {
	limit?: number;
};

function BestSellersSkeleton() {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex flex-col">
					<Skeleton className="aspect-[3/4] mb-5 rounded-sm" />
					<div className="text-center">
						<Skeleton className="h-6 w-24 mx-auto mb-2" />
						<Skeleton className="h-4 w-16 mx-auto" />
					</div>
				</div>
			))}
		</div>
	);
}

async function BestSellersContent({ limit = 4 }: BestSellersProps) {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit });

	if (products.data.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
			{products.data.map((product) => (
				<ProductCardMedium key={product.id} product={product} />
			))}
		</div>
	);
}

export function BestSellers({ limit = 4 }: BestSellersProps) {
	return (
		<section className="py-24 px-6 md:px-12 w-full max-w-screen-2xl mx-auto relative z-50 bg-background border-t border-border/50">
			<SectionHeader badge="Customer Favorites" title="Best Sellers" centered />
			<Suspense fallback={<BestSellersSkeleton />}>
				<BestSellersContent limit={limit} />
			</Suspense>
		</section>
	);
}
