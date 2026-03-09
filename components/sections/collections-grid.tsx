import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallbackCollections = [
	{ name: "Men", href: "/products", image: "/scraped-3.png" },
	{ name: "Women", href: "/products", image: "/scraped-4.png" },
	{ name: "Accessories", href: "/products", image: "/scraped-2.png" },
];

export async function CollectionsGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	const displayCollections =
		collections.data.length > 0
			? collections.data.map((c, i) => ({
					name: c.name,
					href: `/collection/${c.slug}`,
					image: fallbackCollections[i % fallbackCollections.length].image,
				}))
			: fallbackCollections;

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<h2 className="text-2xl sm:text-3xl font-medium text-center mb-12">Collections</h2>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{displayCollections.map((col) => (
					<YnsLink
						prefetch={"eager"}
						key={col.name}
						href={col.href}
						className="group relative aspect-[3/4] overflow-hidden bg-secondary"
					>
						<Image
							src={col.image}
							alt={col.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 33vw"
						/>
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-opacity duration-500" />
						<div className="absolute bottom-6 left-6">
							<span className="text-base font-medium text-white">{col.name}</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
