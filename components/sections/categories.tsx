import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_TILES = [
	{ name: "Botanicals", slug: "botanicals", image: "/scraped-2.jpg", caption: "Skin & body" },
	{ name: "Personal Care", slug: "personal-care", image: "/scraped-0.jpg", caption: "Daily rituals" },
	{ name: "Home & Living", slug: "home-living", image: "/scraped-4.jpg", caption: "Calm interiors" },
	{ name: "Atelier Goods", slug: "atelier-goods", image: "/scraped-5.jpg", caption: "Made by hand" },
];

const ICONS = ["✿", "✦", "❋", "❀"];

export async function Categories() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	const tiles =
		collections.data.length >= 4
			? collections.data.slice(0, 4).map((c, i) => ({
					name: c.name,
					slug: c.slug,
					image: FALLBACK_TILES[i]?.image ?? "/scraped-0.jpg",
					caption: FALLBACK_TILES[i]?.caption ?? "Curated picks",
				}))
			: FALLBACK_TILES;

	return (
		<section className="relative bg-[var(--olive-deep)] text-[var(--cream)] py-20 sm:py-28">
			<div className="absolute inset-0 opacity-10 pointer-events-none">
				<svg
					className="w-full h-full"
					viewBox="0 0 600 400"
					preserveAspectRatio="xMidYMid slice"
					aria-hidden="true"
				>
					<defs>
						<pattern id="leaves" width="80" height="80" patternUnits="userSpaceOnUse">
							<path
								d="M40 10 C 25 25, 22 40, 40 70 C 58 40, 55 25, 40 10 Z"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.4"
							/>
							<path d="M40 10 L 40 70" stroke="currentColor" strokeWidth="0.4" />
						</pattern>
					</defs>
					<rect width="600" height="400" fill="url(#leaves)" />
				</svg>
			</div>

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--cream)]/70 mb-4">
							<span className="h-px w-8 bg-[var(--cream)]/50" />
							Browse the shop
						</span>
						<h2 className="font-display text-5xl sm:text-6xl tracking-tight">
							Shop by <em className="italic font-light">Category</em>
						</h2>
					</div>
					<p className="text-[var(--cream)]/70 max-w-sm leading-relaxed">
						Four worlds to wander — each curated with the same gentle hand and slow standards.
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
					{tiles.map((tile, i) => (
						<YnsLink
							key={tile.slug}
							prefetch={"eager"}
							href={`/collection/${tile.slug}`}
							className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--cream)]/5 border border-[var(--cream)]/10 hover:border-[var(--cream)]/30 transition-all"
						>
							<Image
								src={tile.image}
								alt={tile.name}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--olive-deep)] via-[var(--olive-deep)]/30 to-transparent" />

							<div className="absolute top-4 left-4 h-9 w-9 rounded-full bg-[var(--cream)] text-[var(--olive-deep)] flex items-center justify-center text-base">
								{ICONS[i % ICONS.length]}
							</div>

							<div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
								<div>
									<p className="text-[10px] tracking-[0.22em] uppercase text-[var(--cream)]/60 mb-1">
										{tile.caption}
									</p>
									<h3 className="font-display text-2xl text-[var(--cream)] leading-tight">{tile.name}</h3>
								</div>
								<span className="h-9 w-9 rounded-full border border-[var(--cream)]/40 flex items-center justify-center group-hover:bg-[var(--cream)] group-hover:text-[var(--olive-deep)] transition-colors">
									<ArrowUpRight className="h-4 w-4" />
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
