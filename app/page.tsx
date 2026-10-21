import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Fragment } from "react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { getStoreIdentity, TILE_COLORS } from "@/lib/swag";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

/** Where the black call-to-action block sits in the grid (the original's "special grid item"). */
const CTA_INDEX = 9;

async function getHomeData() {
	"use cache";
	cacheLife("minutes");

	const [products, identity] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [], meta: { count: 0 } })),
		getStoreIdentity(),
	]);
	const pictured = products.data.filter(
		(p) => p.images.length > 0 || p.variants.some((v) => (v.images ?? []).length > 0),
	);
	// An odd number of product blocks plus the black call-to-action block: an even count, so
	// the two-column grid never ends on a lone tile.
	const shown = pictured.slice(0, 13);
	return {
		products: shown.length % 2 === 1 ? shown : shown.slice(0, -1),
		total: products.meta.count,
		identity,
	};
}

// Cached and rendered without a Suspense boundary: the grid is part of the prerendered shell,
// so nothing streams in above the fold and pushes the page.
export default async function Home() {
	const { products, total, identity } = await getHomeData();

	return (
		<div className="bg-swag-paper">
			<h1 className="sr-only">{identity.name}</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2">
				{products.map((product, index) => (
					<Fragment key={product.id}>
						{index === CTA_INDEX && <CtaBlock total={total} />}
						<ProductCard
							product={product}
							priority={index < 2}
							color={TILE_COLORS[index % TILE_COLORS.length]}
							sizes="(max-width: 640px) 70vw, 30vw"
						/>
					</Fragment>
				))}
				{products.length <= CTA_INDEX && <CtaBlock total={total} />}
			</div>
		</div>
	);
}

function CtaBlock({ total }: { total: number }) {
	return (
		<div className="flex aspect-square items-center justify-center bg-black px-4">
			<Link
				href="/products"
				className="inline-flex h-14 items-center rounded-full bg-swag-orange px-8 text-t14 text-black uppercase hover:bg-white"
			>
				Browse all {total > 0 ? total : ""} pieces
			</Link>
		</div>
	);
}
