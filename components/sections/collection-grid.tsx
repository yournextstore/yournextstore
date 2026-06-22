import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_IMAGES = ["/scraped-2.jpg", "/scraped-3.jpg", "/scraped-4.jpg", "/scraped-5.jpg"];

export async function CollectionGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="bg-background py-16 sm:py-24">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex items-end justify-between mb-10 sm:mb-14">
					<div>
						<p className="text-eyebrow text-[color:var(--color-terracotta-deep)] mb-3">Shop by Collection</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground max-w-xl">
							Built for the way you actually wear color.
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden sm:inline-flex items-center gap-2 text-eyebrow text-foreground/70 hover:text-foreground transition-colors"
					>
						All Collections →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
					{collections.data.slice(0, 3).map((collection, idx) => (
						<YnsLink
							key={collection.id}
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="group relative block aspect-[4/5] overflow-hidden bg-secondary"
						>
							<Image
								src={FALLBACK_IMAGES[idx] ?? FALLBACK_IMAGES[0]}
								alt={collection.name}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent"
							/>
							<div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9 text-[color:var(--color-bone)]">
								<p className="text-eyebrow text-[color:var(--color-blush)]/90 mb-2">
									0{idx + 1} / 0{collections.data.length}
								</p>
								<h3 className="font-display text-2xl sm:text-3xl tracking-tight">{collection.name}</h3>
								<span className="mt-4 inline-flex items-center gap-2 text-eyebrow opacity-90 group-hover:opacity-100">
									Shop now →
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
