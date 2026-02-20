import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#2d5016]/90 via-[#3a6b1e]/80 to-[#4a7c28]/70">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-10 sm:py-14 lg:py-18 relative z-10">
					<div className="max-w-2xl">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="mt-3 text-base text-white/80 leading-relaxed">
								{typeof collection.description === "string"
									? collection.description
									: "Explore our curated collection"}
							</p>
						)}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<YNSImage
						src={collection.image}
						alt={collection.name}
						fill
						className="object-cover opacity-20"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-[#2d5016] to-transparent" />
				</div>
			)}
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="bg-white rounded-lg border border-border overflow-hidden">
						<div className="aspect-square bg-secondary animate-pulse" />
						<div className="p-4 space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/3 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionProducts({ collection }: { collection: APICollectionGetByIdResult }) {
	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<ProductGrid
			title={`${collection.name} Collection`}
			description={`${products.length} products`}
			products={products}
			showViewAll={false}
		/>
	);
}

export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
	"use cache";
	cacheLife("minutes");

	const { slug } = await props.params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		notFound();
	}

	return (
		<main>
			<CollectionHeader collection={collection} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</main>
	);
}
