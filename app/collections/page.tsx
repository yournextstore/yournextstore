import type { Metadata } from "next";
import { BrowseCards } from "@/components/browse-cards";
import { getCollections } from "@/lib/catalog";

export const metadata: Metadata = {
	title: "Collections",
	alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
	const collections = await getCollections();
	return (
		<BrowseCards
			kicker="Curated"
			title="Collections"
			items={collections.map((collection) => ({
				id: collection.id,
				name: collection.name,
				description: collection.description,
				href: `/collection/${collection.slug}`,
			}))}
		/>
	);
}
