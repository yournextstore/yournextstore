import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_IMAGES = [
	"/scraped-0.jpg",
	"/scraped-1.jpg",
	"/scraped-3.jpg",
	"/scraped-4.jpg",
	"/scraped-5.jpg",
];

export async function CategoriesStrip() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) return null;

	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1440px] px-6 pt-16 pb-10 lg:px-12 lg:pt-24">
				<div className="mb-8 flex items-end justify-between">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] text-lilac-deep">Shop By</p>
						<h2 className="font-display mt-2 text-3xl font-medium tracking-[-0.01em] text-foreground sm:text-4xl">
							Categories
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors sm:inline-block"
					>
						See all collections
					</YnsLink>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{collections.data.slice(0, 5).map((collection, index) => (
						<YnsLink
							key={collection.id}
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="group relative block aspect-[3/4] overflow-hidden bg-lilac-soft"
						>
							<Image
								src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
								alt={collection.name}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-foreground/55 via-transparent to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-4">
								<p className="font-display text-xl text-background">{collection.name}</p>
								<p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-background/80">Shop now →</p>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
