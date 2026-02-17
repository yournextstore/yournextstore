import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function CollectionGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
				{collections.data.map((collection) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="group relative overflow-hidden aspect-[3/4]"
					>
						{collection.image ? (
							<YNSImage
								src={collection.image}
								alt={collection.name}
								fill
								sizes="(max-width: 640px) 50vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-stone-400 to-stone-600" />
						)}
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
						<div className="absolute bottom-4 left-4">
							<h3 className="font-heading text-base sm:text-lg font-semibold text-white tracking-wide">
								{collection.name}
							</h3>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
