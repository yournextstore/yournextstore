import { Heart, Sparkles, Star, Sun, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { getHomeTiles, TILE_PHOTOS, type Tile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

/** Tile palettes from the original's blocks grid: tangerine, aqua, rose, violet, teal. */
const TONES = [
	{ bg: "from-[#ffc98b] via-[#f79a4a] to-[#ee6f2a]", sticker: "bg-black text-white", icon: Tag },
	{ bg: "from-[#9ce9ea] via-[#7fd3d6] to-[#d9dcd8]", sticker: "bg-[#ec722b] text-white", icon: Star },
	{ bg: "from-[#f3c9cf] via-[#d9a8bb] to-[#b9b3c2]", sticker: "bg-sticker-red text-white", icon: Sparkles },
	{ bg: "from-[#e9b5e3] via-[#cc8fd6] to-[#a46fd0]", sticker: "bg-[#f7c600] text-black", icon: Heart },
	{ bg: "from-[#4cc9c0] via-[#3fb8b4] to-[#5ad6d6]", sticker: "bg-white text-[#2a8f8a]", icon: Sun },
] as const;

function TileTitle({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				"font-display relative z-10 block text-2xl font-extrabold uppercase leading-none text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.35)] md:text-[28px]",
				className,
			)}
		>
			{children}
		</span>
	);
}

function BlockTile({ tile, index, className }: { tile: Tile; index: number; className?: string }) {
	const tone = TONES[index % TONES.length] ?? TONES[0];
	const Icon = tone.icon;
	return (
		<Link
			href={tile.href}
			className={cn(
				"group relative isolate flex overflow-hidden rounded-[20px] bg-linear-to-br p-6 transition-shadow duration-500 hover:shadow-xl",
				tone.bg,
				className,
			)}
		>
			{tile.image && (
				<div className="absolute inset-y-0 right-0 w-[78%] [mask-image:linear-gradient(to_right,transparent,#000_38%)]">
					<Image
						src={tile.image}
						alt=""
						fill
						sizes="(max-width: 768px) 80vw, 40vw"
						className="object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</div>
			)}
			<span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/35 to-transparent" />
			<span
				className={cn(
					"relative z-10 flex size-[30px] items-center justify-center rounded-full",
					tone.sticker,
				)}
			>
				<Icon aria-hidden className="size-4" strokeWidth={2.5} />
			</span>
			<TileTitle className="absolute bottom-6 left-6 right-6 line-clamp-2">{tile.title}</TileTitle>
		</Link>
	);
}

async function BlocksGrid() {
	const { catalog, tiles } = await getHomeTiles();
	const [a, b, c, d, e] = tiles;

	return (
		<section aria-label="Shop by department" className="frame flex flex-col gap-5 pt-4 md:pt-5">
			<h1 className="sr-only">Shop by department</h1>
			<Link
				href="/products"
				className="group relative isolate flex h-[175px] items-end overflow-hidden rounded-[20px] bg-linear-to-r from-[#f7a8d4] via-[#f4b6dc] to-[#f19ccb] p-6 transition-shadow duration-500 hover:shadow-xl md:h-[175px]"
			>
				<div className="absolute inset-y-0 right-0 flex w-[60%] items-center justify-end gap-3 pr-4 md:w-[55%] lg:w-[78%] lg:justify-around md:gap-6 md:pr-8">
					{catalog.map((src, i) => (
						<div
							key={src}
							className={cn(
								"relative aspect-square shrink-0 overflow-hidden rounded-full border-4 border-white/70 shadow-lg transition-transform duration-500 group-hover:-translate-y-1",
								i % 2 === 0 ? "w-24 md:w-32 md:-translate-y-2" : "w-20 md:w-28 md:translate-y-4",
								i === 1 && "hidden sm:block",
								i > 1 && "hidden lg:block",
							)}
						>
							<YNSMedia src={src} alt="" fill sizes="128px" className="object-cover" />
						</div>
					))}
				</div>
				<TileTitle className="text-[34px] md:text-[44px]">Catalog</TileTitle>
			</Link>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
				{[a, b, c].map((tile, i) =>
					tile ? (
						<BlockTile key={tile.href} tile={tile} index={i} className="h-[205px] md:h-[260px]" />
					) : null,
				)}
			</div>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				{d && <BlockTile tile={d} index={3} className="h-[205px] md:h-[260px]" />}
				{e ? (
					<BlockTile tile={e} index={4} className="h-[205px] md:h-[260px]" />
				) : (
					<BlockTile
						tile={{ href: "/about", title: "Our story", image: TILE_PHOTOS[4] }}
						index={4}
						className="h-[205px] md:h-[260px]"
					/>
				)}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<BlocksGrid />
			<ProductGrid title="New arrivals" limit={10} className="frame pt-12 pb-6" />
		</>
	);
}
