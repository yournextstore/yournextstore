import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { ProductCardLarge } from "./product-card";
import { SectionHeader } from "./section-header";

type CuratedEssentialsProps = {
	limit?: number;
};

function CuratedEssentialsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i}>
					<Skeleton className="aspect-[4/5] mb-6" />
					<div className="flex justify-between">
						<div>
							<Skeleton className="h-8 w-40 mb-2" />
							<Skeleton className="h-4 w-24" />
						</div>
						<Skeleton className="h-6 w-16" />
					</div>
				</div>
			))}
		</div>
	);
}

async function CuratedEssentialsContent({ limit = 3 }: CuratedEssentialsProps) {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit });

	if (products.data.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
			{products.data.map((product) => (
				<ProductCardLarge key={product.id} product={product} />
			))}
		</div>
	);
}

export function CuratedEssentials({ limit = 3 }: CuratedEssentialsProps) {
	return (
		<section
			id="products"
			className="py-24 px-6 md:px-12 w-full max-w-screen-2xl mx-auto relative z-50 bg-background"
		>
			<SectionHeader
				badge="Our Selection"
				title="Curated Essentials"
				viewAllLink="/collection/all"
				withBorder
			/>
			<Suspense fallback={<CuratedEssentialsSkeleton />}>
				<CuratedEssentialsContent limit={limit} />
			</Suspense>
		</section>
	);
}
