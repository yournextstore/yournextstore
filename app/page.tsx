import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { AllBlock, CollectionBlock, EditorialBlock } from "@/components/photon";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	editorialImages,
	getCollectionTiles,
	getPicturedFirstProducts,
	getStoreIdentity,
} from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function HomeContent() {
	"use cache";
	cacheLife("minutes");
	const [identity, tiles, newIn] = await Promise.all([
		getStoreIdentity(),
		getCollectionTiles(),
		getPicturedFirstProducts(6),
	]);
	const featured = tiles.filter((tile) => tile.image).slice(0, 2);

	return (
		<>
			<EditorialBlock
				className="bg-photon-yellow text-black"
				image="/images/hero-objects.jpg"
				tint={false}
				priority
			>
				<h1 className="text-[clamp(2.25rem,7vw,6rem)] leading-none font-bold uppercase">
					{identity.storeName}
				</h1>
				<p className="mt-2 max-w-[34ch]">Design objects in loud solid colour.</p>
				<p>
					<Link href="/products" className="inline-flex min-h-6 items-center">
						Shop all products ↗
					</Link>
				</p>
			</EditorialBlock>

			<ProductGrid title="New in" products={newIn} />

			<EditorialBlock className="bg-black text-white" image={editorialImages.home.src} grayscale>
				<h2 className="text-photon-title">Made to be used</h2>
				<p>
					Every lamp, stool, tray and clock is folded, cast or powder-coated to be used every day, not only
					looked at.
				</p>
				<p>
					<Link href="/about" className="inline-flex min-h-6 items-center">
						About {identity.storeName} ↗
					</Link>
				</p>
			</EditorialBlock>

			{featured.length > 0 && (
				<section aria-label="Collections">
					{featured.map((tile) => (
						<CollectionBlock key={tile.id} tile={tile} />
					))}
					<AllBlock href="/collections" label="All Collections" className="h-[40vh] max-md:h-[40vh]" />
				</section>
			)}
		</>
	);
}

export default function Home() {
	return <HomeContent />;
}
