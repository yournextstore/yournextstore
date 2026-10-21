import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Archive } from "@/components/maison/archive";
import { ArchiveHero } from "@/components/maison/archive-hero";
import { ArchiveSkeleton } from "@/components/maison/archive-skeleton";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { editorialShots, toPieces } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const { storeName } = await getStoreSeo();
	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;
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

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid. Cached like the collection itself, which also pins the
// `Date.now()` below to the cache entry.
async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// The SDK throws on a 404: one product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function CollectionPage(props: PageProps<"/collection/[slug]">) {
	return (
		<Suspense fallback={<ArchiveSkeleton />}>
			<CollectionContent params={props.params} />
		</Suspense>
	);
}

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!collection`
// branches never run and an unknown slug answers 200 with the error page.
const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

async function getCollectionPieces(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const products = await getCollectionProducts(collection);
	return { pieces: await toPieces(products), shots: editorialShots(products) };
}

const CollectionContent = async ({ params }: { params: PageProps<"/collection/[slug]">["params"] }) => {
	const { slug } = await params;
	const collection = await getCollectionData(slug);

	if (!collection) {
		notFound();
	}

	const { pieces, shots } = await getCollectionPieces(collection);
	const numbers = new Map(pieces.map((piece) => [piece.slug, piece.no]));
	// The API sends rich text (TipTap); older payloads sent a plain string.
	const description =
		typeof collection.description === "string" ? (
			collection.description
		) : collection.description ? (
			<div className="tiptap-content">
				<TiptapRenderer content={collection.description} />
			</div>
		) : null;
	const cover = collection.image
		? [{ label: "the collection", href: `/collection/${collection.slug}`, src: collection.image }]
		: [];
	const tiles = [
		...cover,
		...shots.map((shot) => ({
			label: `No. ${numbers.get(shot.slug) ?? "—"}`,
			href: `/product/${shot.slug}`,
			src: shot.src,
		})),
	].slice(0, 3);

	return (
		<div className="mx-auto min-h-svh max-w-[1240px] px-4 sm:px-6">
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ArchiveHero
				kicker="Collection"
				title={collection.name}
				blurb={
					description ??
					`${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} gathered from the register into one collection.`
				}
				tiles={tiles}
			/>
			{pieces.length > 0 ? (
				<Archive pieces={pieces} />
			) : (
				<div className="py-[72px] text-center text-dim">
					<p className="font-sf mb-3 text-[22px]">This collection is being catalogued</p>
					<Link href="/products" className="link-rule text-acc">
						Browse the whole archive
					</Link>
				</div>
			)}
		</div>
	);
};
