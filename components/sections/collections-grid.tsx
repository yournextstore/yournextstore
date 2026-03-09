import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

const collectionImages: Record<string, string> = {
	0: "/scraped-5.png",
	1: "/scraped-6.png",
	2: "/scraped-7.png",
};

export async function CollectionsGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wider text-center mb-12 uppercase">
				Shop Collections
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{collections.data.map((collection, index) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="group relative overflow-hidden"
					>
						<div className="aspect-[3/4] relative bg-secondary">
							<Image
								src={collectionImages[String(index)] ?? "/scraped-5.png"}
								alt={collection.name}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
						</div>
						<div className="mt-4 text-center">
							<h3 className="font-heading text-lg font-light tracking-wider uppercase">{collection.name}</h3>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
