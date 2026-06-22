import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallbackTiles = [
	{ src: "/scraped-2.jpg", tag: "Spice blends", name: "Levant Pantry" },
	{ src: "/scraped-3.jpg", tag: "Sweets & dates", name: "Sweet Heritage" },
	{ src: "/scraped-4.jpg", tag: "Pours & syrups", name: "Slow Pours" },
	{ src: "/scraped-5.jpg", tag: "Gifting", name: "Gift Tins" },
];

export async function CollectionGrid() {
	"use cache";
	cacheLife("hours");

	const { data } = await commerce.collectionBrowse({ limit: 4 });

	const tiles = data.map((c, i) => {
		const fallback = fallbackTiles[i % fallbackTiles.length];
		return {
			id: c.id,
			href: `/collection/${c.slug}`,
			name: c.name,
			tag: fallback.tag,
			src: c.image || fallback.src,
		};
	});

	const finalTiles =
		tiles.length === 4
			? tiles
			: [
					...tiles,
					...fallbackTiles.slice(tiles.length).map((f, i) => ({
						id: `fallback-${i}`,
						href: "/products",
						name: f.name,
						tag: f.tag,
						src: f.src,
					})),
				];

	return (
		<section className="bg-[#fffaf7] py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-12 gap-4">
					<div>
						<p className="text-[11px] uppercase tracking-[0.3em] text-[#b81e26] font-semibold">
							Shop the pantry
						</p>
						<h2 className="mt-3 font-display italic text-3xl sm:text-5xl text-[#7a0e15] tracking-tight">
							A pantry like your grandmother&apos;s.
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden sm:inline-flex text-sm font-medium text-[#b81e26] hover:text-[#7a0e15] underline-offset-4 hover:underline"
					>
						See all collections →
					</YnsLink>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{finalTiles.map((tile) => (
						<YnsLink
							key={tile.id}
							href={tile.href}
							className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#fbe5ea]"
						>
							<Image
								src={tile.src}
								alt={tile.name}
								fill
								sizes="(max-width: 1024px) 50vw, 25vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#7a0e15]/70 via-[#7a0e15]/10 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-5 text-[#fbe5ea]">
								<p className="text-[10px] uppercase tracking-[0.25em] opacity-80">{tile.tag}</p>
								<p className="font-display italic text-xl sm:text-2xl mt-1">{tile.name}</p>
							</div>
							<div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#fbe5ea]/95 text-[#7a0e15] grid place-items-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
								→
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
