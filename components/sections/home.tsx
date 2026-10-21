import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { HomeSearch } from "@/components/gf/home-search";
import { type CategoryTile, getCategoryTiles, getPromoBanner } from "@/lib/catalog";
import { PROMO_IMAGES } from "@/lib/editorial";
import { gfMoreLink } from "@/lib/gf-styles";
import { YNSMedia } from "@/lib/yns-media";

export function SearchBar() {
	return (
		<HomeSearch
			trailing={
				<Link
					href="/products"
					aria-label="Filter products"
					className="inline-flex size-10 items-center justify-center rounded-full hover:bg-light-silver"
				>
					<SlidersHorizontal className="size-6" strokeWidth={1.75} />
				</Link>
			}
		/>
	);
}

/** The green promo card. Its copy is read off the catalogue (see getPromoBanner). */
export async function PromoBanner() {
	const banner = await getPromoBanner();
	if (!banner) {
		return null;
	}

	const content =
		banner.kind === "deals"
			? {
					line1: "Special offers",
					line2: `Up to ${banner.percent}% off`,
					note: `Special prices on ${banner.count} ${banner.count === 1 ? "product" : "products"}`,
					cta: "Explore deals",
					href: "/deals",
					image: PROMO_IMAGES.deals,
				}
			: banner.kind === "collection"
				? {
						line1: "New picks",
						line2: banner.name,
						note: `Browse the whole ${banner.name} collection`,
						cta: "Explore",
						href: `/collection/${banner.slug}`,
						image: PROMO_IMAGES.collection,
					}
				: {
						line1: "New picks",
						line2: "Shop all",
						note: `${banner.count} ${banner.count === 1 ? "product" : "products"} to browse`,
						cta: "Explore",
						href: "/products",
						image: PROMO_IMAGES.collection,
					};

	return (
		<section
			aria-label="Featured"
			className="relative mt-[22px] flex min-h-[172px] flex-col overflow-hidden rounded-[30px] bg-green-500 p-4 pb-5 text-white"
		>
			<div
				aria-hidden="true"
				className="absolute -top-[25px] -right-[25px] size-[100px] rounded-full bg-white/15"
			/>
			<div
				aria-hidden="true"
				className="absolute -top-[45px] right-[25px] size-[100px] rounded-full bg-white/15"
			/>
			{content.image && (
				<div className="absolute -right-6 -bottom-8 size-[150px] overflow-hidden rounded-full border-[6px] border-white/25 sm:size-[170px]">
					<YNSMedia src={content.image} alt="" fill sizes="170px" className="object-cover" priority />
				</div>
			)}
			<h2 className="relative max-w-[62%] text-gf-h3 font-bold">
				{content.line1}
				<br />
				<span className="break-words">{content.line2}</span>
			</h2>
			<p className="relative mt-2.5 max-w-[58%] text-gf-sm">{content.note}</p>
			<Link
				href={content.href}
				className="relative z-10 mt-[15px] w-fit rounded-[10px] bg-white px-[18px] py-[9px] text-gf-h5 font-bold text-green-500 transition-colors hover:bg-flash-white"
			>
				{content.cta}
			</Link>
		</section>
	);
}

export function CategoryCard({ tile, showCount = false }: { tile: CategoryTile; showCount?: boolean }) {
	return (
		<Link
			href={`/category/${tile.slug}`}
			className="flex min-w-[97px] shrink-0 snap-start flex-col items-center gap-2.5 rounded-[30px] p-4 transition-colors hover:bg-flash-white focus-visible:outline-2 focus-visible:outline-green-500"
		>
			<span className="relative size-[65px] overflow-hidden rounded-full bg-flash-white">
				{tile.image && (
					<YNSMedia src={tile.image} alt="" fill sizes="65px" className="gf-photo object-cover" />
				)}
			</span>
			<span className="w-full max-w-[90px] truncate text-center text-gf-xs font-bold">{tile.name}</span>
			{showCount && (
				<span className="-mt-1 whitespace-nowrap text-gf-sm text-muted-foreground">
					{tile.count} {tile.count === 1 ? "product" : "products"}
				</span>
			)}
		</Link>
	);
}

/** "Browse categories": round photo chips in a strip that runs off the column's right edge. */
export async function BrowseCategories() {
	const tiles = await getCategoryTiles();
	if (tiles.length === 0) {
		return null;
	}
	return (
		<section className="mt-[22px]">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-gf-h4 font-bold">Browse categories</h2>
				<Link href="/categories" className={gfMoreLink}>
					See all
				</Link>
			</div>
			<div className="-mx-6 mt-[18px] flex snap-x overflow-x-auto scroll-px-6 px-6 [scrollbar-width:none]">
				{tiles.map((tile) => (
					<CategoryCard key={tile.id} tile={tile} />
				))}
			</div>
		</section>
	);
}
