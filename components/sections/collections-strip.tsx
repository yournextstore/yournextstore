import { ArrowUpRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallbackImages = ["/scraped-0.jpg", "/scraped-1.jpg", "/scraped-2.jpg", "/scraped-3.jpg"] as const;

const tones = [
	{ tint: "from-foreground/0 via-foreground/0 to-foreground/35", chip: "bg-card/95 text-foreground" },
	{ tint: "from-foreground/0 via-foreground/0 to-foreground/45", chip: "bg-accent text-foreground" },
	{ tint: "from-foreground/0 via-foreground/0 to-foreground/40", chip: "bg-card/95 text-foreground" },
	{ tint: "from-foreground/0 via-foreground/0 to-foreground/50", chip: "bg-foreground text-background" },
] as const;

const defaultTone = tones[0];
const defaultImage = fallbackImages[0];

export async function CollectionsStrip() {
	"use cache";
	cacheLife("hours");

	const { data } = await commerce.collectionBrowse({ limit: 4 });
	const tiles = data.length
		? data.slice(0, 4)
		: [
				{ id: "essentials", name: "Everyday essentials", slug: "essentials", description: null },
				{ id: "studio", name: "Studio favorites", slug: "studio", description: null },
				{ id: "gifts", name: "Thoughtful gifts", slug: "gifts", description: null },
				{ id: "limited", name: "Limited drops", slug: "limited", description: null },
			];

	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-16 sm:pb-20">
				<div className="flex items-end justify-between gap-6 flex-wrap mb-8 sm:mb-10">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
							Shop by mood
						</div>
						<h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.035em] text-foreground">
							Four corners of the catalog.
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						Browse everything
						<ArrowUpRightIcon className="h-4 w-4" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
					{tiles.map((tile, i) => {
						const tone = tones[i % tones.length] ?? defaultTone;
						const img = fallbackImages[i % fallbackImages.length] ?? defaultImage;
						return (
							<YnsLink
								prefetch={"eager"}
								key={tile.id}
								href={`/collection/${tile.slug}`}
								className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-card card-soft-shadow"
							>
								<Image
									src={img}
									alt={tile.name}
									fill
									sizes="(max-width: 640px) 50vw, 25vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className={`absolute inset-0 bg-gradient-to-b ${tone.tint}`} aria-hidden />
								<div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
									<div
										className={`inline-flex w-fit items-center gap-1 rounded-full ${tone.chip} px-2.5 py-1 text-[11px] font-medium`}
									>
										0{i + 1}
										<span className="opacity-50">/04</span>
									</div>
									<h3 className="mt-3 font-display text-lg sm:text-xl font-semibold tracking-tight text-background drop-shadow-sm">
										{tile.name}
									</h3>
								</div>
								<div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<ArrowUpRightIcon className="h-4 w-4" />
								</div>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
