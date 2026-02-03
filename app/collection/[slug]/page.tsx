import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";

function CollectionHeader({ collection }: { collection: APICollectionGetByIdResult }) {
	return (
		<section className="relative overflow-hidden bg-background-dark hero-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 lg:py-24">
					<div className="max-w-2xl">
						<span className="text-primary font-semibold text-sm tracking-wider uppercase mb-2 block">
							Collection
						</span>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="mt-4 text-lg text-gray-300 leading-relaxed">
								{typeof collection.description === "string"
									? collection.description
									: "Explore our curated collection of premium CBD products"}
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
					<div className="absolute inset-0 bg-gradient-to-r from-background-dark to-transparent" />
				</div>
			)}
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-dark-accent rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-dark-accent rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-dark-accent rounded animate-pulse" />
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
		<main className="bg-background-dark min-h-screen">
			<CollectionHeader collection={collection} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} />
			</Suspense>
		</main>
	);
}
