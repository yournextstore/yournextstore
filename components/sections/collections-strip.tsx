import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

const fallbackImages = [
	"/scraped-2.jpg",
	"/scraped-3.jpg",
	"/scraped-4.jpg",
	"/scraped-5.jpg",
	"/scraped-0.jpg",
	"/scraped-1.jpg",
];

const fallbackPalette = ["bg-peach-soft", "bg-lime/30", "bg-forest-grain text-cream"];

export async function CollectionsStrip() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });
	const items = collections.data;

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] font-semibold text-forest/70 mb-2">
							Shop the aisles
						</p>
						<h2 className="font-display text-3xl sm:text-4xl font-semibold text-forest-deep">
							Built around your weekly basket
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-forest-deep transition-colors"
					>
						All collections →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					{items.map((collection, idx) => {
						const palette = fallbackPalette[idx % fallbackPalette.length];
						const image = collection.image ?? fallbackImages[idx % fallbackImages.length];
						const isDark = palette.includes("forest-grain");

						return (
							<YnsLink
								key={collection.id}
								prefetch={"eager"}
								href={`/collection/${collection.slug}`}
								className={`relative ${palette} rounded-3xl p-7 overflow-hidden group min-h-[260px] flex flex-col justify-between border border-border/40`}
							>
								<div className="relative z-10">
									<p
										className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${isDark ? "text-lime" : "text-forest/70"}`}
									>
										Collection
									</p>
									<h3
										className={`mt-2 font-display text-2xl font-semibold ${isDark ? "text-cream" : "text-forest-deep"}`}
									>
										{collection.name}
									</h3>
								</div>
								<div className="relative z-10 flex items-center gap-2 mt-6">
									<span
										className={`inline-flex h-9 px-4 items-center rounded-full text-xs font-semibold transition-transform group-hover:translate-x-1 ${
											isDark ? "bg-lime text-forest-deep" : "bg-forest-deep text-cream"
										}`}
									>
										Shop now →
									</span>
								</div>
								<div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full overflow-hidden ring-4 ring-cream/20 shadow-2xl rotate-6 group-hover:rotate-3 transition-transform">
									<Image src={image} alt={collection.name} fill sizes="220px" className="object-cover" />
								</div>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
