import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCommerce } from "@/lib/commerce";
import { getActiveCurrency, getCurrencyForLocale } from "@/lib/currency";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { getCachedTranslations } from "@/lib/translations";
import { YNSMedia } from "@/lib/yns-media";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
	const { slug, locale } = await params;
	const currency = getCurrencyForLocale(locale);
	const api = getCommerce({ lang: locale, currency });
	const [collection, t] = await Promise.all([
		api.collectionGet({ idOrSlug: slug }),
		getTranslations("Metadata"),
	]);

	if (!collection) {
		return { title: t("collectionNotFound") };
	}

	const description = typeof collection.description === "string" ? collection.description : undefined;

	return {
		title: t("collectionTitle", { name: collection.name }),
		description,
		openGraph: {
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

function CollectionHeader({
	collection,
	fallbackDescription,
}: {
	collection: APICollectionGetByIdResult;
	fallbackDescription: string;
}) {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 lg:py-20">
					<div className="max-w-2xl">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
								{typeof collection.description === "string" ? collection.description : fallbackDescription}
							</p>
						)}
					</div>
				</div>
			</div>
			{collection.image && (
				<div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
					<YNSMedia
						src={collection.image}
						alt={collection.name}
						fill
						sizes="50vw"
						className="object-cover opacity-30"
						priority
					/>
					<div className="absolute inset-0 bg-linear-to-r from-secondary/30 to-transparent" />
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
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

async function CollectionProducts({
	collection,
	locale,
	currency,
}: {
	collection: APICollectionGetByIdResult;
	locale: string;
	currency: string;
}) {
	const t = await getCachedTranslations(locale, "Collection");
	const products = collection.productCollections.map((pc) => pc.product);

	return (
		<ProductGrid
			locale={locale}
			currency={currency}
			title={t("collectionTitle", { name: collection.name })}
			description={t("productCount", { count: products.length })}
			products={products}
			showViewAll={false}
		/>
	);
}

export default async function CollectionPage(props: { params: Promise<{ slug: string; locale: string }> }) {
	const { locale } = await props.params;
	const currency = await getActiveCurrency(locale);
	return <CollectionContent params={props.params} currency={currency} />;
}

async function CollectionContent({
	params,
	currency,
}: {
	params: Promise<{ slug: string; locale: string }>;
	currency: string;
}) {
	const { slug, locale } = await params;
	const api = getCommerce({ lang: locale, currency });
	const [collection, t] = await Promise.all([
		api.collectionGet({ idOrSlug: slug }),
		getCachedTranslations(locale, "Collection"),
	]);

	if (!collection) {
		notFound();
	}

	return (
		<main>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<CollectionHeader collection={collection} fallbackDescription={t("exploreCollection")} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CollectionProducts collection={collection} locale={locale} currency={currency} />
			</Suspense>
		</main>
	);
}
