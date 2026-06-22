import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const collectionImages = [
	"/scraped-3.jpg",
	"/scraped-10.jpg",
	"/scraped-11.jpg",
	"/scraped-12.jpg",
	"/scraped-13.jpg",
	"/scraped-4.jpg",
];

export async function CollectionGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{collections.data.map((collection, index) => (
					<YnsLink
						key={collection.id}
						href={`/collection/${collection.slug}`}
						prefetch={"eager"}
						className="group relative aspect-[4/3] overflow-hidden bg-secondary"
					>
						<Image
							src={collectionImages[index % collectionImages.length]}
							alt={collection.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>
						<div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
						<div className="absolute bottom-6 left-6">
							<h3 className="text-lg sm:text-xl font-bold text-white">{collection.name}</h3>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
