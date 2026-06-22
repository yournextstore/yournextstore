import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallbackImages = ["/scraped-1.jpg", "/scraped-2.jpg", "/scraped-3.jpg", "/scraped-4.jpg"];

export async function CollectionSpotlight() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	if (collections.data.length === 0) {
		return null;
	}

	const featured = collections.data.slice(0, 3);

	return (
		<section className="bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center max-w-xl mx-auto mb-12">
					<span className="text-[11px] tracking-[0.28em] uppercase text-magenta font-semibold">
						Shop the Edits
					</span>
					<h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground leading-tight">
						Curated for every <span className="italic">silhouette</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
					{featured.map((collection, i) => (
						<YnsLink
							prefetch={"eager"}
							key={collection.id}
							href={`/collection/${collection.slug}`}
							className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-blush"
						>
							<Image
								src={fallbackImages[i % fallbackImages.length] ?? "/scraped-1.jpg"}
								alt={collection.name}
								fill
								sizes="(max-width: 640px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-plum/55 via-plum/10 to-transparent"
							/>
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-white">
								<h3 className="font-display text-2xl sm:text-3xl leading-tight">{collection.name}</h3>
								<span className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase">
									Shop now
									<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
