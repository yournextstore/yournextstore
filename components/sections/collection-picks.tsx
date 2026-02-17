import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function CollectionPicks() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });
	const displayCollections = collections.data.slice(0, 2);

	if (displayCollections.length === 0) {
		return null;
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Top picks</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{displayCollections.map((collection) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="group relative overflow-hidden aspect-[4/3]"
					>
						{collection.image ? (
							<YNSImage
								src={collection.image}
								alt={collection.name}
								fill
								sizes="(max-width: 640px) 100vw, 50vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500" />
						)}
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
						<div className="absolute bottom-6 left-6">
							<h3 className="font-heading text-xl sm:text-2xl font-semibold text-white tracking-wide">
								{collection.name}
							</h3>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
