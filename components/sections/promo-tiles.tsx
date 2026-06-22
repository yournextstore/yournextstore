import Image from "next/image";
import { YnsLink } from "../yns-link";

type Tile = {
	eyebrow: string;
	title: string;
	subtitle: string;
	tone: "rose" | "peach" | "saffron" | "lavender";
	image: string;
	href: string;
};

const tiles: Tile[] = [
	{
		eyebrow: "Save",
		title: "$29",
		subtitle: "Bundles of fresh greens & herbs",
		tone: "rose",
		image: "/scraped-0.jpg",
		href: "/products",
	},
	{
		eyebrow: "Discount",
		title: "30%",
		subtitle: "Pantry staples & dry goods",
		tone: "peach",
		image: "/scraped-1.jpg",
		href: "/products",
	},
	{
		eyebrow: "Up to",
		title: "50%",
		subtitle: "Daily picks from the deli aisle",
		tone: "saffron",
		image: "/scraped-2.jpg",
		href: "/products",
	},
	{
		eyebrow: "Free",
		title: "Ship",
		subtitle: "On every basket over $35",
		tone: "lavender",
		image: "/scraped-3.jpg",
		href: "/products",
	},
];

const toneClasses: Record<Tile["tone"], string> = {
	rose: "bg-rose-tile text-[#7a1b35]",
	peach: "bg-peach-tile text-[#7a3a14]",
	saffron: "bg-saffron-tile text-[#6b4a02]",
	lavender: "bg-lavender-tile text-[#3a1c6d]",
};

export function PromoTiles() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
				{tiles.map((tile) => (
					<YnsLink
						key={tile.title + tile.eyebrow}
						prefetch={"eager"}
						href={tile.href}
						className={`group relative flex h-44 items-end overflow-hidden rounded-3xl p-5 shadow-card transition hover:-translate-y-0.5 sm:h-52 ${toneClasses[tile.tone]}`}
					>
						<div className="relative z-10">
							<div className="text-xs font-semibold uppercase tracking-wider opacity-80">{tile.eyebrow}</div>
							<div className="font-display text-3xl font-extrabold leading-none sm:text-4xl">
								{tile.title}
							</div>
							<div className="mt-2 max-w-[12rem] text-xs opacity-80 sm:text-sm">{tile.subtitle}</div>
						</div>
						<div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
						<div className="absolute right-2 top-2 h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
							<Image
								src={tile.image}
								alt=""
								fill
								sizes="160px"
								className="object-contain object-right-top drop-shadow-md transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
