import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, isPreview } from "@/lib/demo-products";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

type SearchParams = Promise<{ preview?: string }>;

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: SearchParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const sp = await searchParams;
	const preview = await isPreview(sp);

	if (preview) {
		return {
			title: `${slug} — Your Next Store`,
			robots: { index: false, follow: false },
		};
	}

	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection.`;
	const canonical = `/collection/${collection.slug}`;

	return {
		title: collection.name,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: collection.name,
			description,
			url: canonical,
			images: collection.image ? [{ url: collection.image, alt: collection.name }] : undefined,
		},
		twitter: {
			card: collection.image ? "summary_large_image" : "summary",
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({
	name,
	description,
	image,
}: {
	name: string;
	description?: string;
	image?: string | null;
}) {
	return (
		<section className="relative overflow-hidden bg-aura-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-24 lg:py-28">
					<div className="max-w-2xl">
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-4">Collection</p>
						<h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-walnut text-balance">
							{name}
						</h1>
						{description && (
							<p className="mt-5 text-base sm:text-lg text-espresso/70 leading-relaxed max-w-md">
								{description}
							</p>
						)}
					</div>
				</div>
			</div>
			{image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<YNSMedia src={image} alt={name} fill sizes="50vw" className="object-cover opacity-50" priority />
					<div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/60 to-transparent" />
				</div>
			)}
		</section>
	);
}

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-sand rounded-md mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-sand rounded animate-pulse" />
							<div className="h-3 w-1/3 bg-sand rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionProducts({
	collection,
	isPreviewActive,
}: {
	collection: APICollectionGetByIdResult;
	isPreviewActive: boolean;
}) {
	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<ProductGrid
			eyebrow="The shelf"
			title={`${collection.name} pieces`}
			description={`${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
			products={products}
			showViewAll={false}
			columns={4}
			isPreview={isPreviewActive}
		/>
	);
}

function DemoCollection({ slug, isPreviewActive }: { slug: string; isPreviewActive: boolean }) {
	const filtered = DEMO_PRODUCTS.filter((p) => p.category?.slug === slug);
	const display = filtered.length > 0 ? filtered : DEMO_PRODUCTS;
	const niceName = slug
		.split("-")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");
	return (
		<main>
			<CollectionHeader
				name={niceName}
				description="A small group of pieces, shaped by hand in our atelier."
			/>
			<ProductGrid
				eyebrow="The shelf"
				title={`${niceName} pieces`}
				description={`${display.length} ${display.length === 1 ? "piece" : "pieces"}`}
				products={display}
				showViewAll={false}
				columns={4}
				isPreview={isPreviewActive}
			/>
		</main>
	);
}

export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
	const { slug } = await props.params;
	const sp = (await props.searchParams) as Record<string, string | string[] | undefined>;
	const preview = await isPreview(sp);

	if (preview) {
		return <DemoCollection slug={slug} isPreviewActive={true} />;
	}

	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		notFound();
	}

	const description = typeof collection.description === "string" ? collection.description : undefined;

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader name={collection.name} description={description} image={collection.image} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} isPreviewActive={false} />
			</Suspense>
		</>
	);
}
