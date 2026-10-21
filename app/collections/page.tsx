import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { AllBlock, CollectionBlock } from "@/components/photon";
import { getCollectionTiles, getStoreIdentity } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreIdentity();
	const description = `Every collection at ${storeName}.`;
	return {
		title: "Collections",
		description,
		alternates: { canonical: "/collections" },
		openGraph: { type: "website", title: "Collections", description, url: "/collections" },
	};
}

async function CollectionList() {
	"use cache";
	cacheLife("minutes");
	const tiles = await getCollectionTiles();

	return (
		<div className="pt-[var(--main-padding)] max-md:pt-[calc(var(--main-padding)*1.5)]">
			<h1 className="sr-only">Collections</h1>
			<AllBlock href="/products" label="All Products" />
			{tiles.map((tile, index) => (
				<CollectionBlock key={tile.id} tile={tile} priority={index === 0} />
			))}
		</div>
	);
}

export default function CollectionsPage() {
	return <CollectionList />;
}
