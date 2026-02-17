import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export async function CollectionCards() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	const topTwoCollections = collections.data.slice(0, 2);

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8 text-center">Top picks</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				{topTwoCollections.map((collection, index) => (
					<YnsLink
						key={collection.id}
						href={`/collection/${collection.slug}`}
						prefetch={"eager"}
						className="group relative aspect-[4/3] overflow-hidden bg-secondary"
					>
						<Image
							src={index === 0 ? "/scraped-3.png" : "/scraped-4.png"}
							alt={collection.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 50vw"
						/>
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
						<div className="absolute bottom-8 left-8">
							<h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">{collection.name}</h3>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
