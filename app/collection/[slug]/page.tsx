import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, isPreview, previewHref } from "@/lib/demo-products";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const sp = await searchParams;
	const preview = await isPreview(sp);
	const { slug } = await params;

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
	count,
	slug,
	previewMode,
}: {
	name: string;
	count: number;
	slug: string;
	previewMode: boolean;
}) {
	return (
		<section className="hero-gradient">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					<YnsLink href={previewHref("/", previewMode)} className="hover:text-foreground transition-colors">
						Home
					</YnsLink>
					<span className="mx-2">/</span>
					<YnsLink
						href={previewHref("/products", previewMode)}
						className="hover:text-foreground transition-colors"
					>
						Shop
					</YnsLink>
					<span className="mx-2">/</span>
					<span className="text-foreground">{name}</span>
				</div>
				<div className="pt-8 sm:pt-12 pb-10 sm:pb-14 flex items-end gap-3 flex-wrap">
					<h1 className="font-display font-light text-foreground text-[56px] sm:text-[80px] lg:text-[112px] leading-[0.92] tracking-[-0.02em]">
						{name}
					</h1>
					<sup className="font-mono-cap text-[12px] sm:text-[14px] -translate-y-4 sm:-translate-y-10 text-muted-foreground tracking-[0.18em]">
						{count}
					</sup>
					{/* hidden helper to preserve slug var in static-analysis-friendly form */}
					<span className="sr-only">collection {slug}</span>
				</div>
			</div>
		</section>
	);
}

function CollectionProducts({
	products,
	previewMode,
}: {
	products: APICollectionGetByIdResult["productCollections"][number]["product"][];
	previewMode: boolean;
}) {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} previewMode={previewMode} />
				))}
			</div>
		</section>
	);
}

function CollectionPreview({ slug }: { slug: string }) {
	const title = slug.charAt(0).toUpperCase() + slug.slice(1);
	return (
		<>
			<CollectionHeader name={title} count={DEMO_PRODUCTS.length} slug={slug} previewMode />
			<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
					{DEMO_PRODUCTS.map((product) => (
						<ProductCard key={product.id} product={product} previewMode />
					))}
				</div>
			</section>
		</>
	);
}

export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
	const sp = await props.searchParams;
	const preview = await isPreview(sp);
	const { slug } = await props.params;

	if (preview) {
		return (
			<main>
				<CollectionPreview slug={slug} />
			</main>
		);
	}

	return (
		<main>
			<Suspense fallback={null}>
				<CollectionContent slug={slug} previewMode={false} />
			</Suspense>
		</main>
	);
}

async function CollectionContent({ slug, previewMode }: { slug: string; previewMode: boolean }) {
	"use cache";
	cacheLife("minutes");

	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		notFound();
	}

	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader
				name={collection.name}
				count={products.length}
				slug={slug}
				previewMode={previewMode}
			/>
			<CollectionProducts products={products} previewMode={previewMode} />
		</>
	);
}
